// J WALK — first-person walkthrough of the ground-floor offices.
// Geometry comes straight from plan.js (the same data as the 3D overview and the video), in centimetres.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { TOPY, LEFTX, OUTLINE, CORRIDOR, SHAFT, ROOMS, WALLS, DOORS } from './plan.js';

const H = 360;                 // slab height (cm) — ground floor with an exposed concrete ceiling
const EYE = 1.62, RADIUS = 0.24, WALK = 1.55, RUN = 3.1;
const $ = s => document.querySelector(s);
const m = v => v / 100;

// ============================================================ renderer
const canvas = $('#view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .92;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
RectAreaLightUniformsLib.init();
const maxAniso = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.05, 400);
camera.rotation.order = 'YXZ';

// ============================================================ loading
const manager = new THREE.LoadingManager();
manager.onProgress = (_, done, total) => { const p = Math.round(done / total * 100); $('#loader .bar i').style.width = p + '%'; $('#pct').textContent = p + '%'; };
const texLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);

// world-scale PBR texture set; UVs are generated in metres so `size` = metres per repeat
const texCache = {};
function texSet(id, size, opts = {}) {
  const key = id + size;
  if (texCache[key]) return texCache[key];
  const ld = (suffix, srgb) => {
    const t = texLoader.load(`assets/tex/${id}_${suffix}.jpg`);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / size, 1 / size); t.anisotropy = maxAniso;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (opts.rotate) { t.center.set(.5, .5); t.rotation = opts.rotate; }
    return t;
  };
  return (texCache[key] = { map: ld('diff', true), normalMap: ld('nor'), roughnessMap: ld('rough') });
}
// procedural textures (carpet tiles, boucle fabric, grout)
function canvasTex(w, h, draw, srgb = true, rep = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxAniso; t.repeat.set(...rep);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}
let seed = 1337; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function heightToNormal(src, strength = 2) {
  const w = src.width, h = src.height, d = src.getContext('2d').getImageData(0, 0, w, h).data;
  const out = document.createElement('canvas'); out.width = w; out.height = h; const o = out.getContext('2d'); const img = o.createImageData(w, h);
  const H_ = (x, y) => d[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H_(x + 1, y) - H_(x - 1, y)) * strength, dy = (H_(x, y + 1) - H_(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1), i = (y * w + x) * 4;
    img.data[i] = (-dx / l * .5 + .5) * 255; img.data[i + 1] = (dy / l * .5 + .5) * 255; img.data[i + 2] = (1 / l * .5 + .5) * 255; img.data[i + 3] = 255;
  }
  o.putImageData(img, 0, 0); return out;
}
// carpet tiles: 50 cm tiles, quarter-turned, dark charcoal with fine linear streaks (as in the design file)
const carpetH = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d');
  x.fillStyle = '#777'; x.fillRect(0, 0, 1024, 1024);
  for (let ty = 0; ty < 2; ty++) for (let tx = 0; tx < 2; tx++) {
    x.save(); x.beginPath(); x.rect(tx * 512, ty * 512, 512, 512); x.clip();
    const vert = (tx + ty) % 2;
    for (let i = 0; i < 2600; i++) {
      const a = rnd(), p = rnd() * 512, q = rnd() * 512, L = 20 + rnd() * 160, v = 60 + rnd() * 120;
      x.strokeStyle = `rgba(${v},${v},${v},${0.25 + a * .5})`; x.lineWidth = .8 + rnd() * 1.6; x.beginPath();
      if (vert) { x.moveTo(tx * 512 + p, ty * 512 + q); x.lineTo(tx * 512 + p, ty * 512 + q + L); } else { x.moveTo(tx * 512 + p, ty * 512 + q); x.lineTo(tx * 512 + p + L, ty * 512 + q); }
      x.stroke();
    }
    x.restore();
  }
  x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 511, 1024, 2); x.fillRect(511, 0, 2, 1024); x.fillRect(0, 0, 1024, 1); x.fillRect(0, 0, 1, 1024);
  return c;
})();
const carpetMap = canvasTex(1024, 1024, (x) => {
  x.drawImage(carpetH, 0, 0); x.globalCompositeOperation = 'multiply'; x.fillStyle = '#4a4846'; x.fillRect(0, 0, 1024, 1024);
});
const carpetNor = canvasTex(1024, 1024, (x) => x.drawImage(heightToNormal(carpetH, 3), 0, 0), false);
const boucleH = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) { const v = 90 + rnd() * 140; x.fillStyle = `rgb(${v},${v},${v})`; x.beginPath(); x.arc(rnd() * 512, rnd() * 512, 1.2 + rnd() * 2.4, 0, 7); x.fill(); }
  return c;
})();
const boucleNor = canvasTex(512, 512, (x) => x.drawImage(heightToNormal(boucleH, 2.5), 0, 0), false, [6, 6]);
const weaveNor = canvasTex(256, 256, (x) => {
  const c = document.createElement('canvas'); c.width = c.height = 256; const y = c.getContext('2d');
  for (let i = 0; i < 256; i += 4) { y.fillStyle = i % 8 ? '#999' : '#666'; y.fillRect(0, i, 256, 2); y.fillStyle = 'rgba(80,80,80,.5)'; y.fillRect(i, 0, 2, 256); }
  x.drawImage(heightToNormal(c, 1.5), 0, 0);
}, false, [10, 10]);
// grout decal for the large-format porcelain floor (120 × 60 cm tiles)
const groutAlpha = canvasTex(1024, 512, (x) => { x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 512); x.fillStyle = '#fff'; x.fillRect(0, 0, 1024, 3); x.fillRect(0, 0, 3, 512); }, false);

