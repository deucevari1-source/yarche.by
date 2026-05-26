'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { installTracker, track } from '@/lib/analytics/client';

const API_URL = 'https://bot.yarche.by:5050/api/lead';

type YmFn = ((id: number, action: string, ...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: YmFn;
  }
}

const YM_ID = 109348823;

// Metrica's loader runs on `lazyOnload`, so window.ym may not exist when an
// early click/scroll fires. Make our own stub that queues args; the real
// tag.js drains the queue once it loads.
function fireGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!window.ym) {
    const stub = function (...args: unknown[]) {
      (stub.a = stub.a || []).push(args);
    } as YmFn;
    stub.l = Date.now();
    window.ym = stub;
  }
  window.ym(YM_ID, 'reachGoal', goal, params);
}

const HOVER_SELECTOR =
  'a,button,.service-card,.service-full,.price-card,.review-card,.feature-item,.synergy-card,.step-card';

export function GlobalScripts() {
  const pathname = usePathname();
  const router = useRouter();

  // Nav scroll effect
  useEffect(() => {
    function onScroll() {
      const nav = document.querySelector('.nav');
      if (!nav) return;
      nav.classList.toggle('nav-scrolled', window.scrollY > 100);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mirror current route segment to <html data-page="..."> so space-bg.js
  // can detect /cases via MutationObserver and fade in extra elements.
  useEffect(() => {
    const seg = pathname.replace(/^\/+/, '').split('/')[0] || 'home';
    document.documentElement.dataset.page = seg;
  }, [pathname]);

  // Expose window.yarcheTrack once.
  useEffect(() => {
    installTracker();
  }, []);

  // Pageview on initial load and every SPA navigation.
  useEffect(() => {
    track('pageview', { title: document.title || undefined });
  }, [pathname]);

  // Notify gtag + Metrika on SPA navigation. Their own loader fires the
  // first pageview automatically, so skip it here.
  const isFirstNav = useRef(true);
  useEffect(() => {
    if (isFirstNav.current) {
      isFirstNav.current = false;
      return;
    }
    if (pathname.startsWith('/admin')) return;
    const url = pathname + window.location.search;
    window.gtag?.('event', 'page_view', { page_path: url, page_title: document.title });
    window.ym?.(YM_ID, 'hit', window.location.origin + url, { title: document.title });
  }, [pathname]);

  // /web: fire `scroll_footer` reachGoal once per page load when footer appears in viewport
  useEffect(() => {
    if (pathname !== '/web') return;
    const footer = document.querySelector('footer.footer');
    if (!footer) return;
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired) {
            fired = true;
            track('scroll_footer', { page: document.title || location.pathname });
            fireGoal('scroll_footer');
            io.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  // Custom-select dropdown + div[href] click navigation — document delegation
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const trigger = target.closest('.custom-select-trigger') as HTMLElement | null;
      if (trigger) {
        const sel = trigger.parentElement;
        if (!sel) return;
        document.querySelectorAll('.custom-select.open').forEach((s) => {
          if (s !== sel) s.classList.remove('open');
        });
        sel.classList.toggle('open');
        return;
      }

      const option = target.closest('.custom-select-option') as HTMLElement | null;
      if (option) {
        const sel = option.closest('.custom-select') as HTMLElement | null;
        if (!sel) return;
        const val = option.getAttribute('data-val') || '';
        sel.setAttribute('data-value', val);
        const span = sel.querySelector('.custom-select-trigger span');
        if (span) span.textContent = val;
        sel.classList.add('has-value');
        sel.classList.remove('open');
        sel.querySelectorAll('.custom-select-option').forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        return;
      }

      document.querySelectorAll('.custom-select.open').forEach((s) => s.classList.remove('open'));

      // Intercept <a> + div[href] for SPA navigation. Pages rendered via
      // dangerouslySetInnerHTML use plain <a>, so Next's Link interceptor
      // doesn't see them. Skip external / new-tab / modifier-key clicks.
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const card = target.closest('[href]') as HTMLElement | null;
      if (!card) return;
      const href = card.getAttribute('href');
      if (!href) return;
      if (window.location.pathname === '/web') {
        if (card.classList.contains('feature-item')) {
          track('feature_click', { href, page: document.title || location.pathname });
          fireGoal('feature_click', { href });
        } else if (card.classList.contains('price-btn')) {
          const tariff =
            new URL(href, window.location.origin).searchParams.get('tariff') || '';
          track('cta_click', { tariff, href, page: document.title || location.pathname });
          fireGoal('cta_click', { tariff, href });
        }
      }
      if (card.tagName === 'A' && card.getAttribute('target') === '_blank') return;
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        let goal: string | null = null;
        if (href.startsWith('tel:')) goal = 'phone_click';
        else if (href.startsWith('mailto:')) goal = 'email_click';
        else if (href.includes('t.me/') || href.includes('wa.me/')) goal = 'messenger_click';
        if (goal) {
          track(goal, { href, page: document.title || location.pathname });
          fireGoal(goal, { href });
        }
        return;
      }
      e.preventDefault();
      router.push(href);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  // Custom cursor — mount once, no pathname dep, delegated hover
  useEffect(() => {
    // Hard-reject touch devices (some mobile browsers wrongly report pointer:fine).
    if ('ontouchstart' in window) return;
    if ((navigator.maxTouchPoints ?? 0) > 0) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.innerWidth <= 1024) return;

    const cursorEl = document.getElementById('cursor');
    const trailEl = document.getElementById('trail');
    if (!cursorEl || !trailEl) return;

    cursorEl.style.display = 'block';
    trailEl.style.display = 'block';
    document.body.style.cursor = 'none';

    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    let rafId = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      cursorEl!.style.left = mx + 'px';
      cursorEl!.style.top = my + 'px';
    }
    function loop() {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      trailEl!.style.left = tx + 'px';
      trailEl!.style.top = ty + 'px';
      rafId = requestAnimationFrame(loop);
    }
    function onOver(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(HOVER_SELECTOR)) {
        cursorEl!.style.width = '28px';
        cursorEl!.style.height = '28px';
      }
    }
    function onOut(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(HOVER_SELECTOR)) {
        cursorEl!.style.width = '16px';
        cursorEl!.style.height = '16px';
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    rafId = requestAnimationFrame(loop);

    return () => {
      // Listener cleanup only. Do NOT reset display/body.cursor — survives strict-mode double mount.
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  // Contact form (only mounts if .contact-form is on the page)
  useEffect(() => {
    const form = document.querySelector('.contact-form') as HTMLFormElement | null;
    if (!form) return;
    const btn = form.querySelector('.form-submit') as HTMLButtonElement | null;
    if (!btn) return;
    const origText = btn.textContent || '';

    const inputs = form.querySelectorAll('input');
    const phoneInput = inputs[1] as HTMLInputElement | undefined;

    const onFocus = function (this: HTMLInputElement) {
      if (!this.value) this.value = '+375 (';
    };
    const onPhoneInput = function (this: HTMLInputElement) {
      let v = this.value.replace(/\D/g, '');
      if (v.length < 3) v = '375';
      if (v.substring(0, 3) !== '375') v = '375' + v.substring(3);
      let f = '+375';
      if (v.length > 3) f += ' (' + v.substring(3, 5);
      if (v.length >= 5) f += ') ';
      if (v.length > 5) f += v.substring(5, 8);
      if (v.length > 8) f += '-' + v.substring(8, 10);
      if (v.length > 10) f += '-' + v.substring(10, 12);
      this.value = f;
    };
    const onKeyDown = function (this: HTMLInputElement, e: KeyboardEvent) {
      if (e.key === 'Backspace' && this.value.length <= 5) e.preventDefault();
    };

    if (phoneInput) {
      phoneInput.value = '+375 (';
      phoneInput.setAttribute('placeholder', '+375 (__) ___-__-__');
      phoneInput.setAttribute('maxlength', '19');
      phoneInput.addEventListener('focus', onFocus);
      phoneInput.addEventListener('input', onPhoneInput);
      phoneInput.addEventListener('keydown', onKeyDown);
    }

    // First-interaction tracking: fires once per page load when the user
    // touches any field (input/textarea focus or custom-select click).
    let formFocusFired = false;
    const onFirstFocus = () => {
      if (formFocusFired) return;
      formFocusFired = true;
      const pageName = document.title || location.pathname;
      track('form_focus', { page: pageName });
      fireGoal('form_focus', { page: pageName });
    };
    form.addEventListener('focusin', onFirstFocus);
    const selectTrigger = form.querySelector('.custom-select-trigger');
    selectTrigger?.addEventListener('click', onFirstFocus);

    // Prefill from query params (?tariff=… & message=…) — used by /web/[feature]
    // CTA buttons that route to /contact with the chosen service + intent line.
    try {
      const sp = new URLSearchParams(window.location.search);
      const tariffParam = sp.get('tariff');
      const messageParam = sp.get('message');
      if (tariffParam) {
        const sel = form.querySelector('.custom-select');
        if (sel) {
          sel.setAttribute('data-value', tariffParam);
          const span = sel.querySelector('.custom-select-trigger span');
          if (span) span.textContent = tariffParam;
          sel.classList.add('has-value');
          sel.querySelectorAll('.custom-select-option').forEach((o) => {
            if (o.getAttribute('data-val') === tariffParam) o.classList.add('selected');
            else o.classList.remove('selected');
          });
        }
      }
      if (messageParam) {
        const ta = form.querySelector('textarea') as HTMLTextAreaElement | null;
        if (ta && !ta.value) ta.value = messageParam;
      }
    } catch {
      // best-effort prefill; never block the form on a URL parse error
    }

    type State = 'ready' | 'sending' | 'success' | 'error';
    function setState(s: State) {
      btn!.disabled = s !== 'ready';
      if (s === 'sending') {
        btn!.textContent = 'Отправляем...';
        btn!.style.opacity = '0.7';
      } else if (s === 'success') {
        btn!.textContent = '✓ Заявка отправлена!';
        btn!.style.background = '#22c55e';
        btn!.style.color = '#fff';
        btn!.style.opacity = '1';
      } else if (s === 'error') {
        btn!.textContent = 'Ошибка. Попробуйте ещё раз';
        btn!.style.background = '#ef4444';
        btn!.style.color = '#fff';
        btn!.style.opacity = '1';
      } else {
        btn!.textContent = origText;
        btn!.style.background = '';
        btn!.style.color = '';
        btn!.style.opacity = '1';
      }
    }

    function getData() {
      const ins = form!.querySelectorAll('input');
      const ta = form!.querySelector('textarea') as HTMLTextAreaElement | null;
      const sel = form!.querySelector('.custom-select');
      return {
        name: (ins[0] as HTMLInputElement | undefined)?.value.trim() || '',
        contact: (ins[1] as HTMLInputElement | undefined)?.value.trim() || '',
        service: sel?.getAttribute('data-value') || '',
        message: ta?.value.trim() || '',
        page: document.title || location.pathname,
      };
    }

    function highlight(i: number, t: string) {
      const inp = form!.querySelectorAll('input')[i] as HTMLInputElement | undefined;
      if (!inp) return;
      inp.style.borderColor = '#ef4444';
      inp.setAttribute('placeholder', t);
      inp.focus();
      setTimeout(() => {
        inp.style.borderColor = '';
      }, 3000);
    }

    function onSubmit(e: Event) {
      e.preventDefault();
      const d = getData();
      if (!d.name) {
        highlight(0, 'Укажите ваше имя');
        return;
      }
      const digits = d.contact.replace(/\D/g, '');
      if (digits.length !== 12) {
        highlight(1, 'Введите полный номер');
        return;
      }
      setState('sending');
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then(() => {
          setState('success');
          track('form_submit', { service: d.service, page: d.page });
          fireGoal('form_submit', { service: d.service, page: d.page });
          form!.querySelectorAll('input').forEach((i, idx) => {
            (i as HTMLInputElement).value = idx === 1 ? '+375 (' : '';
          });
          const ta = form!.querySelector('textarea') as HTMLTextAreaElement | null;
          if (ta) ta.value = '';
          const sel = form!.querySelector('.custom-select');
          if (sel) {
            sel.setAttribute('data-value', '');
            const sp = sel.querySelector('.custom-select-trigger span');
            if (sp) sp.textContent = 'Выберите услугу';
          }
          setTimeout(() => setState('ready'), 3000);
        })
        .catch(() => {
          setState('error');
          setTimeout(() => setState('ready'), 3000);
        });
    }
    btn.addEventListener('click', onSubmit);

    return () => {
      btn.removeEventListener('click', onSubmit);
      form.removeEventListener('focusin', onFirstFocus);
      selectTrigger?.removeEventListener('click', onFirstFocus);
      if (phoneInput) {
        phoneInput.removeEventListener('focus', onFocus);
        phoneInput.removeEventListener('input', onPhoneInput);
        phoneInput.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [pathname]);

  return null;
}
