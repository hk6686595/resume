/* ============================================================
   崔伊超 · 个人简历网站 —— 交互脚本
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  var header = doc.querySelector(".site-header");
  var navToggle = doc.getElementById("navToggle");
  var siteNav = doc.getElementById("siteNav");
  var backTop = doc.getElementById("backTop");
  var yearEl = doc.getElementById("year");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 页脚年份 ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 滚动进度条 ---------- */
  var progress = doc.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  doc.body.appendChild(progress);

  /* ---------- 主题切换（清新 / 暖色 / 暗黑） ---------- */

  var STORAGE_KEY = "resume-theme";
  var THEMES = ["fresh", "warm", "dark"];
  var THEME_COLORS = {
    fresh: "#f6f8fb",
    warm: "#fdf6f0",
    dark: "#0b1120",
  };
  var themeColorMeta = doc.getElementById("themeColorMeta");
  var themeButtons = Array.prototype.slice.call(
    doc.querySelectorAll("[data-theme-set]")
  );

  function storedTheme() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return THEMES.indexOf(v) >= 0 ? v : null;
    } catch (e) {
      /* 隐私模式 / 禁用存储时降级为不持久化 */
      return null;
    }
  }

  /* 用户显式选择 > 系统偏好 > 清新 */
  function preferredTheme() {
    var saved = storedTheme();
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "fresh";
  }

  /*
   * 优先沿用 <head> 内联脚本已写入的 data-theme（它比本脚本更早执行，
   * 是防闪烁的唯一来源）；只有在属性缺失或非法时才自行推断，避免
   * 内联脚本被 CSP 拦下时反而覆盖系统偏好。
   */
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    return THEMES.indexOf(t) >= 0 ? t : preferredTheme();
  }

  /* 同步所有主题按钮的选中态（头部与移动端菜单各有一份） */
  function syncThemeButtons(theme) {
    themeButtons.forEach(function (btn) {
      var on = btn.getAttribute("data-theme-set") === theme;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("active", on);
    });
  }

  function applyTheme(theme, persist) {
    if (THEMES.indexOf(theme) < 0) return;
    root.setAttribute("data-theme", theme);
    syncThemeButtons(theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", THEME_COLORS[theme] || THEME_COLORS.fresh);
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* 忽略写入失败 */
      }
    }
  }

  applyTheme(currentTheme(), false);

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(btn.getAttribute("data-theme-set"), true);
    });
  });

  /* 用户未手动选择过时，跟随系统配色实时切换 */
  var colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  var onSchemeChange = function (e) {
    if (!storedTheme()) applyTheme(e.matches ? "dark" : "fresh", false);
  };
  if (typeof colorScheme.addEventListener === "function") {
    colorScheme.addEventListener("change", onSchemeChange);
  } else if (typeof colorScheme.addListener === "function") {
    colorScheme.addListener(onSchemeChange);
  }

  /* ---------- 顶部导航：滚动阴影 / 回到顶部 / 进度条 / 高亮 ---------- */

  function updateProgress() {
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }

  /* 滚动高亮：基于视口位置判定，避免 offsetTop 受定位祖先影响 */
  var navLinks = siteNav
    ? Array.prototype.slice.call(siteNav.querySelectorAll('a[href^="#"]'))
    : [];
  var sections = [];
  navLinks.forEach(function (link) {
    var target = doc.querySelector(link.getAttribute("href"));
    if (target) sections.push({ link: link, el: target });
  });

  function updateSpy() {
    if (!sections.length) return;
    var line = 140;
    var current = null;
    sections.forEach(function (item) {
      if (item.el.getBoundingClientRect().top <= line) current = item;
    });
    /* 滚到底部时强制高亮最后一节，避免末节永远无法激活 */
    if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    sections.forEach(function (item) {
      item.link.classList.toggle("active", item === current);
    });
  }

  var ticking = false;
  function onScroll() {
    if (header) {
      if (window.scrollY > 10) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    if (backTop) {
      if (window.scrollY > 480) backTop.classList.add("show");
      else backTop.classList.remove("show");
    }
    updateProgress();
    updateSpy();

    ticking = false;
  }

  /* 单次 rAF 合并滚动事件：一次滚动只触发一次回调 */
  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  onScroll();

  /* ---------- Hero 数字滚动 ---------- */
  var statEls = doc.querySelectorAll(".stat-card b");
  function runCounters() {
    statEls.forEach(function (el) {
      var match = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2] || "";
      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }
      var startTime = null;
      var duration = 1200;
      function step(now) {
        if (startTime === null) startTime = now;
        var p = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    });
  }
  if (statEls.length) setTimeout(runCounters, 400);

  /* ---------- 移动端菜单 ---------- */

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });

    /* 点击导航链接后收起移动端菜单 */
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    /* Esc 关闭菜单，并把焦点交还给按钮 */
    doc.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !siteNav.classList.contains("open")) return;
      siteNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    });
  }

  /* ---------- 回到顶部 ---------- */

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* 打印前确保技能条按等级显示（避免未滚动到技能区时宽度为 0） */
  function fillAllBars() {
    doc.querySelectorAll(".bar i[data-level]").forEach(function (bar) {
      var level = parseInt(bar.getAttribute("data-level"), 10);
      if (!isNaN(level)) bar.style.width = level + "%";
    });
  }
  window.addEventListener("beforeprint", fillAllBars);

  /* ---------- 入场动画 + 技能条 ---------- */
  function staggerDelay(el) {
    var parent = el.parentElement;
    if (!parent || !parent.classList.contains("cards-grid")) return 0;
    var items = Array.prototype.filter.call(parent.children, function (child) {
      return child.classList.contains("reveal");
    });
    var index = items.indexOf(el);
    if (index < 0) return 0;
    return Math.min(index * 0.06, 0.84);
  }

  var revealEls = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;

          /* 网格错峰入场：延迟瞬时注入，动画结束后清除，避免影响悬浮效果 */
          var delay = reduceMotion ? 0 : staggerDelay(el);
          if (delay > 0) {
            el.style.transitionDelay = delay + "s";
            window.setTimeout(function () {
              el.style.transitionDelay = "";
            }, delay * 1000 + 800);
          }

          el.classList.add("in-view");

          /* 技能条宽度动画 */
          el.querySelectorAll(".bar i[data-level]").forEach(function (bar) {
            var level = parseInt(bar.getAttribute("data-level"), 10);
            if (!isNaN(level)) bar.style.width = level + "%";
          });

          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    /* 老浏览器无 IntersectionObserver：直接显示全部内容，避免永久空白 */
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
    fillAllBars();
  }

  /* ---------- 项目演示视频：同时只允许播放一个 ---------- */
  var videos = doc.querySelectorAll(".project-video");
  videos.forEach(function (video) {
    video.addEventListener("play", function () {
      videos.forEach(function (other) {
        if (other !== video && !other.paused) other.pause();
      });
    });
  });
})();