// ============================================================ materials
const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: .7, metalness: 0, envMapIntensity: .55 }, o));
const MAT = {
  tile: std({ ...texSet('white_plaster_02', 2.4), color: '#e9e3d9', roughness: .9, envMapIntensity: .9 }),
  tileWC: std({ ...texSet('white_plaster_02', 1.2), color: '#d9d5cf', envMapIntensity: .9 }),
  grout: std({ color: '#8f897f', alphaMap: groutAlpha, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }),
  carpet: std({ map: carpetMap, normalMap: carpetNor, normalScale: new THREE.Vector2(.8, .8), roughness: .97, envMapIntensity: .2 }),
  ceiling: std({ ...texSet('brushed_concrete', 3.2), color: '#c3c6c9', roughness: 1, envMapIntensity: .7 }),
  plaster: std({ normalMap: texSet('painted_plaster_wall', 2.2).normalMap, normalScale: new THREE.Vector2(.35, .35), color: '#ecebe8', roughness: .93, envMapIntensity: .35 }),
  plasterDark: std({ normalMap: texSet('painted_plaster_wall', 2.2).normalMap, normalScale: new THREE.Vector2(.35, .35), color: '#55534f', roughness: .93, envMapIntensity: .3 }),
  concrete: std({ ...texSet('brushed_concrete', 1.6), color: '#c9c5bd', roughness: .95 }),
  walnut: std({ ...texSet('walnut_veneer', 1.4), roughness: .55, envMapIntensity: .6 }),
  walnutV: std({ ...texSet('walnut_veneer', 1.4, { rotate: Math.PI / 2 }), roughness: .55, envMapIntensity: .6 }),
  whiteTop: std({ color: '#f3f1ec', roughness: .28, envMapIntensity: .8 }),
  whiteMatte: std({ color: '#eceae5', roughness: .6 }),
  greyCab: std({ color: '#5b5a58', roughness: .55 }),
  black: std({ color: '#1b1b1c', roughness: .45, metalness: .5 }),
  blackMatte: std({ color: '#161616', roughness: .8 }),
  chrome: std({ color: '#d7d7d7', roughness: .12, metalness: 1, envMapIntensity: 1.2 }),
  steel: std({ color: '#9a9a9a', roughness: .35, metalness: 1 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#e4eeee', roughness: .03, metalness: 0, transparent: true, opacity: .11, envMapIntensity: 1.3, depthWrite: false, side: THREE.DoubleSide, specularIntensity: 1 }),
  glassFrost: std({ color: '#f4f6f5', roughness: .4, transparent: true, opacity: .55, depthWrite: false }),
  mirror: std({ color: '#9aa0a3', roughness: .04, metalness: .9, envMapIntensity: .25 }),
  fabricBeige: std({ color: '#b9a998', normalMap: boucleNor, roughness: .98, envMapIntensity: .3 }),
  fabricTan: std({ color: '#a08068', normalMap: boucleNor, roughness: .95, envMapIntensity: .3 }),
  fabricGrey: std({ color: '#6c6862', normalMap: weaveNor, roughness: .97, envMapIntensity: .25 }),
  fabricDark: std({ color: '#2c2c2d', normalMap: weaveNor, roughness: .95, envMapIntensity: .2 }),
  leather: std({ color: '#1e1d1c', roughness: .42, envMapIntensity: .6 }),
  leatherTaupe: std({ color: '#b5aa9b', roughness: .5 }),
  rugDark: std({ color: '#3f3e3c', normalMap: boucleNor, roughness: 1, envMapIntensity: .15 }),
  rugGrey: std({ color: '#7d7a74', normalMap: weaveNor, roughness: 1, envMapIntensity: .15 }),
  screenOff: std({ color: '#0b0c0e', roughness: .15, metalness: .3, envMapIntensity: 1 }),
  screenOn: std({ color: '#0c0e12', roughness: .15, metalness: .2, emissive: '#1b2633', emissiveIntensity: .25, envMapIntensity: 1 }),
  ledWarm: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffdcb0').multiplyScalar(2.4) }),
  ledPanel: new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff3e2').multiplyScalar(2.6) }),
  ductBlack: std({ color: '#1d1d1e', roughness: .6, metalness: .3 }),
  pipeRed: std({ color: '#8f1f1a', roughness: .45, metalness: .2 }),
  ceramic: std({ color: '#fbfbfa', roughness: .12, envMapIntensity: 1 }),
  paper: std({ color: '#fafafa', roughness: .9 }),
  acWhite: std({ color: '#f2f2f0', roughness: .35 }),
  plantSoil: std({ color: '#3b2f25', roughness: 1 }),
  potWhite: std({ color: '#e8e5df', roughness: .75 }),
  potConcrete: std({ ...texSet('brushed_concrete', .8), color: '#9b978f', roughness: .9 }),
  pavers: std({ ...texSet('concrete_pavers', 1.6), color: '#d8c9b4', roughness: .95 }),
  asphalt: std({ ...texSet('asphalt_02', 5), color: '#8c8a88', roughness: .95 }),
  curb: std({ ...texSet('brushed_concrete', 1.2), color: '#b8b5ae' }),
};

// ============================================================ geometry helpers (cm in, metres out)
function worldUV(geo) {   // box-projected UVs in metres so textures keep real-world scale on every surface
  const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v; if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u; uv[i * 2 + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo;
}
const gc = {};
const B = (w, h, d) => gc[`b${w}|${h}|${d}`] ||= worldUV(new THREE.BoxGeometry(m(w), m(h), m(d)));
const RB = (w, h, d, r) => gc[`r${w}|${h}|${d}|${r}`] ||= worldUV(new RoundedBoxGeometry(m(w), m(h), m(d), 3, Math.min(m(r), m(w) / 2 - .001, m(h) / 2 - .001, m(d) / 2 - .001)));
const CY = (rt, rb, h, s = 28) => gc[`c${rt}|${rb}|${h}|${s}`] ||= worldUV(new THREE.CylinderGeometry(m(rt), m(rb), m(h), s));
function put(parent, geo, mat, x, y, z, o = {}) {
  const me = new THREE.Mesh(geo, mat); me.position.set(m(x), m(y), m(z));
  if (o.ry) me.rotation.y = o.ry; if (o.rx) me.rotation.x = o.rx; if (o.rz) me.rotation.z = o.rz; if (o.s) me.scale.set(...o.s);
  me.castShadow = o.cast !== false; me.receiveShadow = true; parent.add(me); return me;
}
function grp(x, z, ry = 0, y = 0, parent = scene) { const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); g.rotation.y = ry; parent.add(g); return g; }
function prism(pts, h, mat, y0 = 0, o = {}) {
  const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(m(x), -m(z))));
  const g = new THREE.ExtrudeGeometry(sh, { depth: m(h), bevelEnabled: !!o.bevel, bevelSize: m(o.bevel || 0), bevelThickness: m(o.bevel || 0), bevelSegments: 3, curveSegments: 24 });
  g.rotateX(-Math.PI / 2); worldUV(g);
  const me = new THREE.Mesh(g, mat); me.position.y = m(y0); me.castShadow = o.cast !== false; me.receiveShadow = true; scene.add(me); return me;
}
function flat(pts, mat, y, faceDown = false) {
  const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(m(x), -m(z))));
  const g = new THREE.ShapeGeometry(sh); g.rotateX(-Math.PI / 2);
  if (faceDown) { const idx = g.index.array; for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 2]; idx[i + 2] = t; } const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setY(i, -n.getY(i)); }
  worldUV(g); const me = new THREE.Mesh(g, mat); me.position.y = m(y); me.receiveShadow = true; scene.add(me); return me;
}
const arcPts = (cx, cz, r0, r1, a0, a1, n = 48) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + r1 * Math.cos(a), cz + r1 * Math.sin(a)]); } for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; p.push([cx + r0 * Math.cos(a), cz + r0 * Math.sin(a)]); } return p; };
const segAng = (x1, z1, x2, z2) => -Math.atan2(z2 - z1, x2 - x1);

// ============================================================ collision (2D, metres)
const segs = [];      // [x1,z1,x2,z2,halfThickness]
const boxes = [];     // [x0,z0,x1,z1]
const wallSeg = (x1, z1, x2, z2, t) => segs.push([m(x1), m(z1), m(x2), m(z2), m(t) / 2]);
const block = (x0, z0, x1, z1) => boxes.push([m(Math.min(x0, x1)), m(Math.min(z0, z1)), m(Math.max(x0, x1)), m(Math.max(z0, z1))]);
const blockCircle = (x, z, r) => block(x - r, z - r, x + r, z + r);
function hits(px, pz) {
  for (const [x1, z1, x2, z2, ht] of segs) {
    const dx = x2 - x1, dz = z2 - z1, L2 = dx * dx + dz * dz; let t = L2 ? ((px - x1) * dx + (pz - z1) * dz) / L2 : 0; t = Math.max(0, Math.min(1, t));
    if (Math.hypot(px - (x1 + t * dx), pz - (z1 + t * dz)) < RADIUS + ht) return true;
  }
  for (const [x0, z0, x1, z1] of boxes) { const cx = Math.max(x0, Math.min(px, x1)), cz = Math.max(z0, Math.min(pz, z1)); if (Math.hypot(px - cx, pz - cz) < RADIUS) return true; }
  if (SLAT.on) { const [x0, z0, x1, z1] = SLAT.box, cx = Math.max(x0, Math.min(px, x1)), cz = Math.max(z0, Math.min(pz, z1)); if (Math.hypot(px - cx, pz - cz) < RADIUS) return true; }
  return false;
}

