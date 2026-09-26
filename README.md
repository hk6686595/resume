# 崔伊超 · 个人简历网站（Bun）

基于 [Bun](https://bun.sh) 的服务端渲染（SSR）个人简历网站，内容参考原静态项目 `D:\PI\WebAndData\resume`。

## 项目结构

```
resume-bun/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Bun.serve 入口（SSR + 静态资源）
│   ├── build.ts              # 静态构建（输出到 dist/）
│   ├── data/
│   │   └── resume.ts         # 简历内容数据（结构化）
│   └── templates/
│       └── render.ts         # HTML 服务端渲染模板
├── public/
│   ├── css/style.css         # 样式
│   ├── js/main.js            # 交互脚本
│   └── videos/               # 项目演示视频
└── README.md
```

## 快速开始

```bash
# 安装依赖（仅类型声明）
bun install

# 开发模式（文件变动自动重启）
bun run dev

# 生产启动
bun run start

# 类型检查
bun run typecheck

# 构建纯静态站点（输出 dist/，可直接托管到 GitHub Pages 等）
bun run build
```

默认访问：`http://localhost:3000`（可用 `PORT=8080 bun run start` 改端口）。

## 主题

内置三套主题，页面右上角（移动端在折叠菜单内）可切换，选择结果存入
`localStorage`，下次访问自动恢复：

| 主题 | 说明 |
| --- | --- |
| 清新 | 默认，浅蓝冷色调 |
| 暖色 | 米白底 + 琥珀橙强调色 |
| 暗黑 | 深色，适配 `prefers-color-scheme: dark` |

首次访问若本地没有选择，会跟随系统配色。切换逻辑由 `public/js/main.js`
负责，`<head>` 内有一段同步内联脚本在首帧前写入 `data-theme`，因此不会闪白。

所有颜色都走 CSS 变量（`--accent`、`--surface`、`--muted` 等），集中在
`public/css/style.css` 顶部的三段主题块里。新增配色只需改变量，不要硬编码
颜色值。

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动执行
「安装依赖 → 类型检查 → 构建 → 发布」，无需手动操作。首次使用需在仓库
**Settings → Pages** 中把 **Source** 设为 **`GitHub Actions`**
（若沿用旧的 *Deploy from a branch* 设置，根目录没有 `index.html`，会 404）。

> Pages 免费版每月有 100GB 软性带宽上限。本站 8 个演示视频共 59MB
> （最大单个 21MB），访客点开一个就可能消耗几十 MB，访问量上来后建议
> 给视频接 CDN 或转码到 720p。

**自定义域名**：GitHub Pages 免费支持绑定自己的域名 —— 在
**Settings → Pages → Custom domain** 填入域名，再按提示在域名服务商处添加
CNAME 记录指向 `<用户名>.github.io`。HTTPS 证书由 GitHub 自动签发。

## 与原静态版的区别

- **内容数据化**：简历信息集中在 `src/data/resume.ts`，改内容无需碰 HTML
- **SSR**：首页由 Bun 在服务端渲染，首屏即完整 HTML
- **静态构建**：`bun run build` 可导出纯静态 `dist/`，兼容原部署方式
- **多主题**：清新 / 暖色 / 暗黑三套配色，纯 CSS 变量实现，无额外依赖
- **部署路径无关**：HTML 中的资源引用为相对路径（`css/style.css`、`videos/xxx.mp4`），
  因此 `dist/` 放在域名根目录、GitHub Pages 子路径（`/仓库名/`）或直接以 `file://`
  打开都不会出现资源 404
- **路径安全**：静态文件服务用 `path.resolve` 真正解析 `..` 后再校验前缀，
  阻断路径穿越；畸形百分号编码返回 400
- **转义安全**：所有文本走 HTML 转义，`href` 仅放行 `http(s)/mailto/tel` 与页内锚点，
  内联 JSON-LD 转义 `<`
- **无 JS 兜底**：`.reveal` 入场动画在 `<noscript>` 与 `@media print` 下强制显示，
  避免脚本失败或打印时得到空白简历
- **对比度**：三套主题的正文级文本均满足 WCAG AA（≥ 4.5:1）
