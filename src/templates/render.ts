import { resume, type Project } from "../data/resume";

/**
 * 资源使用相对路径（而非 /css/... 绝对路径），这样导出的 dist/
 * 可以被部署在域名根目录、子目录（GitHub Pages 项目站）或直接以
 * file:// 打开，静态资源都不会 404。
 * 页面只会在根层级被访问（/ 与 /index.html），因此相对路径总是安全。
 */
const asset = (path: string): string => path;

const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * 只放行已知的安全协议，拦截 javascript: / data: 一类可执行 URL。
 * 页内锚点与相对路径同样允许。
 */
const SAFE_PROTOCOLS = ["http://", "https://", "mailto:", "tel:"];

function safeHref(href: string): string {
  const v = href.trim();
  if (/^(#|\/|\.\/|\.\.\/)/.test(v)) return esc(v);
  const lower = v.toLowerCase();
  return SAFE_PROTOCOLS.some((p) => lower.startsWith(p)) ? esc(v) : "#";
}

/**
 * 内联 JSON-LD 必须转义 "<"，否则数据里的 "</script>" 可提前闭合脚本块。
 */
function jsonLdScript(data: unknown): string {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

const THEMES = [
  { id: "fresh", label: "清新" },
  { id: "warm", label: "暖色" },
  { id: "dark", label: "暗黑" },
] as const;

/**
 * 主题切换器。首屏在 <head> 内联脚本里已写入 data-theme，
 * 这里只需输出三种可选按钮；具体 id 不写死，由 main.js 统一读取。
 */
function renderThemeSwitch(variant: "bar" | "menu"): string {
  const buttons = THEMES.map(
    (t) =>
      `<button type="button" class="theme-btn" data-theme-set="${t.id}" aria-pressed="false">${t.label}</button>`,
  ).join("");
  return `<div class="theme-switch theme-switch--${variant}" role="group" aria-label="切换主题">${buttons}</div>`;
}

const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563eb'/%3E%3Ctext x='32' y='43' font-size='30' text-anchor='middle' fill='white' font-family='sans-serif'%3E%E5%B4%94%3C/text%3E%3C/svg%3E";

function renderHead(): string {
  const { meta, jsonLd } = resume;
  return `<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(meta.name)} · 个人简历 | ${esc(meta.role)}</title>
<meta name="description" content="${esc(meta.description)}" />
<meta name="keywords" content="${esc(meta.keywords)}" />
<meta property="og:title" content="${esc(meta.name)} · 个人简历" />
<meta property="og:description" content="${esc(meta.description)}" />
<meta property="og:type" content="website" />
<meta name="theme-color" id="themeColorMeta" content="#f6f8fb" />
<link rel="icon" href="${favicon}" />
<script>
/* 必须在样式表之前同步写入主题，避免首屏闪白；失败时回落到默认清新主题 */
(function () {
  var t = "fresh";
  try {
    var s = localStorage.getItem("resume-theme");
    if (s === "fresh" || s === "warm" || s === "dark") {
      t = s;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      t = "dark";
    }
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", t);
})();
</script>
<link rel="stylesheet" href="${asset("css/style.css")}" />
<script type="application/ld+json">
${jsonLdScript(jsonLd)}
</script>
</head>`;
}

function renderNav(): string {
  const links = resume.nav
    .map((n) => `<a href="${safeHref(n.href)}">${esc(n.text)}</a>`)
    .join("\n        ");
  return `<header class="site-header" id="top">
  <div class="container nav-wrap">
    <a class="brand" href="#top">${esc(resume.hero.name)}<span class="brand-dot">.</span></a>
    <div class="nav-right">
      ${renderThemeSwitch("bar")}
      <button class="nav-toggle" id="navToggle" aria-label="打开菜单" aria-expanded="false" aria-controls="siteNav">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="siteNav">
        ${links}
        ${renderThemeSwitch("menu")}
        <a class="nav-cta" href="#contact">联系我</a>
      </nav>
    </div>
  </div>
</header>`;
}

function renderHero(): string {
  const { hero } = resume;
  const tags = hero.tags.map((t) => `<li>${esc(t)}</li>`).join("");
  const stats = hero.stats
    .map(
      (s) =>
        `<div class="stat-card"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`,
    )
    .join("\n        ");
  return `<section class="hero" id="home">
    <div class="hero-bg" aria-hidden="true">
      <span class="blob blob-1"></span>
      <span class="blob blob-2"></span>
      <span class="blob blob-3"></span>
    </div>
    <div class="container hero-inner">
      <div class="hero-text">
        <p class="hero-kicker reveal">${esc(hero.kicker)}</p>
        <h1 class="hero-name reveal">${esc(hero.name)}</h1>
        <p class="hero-role reveal">${esc(hero.role)}</p>
        <p class="hero-desc reveal">${esc(hero.desc)}</p>
        <div class="hero-actions reveal">
          <a class="btn btn-primary" href="#contact">联系我</a>
        </div>
        <ul class="hero-tags reveal">${tags}</ul>
      </div>
      <div class="hero-stats reveal">
        ${stats}
      </div>
    </div>
  </section>`;
}

function renderAbout(): string {
  const { about } = resume;
  const paras = about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n          ");
  const points = about.points.map((p) => `<li>${esc(p)}</li>`).join("\n          ");
  return `<section class="section" id="about">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">ABOUT</span>
        <h2>关于我</h2>
      </div>
      <div class="about-grid">
        <div class="about-text reveal">
          ${paras}
        </div>
        <ul class="about-points reveal">
          ${points}
        </ul>
      </div>
    </div>
  </section>`;
}

function renderSkills(): string {
  const cards = resume.skillGroups
    .map((g) => {
      const bars = g.skills
        .map((s) => {
          const label = s.label ? `<em>${esc(s.label)}</em>` : "";
          return `<div class="skill">
            <div class="skill-top"><span>${esc(s.name)}</span>${label}</div>
            <div class="bar"><i data-level="${s.level}"></i></div>
          </div>`;
        })
        .join("\n          ");
      return `<div class="card skill-card reveal">
          <h3>${esc(g.title)}</h3>
          ${bars}
        </div>`;
    })
    .join("\n        ");

  const chips = resume.skillChips.map((c) => `<span>${esc(c)}</span>`).join("");

  return `<section class="section section-alt" id="skills">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">SKILLS</span>
        <h2>专业技能</h2>
      </div>

      <div class="skills-grid">
        ${cards}
      </div>

      <div class="card chip-card reveal">
          <h3>常用技术栈</h3>
        <div class="chips">
          ${chips}
        </div>
      </div>
    </div>
  </section>`;
}

interface CardOptions {
  /** 个人项目区使用更宽的版心 */
  featured?: boolean;
  /** 工具区不需要演示视频 */
  withVideo?: boolean;
}

/** 项目卡 / 工具卡共用的头部与描述，消除两处重复模板 */
function renderCardBody(p: Project, opts: CardOptions): string {
  const chips = p.chips.map((c) => `<span>${esc(c)}</span>`).join("");
  const video =
    opts.withVideo !== false && p.video
      ? `<video class="project-video" controls preload="metadata" playsinline>
            <source src="${asset(`videos/${encodeURIComponent(p.video)}`)}" type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>`
      : "";
  return `<div class="project-head">
          <span class="project-icon">${esc(p.icon)}</span>
          <div>
            <h3>${esc(p.title)}</h3>
            <p class="project-type">${esc(p.type)}</p>
          </div>
        </div>
        <p class="project-desc">${esc(p.desc)}</p>
        ${video}
        <div class="chips">
          ${chips}
        </div>`;
}

function renderProjectCard(p: Project, opts: CardOptions = {}): string {
  return `<article class="card project-card${opts.featured ? " featured" : ""} reveal">
        ${renderCardBody(p, opts)}
      </article>`;
}

function renderProjects(): string {
  const cards = resume.projects.map((p) => renderProjectCard(p)).join("\n        ");
  return `<section class="section" id="projects">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">PROJECTS</span>
        <h2>标志性展项项目</h2>
        <p class="section-sub">科技馆互动展项，软硬件深度联动 · 点击播放演示视频</p>
      </div>
      <div class="cards-grid">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderIndependent(): string {
  const cards = resume.independent
    .map((p) => renderProjectCard(p, { featured: true }))
    .join("\n\n        ");
  return `<section class="section" id="independent">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">SIDE PROJECT</span>
        <h2>个人项目</h2>
        <p class="section-sub">独立开发与 AI 辅助完成的个人项目</p>
      </div>
      <div class="stack">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderTools(): string {
  const cards = resume.tools
    .map((p) => renderProjectCard(p, { withVideo: false }))
    .join("\n\n        ");
  return `<section class="section section-alt" id="tools">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">TOOLS &amp; FRAMEWORK</span>
        <h2>工具软件与内部框架</h2>
        <p class="section-sub">自研工具与框架 · 部分由 Cursor AI + Python 辅助开发</p>
      </div>
      <div class="cards-grid">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderExperience(): string {
  const cards = resume.experiences
    .map((e) => {
      const badges = e.badges.map((b) => `<span class="exp-badge">${esc(b)}</span>`).join("\n            ");
      const summary = e.summary ? `<p class="exp-summary">${esc(e.summary)}</p>` : "";
      const list = e.list?.length
        ? `<ul class="exp-list">
            ${e.list.map((li) => `<li>${esc(li)}</li>`).join("\n            ")}
          </ul>`
        : "";
      return `<div class="card exp-card reveal">
        <div class="exp-head">
          <div>
            <h3>${esc(e.company)}</h3>
            <p class="exp-role">${esc(e.role)}</p>
          </div>
          ${badges}
        </div>
        ${summary}
        ${list}
      </div>`;
    })
    .join("\n\n      ");
  return `<section class="section" id="experience">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">EXPERIENCE</span>
        <h2>工作经历</h2>
      </div>
      <div class="stack">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderEducation(): string {
  const { education } = resume;
  const items = education.list
    .map(
      (e) => `<div class="edu-item reveal">
          <div class="edu-year">${esc(e.year)}</div>
          <div class="edu-body">
            <h3>${esc(e.school)}</h3>
            <p>${esc(e.desc)}</p>
          </div>
        </div>`,
    )
    .join("\n        ");
  const chips = education.extraChips.map((c) => `<span class="chip">${esc(c)}</span>`).join("");
  return `<section class="section section-alt" id="education">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">EDUCATION</span>
        <h2>教育背景</h2>
      </div>
      <div class="edu-list">
        ${items}
      </div>
      <div class="card edu-extra reveal">
        <span class="edu-extra-label">${esc(education.extraLabel)}</span>
        ${chips}
      </div>
    </div>
  </section>`;
}

function renderContact(): string {
  const items = resume.contacts
    .map((c) => {
      const inner = `<span class="contact-icon">${esc(c.icon)}</span>
          <div><b>${esc(c.label)}</b><p>${esc(c.value)}</p></div>`;
      if (c.href) {
        const target = /^https?:\/\//i.test(c.href) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a class="contact-item reveal" href="${safeHref(c.href)}"${target}>
          ${inner}
        </a>`;
      }
      return `<div class="contact-item reveal">
          ${inner}
        </div>`;
    })
    .join("\n        ");
  return `<section class="section" id="contact">
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker">CONTACT</span>
        <h2>联系我</h2>
        <p class="section-sub">欢迎技术交流、项目合作与工作机会</p>
      </div>
      <div class="contact-grid">
        ${items}
      </div>
    </div>
  </section>`;
}

function renderFooter(): string {
  return `<footer class="site-footer">
  <div class="container">
    <p>© <span id="year"></span> ${esc(resume.hero.name)} · 个人简历网站</p>
    <p class="footer-note">${esc(resume.footerNote)}</p>
  </div>
</footer>`;
}

export function renderPage(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="fresh">
${renderHead()}
<body>

<noscript>
  <!-- .reveal 默认 opacity:0 且靠 JS 加 .in-view，禁用 JS 时必须兜底，否则整页空白 -->
  <style>.reveal { opacity: 1 !important; transform: none !important; }</style>
</noscript>

${renderNav()}

<main>
  ${renderHero()}
  ${renderAbout()}
  ${renderSkills()}
  ${renderProjects()}
  ${renderIndependent()}
  ${renderTools()}
  ${renderExperience()}
  ${renderEducation()}
  ${renderContact()}
</main>

${renderFooter()}

<button class="back-top" id="backTop" aria-label="回到顶部">↑</button>

<script src="${asset("js/main.js")}"></script>
</body>
</html>`;
}