// ============================================================ floors & ceiling
const inPoly = (x, z, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if (((zi > z) !== (zj > z)) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
flat(OUTLINE, MAT.tile, 0);
const groutMesh = flat(OUTLINE, MAT.grout, 0.15); groutMesh.material.alphaMap.repeat.set(1 / 1.2, 1 / .6); groutMesh.renderOrder = 1;
for (const r of ROOMS) { if (r.floor === 'carpet') flat(r.poly, MAT.carpet, 0.3); if (r.floor === 'wc') flat(r.poly, MAT.tileWC, 0.3); }
flat(SHAFT, MAT.concrete, 0.3);
flat(OUTLINE, MAT.ceiling, H, true);

// ============================================================ walls, glass partitions, doors
const CAP = MAT.black;
const accentWall = (x1, z1, x2, z2) => (x1 === 980 || x1 === 1130 || x2 === 980) && Math.max(z1, z2) >= 330; // dark shaft walls facing the workspace & corridor
for (const [x1, z1, x2, z2, kind] of WALLS) {
  const L = Math.hypot(x2 - x1, z2 - z1), ang = segAng(x1, z1, x2, z2), cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
  if (kind === 'ext' || kind === 'int') {
    const t = kind === 'ext' ? 24 : 12;
    put(scene, B(L + t, H, t), accentWall(x1, z1, x2, z2) ? MAT.plasterDark : MAT.plaster, cx, H / 2, cz, { ry: ang });
    put(scene, B(L + t * .2, 10, t + 1.5), MAT.blackMatte, cx, 5, cz, { ry: ang, cast: false });   // skirting
    wallSeg(x1, z1, x2, z2, t);
  } else {
    const facade = kind === 'facade';
    const pane = put(scene, B(L, H, 1.2), MAT.glass, cx, H / 2, cz, { ry: ang, cast: false }); pane.renderOrder = 3;
    put(scene, B(L, 6, 8), CAP, cx, 3, cz, { ry: ang, cast: false });            // floor track
    put(scene, B(L, 6, 8), CAP, cx, H - 3, cz, { ry: ang, cast: false });        // head track
    if (!facade) put(scene, B(L, 4, 3), CAP, cx, 240, cz, { ry: ang, cast: false }); // transom bar at door height
    if (!facade) { const fr = put(scene, B(L, 8, 1.6), MAT.glassFrost, cx, 108, cz, { ry: ang, cast: false }); fr.renderOrder = 3; }   // manifestation band
    const step = facade ? 150 : 100, n = Math.max(1, Math.round(L / step));
    for (let i = 0; i <= n; i++) { const p = i / n; put(scene, B(facade ? 7 : 4.5, H, facade ? 14 : 8), CAP, x1 + (x2 - x1) * p, H / 2, z1 + (z2 - z1) * p, { ry: ang }); }
    if (facade) {   // roller-blind boxes along the top of the shopfront glass (as in the design file)
      put(scene, B(L, 22, 14), MAT.blackMatte, cx, H - 11, cz + 10, { ry: ang, cast: false });
      const bl = put(scene, B(L, 46, .6), std({ color: '#d9d4cb', roughness: 1, transparent: true, opacity: .82 }), cx, H - 45, cz + 6, { ry: ang }); bl.renderOrder = 2;
    }
    wallSeg(x1, z1, x2, z2, 6);
  }
}
// entrance: closed double glass door in the shopfront between the wall end (x 130) and the facade glass (x 290)
{
  const a = [130, TOPY(130)], b = [290, TOPY(290)], ang = segAng(...a, ...b), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const g = grp((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, ang);
  [-L / 4, L / 4].forEach(dx => { const p = put(g, B(L / 2 - 4, 250, 1.2), MAT.glass, dx, 125, 0, { cast: false }); p.renderOrder = 3; put(g, B(4, 250, 5), CAP, dx - L / 4 + 2, 125, 0); put(g, B(4, 250, 5), CAP, dx + L / 4 - 2, 125, 0); put(g, B(L / 2, 5, 5), CAP, dx, 2.5, 0); put(g, B(L / 2, 5, 5), CAP, dx, 248, 0); put(g, CY(1.4, 1.4, 120, 10), MAT.steel, dx + (dx < 0 ? L / 4 - 10 : -L / 4 + 10), 115, 5); });
  const tr = put(g, B(L, H - 250, 1.2), MAT.glass, 0, 250 + (H - 250) / 2, 0, { cast: false }); tr.renderOrder = 3; put(g, B(L, 6, 8), CAP, 0, 250, 0);
  wallSeg(...a, ...b, 8);
}
// interior doors: frames + sliding leaves that sit closed in the doorway and glide open as you walk up to them
const SOLID_DOORS = new Set([4, 7]);   // archive & toilets (see plan.js DOORS order)
const slidingDoors = [];
DOORS.forEach((d, i) => {
  const L = Math.hypot(d.b[0] - d.a[0], d.b[1] - d.a[1]), ang = segAng(...d.a, ...d.b), cx = (d.a[0] + d.b[0]) / 2, cz = (d.a[1] + d.b[1]) / 2;
  [d.a, d.b].forEach(p => put(scene, B(5, H, 9), CAP, p[0], H / 2, p[1], { ry: ang }));
  put(scene, B(L, 5, 9), CAP, cx, 242, cz, { ry: ang });
  const tr = put(scene, B(L, H - 245, 1.2), SOLID_DOORS.has(i) ? MAT.plaster : MAT.glass, cx, 245 + (H - 245) / 2, cz, { ry: ang, cast: false }); tr.renderOrder = 3;
  const lx = (d.la[0] + d.lb[0]) / 2 + d.n[0], lz = (d.la[1] + d.lb[1]) / 2 + d.n[1], LL = Math.hypot(d.lb[0] - d.la[0], d.lb[1] - d.la[1]);
  const g = grp(lx, lz, ang);
  if (SOLID_DOORS.has(i)) put(g, B(LL - 2, 238, 4), MAT.walnutV, 0, 120, 0);
  else { const pn = put(g, B(LL - 6, 236, 1.2), MAT.glass, 0, 120, 0, { cast: false }); pn.renderOrder = 3; [-LL / 2 + 2, LL / 2 - 2].forEach(ex => put(g, B(4, 238, 4), CAP, ex, 120, 0)); put(g, B(LL, 4, 4), CAP, 0, 2, 0); put(g, B(LL, 4, 4), CAP, 0, 238, 0); }
  put(g, B(3, 40, 3), MAT.black, LL / 2 - 10, 105, 3);
  slidingDoors.push({ g, mid: [m(cx), m(cz)], shut: [m(cx + d.n[0]), m(cz + d.n[1])], open: [m(lx), m(lz)], t: 0 });
  g.position.set(m(cx + d.n[0]), 0, m(cz + d.n[1]));   // start closed
  put(scene, B(L + 40, 3, 10), CAP, lx + Math.cos(-ang) * 0, 244, lz, { ry: ang, cast: false });    // sliding track
});

// ============================================================ exposed ceiling services (ducts, sprinklers, track lights)
const lightSpots = [];
function duct(x1, z1, x2, z2, w = 55, h = 40, y = 318) {
  const L = Math.hypot(x2 - x1, z2 - z1), ang = segAng(x1, z1, x2, z2), cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
  put(scene, B(L, h, w), MAT.ductBlack, cx, y, cz, { ry: ang });
  for (let s = 60; s < L - 40; s += 260) {     // square ceiling diffusers hanging off the duct
    const px = x1 + (x2 - x1) * s / L, pz = z1 + (z2 - z1) * s / L;
    put(scene, B(55, 22, 55), MAT.ductBlack, px, y - h / 2 - 11, pz, { ry: ang });
    for (let k = -2; k <= 2; k++) put(scene, B(46, 1.2, 2), MAT.blackMatte, px, y - h / 2 - 22.5, pz + k * 9, { ry: ang, cast: false });
  }
  [x1, x2].forEach((_, i) => {});
}
function pipe(x1, z1, x2, z2, y = 345, r = 2.6, mat = MAT.pipeRed) {
  const L = Math.hypot(x2 - x1, z2 - z1); const me = put(scene, CY(r, r, L, 12), mat, (x1 + x2) / 2, y, (z1 + z2) / 2, { rz: Math.PI / 2, cast: false });
  me.rotation.set(0, segAng(x1, z1, x2, z2), Math.PI / 2, 'YXZ');
  for (let s = 150; s < L; s += 300) { const px = x1 + (x2 - x1) * s / L, pz = z1 + (z2 - z1) * s / L; put(scene, CY(1.2, 1.2, 16, 8), mat, px, y - 9, pz, { cast: false }); put(scene, CY(2.5, 1.5, 3, 10), MAT.chrome, px, y - 18, pz, { cast: false }); }
}
function track(x1, z1, x2, z2, n, y = 330, aim = null) {
  const L = Math.hypot(x2 - x1, z2 - z1), ang = segAng(x1, z1, x2, z2);
  put(scene, B(L, 3, 3.5), MAT.black, (x1 + x2) / 2, y, (z1 + z2) / 2, { ry: ang, cast: false });
  [0, 1].forEach(e => put(scene, CY(.3, .3, H - y, 4), MAT.black, e ? x2 : x1, (H + y) / 2, e ? z2 : z1, { cast: false }));
  for (let i = 0; i < n; i++) {
    const p = (i + .5) / n, px = x1 + (x2 - x1) * p, pz = z1 + (z2 - z1) * p;
    const g = grp(px, pz, 0, y - 2); const can = new THREE.Group(); g.add(can);
    put(can, CY(3.8, 3.8, 15, 18), MAT.black, 0, -9, 0); put(can, CY(3.3, 3.3, .6, 18), MAT.ledWarm, 0, -16.6, 0, { cast: false });
    can.rotation.x = .25 * (i % 2 ? 1 : -1);
    lightSpots.push([px, pz, aim]);
  }
}
function pendant(x, z, len, ry = 0, y = 270, area = true) {
  const g = grp(x, z, ry, y);
  put(g, B(len, 5, 6), MAT.black, 0, 0, 0); put(g, B(len - 4, .8, 4.4), MAT.ledPanel, 0, -2.8, 0, { cast: false });
  [-len / 2 + 20, len / 2 - 20].forEach(dx => put(g, CY(.25, .25, H - y, 4), MAT.steel, dx, (H - y) / 2, 0, { cast: false }));
  if (area) { const L = new THREE.RectAreaLight('#fff1dc', 9, m(len), .18); L.position.set(0, -.04, 0); L.rotation.x = -Math.PI / 2; g.add(L); }
  return g;
}
// main supply duct along the corridor, branches over the workspace and reception (black, as in the design file)
duct(470, 860, 1255, 860); duct(1340, 400, 1340, 940, 50, 38); duct(560, 175, 940, 175, 45, 35, 322); duct(250, 130, 250, 700, 45, 35, 322);
pipe(450, 800, 1320, 800); pipe(1300, 420, 1300, 960); pipe(500, 110, 960, 110); pipe(80, 300, 430, 300); pipe(520, 1180, 1300, 1180, 345); pipe(1430, 60, 1680, 60); pipe(1430, 760, 1680, 760);
put(scene, B(840, 6, 30), std({ color: '#2a2a2a', roughness: .5, metalness: .6, wireframe: false }), 715, 300, 640, { cast: false });   // cable tray over the workspace
track(100, 300, 420, 300, 4, 330, [m(346), m(400)]); track(120, 640, 420, 640, 4, 330, null); track(500, 905, 1250, 905, 6); track(1255, 420, 1255, 940, 4); track(1450, 300, 1680, 300, 3);

// ============================================================ furniture builders
const chair = (x, z, face, exec = false, mat = exec ? MAT.leather : MAT.fabricDark) => {   // office chair, front faces local +z
  const g = grp(x, z, face);
  for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; put(g, B(3.4, 3, 30), MAT.black, Math.sin(a) * 15, 5, Math.cos(a) * 15, { ry: a }); put(g, CY(2.6, 2.6, 4, 12), MAT.blackMatte, Math.sin(a) * 29, 2, Math.cos(a) * 29); }
  put(g, CY(2.8, 3.2, 26, 16), MAT.chrome, 0, 21, 0); put(g, CY(3.6, 3.6, 10, 16), MAT.black, 0, 37, 0);
  put(g, RB(50, 9, 48, 4), mat, 0, 46, 2);
  const bh = exec ? 66 : 50; const back = put(g, RB(47, bh, 7, 3.5), exec ? mat : std({ color: '#2a2a2b', roughness: .8, transparent: true, opacity: .93 }), 0, 54 + bh / 2, -23, { rx: -.12 });
  if (!exec) put(g, B(41, bh - 8, 1.5), MAT.blackMatte, 0, 54 + bh / 2, -26.5, { rx: -.12 });
  put(g, B(5, 3, 26), MAT.black, -25, 66, 0); put(g, B(5, 3, 26), MAT.black, 25, 66, 0); put(g, B(3, 18, 3), MAT.black, -25, 56, -2); put(g, B(3, 18, 3), MAT.black, 25, 56, -2);
  return g;
};
const visitorChair = (x, z, face, mat = MAT.leatherTaupe) => {
  const g = grp(x, z, face);
  [[-21, -19], [21, -19], [-21, 19], [21, 19]].forEach(([a, b]) => put(g, CY(1.3, 1.3, 45, 8), MAT.black, a, 22.5, b));
  put(g, RB(50, 7, 48, 3), mat, 0, 47, 0); put(g, RB(50, 40, 7, 3), mat, 0, 70, -21, { rx: -.1 });
  return g;
};
const monitor = (parent, x, y, z, ry = 0, on = true) => {
  const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); g.rotation.y = ry; parent.add(g);
  put(g, RB(24, 1.2, 18, .5), MAT.black, 0, .6, 0); put(g, B(4, 26, 2.5), MAT.black, 0, 13, -4);
  put(g, RB(61, 36, 2.2, .6), MAT.screenOff, 0, 38, -2.5); put(g, B(59, 34, .3), on ? MAT.screenOn : MAT.screenOff, 0, 38, -1.3, { cast: false });
  put(g, RB(44, 1.4, 13, .5), MAT.whiteMatte, 0, .7, 22); put(g, RB(6, 2, 10, 1), MAT.whiteMatte, 34, 1, 22);
};
const deskTop = (p, x, z, w, d, mat = MAT.whiteTop, y = 73.5) => put(p, RB(w, 3, d, .8), mat, x, y, z);
const deskLegs = (p, w, d, mat = MAT.black) => { [-w / 2 + 3, w / 2 - 3].forEach(x => { put(p, B(5, 72, 5), mat, x, 36, -d / 2 + 4); put(p, B(5, 72, 5), mat, x, 36, d / 2 - 4); put(p, B(5, 5, d - 8), mat, x, 69, 0); }); };
const books = (p, x, y, z, w, ry = 0) => {   // a run of real-looking books / binders
  const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); g.rotation.y = ry; p.add(g); let cx = -w / 2;
  const cols = ['#e9e4da', '#2b2b2b', '#8a7f72', '#c9bba5', '#4d5156', '#b09379', '#f2efe9'];
  while (cx < w / 2 - 3) { const bw = 2.5 + rnd() * 3.5, bh = 22 + rnd() * 9, c = cols[(rnd() * cols.length) | 0]; put(g, B(bw, bh, 18 + rnd() * 4), std({ color: c, roughness: .8 }), cx + bw / 2, bh / 2, 0, { rz: rnd() < .08 ? .25 : 0, cast: false }); cx += bw + .3; }
};
const acUnit = (x, z, ry, y = 285) => { const g = grp(x, z, ry, y); put(g, RB(92, 30, 22, 6), MAT.acWhite, 0, 0, 0); put(g, B(80, 1, 1), MAT.blackMatte, 0, -10, 11.5); put(g, B(8, 1.5, 1), std({ color: '#7fd1ff', emissive: '#4fb7ff', emissiveIntensity: 1 }), 34, 6, 11.4, { cast: false }); };
const roundTable = (x, z, r, h, mat) => { put(scene, CY(r, r, 3, 40), mat, x, h, z); put(scene, CY(3.5, 3.5, h - 2, 12), MAT.black, x, h / 2, z); put(scene, CY(r * .55, r * .55, 2, 30), MAT.black, x, 1, z); };

