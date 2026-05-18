'use client';

import { useEffect, useRef } from 'react';

// scene.html doesn't read a `mode` URL param — only `embed` and `headless`.
// It exposes a postMessage protocol and announces readiness by sending
// `{ type: 'sceneReady' }` to its parent once Three.js + models are mounted.
// We listen for that and reply with `setMode` for non-default modes.
const SCENES: Array<{ mode: string; label: string }> = [
  { mode: 'container', label: 'Контейнер' },
  { mode: 'kpp', label: 'КПП' },
  { mode: 'dacha', label: 'Дачный домик' },
];

const SCENE_URL = 'https://containers-web.vercel.app/scene.html?embed=1&headless=1';

export function Modul51Scenes() {
  const refs = useRef<Array<HTMLIFrameElement | null>>([]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== 'sceneReady') return;
      const idx = refs.current.findIndex(
        (f) => f != null && f.contentWindow === e.source,
      );
      if (idx === -1) return;
      const mode = SCENES[idx].mode;
      if (mode === 'container') return; // scene.html defaults to container
      (e.source as Window | null)?.postMessage(
        { type: 'setMode', mode },
        '*',
      );
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
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
