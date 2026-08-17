/* ============================================================
   崔伊超 · 个人简历网站 —— 交互脚本
   ============================================================ */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  var backTop = document.getElementById("backTop");
  var printBtn = document.getElementById("printBtn");
  var yearEl = document.getElementById("year");

  /* ---------- 页脚年份 ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 顶部导航：滚动阴影 ---------- */
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    if (window.scrollY > 480) backTop.classList.add("show");
    else backTop.classList.remove("show");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  /* ---------- 打印 / 保存 PDF ---------- */
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

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
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");

        /* 技能条宽度动画 */
        entry.target.querySelectorAll(".bar i[data-level]").forEach(function (bar) {
          var level = parseInt(bar.getAttribute("data-level"), 10);
          if (!isNaN(level)) bar.style.width = level + "%";
        });

        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    io.observe(el);
  });
})();