// --- plants (real scanned models, pots repainted to suit the design) ---
const PLANTS = {};
const plantJobs = [];
function plant(kind, x, z, height, y = 0, pot = 'white') { plantJobs.push({ kind, x, z, height, y, pot }); blockCircle(x, z, height > 80 ? 26 : 0); }
function loadPlants() {
  const files = { a: 'assets/models/potted_plant_01/potted_plant_01_1k.gltf', b: 'assets/models/potted_plant_02/potted_plant_02_1k.gltf', c: 'assets/models/potted_plant_04/potted_plant_04_1k.gltf' };
  for (const [k, url] of Object.entries(files)) gltfLoader.load(url, gl => {
    const root = gl.scene; root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material) o.material.envMapIntensity = .5; } });
    PLANTS[k] = root;
    plantJobs.filter(j => j.kind === k).forEach(j => {
      const inst = root.clone(true);   // keep the scanned pot, soil and pebble materials exactly as captured
      const box = new THREE.Box3().setFromObject(inst), size = box.getSize(new THREE.Vector3()); const s = m(j.height) / size.y;
      inst.scale.setScalar(s); inst.position.set(m(j.x), m(j.y) - box.min.y * s, m(j.z)); inst.rotation.y = (j.x * 7 + j.z) % 6.28; scene.add(inst);
    });
  });
}

