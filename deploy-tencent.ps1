# ============================================================
# 一键部署到腾讯云 EdgeOne Makers（静态托管）
#
# 首次：edgeone login --site china
# 之后：.\deploy-tencent.ps1
# 可指定项目名：.\deploy-tencent.ps1 -ProjectName "cuiyichao-resume-web"
# ============================================================
param(
    [string]$ProjectName = "cuiyichao-resume-web",
    [ValidateSet("global", "overseas")]
    [string]$Area = "overseas"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$edgeone = $null
$cmd = Get-Command edgeone -ErrorAction SilentlyContinue
if ($cmd) { $edgeone = $cmd.Source }
if (-not $edgeone) {
    Write-Host "正在安装 EdgeOne CLI..."
    npm install -g edgeone
    $cmd = Get-Command edgeone -ErrorAction SilentlyContinue
    if ($cmd) { $edgeone = $cmd.Source }
}
if (-not $edgeone) {
    throw "未找到 edgeone，请先执行：npm install -g edgeone"
}

$whoami = (& $edgeone whoami 2>&1 | Out-String)
if ($whoami -notmatch 'Account ID') {
    Write-Host "未登录腾讯云，正在打开中国站登录..."
    & $edgeone login --site china
    $whoami = (& $edgeone whoami 2>&1 | Out-String)
    if ($whoami -notmatch 'Account ID') {
        throw "登录失败，请手动执行：edgeone login --site china"
    }
}

Write-Host $whoami.Trim()

$stage = Join-Path $env:TEMP "resume-tencent-deploy"
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null
Copy-Item (Join-Path $PSScriptRoot "index.html") $stage
Copy-Item (Join-Path $PSScriptRoot "assets") (Join-Path $stage "assets") -Recurse

Write-Host "正在部署到腾讯云 EdgeOne 项目: $ProjectName (加速区域 $Area)"
& $edgeone makers deploy $stage -n $ProjectName -e production -a $Area --json
if ($LASTEXITCODE -ne 0) {
    throw "部署失败，退出码 $LASTEXITCODE"
}

Write-Host ""
Write-Host "部署完成。国内访问请用 CLI 打印的带 eo_token 预览链接（约 3 小时有效）。"
Write-Host "境外可直接打开项目域名；长期公开分享建议在控制台绑定已备案自定义域名。"
Write-Host "控制台: https://console.cloud.tencent.com/edgeone/pages"