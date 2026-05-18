(function () {

var STYLES = [
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
  ":host{",
  "  --yellow:#FFE500;--orange:#FF6B00;--orange-dark:#e05500;",
  "  --black:#0A0A0A;--dark:#141414;--dark-card:#1A1A1A;--dark-border:#2A2A2A;",
  "  --white:#FFFFFF;--gray:#888;--gray-light:#BBB;",
  "  --radius:16px;--radius-sm:10px;",
  "  --font:'Onest',system-ui,sans-serif;",
  "  --hover-bg:rgba(255,255,255,0.06);",
  "  --btn-gradient:linear-gradient(135deg,#FFE500 0%,#FF6B00 100%);",
  "}",

  "@keyframes spinRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  "@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}",
  "@keyframes floatMobile{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-4px)}}",
  "@keyframes trace1{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-9999}}",
  "@keyframes trace2{0%{stroke-dashoffset:0}100%{stroke-dashoffset:9999}}",

  // DESKTOP
  "#launcher-wrap{",
  "  position:fixed;bottom:20px;right:40px;",
  "  width:64px;height:64px;",
  "  z-index:99998;",
  "  animation:float 3.6s ease-in-out infinite;",
  "}",
  "#ring1{",
  "  position:absolute;inset:-6px;border-radius:50%;",
  "  border:2.5px solid transparent;",
  "  border-top-color:#FFE500;border-right-color:rgba(255,229,0,.3);",
  "  animation:spinRing 1.8s linear infinite;pointer-events:none;transition:opacity .3s;",
  "}",
  "#ring2{",
  "  position:absolute;inset:-11px;border-radius:50%;",
  "  border:1.5px solid transparent;",
  "  border-bottom-color:rgba(255,229,0,.25);border-left-color:rgba(255,107,0,.2);",
  "  animation:spinRing 3s linear infinite reverse;pointer-events:none;transition:opacity .3s;",
  "}",
  "#launcher{",
  "  position:relative;width:64px;height:64px;border-radius:50%;",
  "  background:var(--btn-gradient);border:none;cursor:pointer!important;",
  "  display:flex;align-items:center;justify-content:center;",
  "  box-shadow:0 4px 20px rgba(255,107,0,.45);",
  "  transition:box-shadow .3s,transform .15s;z-index:1;",
  "}",
  "#launcher:hover{transform:scale(1.08)}",
  "#launcher:active{transform:scale(.95)}",
  "#launcher svg.icon{width:26px;height:26px;fill:#fff;pointer-events:none}",
  "#launcher-label{display:none}",
  "#launcher-svg{display:none}",

  // open state
  "#launcher-wrap.is-open{animation:none}",
  "#launcher-wrap.is-open #ring1,#launcher-wrap.is-open #ring2{opacity:0}",
  "#launcher-wrap.is-open #launcher-svg{opacity:0!important}",
  "#launcher-wrap.is-open #launcher{background:#2A2A2A!important;box-shadow:0 4px 16px rgba(0,0,0,.4)!important}",

  // MOBILE
  "@media(max-width:640px){",
  "  #launcher-wrap{",
  "    bottom:12px;left:50%;right:auto;",
  "    transform:translateX(-50%);",
  "    width:auto;height:auto;",
  "    animation:floatMobile 3.6s ease-in-out infinite;",
  "  }",
  "  #launcher-wrap.is-open{animation:none;transform:translateX(-50%)}",
  "  #ring1,#ring2{display:none}",
  "  #launcher-svg{",
  "    display:block;",
  "    position:absolute;",
  "    pointer-events:none;",
  "    overflow:visible;",
  "    transition:opacity .3s;",
  "    z-index:0;",
  "  }",
  "  #launcher{",
  "    width:auto;height:54px;border-radius:100px;",
  "    padding:0 24px;gap:10px;position:relative;z-index:1;",
  "  }",
  "  #launcher-label{",
  "    display:block;font-family:var(--font);font-size:15px;font-weight:600;",
  "    color:#fff;letter-spacing:-.01em;white-space:nowrap;",
  "  }",
  "  #launcher svg.icon{width:20px;height:20px}",
  "  #input{font-size:16px!important}",
  "  #window{",
  "    bottom:82px!important;right:12px!important;left:12px!important;",
  "    width:auto!important;border-radius:var(--radius)!important;",
  "    max-height:calc(100vh - 96px)!important;",
  "  }",
  "}",


  // Lead form
  "#lead-form{padding:16px;border-top:1px solid var(--dark-border);background:var(--dark);flex-shrink:0;display:none;flex-direction:column;gap:8px}",
  "#lead-form.visible{display:flex}",
  "#lead-form p{font-size:13px;color:var(--gray);font-family:var(--font);margin-bottom:2px}",
  "#lead-input-name,#lead-input-contact{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-sm);padding:9px 13px;font-size:16px;font-family:var(--font);color:var(--white);outline:none;width:100%;transition:border-color .15s}",
  "#lead-input-name:focus,#lead-input-contact:focus{border-color:rgba(255,107,0,.4)}",
  "#lead-input-name::placeholder,#lead-input-contact::placeholder{color:var(--gray)}",
  "#lead-submit{background:var(--btn-gradient);border:none;border-radius:var(--radius-sm);padding:10px;font-size:14px;font-weight:600;font-family:var(--font);color:#fff;cursor:pointer!important;transition:opacity .15s}",
  "#lead-submit:hover{opacity:.85}",
  "#lead-submit:disabled{opacity:.4;cursor:default!important}",
  // chat window
  "#window{position:fixed;bottom:96px;right:40px;width:370px;max-height:560px;background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius);box-shadow:0 16px 48px rgba(0,0,0,.6);display:flex;flex-direction:column;overflow:hidden;z-index:99999;transition:opacity .3s,transform .3s;font-family:var(--font)}",
  "#window.hidden{opacity:0;pointer-events:none;transform:translateY(16px) scale(.97)}",
  "#header{background:var(--dark);border-bottom:1px solid var(--dark-border);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;position:sticky;top:0;z-index:2}",
  "#header-left{display:flex;align-items:center;gap:10px}",
  "#header-dot{width:8px;height:8px;border-radius:50%;background:#FF6B00;box-shadow:0 0 8px rgba(255,107,0,.6)}",
  "#header-info{display:flex;flex-direction:column;gap:1px}",
  "#header-title{font-size:15px;font-weight:600;color:var(--white);letter-spacing:-.01em}",
  "#header-sub{font-size:11px;color:var(--gray)}",
  "#close-btn{background:var(--hover-bg);border:1px solid var(--dark-border);border-radius:8px;cursor:pointer!important;color:var(--gray-light);width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .15s,color .15s}",
  "#close-btn:hover{background:rgba(255,255,255,.1);color:var(--white)}",
  "#messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;background:var(--dark-card)}",
  "#messages::-webkit-scrollbar{width:4px}",
  "#messages::-webkit-scrollbar-thumb{background:var(--dark-border);border-radius:4px}",
  ".msg{max-width:86%;padding:10px 14px;border-radius:var(--radius-sm);font-size:14px;line-height:1.55;word-break:break-word;font-family:var(--font)}",
  ".msg.user{align-self:flex-end;background:#FF6B00;color:#fff;border-bottom-right-radius:3px;font-weight:500}",
  ".msg.bot{align-self:flex-start;background:var(--dark);color:var(--gray-light);border:1px solid var(--dark-border);border-bottom-left-radius:3px}",
  ".msg.bot.typing{color:var(--gray);font-style:italic}",
  ".msg.bot strong{font-weight:600;color:var(--white)}",
  ".msg.bot code{font-family:monospace;font-size:12px;background:rgba(255,107,0,.07);border:1px solid rgba(255,107,0,.15);color:#FF6B00;padding:1px 5px;border-radius:4px}",
  ".msg.bot a{color:#FF6B00;text-decoration:none}",
  "#input-bar{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--dark-border);background:var(--dark);flex-shrink:0}",
  "#input{flex:1;background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-sm);padding:9px 13px;font-size:14px;font-family:var(--font);color:var(--white);outline:none;resize:none;line-height:1.4;max-height:96px;overflow-y:auto;transition:border-color .15s;cursor:text!important}",
  "#input::placeholder{color:var(--gray)}",
  "#input:focus{border-color:rgba(255,107,0,.4)}",
  "#send-btn{background:var(--btn-gradient);border:none;border-radius:var(--radius-sm);width:38px;height:38px;cursor:pointer!important;display:flex;align-items:center;justify-content:center;flex-shrink:0;align-self:flex-end;transition:opacity .15s,transform .1s,box-shadow .15s}",
  "#send-btn:hover{opacity:.85;box-shadow:0 0 14px rgba(255,107,0,.35)}",
  "#send-btn:active{transform:scale(.93)}",
  "#send-btn:disabled{opacity:.35;cursor:default!important;box-shadow:none}",
  "#send-btn svg{fill:#fff;width:16px;height:16px;pointer-events:none}"
].join("\n");

function md(text) {
  return text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`([^`]+)`/g,"<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g,"<br>");
}

var script   = document.currentScript || document.querySelector('script[data-api]');
var API_URL  = ((script && script.dataset.api) ? script.dataset.api : "http://localhost:3001") + "/api/chat";
var LEAD_URL = (script && script.dataset.lead) ? script.dataset.lead : "https://bot.yarche.by:5050/api/lead";
var BOT_NAME = (script && script.dataset.name) ? script.dataset.name : "ai-\u0412\u043b\u0430\u0434";
var COLOR    = (script && script.dataset.color) ? script.dataset.color : "#FF6B00";
var GREETING = (script && script.dataset.greeting)
  ? script.dataset.greeting
  : ("\u041f\u0440\u0438\u0432\u0435\u0442! \u042f " + BOT_NAME + ". \u0427\u0435\u043c \u043c\u043e\u0433\u0443 \u043f\u043e\u043c\u043e\u0447\u044c?");

if (!document.querySelector('link[href*="Onest"]')) {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap';
  document.head.appendChild(l);
}

var host = document.createElement('div');
host.id = 'chat-widget-host';
document.body.appendChild(host);

var gs = document.createElement('style');
gs.textContent = '#chat-widget-host,#chat-widget-host *{cursor:pointer!important}#chat-widget-host textarea,#chat-widget-host input{cursor:text!important;font-size:16px!important}';
document.head.appendChild(gs);

var shadow = host.attachShadow({ mode: 'open' });
var styleEl = document.createElement('style');
styleEl.textContent = ':host{--cw-color:' + COLOR + '}\n' + STYLES;
shadow.appendChild(styleEl);

var wrap = document.createElement('div');
wrap.innerHTML =
  '<div id="launcher-wrap">' +
    '<div id="ring1"></div>' +
    '<div id="ring2"></div>' +
    '<svg id="launcher-svg"></svg>' +
    '<button id="launcher" aria-label="Open chat">' +
      '<svg class="icon" viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>' +
      '<span id="launcher-label">\u0421\u043f\u0440\u043e\u0441\u0438 ai-\u0412\u043b\u0430\u0434\u0430</span>' +
    '</button>' +
  '</div>' +
  '<div id="window" class="hidden">' +
    '<div id="header">' +
      '<div id="header-left">' +
        '<div id="header-dot"></div>' +
        '<div id="header-info">' +
          '<span id="header-title">' + BOT_NAME + '</span>' +
          '<span id="header-sub">Online</span>' +
        '</div>' +
      '</div>' +
      '<button id="close-btn" aria-label="Закрыть чат">&times;</button>' +
    '</div>' +
    '<div id="messages"></div>' +
    '<div id="input-bar">' +
      '<textarea id="input" rows="1" placeholder="\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435\u2026"></textarea>' +
      '<button id="send-btn" aria-label="Отправить сообщение"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>' +
    '</div>' +
    '<div id="lead-form">' +
      '<p>\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u2014 \u043c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438</p>' +
      '<input id="lead-input-name" type="text" placeholder="\u0412\u0430\u0448\u0435 \u0438\u043c\u044f" autocomplete="name"/>' +
      '<input id="lead-input-contact" type="tel" placeholder="\u0422\u0435\u043b\u0435\u0444\u043e\u043d \u0438\u043b\u0438 Telegram" autocomplete="tel"/>' +
      '<button id="lead-submit">\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443 →</button>' +
    '</div>' +
  '</div>';
shadow.appendChild(wrap);

function $(id){ return shadow.getElementById(id); }
var launcherWrap = $('launcher-wrap');
var win          = $('window');
var launcher     = $('launcher');
var lsvg         = $('launcher-svg');
var messages     = $('messages');
var input        = $('input');
var sendBtn      = $('send-btn');
var closeBtn     = $('close-btn');
var leadForm     = $('lead-form');
var leadName     = $('lead-input-name');
var leadContact  = $('lead-input-contact');
var leadSubmit   = $('lead-submit');
var leadData     = {};

// Build SVG rings for mobile pill
function buildSVGRings() {
  if (window.innerWidth > 640) return;
  var w = launcher.offsetWidth;
  var h = launcher.offsetHeight;
  if (!w || !h) return;

  var p1 = 6, p2 = 11;
  var rx1 = h / 2 + p1;
  var rx2 = h / 2 + p2;
  var perim1 = Math.round(2 * (w - h) + 2 * Math.PI * rx1);
  var perim2 = Math.round(2 * (w - h) + 2 * Math.PI * rx2);
  var ns = 'http://www.w3.org/2000/svg';

  lsvg.setAttribute('width',  w + p2 * 2);
  lsvg.setAttribute('height', h + p2 * 2);
  lsvg.style.left = (-p2) + 'px';
  lsvg.style.top  = (-p2) + 'px';
  lsvg.innerHTML = '';

  function rect(x, y, rw, rh, rx, stroke, sw, dash, anim) {
    var r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', rw); r.setAttribute('height', rh);
    r.setAttribute('rx', rx); r.setAttribute('ry', rx);
    r.setAttribute('fill', 'none');
    r.setAttribute('stroke', stroke);
    r.setAttribute('stroke-width', sw);
    r.setAttribute('stroke-dasharray', dash);
    r.setAttribute('stroke-dashoffset', '0');
    r.setAttribute('stroke-linecap', 'round');
    r.style.animation = anim;
    return r;
  }

  lsvg.appendChild(rect(
    p2 - p1, p2 - p1, w + p1*2, h + p1*2, rx1,
    '#FFE500', '2.5',
    '24 ' + (perim1 - 24),
    'trace1 2s linear infinite'
  ));
  lsvg.appendChild(rect(
    0, 0, w + p2*2, h + p2*2, rx2,
    'rgba(255,107,0,0.5)', '1.5',
    '14 ' + (perim2 - 14),
    'trace2 3.2s linear infinite'
  ));

  // inject keyframes with correct perimeter
  var kfId = 'cw-kf';
  var kfEl = shadow.getElementById(kfId);
  if (!kfEl) {
    kfEl = document.createElement('style');
    kfEl.id = kfId;
    shadow.appendChild(kfEl);
  }
  kfEl.textContent =
    '@keyframes trace1{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-' + perim1 + '}}' +
    '@keyframes trace2{0%{stroke-dashoffset:0}100%{stroke-dashoffset:' + perim2 + '}}';
}

setTimeout(buildSVGRings, 150);
window.addEventListener('resize', function(){ setTimeout(buildSVGRings, 100); });

var isStreaming  = false;
var isOpen       = false;

// Session storage with 10 min expiry
var SESSION_KEY = 'cw_session';
var SESSION_TTL = 1 * 60 * 60 * 1000;

function loadSession() {
  try {
    var raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { history: [], greetingDone: false };
    var data = JSON.parse(raw);
    if (Date.now() - data.ts > SESSION_TTL) {
      sessionStorage.removeItem(SESSION_KEY);
      return { history: [], greetingDone: false };
    }
    return { history: data.history || [], greetingDone: !!data.greetingDone };
  } catch(e) { return { history: [], greetingDone: false }; }
}

function saveSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      history: history,
      greetingDone: greetingDone,
      ts: Date.now()
    }));
  } catch(e) {}
}

var _session     = loadSession();
var history      = _session.history;
var greetingDone = _session.greetingDone;

function typeGreeting() {
  return new Promise(function(resolve) {
    var div = document.createElement('div');
    div.className = 'msg bot';
    messages.appendChild(div);
    var i = 0;
    function tick() {
      div.innerHTML = md(GREETING.slice(0, i));
      messages.scrollTop = messages.scrollHeight;
      if (i <= GREETING.length) { i++; setTimeout(tick, 22); }
      else { greetingDone = true; saveSession(); resolve(); }
    }
    tick();
  });
}

function addMsg(role, text, streaming) {
  var d = document.createElement('div');
  d.className = 'msg ' + role + (streaming ? ' typing' : '');
  d.innerHTML = role === 'bot'
    ? md(text)
    : text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
  return d;
}

function openChat() {
  isOpen = true;
  win.classList.remove('hidden');
  launcherWrap.classList.add('is-open');
  var p;
  if (!greetingDone) {
    p = typeGreeting();
  } else if (messages.children.length === 0) {
    // restore messages from session, always prepend greeting
    addMsg('bot', GREETING);
    history.forEach(function(m) {
      addMsg(m.role === 'user' ? 'user' : 'bot', m.content);
    });
    p = Promise.resolve();
  } else {
    p = Promise.resolve();
  }
  p.then(function(){ if (window.innerWidth > 640) input.focus(); });
}
function closeChat() {
  isOpen = false;
  win.classList.add('hidden');
  launcherWrap.classList.remove('is-open');
}

function send() {
  var text = input.value.trim();
  if (!text || isStreaming) return;
  addMsg('user', text);
  history.push({ role: 'user', content: text }); saveSession();
  input.value = ''; input.style.height = '';
  isStreaming = true; sendBtn.disabled = true;

  var bot = addMsg('bot', '\u2026', true);
  var acc = '';

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history })
  })
  .then(function(res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var reader = res.body.getReader();
    var dec = new TextDecoder();
    var buf = '';
    function pump() {
      return reader.read().then(function(r) {
        if (r.done) return;
        buf += dec.decode(r.value, { stream: true });
        var lines = buf.split('\n'); buf = lines.pop();
        lines.forEach(function(line) {
          if (!line.startsWith('data: ')) return;
          var d = line.slice(6);
          if (d === '[DONE]') return;
          try {
            acc += JSON.parse(d);
            bot.classList.remove('typing');
            // parse lead tag
            var displayAcc = acc.replace(/\[LEAD_READY\](\{[^}]*\})?/g, function(_match, json) {
              try { leadData = JSON.parse(json || '{}'); } catch(e) {}
              return '';
            });
            bot.innerHTML = md(displayAcc.trim());
            messages.scrollTop = messages.scrollHeight;
          } catch(e) {}
        });
        return pump();
      });
    }
    return pump();
  })
  .then(function() {
    if (acc) {
      var cleanAcc = acc.replace(/\[LEAD_READY\](\{[^}]*\})?/g, '').trim();
      history.push({ role: 'assistant', content: cleanAcc });
      saveSession();
      if (/\[LEAD_READY\]/.test(acc)) {
        leadForm.classList.add('visible');
        leadName.focus();
      }
    }
    isStreaming = false; sendBtn.disabled = false;
  })
  .catch(function(err) {
    console.error('[ai-Vlad widget] error:', err);
    bot.innerHTML = '\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0432\u044f\u0437\u0438. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.';
    bot.classList.remove('typing');
    isStreaming = false; sendBtn.disabled = false;
  });
}

// iOS Safari: fix viewport height when keyboard opens
function fixIOSHeight() {
  if (window.innerWidth > 640) return;
  var wEl = shadow.getElementById('window');
  if (!wEl) return;
  var btnH = 54 + 12 + 12; // pill height + bottom + gap
  var vh = window.innerHeight;
  wEl.style.maxHeight = (vh - btnH) + 'px';
  wEl.style.bottom = '82px';
}
window.addEventListener('resize', fixIOSHeight);
window.addEventListener('focusin', function() { setTimeout(fixIOSHeight, 300); });
window.addEventListener('focusout', function() {
  setTimeout(fixIOSHeight, 300);
  setTimeout(function() {
    messages.scrollTop = messages.scrollHeight;
  }, 350);
});
setTimeout(fixIOSHeight, 200);

// Lead form submit
leadSubmit.addEventListener('click', function() {
  var name    = leadName.value.trim();
  var contact = leadContact.value.trim();
  if (!name || !contact) {
    if (!name) leadName.style.borderColor = 'rgba(255,50,50,.6)';
    if (!contact) leadContact.style.borderColor = 'rgba(255,50,50,.6)';
    return;
  }
  leadSubmit.disabled = true;
  leadSubmit.textContent = '\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c\u2026';

  fetch(LEAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      contact: contact,
      service: leadData.business || '\u0427\u0430\u0442-\u0432\u0438\u0434\u0436\u0435\u0442',
      message: '\u0411\u0438\u0437\u043d\u0435\u0441: ' + (leadData.business||'—') +
               '\n\u0421\u0430\u0439\u0442: ' + (leadData.site||'—') +
               '\n\u0426\u0435\u043b\u0438: ' + (leadData.goals||'—') +
               '\n\u041f\u043e\u0436\u0435\u043b\u0430\u043d\u0438\u044f: ' + (leadData.wishes||'—'),
      page: 'ai-\u0412\u043b\u0430\u0434 (\u0447\u0430\u0442-\u0432\u0438\u0434\u0436\u0435\u0442)'
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(r) {
    if (r.ok) {
      leadForm.innerHTML = '<p style="color:#4ade80;font-family:var(--font);font-size:14px;text-align:center;padding:4px 0">\u2713 \u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430! \u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u0432 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043c\u044f.</p>';
      addMsg('bot', '\u0421\u043f\u0430\u0441\u0438\u0431\u043e! \u0417\u0430\u044f\u0432\u043a\u0430 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u0430 \u043c\u0435\u043d\u0435\u0434\u0436\u0435\u0440\u0443. \u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u0432 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043c\u044f \u2014 \u043e\u0431\u044b\u0447\u043d\u043e \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f!');
    } else {
      leadSubmit.disabled = false;
      leadSubmit.textContent = '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443 \u2192';
      addMsg('bot', '\u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437 \u0438\u043b\u0438 \u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c \u043d\u0430 b2b@yarche.by');
    }
  })
  .catch(function() {
    leadSubmit.disabled = false;
    leadSubmit.textContent = '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443 \u2192';
    addMsg('bot', '\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438. \u041f\u043e\u0437\u0432\u043e\u043d\u0438\u0442\u0435 \u043d\u0430\u043c: +375 (29) 246-00-54');
  });
});

launcher.addEventListener('click', function() {
  if (isOpen) closeChat(); else openChat();
});
closeBtn.addEventListener('click', closeChat);
input.addEventListener('input', function() { input.style.height = 'auto'; input.style.height = input.scrollHeight + 'px'; });
input.addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
sendBtn.addEventListener('click', send);

})();