// ============================================================ RECEPTION (straight counter on the east side of the reception —
// on your left as you walk in — running front-to-back so the entrance path stays clear; no slat screen per the manager)
{
  const z0 = 280, z1 = 520, W = z1 - z0, xf = 290;   // xf = visitor-side (west) face of the counter
  const g = grp(xf, (z0 + z1) / 2, Math.PI / 2);      // local +z = east (receptionist side), local x runs along the counter
  put(g, RB(W + 6, 3, 53, 1), MAT.whiteTop, 0, 107.5, 23.5);           // top ledge
  put(g, RB(W, 54, 45, 1), MAT.whiteTop, 0, 79, 22.5);                  // white solid-surface front
  put(g, B(W - 12, 1.6, 4), MAT.ledWarm, 0, 51, 7, { cast: false });    // warm LED reveal under the front
  put(g, RB(W - 12, 50, 34, 1), MAT.walnut, 0, 27, 23);                 // recessed walnut plinth
  put(g, RB(W - 4, 3, 47, .8), MAT.whiteTop, 0, 74.5, 68);              // receptionist's work surface
  [-W / 2 + 2, W / 2 - 2].forEach(x => put(g, B(4, 73, 47), MAT.whiteTop, x, 36.5, 68));   // work-surface end panels
  monitor(g, 10, 76, 58, 0); put(g, RB(20, 5, 16, 2), MAT.black, -70, 78, 70); put(g, B(28, 1, 20), MAT.paper, 75, 76.5, 72, { ry: -.12 });
  chair(xf + 140, (z0 + z1) / 2, -Math.PI / 2, true);   // receptionist faces west, towards the entrance path
  block(xf - 4, z0 - 3, xf + 92, z1 + 3);
}
// optional walnut slat screen behind the receptionist (design file pp.2–3): free-standing vertical battens on a black
// floor rail, full height behind the counter and sweeping down towards the waiting area. Toggle: button / H key.
const SLAT = { x: 472, z0: 250, z1: 690, on: true, group: new THREE.Group() };
{
  const g = SLAT.group; scene.add(g);
  const pitch = 9, n = Math.floor((SLAT.z1 - SLAT.z0) / pitch);
  for (let i = 0; i <= n; i++) {
    const z = SLAT.z0 + i * pitch, t = Math.max(0, (z - 480) / (SLAT.z1 - 480));
    const h = Math.round(130 + 140 * (1 + Math.cos(Math.PI * t)) / 2);   // 270 cm behind the desk → 130 cm at the end
    put(g, RB(4, h, 5, 1.2), MAT.walnutV, SLAT.x, 3 + h / 2, z);
  }
  put(g, B(6, 3, SLAT.z1 - SLAT.z0 + 6), MAT.blackMatte, SLAT.x, 1.5, (SLAT.z0 + SLAT.z1) / 2);   // floor rail
  SLAT.box = [m(SLAT.x - 4), m(SLAT.z0 - 4), m(SLAT.x + 5), m(SLAT.z1 + 4)];
}
function setSlats(on) {
  SLAT.on = on; SLAT.group.visible = on;
  const b = document.getElementById('btnSlat'); if (b) { b.setAttribute('aria-pressed', on);  }
}
// waiting: curved boucle sofa on a round dark rug, oval black coffee table, tan tub chairs
{
  put(scene, CY(150, 150, 1.2, 64), MAT.rugDark, 282, .6, 838, { cast: false });
  const a0 = Math.PI * .42, a1 = Math.PI * 1.08;
  prism(arcPts(280, 835, 86, 126, a0, a1), 28, MAT.fabricBeige, 6, { bevel: 2 });
  for (let k = 0; k < 4; k++) { const s0 = a0 + (a1 - a0) * k / 4 + .006, s1 = a0 + (a1 - a0) * (k + 1) / 4 - .006; prism(arcPts(280, 835, 88, 122, s0, s1, 14), 10, MAT.fabricBeige, 36, { bevel: 3 }); }
  prism(arcPts(280, 835, 112, 128, a0, a1), 44, MAT.fabricBeige, 34, { bevel: 4 });
  for (let a = a0; a <= a1; a += .12) blockCircle(280 + 106 * Math.cos(a), 835 + 106 * Math.sin(a), 22);
  const ct = put(scene, CY(45, 45, 4, 48), MAT.black, 300, 38, 840, { s: [1.35, 1, .85] }); put(scene, CY(30, 30, 36, 40), MAT.blackMatte, 300, 18, 840, { s: [1.3, 1, .8] }); block(240, 805, 360, 875);
  books(scene, 290, 40, 838, 22, .5); plant('c', 318, 840, 26, 40);
  [[228, 715, .53], [352, 722, -.44]].forEach(([x, z, ry]) => {
    const g = grp(x, z, ry);
    put(g, RB(66, 18, 62, 8), MAT.fabricTan, 0, 34, 2);
    const tb = Math.atan2(-Math.cos(ry), -Math.sin(ry));   // world angle of the chair back
    prism(arcPts(x, z, 29, 37, tb - Math.PI * .72, tb + Math.PI * .72, 30), 30, MAT.fabricTan, 42, { bevel: 3 });
    [[-24, -22], [24, -22], [-24, 22], [24, 22]].forEach(([a, b]) => put(g, CY(1.2, .8, 26, 8), MAT.black, a, 13, b));
    blockCircle(x, z, 34);
  });
  plant('a', 88, 300, 150); plant('b', 150, 625, 100); plant('a', 360, 140, 160);
}

// ============================================================ OPEN WORKSPACE (16 workstations)
{
  [255, 525].forEach(tz => {
    const g = grp(715, tz);
    deskTop(g, 0, 0, 440, 142); deskLegs(g, 440, 142);
    put(g, B(410, 36, 3), MAT.fabricGrey, 0, 93, 0);                        // upholstered divider
    put(g, B(410, 2, 4), MAT.black, 0, 111, 0);
    [-165, -55, 55, 165].forEach(dx => {
      monitor(g, dx, 75, -40, Math.PI); monitor(g, dx, 75, 40, 0);
      chair(715 + dx, tz - 98, 0); chair(715 + dx, tz + 98, Math.PI);
    });
    block(715 - 222, tz - 72, 715 + 222, tz + 72);
    pendant(715, tz, 420);
  });
  // feature wall on the shaft side: white tall storage + backlit walnut shelving around a concrete panel (design file p.5)
  const fx = 958;
  put(scene, B(38, 240, 150), MAT.whiteMatte, fx, 120, 160); for (let k = 0; k < 3; k++) put(scene, B(.6, 236, 1), MAT.blackMatte, fx - 19.3, 120, 110 + k * 50, { cast: false });
  put(scene, B(4, 270, 300), MAT.walnut, fx + 16, 135, 420);                 // back panel
  put(scene, B(3, 230, 110), MAT.concrete, fx + 13, 140, 420);               // concrete feature panel
  [280, 560].forEach(zc => { for (let y = 40; y <= 230; y += 47) { put(scene, B(34, 3, 90), MAT.walnut, fx, y, zc); put(scene, B(1, .6, 88), MAT.ledWarm, fx - 16, y - 2, zc, { cast: false }); if (y > 40 && y < 230) books(scene, fx - 2, y + 1.5, zc - 20, 40, Math.PI / 2); } put(scene, B(34, 230, 3), MAT.walnut, fx, 135, zc - 46); put(scene, B(34, 230, 3), MAT.walnut, fx, 135, zc + 46); });
  put(scene, B(38, 100, 120), MAT.walnut, fx, 50, 420);
  block(fx - 22, 80, 980, 640);
  plant('a', 935, 690, 120);
  acUnit(715, 70 - 3 + 14, 0, 290);
}

// ============================================================ KITCHEN (design file p.4: walnut base & tall units, grey uppers, backlit shelves)
{
  put(scene, B(62, 88, 250), MAT.walnutV, 1162, 44, 198); put(scene, RB(66, 4, 254, .8), MAT.whiteTop, 1162, 90, 198);
  for (let z = 80; z <= 310; z += 50) put(scene, B(.8, 80, 1), MAT.blackMatte, 1193.5, 46, z, { cast: false });
  put(scene, B(64, 220, 46), MAT.walnutV, 1162, 110, 48);   // tall fridge housing at the facade end
  put(scene, B(36, 70, 170), MAT.greyCab, 1150, 185, 150); put(scene, B(36, 2, 170), MAT.ledWarm, 1150, 149, 150, { cast: false });
  [235, 270].forEach(y => { put(scene, B(30, 2.5, 70), MAT.walnut, 1148, y - 50, 275); }); put(scene, B(26, 1, 66), MAT.ledWarm, 1146, 183, 275, { cast: false });
  put(scene, B(40, 2, 36), MAT.steel, 1160, 91.5, 230, { cast: false }); put(scene, CY(1.4, 1.4, 30, 10), MAT.black, 1145, 106, 230); put(scene, B(18, 2, 2), MAT.black, 1152, 120, 230);
  put(scene, RB(30, 40, 34, 4), MAT.black, 1160, 112, 110); put(scene, RB(14, 20, 16, 4), MAT.whiteMatte, 1160, 102, 160);
  books(scene, 1148, 237, 270, 22, Math.PI / 2);
  block(1130, 60, 1196, 330);
}

// ============================================================ TOILETS (150 × 200)
{
  [[1130, 330, 1280, 330], [1280, 330, 1280, 420], [1130, 330, 1130, 530], [1130, 530, 1280, 530]].forEach(([x1, z1, x2, z2]) => {
    const L = Math.hypot(x2 - x1, z2 - z1); const inward = x1 === x2 ? (x1 === 1130 ? 7 : -7) : (z1 === 330 ? 7 : -7);
    put(scene, B(L, 240, 1), MAT.tileWC, (x1 + x2) / 2 + (x1 === x2 ? inward : 0), 120, (z1 + z2) / 2 + (x1 === x2 ? 0 : inward), { ry: segAng(x1, z1, x2, z2), cast: false });
  });
  put(scene, RB(52, 14, 42, 2), MAT.ceramic, 1225, 84, 360); put(scene, B(56, 46, 44), MAT.walnut, 1225, 55, 360); put(scene, CY(1.3, 1.3, 22, 8), MAT.chrome, 1236, 100, 348);
  put(scene, B(60, 80, 1), MAT.mirror, 1225, 150, 338, { cast: false });
  const t = grp(1162, 470, Math.PI / 2); put(t, RB(36, 38, 56, 14), MAT.ceramic, 0, 20, 6); put(t, RB(38, 34, 16, 4), MAT.ceramic, 0, 56, -24); put(t, RB(37, 3, 44, 10), MAT.ceramic, 0, 40, 8);
  block(1196, 336, 1254, 384); block(1136, 444, 1192, 500);
  pendant(1205, 430, 80, Math.PI / 2, 300);
}
// closed shaft behind kitchen & toilets — the shortened walnut counter sits on its corridor face
put(scene, RB(66, 100, 186, 2), MAT.walnut, 1164, 50, 625); block(1130, 532, 1198, 718);

