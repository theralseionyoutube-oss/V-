/* V+ — interactions */
(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.add('js');

  /* static mode: used for screenshots / no-motion previews (?static) */
  var staticMode = window.location.search.indexOf('static') !== -1;
  if (staticMode) {
    docEl.classList.remove('js');
    document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
      var n = parseInt(el.getAttribute('data-count'), 10) || 0;
      el.textContent = new Intl.NumberFormat('en-US').format(n) + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      setMenu(mobileMenu.hidden);
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenu.hidden) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && !mobileMenu.hidden) setMenu(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- bot selector ---------- */
  var botRows = Array.prototype.slice.call(document.querySelectorAll('.bot-row'));
  var stage = document.getElementById('bot-stage-card');
  var stageIconUse = stage ? stage.querySelector('.bot-stage-icon use') : null;
  var stageTag = document.getElementById('bot-tag');
  var stageName = document.getElementById('bot-name');
  var stageDesc = document.getElementById('bot-desc');
  var hold1 = document.getElementById('hold-1');
  var hold2 = document.getElementById('hold-2');
  var holdIconUses = stage ? stage.querySelectorAll('.bot-holds .bot-hold use') : [];

  function selectBot(btn, focus) {
    if (!stage) return;
    botRows.forEach(function (row) {
      var active = row === btn;
      row.classList.toggle('is-active', active);
      row.setAttribute('aria-selected', String(active));
    });

    var icon = btn.getAttribute('data-icon') || 'i-crystal';
    if (stageIconUse) stageIconUse.setAttribute('href', '#' + icon);
    if (stageTag) stageTag.textContent = btn.getAttribute('data-tag') || '';
    if (stageName) stageName.textContent = btn.getAttribute('data-name') || '';
    if (stageDesc) stageDesc.textContent = btn.getAttribute('data-desc') || '';

    var holds = (btn.getAttribute('data-holds') || '').split(',');
    if (hold1) hold1.textContent = (holds[0] || '').trim();
    if (hold2) hold2.textContent = (holds[1] || '').trim();
    if (holdIconUses.length) {
      holdIconUses[0].setAttribute('href', '#' + icon);
      holdIconUses[1].setAttribute('href', '#i-totem');
    }

    /* restart the entrance animation */
    stage.style.animation = 'none';
    void stage.offsetWidth;
    stage.style.animation = '';

    if (focus) {
      var dir = btn.classList.contains('bots-col-util') ? -1 : 1;
      void dir;
    }
  }

  botRows.forEach(function (btn) {
    btn.addEventListener('click', function () { selectBot(btn, false); });
    btn.addEventListener('keydown', function (e) {
      var i = botRows.indexOf(btn);
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = botRows[(i + 1) % botRows.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = botRows[(i - 1 + botRows.length) % botRows.length];
      if (next) {
        e.preventDefault();
        next.focus();
        selectBot(next, false);
      }
    });
  });

  /* ---------- animated counters ---------- */
  var statNums = document.querySelectorAll('.stat-num[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = null;
    var formatter = new Intl.NumberFormat('en-US');

    function frame(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatter.format(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!staticMode && 'IntersectionObserver' in window && statNums.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statObserver.observe(el); });
  } else if (!staticMode) {
    statNums.forEach(function (el) {
      var n = parseInt(el.getAttribute('data-count'), 10) || 0;
      el.textContent = new Intl.NumberFormat('en-US').format(n) + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- FAQ: keep one answer open ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });
})();
