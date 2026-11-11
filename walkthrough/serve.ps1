# Tiny local web server for the walkthrough (browsers block 3D pages opened straight from disk).
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript'; '.css'='text/css'; '.jpg'='image/jpeg'; '.png'='image/png'; '.hdr'='application/octet-stream'; '.gltf'='model/gltf+json'; '.bin'='application/octet-stream' }
foreach ($port in 8765..8790) {   # first free port wins
  $http = New-Object System.Net.HttpListener; $http.Prefixes.Add("http://localhost:$port/")
  try { $http.Start(); break } catch { $http.Close(); $http = $null }
}
if (-not $http) { Write-Host 'No free port found'; pause; exit 1 }
Write-Host "J WALK walkthrough running at http://localhost:$port/  (close this window to stop)"
if (-not $env:JW_NOBROWSER) { Start-Process "http://localhost:$port/" }
while ($http.IsListening) {
  $ctx = $http.GetContext()
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/')); if ($rel -eq '') { $rel = 'index.html' }
  $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
  if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($file); $ext = [IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' })
    $ctx.Response.ContentLength64 = $bytes.Length; $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}