// ============================================================ EXECUTIVE LOUNGE (grey L-sofa, dark coffee table, TV wall)
{
  put(scene, RB(280, 1.2, 220, .5), MAT.rugGrey, 1560, .7, 205, { cast: false });
  const sofa = (x, z, w, d, ry) => { const g = grp(x, z, ry); put(g, RB(w, 22, d, 4), MAT.fabricGrey, 0, 13, 0); const n = Math.max(1, Math.round(w / 78)); for (let i = 0; i < n; i++) { const cw = w / n - 2; put(g, RB(cw, 16, d - 24, 7), MAT.fabricGrey, -w / 2 + (i + .5) * w / n, 31, 9); put(g, RB(cw, 46, 18, 8), MAT.fabricGrey, -w / 2 + (i + .5) * w / n, 50, -d / 2 + 11, { rx: -.1 }); put(g, RB(40, 34, 12, 6), MAT.fabricDark, -w / 2 + (i + .5) * w / n + 8, 60, -d / 2 + 24, { rx: -.25, rz: .1 }); } [-w / 2 + 8, w / 2 - 8].forEach(ax => put(g, RB(16, 30, d, 6), MAT.fabricGrey, ax, 34, 0)); return g; };
  sofa(1448, 225, 230, 90, Math.PI / 2); sofa(1580, 60, 200, 90, 0);
  put(scene, RB(100, 8, 70, 2), MAT.blackMatte, 1565, 38, 210); put(scene, B(90, 34, 60), MAT.blackMatte, 1565, 17, 210);
  put(scene, RB(38, 55, 210, 2), MAT.walnut, 1678, 27.5, 220); put(scene, RB(5, 76, 132, 1), MAT.screenOff, 1690, 125, 220);
  block(1400, 105, 1495, 350); block(1475, 12, 1690, 105); block(1510, 170, 1620, 250); block(1655, 110, 1700, 330);
  plant('a', 1610, 335, 120); books(scene, 1556, 42, 205, 16, .3);
}

// ============================================================ ARCHIVE (300 × 150)
{
  put(scene, B(270, 220, 44), MAT.walnut, 1555, 110, 401); for (let x = 1440; x <= 1670; x += 45) put(scene, B(.6, 214, 1), MAT.blackMatte, x, 110, 423.5, { cast: false });
  put(scene, B(44, 220, 70), MAT.walnutV, 1674, 110, 470);
  [[1470, 450], [1510, 455], [1600, 452]].forEach(([x, z], i) => put(scene, RB(34, 26, 30, 2), std({ color: '#f2f0ea', roughness: .85 }), x, 13 + (i === 1 ? 26 : 0), z, { ry: i * .2 }));
  block(1420, 378, 1690, 424); block(1650, 434, 1700, 506);
  pendant(1550, 445, 220, 0, 300);
}

// ============================================================ MEETING ROOM (300 × 450, six seats)
{
  const g = grp(1550, 760);
  put(g, RB(108, 5, 236, 2), MAT.walnut, 0, 74, 0); put(g, B(16, .6, 170), MAT.blackMatte, 0, 76.8, 0, { cast: false });
  put(g, RB(56, 70, 30, 3), MAT.black, 0, 36, -72); put(g, RB(56, 70, 30, 3), MAT.black, 0, 36, 72);
  [-78, 0, 78].forEach(dz => { put(g, B(29, .8, 21), MAT.paper, -33, 77.2, dz, { ry: .05 }); put(g, B(29, .8, 21), MAT.paper, 33, 77.2, dz, { ry: -.05 }); chair(1550 - 92, 760 + dz, Math.PI / 2, true); chair(1550 + 92, 760 + dz, -Math.PI / 2, true); });
  block(1494, 640, 1606, 880);
  put(scene, RB(150, 86, 5, 1), MAT.screenOff, 1550, 150, 529); put(scene, B(146, 82, .4), MAT.screenOn, 1550, 150, 531.8, { cast: false });
  put(scene, RB(170, 50, 40, 1.5), MAT.walnut, 1550, 25, 546); block(1465, 526, 1635, 566);
  pendant(1550, 760, 200, Math.PI / 2, 265);
  plant('b', 1650, 915, 100); acUnit(1690, 760, -Math.PI / 2);
}

// ============================================================ SECRETARY (280 × 400)
{
  // counter desk faces the corridor door; a 75 cm walkway on its west side leads round to the chair
  const g = grp(1205, 1150);
  deskTop(g, 0, 0, 170, 70); put(g, B(4, 72, 66), MAT.whiteTop, -83, 36, 0); put(g, B(4, 72, 66), MAT.whiteTop, 83, 36, 0);
  put(g, RB(176, 104, 8, 1.5), MAT.walnut, 0, 52, -38); put(g, RB(180, 3, 24, 1), MAT.whiteTop, 0, 105.5, -38); put(g, B(174, 1, 1), MAT.ledWarm, 0, 103, -43, { cast: false });
  monitor(g, 15, 75, -8, 0); put(g, RB(20, 5, 16, 2), MAT.black, -50, 77, 0); put(g, B(28, 1, 20), MAT.paper, -15, 75.5, 10, { ry: -.15 });
  chair(1205, 1235, Math.PI, true); block(1117, 1108, 1293, 1188);
  put(scene, RB(170, 85, 45, 1.5), MAT.walnut, 1175, 42.5, 1364); put(scene, RB(52, 24, 42, 3), MAT.whiteMatte, 1125, 97, 1364); block(1088, 1340, 1262, 1388);
  plant('b', 1280, 1340, 85); pendant(1205, 1150, 150, 0, 275);
}

// ============================================================ MANAGER (380 × 420): L-desk to the south, two chairs + table on the north wall
{
  // L-desk with its return on the west; a ~1 m walkway on the east side leads round to the manager's chair
  const g = grp(1490, 1172);
  deskTop(g, 0, 0, 200, 85, MAT.walnut); deskTop(g, -72, 85, 56, 85, MAT.walnut);
  put(g, B(4, 72, 81), MAT.walnut, 98, 36, 0); put(g, B(52, 72, 4), MAT.walnut, -72, 36, 125); put(g, B(192, 46, 3), MAT.walnut, 0, 50, -40);
  monitor(g, 15, 75, -10, 0); put(g, B(30, 1, 22), MAT.paper, 65, 75.5, 4, { ry: .2 }); put(g, RB(20, 5, 16, 2), MAT.black, -72, 77, 100);
  chair(1510, 1262, Math.PI, true);
  block(1388, 1128, 1592, 1216); block(1388, 1216, 1448, 1302);
  // open walnut bookcase on the back wall behind the chair — every book stands on a shelf
  { const bx0 = 1450, bx1 = 1630, bc = (bx0 + bx1) / 2, bw = bx1 - bx0, z = 1360;
    put(scene, B(bw, 196, 2), MAT.walnut, bc, 100, 1377);                                         // back panel
    [bx0 + 1.5, bx1 - 1.5].forEach(x => put(scene, B(3, 200, 36), MAT.walnut, x, 100, z));        // sides
    put(scene, B(bw, 8, 36), MAT.walnut, bc, 4, z); put(scene, B(bw, 3, 36), MAT.walnut, bc, 198.5, z);   // plinth & top
    [52, 100, 148].forEach(y => put(scene, B(bw - 6, 2.5, 34), MAT.walnut, bc, y, z));            // shelves
    const tops = [8, 53.25, 101.25, 149.25];
    tops.forEach((y, i) => {
      books(scene, bx0 + 34 + (i % 2) * 22, y, z - 2, 52 - (i % 2) * 14);
      if (i !== 1) books(scene, bx1 - 40, y, z - 2, 38);
      if (i === 1 || i === 3) { put(scene, CY(7, 6, 20, 24), i === 1 ? MAT.ceramic : MAT.blackMatte, bc + 18, y + 10, z); }
      if (i === 2) put(scene, RB(26, 4, 20, 1), MAT.blackMatte, bc + 10, y + 2, z);
    });
    block(bx0 - 2, 1340, bx1 + 2, 1380);
  }
  [1455, 1605].forEach(x => { const a = grp(x, 1022); put(a, RB(64, 40, 62, 8), MAT.leatherTaupe, 0, 22, 0); put(a, RB(64, 38, 14, 6), MAT.leatherTaupe, 0, 60, -24); put(a, RB(12, 24, 56, 5), MAT.leatherTaupe, -26, 52, 2); put(a, RB(12, 24, 56, 5), MAT.leatherTaupe, 26, 52, 2); block(x - 33, 990, x + 33, 1054); });
  put(scene, RB(60, 4, 50, 2), MAT.walnut, 1530, 44, 1022); put(scene, B(50, 40, 40), MAT.black, 1530, 21, 1022); block(1500, 997, 1560, 1047);
  plant('a', 1660, 1352, 130); plant('b', 1362, 1333, 90);
  pendant(1490, 1172, 190, 0, 270); acUnit(1690, 1190, -Math.PI / 2);
}

