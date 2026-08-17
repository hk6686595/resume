# 崔伊超 · 个人简历网站

一个浅色简洁风格的个人简历单页网站，纯静态（HTML + CSS + JS），无需服务器，免费托管。

## 项目结构

```
个人简历网站/
├── index.html            # 页面主体（简历内容都在这里）
├── assets/
│   ├── css/style.css     # 样式（浅色简洁风、响应式、打印样式）
│   └── js/main.js        # 交互（导航高亮、入场动画、技能条、打印）
└── README.md
```

## 本地预览

```bash
# 任选其一
python -m http.server 4173
# 然后浏览器打开 http://127.0.0.1:4173
```

> 说明：直接双击打开 index.html 也能看，但用本地服务器预览更接近线上效果。

## 部署前：替换占位信息

打开 `index.html`，搜索 `✏️` 注释，把以下占位内容替换为真实信息：

1. **联系方式**（搜索 `youremail@example.com`、`138-0000-0000`、`github.com/yourname`、`所在城市`）
2. **任职时间**（可选，见「工作经历」卡片中的注释说明）
3. 建议同时把 `<title>` 和 `<meta name="description">` 里的信息过一遍

## 免费部署到 GitHub Pages（推荐）

### 方式一：网页操作（无需命令行，推荐新手）

1. 打开 https://github.com 注册 / 登录账号
2. 点击右上角 **+** → **New repository**
   - Repository name：建议填 `resume`（或你的用户名，如 `cuiiychao.github.io`）
   - 选择 **Public**（免费）
   - 不要勾选 "Add a README file"，直接 **Create repository**
3. 进入仓库后，点击 **uploading an existing file**，把本文件夹里的
   `index.html` 和 `assets` 文件夹**整体拖入**上传，点击 **Commit changes**
4. 进入仓库 **Settings** → 左侧 **Pages**
   - Source 选择 **Deploy from a branch**
   - Branch 选择 **main**，目录选择 **/ (root)**，点击 **Save**
5. 等待 1~2 分钟，页面顶部会显示你的网址：
   `https://<你的用户名>.github.io/resume/`

### 方式二：命令行（推荐，以后更新方便）

```bash
cd 个人简历网站
git init
git add .
git commit -m "init: personal resume site"

# 已有 GitHub 账号，且已安装并登录 GitHub CLI 时：
gh repo create resume --public --source=. --push

# 或手动方式（先在网页上建好空仓库后）：
git branch -M main
git remote add origin https://github.com/<你的用户名>/resume.git
git push -u origin main
```

之后每次修改内容，重复：

```bash
git add .
git commit -m "update resume"
git push
```

等待约 1 分钟，线上自动更新。

## 后续可免费升级（可选）

- **自定义域名**：GitHub Pages 免费支持绑定自己的域名（需域名费用，域名本身不是免费的）
- **HTTPS**：GitHub Pages 自动提供 `https://` 证书，无需额外操作

## 打印 / 导出 PDF

页面右上角「打印 / 保存 PDF」按钮，或浏览器里直接 Ctrl+P，可输出排版干净的 PDF 简历用于投递。
