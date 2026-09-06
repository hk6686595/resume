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

function Invoke-Quiet {
    param([scriptblock]$Command)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $output = & $Command
        return @{
            Code   = $LASTEXITCODE
            Output = $output
        }
    } finally {
        $ErrorActionPreference = $prev
    }
}

function Set-GitOrigin {
    param([string]$Url)
    $check = Invoke-Quiet { git remote get-url origin 2>$null | Out-Null }
    if ($check.Code -eq 0) {
        git remote set-url origin $Url
    } else {
        git remote add origin $Url
    }
}

# ---- 初始化仓库并提交本地改动 ----
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

git add -A
$pending = git status --porcelain
if ($pending) {
    Write-Host "检测到未提交改动，正在提交..."
    $commitMsg = "deploy: 更新简历网站"
    git @("commit", "-m", $commitMsg)
}

git branch -M main

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
    # 用 API 取登录名，避免依赖 gh auth status 的文案（新旧版 as / account 不同）
    $login = Invoke-Quiet { & $gh api user --jq .login 2>$null }
    if ($login.Code -eq 0 -and $login.Output) {
        $owner = ("$($login.Output)").Trim()
    }
}

if ($gh -and $owner) {
    # ================= 自动模式 =================
    Write-Host ""
    Write-Host "[OK] 已检测到 GitHub 登录：$owner"
    $repoSlug = "$owner/$RepoName"
    $originUrl = "https://github.com/$repoSlug.git"

    $view = Invoke-Quiet { & $gh repo view $repoSlug 2>$null | Out-Null }
    if ($view.Code -ne 0) {
        Write-Host "正在创建仓库 $RepoName ..."
        & $gh repo create $repoSlug --public --description "个人简历网站"
        if ($LASTEXITCODE -ne 0) {
            throw "创建仓库失败，请检查 gh 权限后重试。"
        }
    } else {
        Write-Host "仓库已存在：$repoSlug ，将直接推送。"
    }

    Set-GitOrigin $originUrl
    Write-Host "正在推送代码到 GitHub..."
    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        throw "git push 失败。请确认 gh auth login 已完成，且对该仓库有写权限。"
    }

    Write-Host "正在启用 GitHub Pages..."
    $pagesBody = '{"source":{"branch":"main","path":"/"}}'
    $created = Invoke-Quiet { $pagesBody | & $gh api -X POST "repos/$repoSlug/pages" --input - 2>$null | Out-Null }
    if ($created.Code -ne 0) {
        Invoke-Quiet { $pagesBody | & $gh api -X PUT "repos/$repoSlug/pages" --input - 2>$null | Out-Null } | Out-Null
    }

    $site = "https://$owner.github.io/$RepoName/"
    $pages = Invoke-Quiet { & $gh api "repos/$repoSlug/pages" --jq .html_url 2>$null }
    if ($pages.Code -eq 0 -and $pages.Output) {
        $site = ("$($pages.Output)").Trim()
        if ($site -and -not $site.EndsWith("/")) { $site = "$site/" }
    }

    Write-Host ""
    Write-Host "[OK] 部署完成！预计 1~2 分钟后可访问："
    Write-Host "   $site"
} elseif ($RepoUrl) {
    # ================= 手动模式 =================
    Set-GitOrigin $RepoUrl
    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        throw "git push 失败，请检查仓库地址和登录状态。"
    }

    Write-Host ""
    Write-Host "[OK] 推送成功！"
    Write-Host "   下一步：打开 GitHub 仓库 -> Settings -> Pages"
    Write-Host "   Source 选 'Deploy from a branch' -> 分支 main -> 目录 / (root) -> Save"
    Write-Host "   等待 1~2 分钟后访问：https://<你的用户名>.github.io/<仓库名>/"
} else {
    Write-Host ""
    Write-Host "[!] 未检测到 GitHub 登录，也未提供 -RepoUrl。"
    Write-Host "   请任选其一："
    Write-Host "   1) 先运行 gh auth login 登录 GitHub，再重跑：.\deploy.ps1"
    Write-Host "   2) 或提供仓库地址：.\deploy.ps1 -RepoUrl ""https://github.com/<你的用户名>/resume.git"""
    Write-Host "   3) 或按 README 的『方式二：网页操作』手动部署"
}