// ============================================================ 3 OFFICES (280 × 400 each)
// Each office: L-desk against the side wall away from the door, a ~1 m walkway from the door straight down to the
// chair, two visitor chairs facing the desk, and a tall walnut cabinet in the front corner.
// Office 1's door is at its east end, so its layout is the mirror image of offices 2 and 3.
[200, 480, 760].forEach(x0 => {
  const mir = x0 === 200, sx = mir ? -1 : 1, U = u => mir ? x0 + 280 - u : x0 + u;   // u = distance from the door-side wall
  const dz = 1245, g = grp(U(188), dz);
  deskTop(g, 0, 0, 160, 75); put(g, B(4, 72, 71), MAT.black, -78, 36, 0); put(g, B(4, 72, 71), MAT.black, 78, 36, 0);
  deskTop(g, sx * 55, 80, 50, 85); put(g, B(46, 72, 4), MAT.black, sx * 55, 36, 120);   // return along the side wall
  put(g, B(150, 40, 2), MAT.whiteMatte, 0, 50, -35);                                    // modesty panel
  monitor(g, -sx * 20, 75, -14, 0); put(g, B(30, 1, 22), MAT.paper, -sx * 58, 75.5, 2, { ry: .15 }); put(g, RB(20, 5, 16, 2), MAT.black, sx * 55, 77, 95);
  chair(U(165), 1322, Math.PI, true);
  visitorChair(U(130), 1172, 0); visitorChair(U(195), 1172, 0);
  block(Math.min(U(108), U(268)), dz - 39, Math.max(U(108), U(268)), dz + 39);
  block(Math.min(U(218), U(268)), dz + 37, Math.max(U(218), U(268)), dz + 125);
  // tall walnut cabinet in the front corner on the desk side (office 1: tight against its slanted outer wall)
  let cab;
  if (mir) { const ang = Math.atan2(200, 1315), cz = 1130; cab = grp(LEFTX(cz + 4.8) + 31.6, cz, ang); block(173, 1065, 224, 1195); }
  else { cab = grp(x0 + 254, 1067.5); block(x0 + 233, 1004, x0 + 275, 1131); }
  put(cab, RB(40, 200, 125, 1.5), MAT.walnut, 0, 100, 0);
  [-1 / 6, 1 / 6].forEach(f => put(cab, B(.6, 196, 1), MAT.blackMatte, -sx * 20.3, 100, 125 * f, { cast: false }));
  put(cab, B(.6, 1, 125), MAT.blackMatte, -sx * 20.3, 120, 0, { cast: false });
  if (mir) plant('b', 192, 1025, 80); else plant('b', U(247), 1165, 70);
  pendant(U(188), dz, 140, 0, 270); acUnit(x0 + 140, 1378, Math.PI);
});

// ============================================================ outside: sidewalk, curb, road and the street across (ground floor)
{
  const fy = z => z;   // facade runs from z≈75 cm (west) to 0 (east)
  flat([[-1400, 75], [3100, -10], [3100, -420], [-1400, -420]], MAT.pavers, -1);
  put(scene, B(4500, 15, 30), MAT.curb, 850, 7.5, -435);
  flat([[-1400, -450], [3100, -450], [3100, -2050], [-1400, -2050]], MAT.asphalt, -1);
  for (let x = -1300; x < 3000; x += 600) put(scene, B(300, .5, 12), std({ color: '#d8d6cf', roughness: .7 }), x, -.6, -1250, { cast: false });
  const st = texLoader.load('assets/street/street.jpg'); st.colorSpace = THREE.SRGBColorSpace; st.wrapS = THREE.MirroredRepeatWrapping; st.repeat.x = 3; st.anisotropy = maxAniso;
  const W = 132, Hh = W / 3 * 1152 / 2688;   // three mirrored copies of the 44 m photo
  const street = new THREE.Mesh(new THREE.PlaneGeometry(W, Hh), new THREE.MeshBasicMaterial({ map: st, color: '#e8e6e2', fog: false }));
  street.position.set(8.5, EYE - .05, -20.6); scene.add(street);
}
// sun + daylight through the shopfront
const sun = new THREE.DirectionalLight('#fff6ec', 3.0);
sun.position.set(2, 26, -18); sun.target.position.set(8.5, 0, 6); sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 });
sun.shadow.bias = -.0002; sun.shadow.normalBias = .02; sun.shadow.radius = 4; scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight('#e4ebf2', '#cfc6b8', .85));   // floor bounce lights the exposed ceiling and undersides
[[4.3, 3.6], [8.6, 3.6], [13.1, 3.6]].forEach(([x, w]) => { const L = new THREE.RectAreaLight('#e9f1ff', 5, w, 2.6); L.position.set(x, 1.6, m(TOPY(x * 100)) + .35); L.lookAt(x, 1.4, 6); scene.add(L); });
// warm track spots
lightSpots.forEach(([x, z], i) => { if (i % 2) return; const s = new THREE.SpotLight('#ffe6cc', 26, 7, .5, .8, 1.8); s.position.set(m(x), 3.2, m(z)); s.target.position.set(m(x) + (i % 4 ? .3 : -.3), 0, m(z) + .4); scene.add(s, s.target); });
// reception & lounge warm accent
[[2.7, 3.3], [2.8, 8.2], [15.6, 2.0]].forEach(([x, z]) => { const p = new THREE.PointLight('#ffe2c4', 10, 5, 2); p.position.set(x, 2.6, z); scene.add(p); });

// ============================================================ environment
new RGBELoader(manager).load('assets/hdri/wide_street_01_1k.hdr', hdr => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(hdr).texture;
  scene.background = hdr; scene.backgroundBlurriness = .02; scene.backgroundIntensity = .9; scene.environmentIntensity = 1;
});
loadPlants();

// ============================================================ post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const gtao = new GTAOPass(scene, camera, innerWidth, innerHeight, undefined, { radius: .5, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16, screenSpaceRadius: false });
gtao.blendIntensity = .85; composer.addPass(gtao);
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .22, .5, .92); composer.addPass(bloom);
composer.addPass(new OutputPass());
const smaa = new SMAAPass(innerWidth * renderer.getPixelRatio(), innerHeight * renderer.getPixelRatio()); composer.addPass(smaa);
let quality = 'high';
function setQuality(q) {
  quality = q; gtao.enabled = q === 'high'; renderer.shadowMap.enabled = true; sun.shadow.mapSize.set(q === 'high' ? 4096 : 2048, q === 'high' ? 4096 : 2048);
  if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  renderer.setPixelRatio(q === 'high' ? Math.min(devicePixelRatio, 1.5) : Math.min(devicePixelRatio, 1)); resize();
  $('#btnQ').textContent = 'جودة: ' + (q === 'high' ? 'عالية' : 'سريعة');
}
function resize() {
  const w = innerWidth, h = innerHeight; camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h, false); composer.setSize(w, h);
}
addEventListener('resize', resize);

// ============================================================ navigation
const SPOTS = [
  ['المدخل والاستقبال', [235, 125], [300, 560]],
  ['جلسة الانتظار', [420, 520], [240, 860]],
  ['منطقة العمل المفتوحة', [520, 640], [900, 120]],
  ['الممر الرئيسي', [520, 860], [1300, 860]],
  ['مكتب إداري (1)', [425, 1030], [330, 1330]],
  ['مكتب إداري (2)', [580, 1030], [620, 1330]],
  ['مكتب إداري (3)', [860, 1030], [900, 1330]],
  ['مكتب السكرتير', [1100, 1040], [1250, 1300]],
  ['مكتب المدير', [1365, 1060], [1600, 1250]],
  ['دورات المياه', [1250, 480], [1150, 400]],
  ['المطبخ', [1330, 300], [1150, 130]],
  ['الاستراحة التنفيذية', [1320, 120], [1600, 230]],
  ['الأرشيف', [1425, 465], [1680, 440]],
  ['قاعة الاجتماعات', [1440, 925], [1580, 560]],
];
const jump = $('#jump'); jump.innerHTML = '<option value="">انتقل إلى…</option>' + SPOTS.map((s, i) => `<option value="${i}">${s[0]}</option>`).join('');
let yaw = 0, pitch = 0;
function goTo(i) { const [, p, t] = SPOTS[i]; camera.position.set(m(p[0]), EYE, m(p[1])); yaw = Math.atan2(-(m(t[0]) - m(p[0])), -(m(t[1]) - m(p[1]))); pitch = -.05; }
jump.addEventListener('change', () => { if (jump.value !== '') { goTo(+jump.value); jump.value = ''; jump.blur(); if (!touch) lockIt(); } });

