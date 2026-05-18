'use client';

import { useState } from 'react';

interface Props {
  categories: string[];
}

export function BlogFilter({ categories }: Props) {
  const [active, setActive] = useState<string>('all');

  function pick(cat: string) {
    setActive(cat);
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    grid.querySelectorAll<HTMLElement>('[data-category]').forEach((card) => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
    });
  }

  return (
    <div className="blog-filter animate delay-3" id="filterBar">
      <button
        type="button"
        className={`blog-filter-btn${active === 'all' ? ' active' : ''}`}
        onClick={() => pick('all')}
      >
        Все
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`blog-filter-btn${active === cat ? ' active' : ''}`}
          onClick={() => pick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
