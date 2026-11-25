$ErrorActionPreference = 'Continue'
$dir = 'd:\DevPrograms\WebAndData\个人简历'
$gh = 'C:\Users\Administrator\AppData\Local\Programs\gh\bin\gh.exe'
Set-Location $dir

Write-Host "== 1. 备份远端 Bun 版到本地分支 =="
git rev-parse --verify -q bun-backup *> $null
if ($LASTEXITCODE -ne 0) { git branch bun-backup origin/main }
Write-Host ("bun-backup -> " + (git rev-parse --short bun-backup))

Write-Host "== 2. 提交工作区剩余改动 =="
git add -A
$pending = git status --porcelain
if ($pending) { git commit -m "chore: 移除面试问答文档" | Out-Null }

Write-Host "== 3. 用静态站覆盖远端树（保留 Bun 提交于历史） =="
git merge -s ours origin/main -m "chore: 静态站覆盖 Bun 版站点，改回分支部署" 2>&1 | Out-String | Write-Host

Write-Host "== 4. 推送 main =="
git push origin main 2>&1 | Out-String | Write-Host

Write-Host "== 5. Pages 切回分支部署 =="
$body = '{"build_type":"legacy","source":{"branch":"main","path":"/"}}'
$body | & $gh api -X PUT repos/hk6686595/resume/pages --input - | Out-Null
Start-Sleep -Seconds 3

Write-Host "== 6. 当前 Pages 状态 =="
$r = & $gh api repos/hk6686595/resume/pages | ConvertFrom-Json
Write-Host ("html_url=" + $r.html_url)
Write-Host ("build_type=" + $r.build_type + " status=" + $r.status)

Write-Host "== 7. 等待构建 =="
for ($i = 0; $i -lt 24; $i++) {
  Start-Sleep -Seconds 10
  $r = & $gh api repos/hk6686595/resume/pages | ConvertFrom-Json
  Write-Host ("[" + $i + "] status=" + $r.status)
  if ($r.status -eq 'built' -or $r.status -eq 'errored') { break }
}

Write-Host "== 8. 线上内容抽查 =="
try {
  $resp = Invoke-WebRequest -Uri ("https://hk6686595.github.io/resume/?t=" + (Get-Date -Format 'yyyyMMddHHmmss')) -UseBasicParsing -TimeoutSec 30
  $html = $resp.Content
  Write-Host ("HTTP " + $resp.StatusCode + "  length=" + $html.Length)
  foreach ($k in @('自研 C++ UI 库', 'Kilo Code', '20+ 自研软件', 'Protobuf', 'MQTT', 'MiniLinux')) {
    Write-Host ("  contains '" + $k + "': " + $html.Contains($k))
  }
} catch {
  Write-Host ("fetch failed: " + $_.Exception.Message)
}