const touch = matchMedia('(pointer: coarse)').matches; if (touch) { document.body.classList.add('touch'); $('#keysDesk').hidden = true; $('#keysTouch').hidden = false; }
const controls = new PointerLockControls(camera, document.body);
controls.pointerSpeed = .8;
const lockIt = () => { try { controls.lock(); } catch (e) { } };
controls.addEventListener('lock', () => $('#start').classList.remove('show'));
controls.addEventListener('unlock', () => { if (!touch) $('#start').classList.add('show'); });
$('#go').addEventListener('click', () => { if (touch) $('#start').classList.remove('show'); else lockIt(); });
canvas.addEventListener('click', () => { if (!touch && !controls.isLocked) lockIt(); });
// PointerLockControls drives the camera quaternion; mirror it into yaw/pitch so teleports and touch share one state
controls.addEventListener('change', () => { const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'); yaw = e.y; pitch = e.x; });

const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'KeyM') toggleMap(); if (e.code === 'KeyF') toggleFs(); if (e.code === 'KeyH') setSlats(!SLAT.on); });
$('#start').addEventListener('click', e => { if (e.target.id === 'start' && !touch) lockIt(); });   // click outside the card to carry on walking
addEventListener('keyup', e => { keys[e.code] = false; });
// touch: joystick to walk, drag anywhere else to look
const stick = { x: 0, y: 0, id: null }, look = { id: null, x: 0, y: 0 };
const stickEl = $('#stick'), knob = $('#stick i');
stickEl.addEventListener('pointerdown', e => { stick.id = e.pointerId; stickEl.setPointerCapture(e.pointerId); moveStick(e); });
stickEl.addEventListener('pointermove', e => { if (e.pointerId === stick.id) moveStick(e); });
const endStick = e => { if (e.pointerId === stick.id) { stick.id = null; stick.x = stick.y = 0; knob.style.transform = ''; } };
stickEl.addEventListener('pointerup', endStick); stickEl.addEventListener('pointercancel', endStick);
function moveStick(e) { const r = stickEl.getBoundingClientRect(); let dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2); const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; } stick.x = dx; stick.y = dy; knob.style.transform = `translate(${dx * 36}px,${dy * 36}px)`; }
canvas.addEventListener('pointerdown', e => { if (!touch) return; look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; });
canvas.addEventListener('pointermove', e => { if (e.pointerId !== look.id) return; yaw -= (e.clientX - look.x) * .005; pitch -= (e.clientY - look.y) * .005; look.x = e.clientX; look.y = e.clientY; });
const endLook = e => { if (e.pointerId === look.id) look.id = null; };
canvas.addEventListener('pointerup', endLook); canvas.addEventListener('pointercancel', endLook);

$('#btnQ').addEventListener('click', () => setQuality(quality === 'high' ? 'fast' : 'high'));
function toggleFs() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); }
$('#btnFs').addEventListener('click', toggleFs);
let mapOn = true; function toggleMap() { mapOn = !mapOn; $('#mini').style.display = mapOn ? '' : 'none'; $('#btnMap').setAttribute('aria-pressed', mapOn); }
$('#btnMap').addEventListener('click', toggleMap);
$('#btnSlat').addEventListener('click', () => setSlats(!SLAT.on)); setSlats(true);

// ---- floor-plan map (navigation aid) ----
const MS = .14, pts = poly => poly.map(p => `${(p[0] * MS).toFixed(1)},${(p[1] * MS).toFixed(1)}`).join(' ');
$('#mini').innerHTML = `<svg width="${1700 * MS + 8}" height="${1390 * MS + 8}" viewBox="-4 -4 ${1700 * MS + 8} ${1390 * MS + 8}" aria-label="خريطة الطابق">
  <polygon points="${pts(OUTLINE)}" fill="rgba(255,255,255,.08)" stroke="#fff" stroke-width="2"/>
  <polygon points="${pts(SHAFT)}" fill="rgba(255,255,255,.25)"/>
  ${ROOMS.map(r => `<polygon id="mp-${r.id}" points="${pts(r.poly)}" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.55)" stroke-width="1"/>`).join('')}
  <g id="me"><path d="M0,-9 L6,6 L0,3 L-6,6 Z" fill="#efba51" stroke="#1f1e1c" stroke-width="1"/></g></svg>`;

// ---- current area label (dimensions straight from the plan) ----
const NAMES = { reception: 'منطقة الاستقبال', open: 'منطقة العمل المفتوحة', kitchen: 'المطبخ', wc: 'دورات المياه', lounge: 'الاستراحة التنفيذية', archive: 'الأرشيف', meet2: 'قاعة الاجتماعات', meet: 'مكتب المدير', b3: 'مكتب السكرتير', b4: 'مكتب إداري', b5: 'مكتب إداري', b6: 'مكتب إداري' };
let lastRoom = null;
function updateRoom() {
  const x = camera.position.x * 100, z = camera.position.z * 100;
  const r = ROOMS.find(rr => inPoly(x, z, rr.poly));
  const id = r ? r.id : inPoly(x, z, CORRIDOR) ? 'corridor' : 'out';
  if (id === lastRoom) return; lastRoom = id;
  const el = $('#room');
  if (id === 'out') { el.style.opacity = 0; return; }
  el.style.opacity = 1;
  el.querySelector('b').textContent = id === 'corridor' ? 'الممر الرئيسي' : NAMES[id];
  el.querySelector('span').innerHTML = id === 'corridor' ? '<span class="num w">270</span> سم عرض' : r.dims ? `<span class="num w">${r.dims[0]}</span> × <span class="num d">${r.dims[1]}</span> سم · <span class="num">${(r.dims[0] * r.dims[1] / 10000).toFixed(2)}</span> م²` : '';
  ROOMS.forEach(rr => document.getElementById('mp-' + rr.id).setAttribute('fill', rr.id === id ? 'rgba(71,161,144,.65)' : 'rgba(255,255,255,.06)'));
}

// ============================================================ loop
const clock = new THREE.Clock(); let bob = 0;
function step(dt) {
  let f = 0, s = 0;
  if (keys.KeyW || keys.ArrowUp) f += 1; if (keys.KeyS || keys.ArrowDown) f -= 1; if (keys.KeyD || keys.ArrowRight) s += 1; if (keys.KeyA || keys.ArrowLeft) s -= 1;
  if (stick.id !== null) { f -= stick.y; s += stick.x; }
  pitch = Math.max(-1.45, Math.min(1.45, pitch));
  camera.rotation.set(pitch, yaw, 0, 'YXZ');
  const len = Math.hypot(f, s); if (len > 1) { f /= len; s /= len; }
  const speed = (keys.ShiftLeft || keys.ShiftRight ? RUN : WALK) * dt;
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  const dx = (fx * f + rx * s) * speed, dz = (fz * f + rz * s) * speed;
  const p = camera.position;
  if (dx && !hits(p.x + dx, p.z)) p.x += dx;
  if (dz && !hits(p.x, p.z + dz)) p.z += dz;
  bob += len ? dt * (keys.ShiftLeft ? 11 : 7.5) : 0;
  p.y = EYE + (len ? Math.sin(bob) * .018 : 0);
  // sliding doors: open when you are within ~2 m, close again behind you (eased, ~0.6 s)
  for (const sd of slidingDoors) {
    const want = Math.hypot(p.x - sd.mid[0], p.z - sd.mid[1]) < 2.1 ? 1 : 0;
    if (sd.t === want) continue;
    sd.t = want > sd.t ? Math.min(1, sd.t + dt * 1.8) : Math.max(0, sd.t - dt * 1.4);
    const e = sd.t * sd.t * (3 - 2 * sd.t);
    sd.g.position.x = sd.shut[0] + (sd.open[0] - sd.shut[0]) * e; sd.g.position.z = sd.shut[1] + (sd.open[1] - sd.shut[1]) * e;
  }
  // map marker
  const me = document.getElementById('me'); if (me) me.setAttribute('transform', `translate(${(p.x * 100 * MS).toFixed(1)},${(p.z * 100 * MS).toFixed(1)}) rotate(${(-yaw * 180 / Math.PI).toFixed(1)})`);
  updateRoom();
}
manager.onLoad = () => {
  $('#loader').style.opacity = 0; setTimeout(() => $('#loader').remove(), 700);
  $('#start').classList.add('show');
};
goTo(0);
setQuality(innerWidth < 900 || touch ? 'fast' : 'high');
renderer.setAnimationLoop(() => { const dt = Math.min(clock.getDelta(), .05); step(dt); composer.render(); });

// for automated checks
window.__walk = { goTo, camera, scene, setSlats, setView: (x, z, tx, tz, py = 0) => { camera.position.set(x, EYE, z); yaw = Math.atan2(-(tx - x), -(tz - z)); pitch = py; }, hits, SPOTS };
