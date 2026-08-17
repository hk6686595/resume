# ============================================================
# 一键部署到 GitHub Pages（全自动模式）
#
# 自动模式（推荐，无需手动建仓库）：
#   1) 登录 GitHub：gh auth login        （首次需要，之后不用）
#   2) 运行：.\deploy.ps1                （自动建仓库、推送、启用 Pages）
#      可加参数指定仓库名：.\deploy.ps1 -RepoName "resume"
#
# 手动模式（没有 gh / 未登录时）：
#   1) 在 GitHub 网页上创建一个空的 Public 仓库（不要勾选 README）
#   2) 运行：.\deploy.ps1 -RepoUrl "https://github.com/<你的用户名>/resume.git"
# ============================================================
param(
    [string]$RepoUrl = "",
    [string]$RepoName = "resume"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# ---- 初始化仓库（如尚未初始化） ----
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    git add .
    git commit -m "init: 崔伊超个人简历网站"
}

# ---- 查找 gh（PATH 或 LOCALAPPDATA 便携安装） ----
$gh = $null
$cmd = Get-Command gh -ErrorAction SilentlyContinue
if ($cmd) { $gh = $cmd.Source }
else {
    $candidate = Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Programs\gh') -Recurse -Filter gh.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($candidate) { $gh = $candidate.FullName }
}

$owner = ""
if ($gh) {
    $statusOut = (& $gh auth status 2>&1 | Out-String)
    if ($statusOut -match 'Logged in to github\.com as\s+(\S+)') {
        $owner = $Matches[1]
    }
}

if ($gh -and $owner) {
    # ================= 自动模式 =================
    Write-Host ""
    Write-Host "✅ 已检测到 GitHub 登录：$owner"
    Write-Host "正在创建仓库 $RepoName 并推送代码..."

    & $gh repo create $RepoName --public --source=. --push 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Host "仓库可能已存在，尝试直接推送..."
        git branch -M main
        git remote remove origin 2>$null
        git remote add origin "https://github.com/$owner/$RepoName.git"
        git push -u origin main
    }

    Write-Host "正在启用 GitHub Pages..."
    $body = '{"source":{"branch":"main","path":"/"}}'
    $body | & $gh api -X POST "repos/$owner/$RepoName/pages" --input - 2>&1 | Out-Host

    $site = "https://$owner.github.io/$RepoName/"
    Write-Host ""
    Write-Host "🎉 部署完成！预计 1~2 分钟后可访问："
    Write-Host "   $site"
} elseif ($RepoUrl) {
    # ================= 手动模式 =================
    git remote remove origin 2>$null
    git remote add origin $RepoUrl
    git push -u origin main

    Write-Host ""
    Write-Host "✅ 推送成功！"
    Write-Host "   下一步：打开 GitHub 仓库 -> Settings -> Pages"
    Write-Host "   Source 选 'Deploy from a branch' -> 分支 main -> 目录 / (root) -> Save"
    Write-Host "   等待 1~2 分钟后访问：https://<你的用户名>.github.io/<仓库名>/"
} else {
    Write-Host ""
    Write-Host "⚠️  未检测到 GitHub 登录，也未提供 -RepoUrl。"
    Write-Host "   请任选其一："
    Write-Host "   1) 先运行 gh auth login 登录 GitHub，再重跑：.\deploy.ps1"
    Write-Host "   2) 或提供仓库地址：.\deploy.ps1 -RepoUrl ""https://github.com/<你的用户名>/resume.git"""
    Write-Host "   3) 或按 README 的『方式二：网页操作』手动部署"
}
