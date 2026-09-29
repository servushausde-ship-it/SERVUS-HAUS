/* SERVUS HAUS – Cookie-Einwilligung (Google Consent Mode v2)
   Standard (in <head>): alles "denied". Erst nach Einwilligung werden
   Statistik- bzw. Marketing-Cookies erlaubt. Die Auswahl wird 12 Monate
   im localStorage gespeichert (technisch erforderlich, § 25 Abs. 2 TDDDG). */
(() => {
  const KEY = 'sh_consent_v1';
  const MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  function read() {
    try {
      const c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.ts < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }

  function apply(c, isNew) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    gtag('consent', 'update', {
      analytics_storage: c.statistik ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    window.dataLayer.push({ event: 'consent_update', consent_statistik: !!c.statistik, consent_marketing: !!c.marketing, consent_new: !!isNew });
  }

  function save(statistik, marketing) {
    const c = { statistik: !!statistik, marketing: !!marketing, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    apply(c, true);
    close();
  }

  const css = `
  .shc{position:fixed;left:16px;right:16px;bottom:16px;z-index:10000;max-width:560px;margin:0 auto;background:#fff;color:#2C2C2C;border:1px solid #E3E0DB;border-radius:12px;box-shadow:0 12px 32px rgba(26,35,56,.18);padding:20px;font:16px/1.5 Inter,system-ui,-apple-system,'Segoe UI',sans-serif}
  .shc h2{font-size:1.1rem;margin:0 0 8px;color:#1A2338}
  .shc p{margin:0 0 12px;font-size:.95rem}
  .shc a{color:#1A2338}
  .shc-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
  .shc-btns button{flex:1 1 150px;min-height:44px;border-radius:999px;border:2px solid #1A2338;font:600 .95rem Inter,system-ui,sans-serif;cursor:pointer;padding:0 16px}
  .shc-accept,.shc-reject{background:#1A2338;color:#fff}
  .shc-settings,.shc-save{background:#fff;color:#1A2338}
  .shc-opts{display:none;border-top:1px solid #E3E0DB;margin-top:8px;padding-top:12px}
  .shc.open .shc-opts{display:block}
  .shc label{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;font-size:.92rem}
  .shc input{width:20px;height:20px;margin-top:2px;flex:none}
  .shc button:focus-visible,.shc input:focus-visible,.shc a:focus-visible{outline:3px solid #2D7DC6;outline-offset:2px}`;

  let box = null;

  function open(showOptions) {
    if (box) { box.classList.toggle('open', !!showOptions); box.querySelector('button').focus(); return; }
    const c = read() || { statistik: false, marketing: false };
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    box = document.createElement('div');
    box.className = 'shc' + (showOptions ? ' open' : '');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'false');
    box.setAttribute('aria-labelledby', 'shc-title');
    box.innerHTML = `
      <h2 id="shc-title">Datenschutz-Einstellungen</h2>
      <p>Wir möchten mit Ihrer Einwilligung Cookies und ähnliche Technologien von Google (Google Analytics, Google Ads) nutzen, um die Nutzung unserer Website statistisch auszuwerten und den Erfolg unserer Werbung zu messen. Dabei können Daten auch in die USA übermittelt werden. Ihre Einwilligung ist freiwillig und jederzeit über „Cookie-Einstellungen“ im Seitenfuß widerrufbar. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>
      <div class="shc-opts" id="shc-opts">
        <label><input type="checkbox" checked disabled> <span><strong>Notwendig</strong> – Speicherung Ihrer Auswahl. Immer aktiv.</span></label>
        <label><input type="checkbox" id="shc-stat"${c.statistik ? ' checked' : ''}> <span><strong>Statistik</strong> – Google Analytics 4: anonyme Auswertung der Seitennutzung.</span></label>
        <label><input type="checkbox" id="shc-mkt"${c.marketing ? ' checked' : ''}> <span><strong>Marketing</strong> – Google Ads: Messung von Anfragen aus Anzeigen (Conversion-Tracking) und Remarketing.</span></label>
      </div>
      <div class="shc-btns">
        <button type="button" class="shc-reject">Nur notwendige</button>
        <button type="button" class="shc-accept">Alle akzeptieren</button>
        <button type="button" class="shc-settings" aria-controls="shc-opts">Einstellungen</button>
        <button type="button" class="shc-save" hidden>Auswahl speichern</button>
      </div>`;
    document.body.appendChild(box);
    const saveBtn = box.querySelector('.shc-save');
    const settingsBtn = box.querySelector('.shc-settings');
    const sync = () => { const o = box.classList.contains('open'); saveBtn.hidden = !o; settingsBtn.hidden = o; };
    sync();
    box.querySelector('.shc-accept').addEventListener('click', () => save(true, true));
    box.querySelector('.shc-reject').addEventListener('click', () => save(false, false));
    settingsBtn.addEventListener('click', () => { box.classList.add('open'); sync(); box.querySelector('#shc-stat').focus(); });
    saveBtn.addEventListener('click', () => save(box.querySelector('#shc-stat').checked, box.querySelector('#shc-mkt').checked));
  }

  function close() { if (box) { box.remove(); box = null; } }

  window.servusConsent = { open: () => open(true) };

  function init() {
    document.querySelectorAll('[data-cookie-settings]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); open(true); }));
    if (!read()) open(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
