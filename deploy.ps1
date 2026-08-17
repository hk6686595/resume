# ============================================================
# 一键部署到 GitHub Pages
#
# 用法（二选一）：
#   1) 已安装并登录 GitHub CLI：
#        gh repo create resume --public --source=. --push
#   2) 使用本脚本（推荐）：
#        先在 GitHub 网页上创建一个空的 Public 仓库（不要勾选 README），
#        然后运行：.\deploy.ps1 -RepoUrl "https://github.com/<你的用户名>/resume.git"
# ============================================================
param(
    [Parameter(Mandatory = $true)]
    [string]$RepoUrl
)

Set-Location $PSScriptRoot

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    git add .
    git commit -m "init: 崔伊超个人简历网站"
}

git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

Write-Host ""
Write-Host "✅ 推送成功！"
Write-Host "   下一步：打开 GitHub 仓库 -> Settings -> Pages"
Write-Host "   Source 选 'Deploy from a branch' -> 分支 main -> 目录 / (root) -> Save"
Write-Host "   等待 1~2 分钟后访问：https://<你的用户名>.github.io/resume/"
