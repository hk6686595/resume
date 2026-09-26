# 旧版部署脚本（已废弃）

`deploy.ps1` 是**旧静态版**简历网站的一键部署脚本，保留仅作历史参考。

## 为什么废弃

该脚本面向的是 `index.html` + `assets/` 的旧目录结构，并会提示你把
GitHub Pages 的 Source 设为 **Deploy from a branch → `main` → `/ (root)`**。

这个设置**现在会直接把站点弄坏**：新版站点的产物在 `dist/`（已被 `.gitignore`
忽略），仓库根目录不再有 `index.html`，按旧提示配置只会得到 404。

## 现在应该怎么做

站点已改用 GitHub Actions 自动部署，**无需任何本地脚本**：

1. 推送到 `main` 分支
2. `.github/workflows/deploy.yml` 自动执行「安装依赖 → 类型检查 → 构建 → 发布」
3. 首次使用需在仓库 **Settings → Pages** 中把 **Source** 设为 **`GitHub Actions`**

详见根目录 `README.md` 的「部署」章节。

## 如果一定要用这个脚本

它依赖 GitHub CLI（`gh auth login`）与旧目录结构，与当前项目不兼容。
请不要在 Bun 版项目上运行它。
