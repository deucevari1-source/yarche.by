'use client';

import { useEffect, useRef } from 'react';

// scene.html doesn't read a `mode` URL param — only `embed` and `headless`.
// To get a non-default mode you have to postMessage('setMode', ...) once the
// iframe is loaded. We wait until the iframe's load event (DOM ready) and
// then send after a short tick so scene.html's message listener is wired up.
const SCENES: Array<{ mode: string; label: string }> = [
  { mode: 'container', label: 'Контейнер' },
  { mode: 'kpp', label: 'КПП' },
  { mode: 'dacha', label: 'Дачный домик' },
];

const SCENE_URL = 'https://containers-web.vercel.app/scene.html?embed=1&headless=1';

export function Modul51Scenes() {
  const refs = useRef<Array<HTMLIFrameElement | null>>([]);

  useEffect(() => {
    const timers: number[] = [];
    refs.current.forEach((iframe, i) => {
      if (!iframe) return;
      const mode = SCENES[i].mode;
      // 'container' is scene.html's default — no message needed.
      if (mode === 'container') return;
      const send = () => {
        const t = window.setTimeout(() => {
          iframe.contentWindow?.postMessage({ type: 'setMode', mode }, '*');
        }, 600);
        timers.push(t);
      };
      if (iframe.contentDocument?.readyState === 'complete') send();
      else iframe.addEventListener('load', send, { once: true });
    });
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  return (
    <section className="modul51-scenes">
      <h2>3D-сцена живьём — три режима</h2>
      <p>
        Один и тот же WebGL-канвас, три встроенных вызова через
        postMessage-протокол сцены. Можно покрутить камеру в каждом блоке
        отдельно — это полноценный Three.js-рендер, а не превью-картинка.
      </p>

      {SCENES.map((s, i) => (
        <figure key={s.mode} className="modul51-scene-block">
          <figcaption>{s.label}</figcaption>
          <div className="md-iframe-wrap">
            <iframe
              ref={(el) => {
                refs.current[i] = el;
              }}
              src={SCENE_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Модуль 51 — ${s.label}`}
              allow="accelerometer; gyroscope"
            />
          </div>
        </figure>
      ))}
    </section>
  );
}
