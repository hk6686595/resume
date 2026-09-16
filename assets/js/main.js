/* ============================================================
   崔伊超 · 个人简历网站 —— 交互脚本
   ============================================================ */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  var backTop = document.getElementById("backTop");
  var yearEl = document.getElementById("year");

  /* ---------- 页脚年份 ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 滚动进度条 ---------- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }

  /* ---------- 顶部导航：滚动阴影 ---------- */
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    if (window.scrollY > 480) backTop.classList.add("show");
    else backTop.classList.remove("show");

    updateProgress();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  onScroll();

  /* ---------- Hero 数字滚动 ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var statEls = document.querySelectorAll(".stat-card b");
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
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if (statEls.length) setTimeout(runCounters, 400);

  /* ---------- 移动端菜单 ---------- */
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

  /* ---------- 回到顶部 ---------- */
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* 打印前确保技能条按等级显示（避免未滚动到技能区时宽度为 0） */
  function fillAllBars() {
    document.querySelectorAll(".bar i[data-level]").forEach(function (bar) {
      var level = parseInt(bar.getAttribute("data-level"), 10);
      if (!isNaN(level)) bar.style.width = level + "%";
    });
  }
  window.addEventListener("beforeprint", fillAllBars);

  /* ---------- 滚动监听：高亮当前导航 ---------- */
  var navLinks = siteNav.querySelectorAll('a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute("href"));
    if (target) sections.push({ link: link, el: target });
  });

  var spyTimer = null;
  function updateSpy() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (item) {
      if (item.el.offsetTop <= pos) current = item;
    });
    sections.forEach(function (item) {
      item.link.classList.toggle("active", item === current);
    });
  }
  window.addEventListener(
    "scroll",
    function () {
      if (spyTimer) return;
      spyTimer = setTimeout(function () {
        spyTimer = null;
        updateSpy();
      }, 60);
    },
    { passive: true }
  );
  updateSpy();

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

  document.querySelectorAll(".reveal").forEach(function (el) {
    io.observe(el);
  });

  /* ---------- 项目演示视频：同时只允许播放一个 ---------- */
  var videos = document.querySelectorAll(".project-video");
  videos.forEach(function (video) {
    video.addEventListener("play", function () {
      videos.forEach(function (other) {
        if (other !== video && !other.paused) other.pause();
      });
    });
  });
})();
