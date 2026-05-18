'use client';

import { useEffect } from 'react';

export function CasesFilter() {
  useEffect(() => {
    const root = document.querySelector('main[data-page="cases"]');
    if (!root) return;

    const buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>('.cases-filter'),
    );
    const cards = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('.case-card'),
    );
    const showAllBtn = root.querySelector<HTMLButtonElement>('[data-show-all]');
    const empty = root.querySelector<HTMLElement>('.cases-empty');

    if (buttons.length === 0 || cards.length === 0) return;

    const counts: Record<string, number> = { all: cards.length };
    for (const c of cards) {
      const cat = c.dataset.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    for (const b of buttons) {
      const f = b.dataset.filter || 'all';
      const span = b.querySelector('.count');
      if (span) span.textContent = String(counts[f] || 0);
    }

    let currentFilter = 'all';
    let showAll = false;

    function apply() {
      let visible = 0;
      for (const c of cards) {
        const cat = c.dataset.category || '';
        const isExtra = c.classList.contains('is-extra');
        const matches = currentFilter === 'all' || cat === currentFilter;
        const shouldShow =
          matches && (currentFilter !== 'all' || !isExtra || showAll);
        c.classList.toggle('is-hidden', !shouldShow);
        if (shouldShow) visible++;
      }
      if (empty) empty.classList.toggle('is-visible', visible === 0);
      if (showAllBtn) {
        const hasExtras =
          currentFilter === 'all' && cards.some((c) => c.classList.contains('is-extra'));
        showAllBtn.hidden = !hasExtras;
        showAllBtn.textContent = showAll ? 'Скрыть ←' : 'Смотреть все →';
        showAllBtn.setAttribute('aria-expanded', showAll ? 'true' : 'false');
      }
    }

    function onFilterClick(this: HTMLButtonElement) {
      currentFilter = this.dataset.filter || 'all';
      for (const b of buttons) {
        b.setAttribute('aria-pressed', String(b === this));
      }
      apply();
    }
    function onShowAllClick() {
      showAll = !showAll;
      apply();
    }

    for (const b of buttons) b.addEventListener('click', onFilterClick);
    showAllBtn?.addEventListener('click', onShowAllClick);
    apply();

    return () => {
      for (const b of buttons) b.removeEventListener('click', onFilterClick);
      showAllBtn?.removeEventListener('click', onShowAllClick);
    };
  }, []);

  return null;
}
