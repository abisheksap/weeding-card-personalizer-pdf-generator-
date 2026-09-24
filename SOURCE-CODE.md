# Wedding Invitation Studio v19 — Source Code


## `index.html`

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#8e2438">
<meta name="description" content="Private, local-first wedding invitation personalizer.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="assets/icons/icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/styles.css">
<title>Wedding Invitation Studio</title>
</head>
<body>
<div id="app">
<header class="topbar">
  <div class="brand"><div class="brand-mark">ॐ</div><div><strong>Wedding Invitation Studio</strong><span>Personalize · Preview · Share</span></div></div>
  <nav class="desktop-nav" aria-label="Main navigation">
    <button class="nav-btn active" data-view="create">Create</button>
    <button class="nav-btn" data-view="cards">Generated Cards</button>
    <button class="nav-btn" data-view="settings">Settings</button>
  </nav>
</header>
<main>
  <section id="createView" class="view active">
    <div class="hero-copy"><div class="eyebrow">WEDDING INVITATION</div><h1>Create a personal invitation.</h1><p>Enter the guest's name and address. The original 3-page card stays intact; only the recipient area is personalized.</p></div>
    <div class="workspace">
      <div class="panel form-panel">
        <div class="panel-head"><div><h2>Guest details</h2><p>Unicode supported · नेपाली · English</p></div><span class="secure-pill">Local only</span></div>
        <label for="guestName">Relative / guest name</label>
        <input id="guestName" autocomplete="off" spellcheck="false" placeholder="श्रीमान् गणेश जी / Mr. Ganesh Ji">
        <label for="guestAddress">Address</label>
        <textarea id="guestAddress" rows="4" spellcheck="false" placeholder="भरतपुर–१०, चितवन / Bharatpur-10, Chitwan"></textarea>

        <div class="editor-panel">
          <div class="editor-head">
            <div><strong>Adjust name & address</strong><small>Drag the text on the preview or fine-tune it below.</small></div>
            <button class="mini-btn" id="resetLayout" type="button">Reset</button>
          </div>
          <div class="template-row">
            <input id="templateName" placeholder="Template name" value="Main Preset" aria-label="Template name">
            <select id="templateSelect" aria-label="Saved template"><option value="main-preset">Main Preset</option></select>
          </div>
          <div class="template-actions"><button class="mini-btn" id="saveTemplate" type="button">Save template</button><button class="mini-btn" id="deleteTemplate" type="button">Delete saved</button><button class="mini-btn" id="fontReset" type="button">Reset fonts</button></div>

          <div class="field-editor">
            <div class="field-title"><span>Name</span><small>PDF points · X from left · Y from bottom</small></div>
            <div class="range-grid">
              <label>X <input id="nameX" type="range" min="0" max="595" step="1" value="196"><output id="nameXValue">196</output></label>
              <label>Y <input id="nameY" type="range" min="0" max="842" step="1" value="56"><output id="nameYValue">56</output></label>
              <label>Size <input id="nameFontSize" type="range" min="8" max="54" step="1" value="24"><output id="nameFontSizeValue">24</output></label>
              <label>Width <input id="nameMaxWidth" type="range" min="80" max="520" step="1" value="420"><output id="nameMaxWidthValue">420</output></label>
            </div>
            <div class="font-grid">
              <label>Font <select id="nameFont"><option value="NotoDeva">Noto Sans Devanagari</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option><option value="Arial">Arial</option><option value="Trebuchet MS">Trebuchet MS</option></select></label>
              <label>Weight <select id="nameWeight"><option value="400">Regular</option><option value="700" selected>Bold</option></select></label>
              <label>Align <select id="nameAlign"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
              <label>Color <input id="nameColor" type="color" value="#7c1f31"></label>
            </div>
          </div>

          <div class="field-editor">
            <div class="field-title"><span>Address</span><small>Saved separately inside each template</small></div>
            <div class="range-grid">
              <label>X <input id="addressX" type="range" min="0" max="595" step="1" value="246"><output id="addressXValue">246</output></label>
              <label>Y <input id="addressY" type="range" min="0" max="842" step="1" value="32"><output id="addressYValue">32</output></label>
              <label>Size <input id="addressFontSize" type="range" min="8" max="54" step="1" value="22"><output id="addressFontSizeValue">22</output></label>
              <label>Width <input id="addressMaxWidth" type="range" min="80" max="520" step="1" value="365"><output id="addressMaxWidthValue">365</output></label>
            </div>
            <div class="font-grid">
              <label>Font <select id="addressFont"><option value="NotoDeva">Noto Sans Devanagari</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option><option value="Arial">Arial</option><option value="Trebuchet MS">Trebuchet MS</option></select></label>
              <label>Weight <select id="addressWeight"><option value="400">Regular</option><option value="700" selected>Bold</option></select></label>
              <label>Align <select id="addressAlign"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
              <label>Color <input id="addressColor" type="color" value="#7c1f31"></label>
            </div>
          </div>
          <div class="drag-hint" id="dragHint">Drag the name or address directly on the card preview.</div>
        </div>

        <div id="duplicateNotice" class="notice hidden"></div>
        <div id="formError" class="error hidden"></div>
        <div class="form-actions"><button class="btn ghost" id="clearBtn">Clear</button><span class="instant-hint">Enter both fields, then use Download or Share — the PDF is created automatically and saved in Generated Cards.</span></div>
        <div class="tip"><span>✓</span><div><strong>Private by design</strong><small>Names, addresses and generated PDFs stay in this browser unless you download or share them.</small></div></div>
      </div>
      <div class="panel preview-panel">
        <div class="panel-head"><div><h2>Preview</h2><p>Page <span id="pageNumber">1</span> of 3</p></div><div class="preview-tools"><button class="icon-btn" id="prevPage" aria-label="Previous page">←</button><button class="icon-btn" id="nextPage" aria-label="Next page">→</button></div></div>
        <div class="preview-stage"><div id="patternOverlay" class="pattern-overlay" aria-hidden="true"></div><canvas id="previewCanvas"></canvas><div id="previewEmpty" class="preview-empty"><div class="empty-icon">💍</div><strong>Your personalized card will appear here.</strong><span>Enter a name and address to preview it.</span></div><div id="previewOverlay" class="preview-overlay" aria-hidden="true"><div id="previewName"></div><div id="previewAddress"></div></div></div>
        <div class="preview-actions"><button class="btn secondary" id="downloadBtn" disabled>Download PDF</button><button class="btn share" id="shareBtn" disabled><span aria-hidden="true">↗</span> Share PDF</button></div>
      </div>
    </div>
  </section>

  <section id="cardsView" class="view">
    <div class="section-head"><div><div class="eyebrow">YOUR INVITATIONS</div><h1>Generated cards</h1><p>Everything created on this browser, with quick access to the PDF.</p></div><button class="btn primary" id="newCardBtn">+ New invitation</button></div>
    <div class="stats"><div class="stat"><span>Total invitations</span><strong id="totalCount">0</strong></div><div class="stat"><span>Created today</span><strong id="todayCount">0</strong></div><div class="stat"><span>Storage</span><strong>Local</strong></div></div>
    <div class="search-row"><input id="searchInput" placeholder="Search name or address…" autocomplete="off"><select id="sortSelect"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option></select></div>
    <div id="cardsList" class="cards-list"></div>
  </section>

  <section id="settingsView" class="view">
    <div class="section-head"><div><div class="eyebrow">LOCAL DATA</div><h1>Backup & settings</h1><p>Your guest list belongs to this browser. Export a backup before changing devices.</p></div></div>
    <div class="settings-grid">
      <div class="panel setting-card"><h2>Backup</h2><p>Export all invitation records and generated PDFs into one ZIP file.</p><button class="btn primary" id="exportBackup">Export backup</button><button class="btn ghost full" id="importBackup">Import backup</button><input type="file" id="backupFile" accept=".zip" hidden></div>
      <div class="panel setting-card"><h2>Guest list</h2><p>Export names, addresses and creation dates as a CSV file.</p><button class="btn secondary" id="exportCsv">Export guest list</button></div>
      <div class="panel setting-card danger-card"><h2>Clear local data</h2><p>Removes generated invitations and PDFs from this browser. This cannot be undone.</p><button class="btn danger" id="clearData">Clear all data</button></div>
    </div>
    <div class="about"><strong>Wedding Invitation Studio</strong><span>Local-first · No account · No server database</span><span>Template: wedding-card-v18-unified-stars-custom-share-crisp</span><span>The Main Preset is stored in the source code, so the same default is used on Vercel and every device.</span></div>
  </section>
</main>
<nav class="mobile-nav"><button class="nav-btn active" data-view="create">Create</button><button class="nav-btn" data-view="cards">Cards</button><button class="nav-btn" data-view="settings">Settings</button></nav>
<div id="toast" class="toast" role="status"></div>
<div id="modal" class="modal hidden"><div class="modal-card"><button class="modal-close" id="modalClose">×</button><div id="modalContent"></div></div></div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script type="module" src="js/app.js?v=18"></script>
</body>
</html>

```


## `css/styles.css`

```css
@font-face{font-family:NotoDeva;src:url('../assets/fonts/NotoSansDevanagari-Regular.ttf') format('truetype');font-weight:400;font-display:swap}@font-face{font-family:NotoDeva;src:url('../assets/fonts/NotoSansDevanagari-Bold.ttf') format('truetype');font-weight:700;font-display:swap}:root{--ink:#2d2024;--muted:#776a70;--line:#eadde1;--paper:#fffaf7;--rose:#8e2438;--rose2:#a83b51;--gold:#b78943;--shadow:0 20px 55px rgba(72,28,40,.10);--radius:22px}*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:NotoDeva,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:linear-gradient(145deg,#fffdfb,#f8eff0)}button,input,textarea,select{font:inherit}button{cursor:pointer}body{background-image:radial-gradient(circle at 10% 5%,rgba(183,137,67,.10),transparent 25%),radial-gradient(circle at 90% 15%,rgba(142,36,56,.08),transparent 24%)}.topbar{height:76px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;background:rgba(255,253,251,.86);backdrop-filter:blur(16px);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}.brand{display:flex;align-items:center;gap:12px}.brand-mark{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:#8e2438;color:#fff;font-size:22px;box-shadow:0 8px 20px rgba(142,36,56,.2)}.brand strong{display:block;font-size:15px}.brand span{display:block;color:var(--muted);font-size:11px;margin-top:2px}.desktop-nav{display:flex;gap:5px}.nav-btn{border:0;background:transparent;padding:10px 15px;border-radius:12px;color:var(--muted);font-weight:700}.nav-btn.active{background:#f6e8eb;color:var(--rose)}main{max-width:1420px;margin:auto;padding:52px 5vw 90px}.view{display:none}.view.active{display:block}.hero-copy{max-width:760px;margin-bottom:30px}.eyebrow{letter-spacing:.18em;font-size:11px;font-weight:800;color:var(--gold)}h1{font-size:clamp(34px,5vw,58px);line-height:1.05;margin:8px 0 13px;letter-spacing:-.04em}.hero-copy p,.section-head p{color:var(--muted);line-height:1.7;margin:0;max-width:720px}.workspace{display:grid;grid-template-columns:minmax(320px,.72fr) minmax(450px,1.28fr);gap:24px}.panel{background:rgba(255,253,251,.9);border:1px solid rgba(234,221,225,.95);border-radius:var(--radius);box-shadow:var(--shadow)}.form-panel{padding:28px}.panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}.panel-head h2{margin:0;font-size:19px}.panel-head p{margin:4px 0 0;color:var(--muted);font-size:12px}.secure-pill{font-size:11px;background:#edf7ef;color:#347044;border-radius:999px;padding:7px 10px;font-weight:800}label{display:block;font-size:13px;font-weight:800;margin:18px 0 8px}input,textarea,select{width:100%;border:1px solid #dfd1d6;background:#fff;border-radius:14px;padding:14px 15px;color:var(--ink);outline:none;transition:.2s}textarea{resize:vertical;min-height:120px}input:focus,textarea:focus,select:focus{border-color:#b97888;box-shadow:0 0 0 4px rgba(142,36,56,.08)}.form-actions,.preview-actions{display:flex;gap:10px;margin-top:18px}.btn{border:0;border-radius:13px;padding:12px 17px;font-weight:800;transition:.2s}.btn:hover{transform:translateY(-1px)}.btn.primary{background:var(--rose);color:white;box-shadow:0 8px 20px rgba(142,36,56,.2)}.btn.secondary{background:#f3e4c9;color:#5e421e}.btn.ghost{background:#f5eef0;color:var(--rose)}.btn.share{background:#e7f4ea;color:#2f6c3e}.btn.danger{background:#f9e3e3;color:#a52626}.btn.full{width:100%;margin-top:10px}.form-actions .primary{margin-left:auto}.tip{display:flex;gap:10px;margin-top:22px;padding:13px;border-radius:14px;background:#faf5f0}.tip span{color:#4e8a5d;font-size:17px}.tip strong,.tip small{display:block}.tip strong{font-size:12px}.tip small{font-size:11px;color:var(--muted);line-height:1.5;margin-top:2px}.notice,.error{margin-top:14px;border-radius:12px;padding:11px 13px;font-size:12px}.notice{background:#fff5d9;color:#6f5315}.error{background:#fde8e8;color:#9e2828}.hidden{display:none!important}.preview-panel{padding:20px;display:flex;flex-direction:column;min-height:720px}.preview-tools{display:flex;gap:6px}.icon-btn{width:36px;height:36px;border:1px solid var(--line);background:#fff;border-radius:10px;color:var(--rose);font-weight:900}.pattern-overlay{position:absolute;pointer-events:none;z-index:3;background-repeat:no-repeat;background-size:100% 100%;background-position:center;mix-blend-mode:multiply}.preview-stage{flex:1;min-height:560px;background:#efe5e2;border-radius:16px;display:grid;place-items:center;position:relative;overflow:hidden;padding:18px}.preview-stage canvas{display:block;max-width:100%;max-height:100%;height:auto;width:auto;box-shadow:0 18px 45px rgba(40,20,24,.18);background:white}.preview-overlay{position:absolute;pointer-events:none;color:#7c1f31;font-weight:700;display:none}.preview-overlay div{position:absolute;white-space:pre-wrap;overflow:hidden}.preview-empty{z-index:6;position:absolute;inset:0;display:grid;place-items:center;align-content:center;text-align:center;color:var(--muted);gap:8px}.empty-icon{font-size:40px}.preview-actions{justify-content:flex-end}.preview-actions .primary{min-width:140px}.section-head{display:flex;justify-content:space-between;align-items:end;gap:25px;margin-bottom:28px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px}.stat{background:rgba(255,253,251,.8);border:1px solid var(--line);padding:18px;border-radius:17px}.stat span{display:block;color:var(--muted);font-size:11px}.stat strong{font-size:26px;display:block;margin-top:4px}.search-row{display:grid;grid-template-columns:1fr 180px;gap:10px;margin-bottom:18px}.cards-list{display:grid;gap:12px}.inv-card{background:rgba(255,253,251,.9);border:1px solid var(--line);border-radius:18px;padding:18px;display:grid;grid-template-columns:1fr auto;gap:15px;align-items:center}.inv-name{font-weight:800;font-size:16px}.inv-address{color:var(--muted);font-size:12px;margin-top:4px}.inv-meta{color:#a18f95;font-size:10px;margin-top:8px}.inv-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.mini-btn{border:1px solid var(--line);background:white;border-radius:10px;padding:8px 10px;font-size:11px;font-weight:800;color:var(--rose)}.empty-list{text-align:center;padding:55px 20px;border:1px dashed #dccbd0;border-radius:18px;color:var(--muted)}.settings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.setting-card{padding:24px}.setting-card h2{margin:0 0 8px}.setting-card p{font-size:12px;line-height:1.6;color:var(--muted);min-height:60px}.about{margin-top:20px;padding:20px;border-top:1px solid var(--line);display:flex;gap:22px;flex-wrap:wrap;color:var(--muted);font-size:11px}.about strong{color:var(--ink)}.toast{position:fixed;bottom:25px;left:50%;transform:translate(-50%,20px);background:#2e2227;color:#fff;padding:12px 16px;border-radius:12px;font-size:12px;opacity:0;pointer-events:none;transition:.25s;z-index:50}.toast.show{opacity:1;transform:translate(-50%,0)}.modal{position:fixed;inset:0;background:rgba(28,17,21,.55);display:grid;place-items:center;padding:20px;z-index:60}.modal-card{max-width:680px;width:100%;max-height:90vh;overflow:auto;background:#fffaf7;border-radius:22px;padding:28px;position:relative;box-shadow:0 30px 90px rgba(0,0,0,.25)}.modal-close{position:absolute;right:16px;top:12px;border:0;background:#f3e7e9;border-radius:50%;width:34px;height:34px;font-size:22px;color:var(--rose)}.mobile-nav{display:none}@media(max-width:900px){.desktop-nav{display:none}.workspace{grid-template-columns:1fr}.preview-panel{min-height:650px}.settings-grid{grid-template-columns:1fr}.mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;height:64px;background:rgba(255,253,251,.96);backdrop-filter:blur(15px);border-top:1px solid var(--line);z-index:30;justify-content:space-around}.mobile-nav .nav-btn{flex:1;border-radius:0}.mobile-nav .active{color:var(--rose);background:#faf0f2}main{padding-bottom:100px}}@media(max-width:560px){main{padding:34px 16px 95px}.topbar{padding:0 16px}.brand strong{font-size:13px}.brand span{font-size:9px}.workspace{gap:15px}.form-panel,.preview-panel{padding:17px}.preview-stage{min-height:500px;padding:10px}.preview-actions{display:grid;grid-template-columns:1fr 1fr}.preview-actions .primary{grid-column:1/-1}.stats{grid-template-columns:1fr}.search-row{grid-template-columns:1fr}.section-head{align-items:start;flex-direction:column}.inv-card{grid-template-columns:1fr}.inv-actions{justify-content:flex-start}.hero-copy h1{font-size:38px}}
.editor-panel{margin-top:20px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,#fffdfb,#fbf3f1);padding:16px}.editor-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.editor-head strong{display:block;font-size:13px}.editor-head small{display:block;color:var(--muted);font-size:10px;margin-top:3px}.template-row{display:grid;grid-template-columns:1.15fr .85fr;gap:8px}.template-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.field-editor{margin-top:13px;padding-top:13px;border-top:1px solid var(--line)}.field-title{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:8px}.field-title span{font-size:12px;font-weight:900;color:var(--rose)}.field-title small{font-size:9px;color:var(--muted)}.range-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.range-grid label{margin:0;padding:8px 9px;border:1px solid var(--line);background:#fff;border-radius:11px;font-size:10px;color:var(--muted);font-weight:800;display:grid;grid-template-columns:30px 1fr 32px;align-items:center;gap:5px}.range-grid input[type=range]{padding:0;border:0;box-shadow:none;background:transparent}.range-grid output{font-size:10px;color:var(--ink);text-align:right}.font-grid{display:grid;grid-template-columns:1.6fr .8fr .8fr 46px;gap:7px;margin-top:7px}.font-grid label{margin:0;font-size:9px;color:var(--muted);font-weight:800}.font-grid select,.font-grid input{margin-top:4px;padding:8px 7px;border-radius:10px;font-size:10px}.font-grid input[type=color]{height:34px;padding:3px}.drag-hint{margin-top:10px;padding:8px 10px;border-radius:10px;background:#f6e9ec;color:var(--rose);font-size:10px;text-align:center}.preview-overlay div{cursor:grab;touch-action:none;text-shadow:0 1px 1px rgba(255,255,255,.5)}.preview-overlay div.dragging{cursor:grabbing;outline:1px dashed rgba(142,36,56,.55);outline-offset:4px}.preview-overlay{z-index:5}.preview-stage canvas{position:relative;z-index:1}@media(max-width:560px){.template-row,.range-grid,.font-grid{grid-template-columns:1fr}.field-title{display:block}.field-title small{display:block;margin-top:3px}.font-grid{gap:5px}}
.instant-hint{font-size:11px;color:var(--muted);line-height:1.45;display:flex;align-items:center;max-width:430px}
.preview-actions .secondary,.preview-actions .share{min-width:150px}
.preview-actions{justify-content:flex-end;flex-wrap:wrap}
@media(max-width:560px){.instant-hint{max-width:none}.form-actions{align-items:flex-start;flex-direction:column}.preview-actions{grid-template-columns:1fr 1fr!important}.preview-actions .secondary,.preview-actions .share{min-width:0}}

/* Deep layered star-field background */
html,body{position:relative;overflow-x:hidden}
body{
  background:
    radial-gradient(ellipse at 50% 0%,rgba(255,250,245,.98) 0%,rgba(250,239,242,.92) 38%,rgba(230,213,220,.94) 100%),
    radial-gradient(circle at 15% 18%,rgba(183,137,67,.13),transparent 23%),
    radial-gradient(circle at 82% 24%,rgba(142,36,56,.11),transparent 25%);
}
body::before,body::after{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;
}
body::before{
  opacity:.8;
  background-image:
    radial-gradient(circle,rgba(183,137,67,.75) 0 1px,transparent 1.5px),
    radial-gradient(circle,rgba(142,36,56,.55) 0 1px,transparent 1.5px),
    radial-gradient(circle,rgba(255,255,255,.95) 0 1.2px,transparent 1.8px);
  background-size:83px 91px,137px 121px,53px 67px;
  background-position:8px 12px,31px 44px,17px 6px;
  mask-image:linear-gradient(to bottom,black,rgba(0,0,0,.65) 70%,transparent);
}
body::after{
  background:
    radial-gradient(circle at 20% 30%,rgba(255,255,255,.8) 0 1px,transparent 2px),
    radial-gradient(circle at 74% 16%,rgba(255,255,255,.9) 0 1px,transparent 2px),
    radial-gradient(circle at 55% 70%,rgba(183,137,67,.6) 0 1px,transparent 2px);
  background-size:29px 29px,47px 47px,61px 61px;
  animation:starTwinkle 5s ease-in-out infinite alternate;
}
@keyframes starTwinkle{from{opacity:.35;transform:scale(1)}to{opacity:.8;transform:scale(1.012)}}
.preview-stage{
  background:
    radial-gradient(circle at 50% 12%,rgba(183,137,67,.15),transparent 30%),
    radial-gradient(circle,rgba(142,36,56,.22) 0 1px,transparent 1.7px),
    radial-gradient(circle,rgba(183,137,67,.30) 0 1px,transparent 1.8px),
    #eee2e2;
  background-size:auto,41px 43px,67px 71px,auto;
}

/* Ornate golden star-outline background for the editor UI. This is decorative UI only and is not written into the PDF. */
body{position:relative;isolation:isolate;overflow-x:hidden}
body::before,body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1}
body::before{opacity:.52;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='%23b78943' stroke-width='1.15' opacity='.42'%3E%3Cpath d='M32 14l3.2 10.8L46 28l-10.8 3.2L32 42l-3.2-10.8L18 28l10.8-3.2z'/%3E%3Cpath d='M128 57l2.7 9.3 9.3 2.7-9.3 2.7-2.7 9.3-2.7-9.3-9.3-2.7 9.3-2.7z'/%3E%3Cpath d='M86 126l3.8 13.2 13.2 3.8-13.2 3.8-3.8 13.2-3.8-13.2-13.2-3.8 13.2-3.8z'/%3E%3Cpath d='M151 142l2.1 7.4 7.4 2.1-7.4 2.1-2.1 7.4-2.1-7.4-7.4-2.1 7.4-2.1z'/%3E%3C/g%3E%3Cg fill='none' stroke='%23d2ad68' stroke-width='.7' opacity='.28'%3E%3Ccircle cx='67' cy='67' r='16'/%3E%3Ccircle cx='67' cy='67' r='21' stroke-dasharray='2 5'/%3E%3Ccircle cx='143' cy='24' r='10'/%3E%3Ccircle cx='22' cy='118' r='12'/%3E%3C/g%3E%3C/svg%3E");background-size:180px 180px;animation:goldenStarsDrift 26s linear infinite}
body::after{opacity:.23;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='310' height='310' viewBox='0 0 310 310'%3E%3Cg fill='none' stroke='%23a8782f' stroke-width='1.4' opacity='.5'%3E%3Cpath d='M155 25l5 17 17 5-17 5-5 17-5-17-17-5 17-5z'/%3E%3Cpath d='M52 224l3.5 12 12 3.5-12 3.5-3.5 12-3.5-12-12-3.5 12-3.5z'/%3E%3Cpath d='M265 158l3 10 10 3-10 3-3 10-3-10-10-3 10-3z'/%3E%3Cpath d='M236 56l2 7 7 2-7 2-2 7-2-7-7-2 7-2z'/%3E%3C/g%3E%3C/svg%3E");background-size:310px 310px;animation:goldenStarsGlow 7s ease-in-out infinite alternate}
.gold-starfield{position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.78;border-radius:16px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cg fill='none' stroke='%23c49a4a' stroke-width='1.2' opacity='.58'%3E%3Cpath d='M34 26l3.5 12 12 3.5-12 3.5-3.5 12-3.5-12-12-3.5 12-3.5z'/%3E%3Cpath d='M171 38l2.5 8.5 8.5 2.5-8.5 2.5-2.5 8.5-2.5-8.5-8.5-2.5 8.5-2.5z'/%3E%3Cpath d='M94 144l4 14 14 4-14 4-4 14-4-14-14-4 14-4z'/%3E%3Cpath d='M211 192l2 7 7 2-7 2-2 7-2-7-7-2 7-2z'/%3E%3C/g%3E%3Cg fill='%23b78943' opacity='.5'%3E%3Ccircle cx='129' cy='85' r='1.4'/%3E%3Ccircle cx='54' cy='184' r='1.2'/%3E%3Ccircle cx='199' cy='126' r='1.1'/%3E%3C/g%3E%3C/svg%3E");background-size:240px 240px}
.preview-stage canvas,.preview-stage .preview-overlay{z-index:2}.preview-empty{z-index:6}
@keyframes goldenStarsDrift{to{background-position:90px 90px}}
@keyframes goldenStarsGlow{from{opacity:.16}to{opacity:.34}}

/* Golden star motif INSIDE the invitation preview itself. This sits above the
   rendered PDF page but below the draggable name/address text, matching the
   motif that is also baked into exported PDFs. */
.preview-stage{position:relative}
#patternOverlay{
  position:absolute;
  pointer-events:none;
  z-index:3;
  border-radius:2px;
  overflow:hidden;
  background-color:rgba(255,248,226,.085);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23b98225' stroke-width='1.18' opacity='.72'%3E%3Cpath d='M22 13l3.6 10.4L36 27l-10.4 3.6L22 41l-3.6-10.4L8 27l10.4-3.6z'/%3E%3Cpath d='M67 55l2.5 7.5 7.5 2.5-7.5 2.5-2.5 7.5-2.5-7.5L57 65l7.5-2.5z'/%3E%3C/g%3E%3Cg fill='%23c99a43' opacity='.50'%3E%3Ccircle cx='48' cy='23' r='1.1'/%3E%3Ccircle cx='42' cy='68' r='1.1'/%3E%3C/g%3E%3C/svg%3E");
  background-size:72px 72px;
  mix-blend-mode:multiply;
}

/* Enhanced invitation sharing */
.btn.share{
  position:relative;overflow:hidden;
  background:linear-gradient(135deg,#2f7a48,#3f8d59 55%,#b78943 150%);
  color:#fff;
  box-shadow:0 10px 24px rgba(47,122,72,.22),inset 0 1px 0 rgba(255,255,255,.25);
  min-width:150px;
}
.btn.share::before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,.24) 48%,transparent 70%);transform:translateX(-120%);transition:.5s}
.btn.share:hover::before{transform:translateX(120%)}
.btn.share:disabled{opacity:.5;box-shadow:none;transform:none;cursor:not-allowed}
.share-modal-head{display:flex;gap:14px;align-items:flex-start;padding-right:34px;margin-bottom:18px}
.share-badge{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#8e2438,#b78943);color:#fff;font-size:23px;box-shadow:0 8px 20px rgba(142,36,56,.18);flex:0 0 auto}
.share-modal-head h2{margin:0;font-size:21px;color:var(--ink)}
.share-intro{margin:5px 0 0;color:var(--muted);font-size:12px;line-height:1.6}
.share-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:18px}
.share-tile{border:1px solid var(--line);background:#fff;border-radius:15px;padding:14px 15px;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:10px;transition:.2s;box-shadow:0 4px 14px rgba(50,25,30,.04)}
.share-tile:hover{transform:translateY(-2px);border-color:#d8c0a2;box-shadow:0 10px 22px rgba(50,25,30,.08)}
.share-tile span{font-weight:900;color:var(--ink);font-size:13px}.share-tile small{color:var(--muted);font-size:10px}
.share-tile.whatsapp{border-left:4px solid #25d366}.share-tile.telegram{border-left:4px solid #229ed9}.share-tile.facebook{border-left:4px solid #1877f2}.share-tile.xshare{border-left:4px solid #222}.share-tile.email{border-left:4px solid #b78943}.share-tile.copy{border-left:4px solid #8e2438}
.share-footer{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}
@media(max-width:560px){.share-grid{grid-template-columns:1fr}.share-footer{display:grid;grid-template-columns:1fr 1fr}.share-footer .btn{width:100%}}


/* Guest-only invitation share view */
.invite-only-body{margin:0;min-height:100vh;background:linear-gradient(145deg,#fffaf1,#f5eadf 55%,#efe1e3);color:#33272b}
.invite-only{min-height:100vh;box-sizing:border-box;padding:22px clamp(14px,4vw,46px) 36px;display:flex;flex-direction:column;align-items:center}
.invite-top{width:min(1080px,100%);display:flex;align-items:center;justify-content:space-between;gap:18px;padding:10px 0 18px}
.invite-kicker{font-size:10px;letter-spacing:.22em;color:#a17a35;font-weight:900}.invite-top h1{margin:5px 0 2px;font-size:24px}.invite-top p{margin:0;color:#786a6e;font-size:12px}
.invite-pages{width:min(760px,100%);background:rgba(255,255,255,.55);padding:10px;border-radius:20px;box-shadow:0 18px 60px rgba(62,38,41,.18);border:1px solid rgba(183,137,67,.25)}
.invite-pages iframe{display:block;width:100%;height:min(78vh,980px);min-height:560px;border:0;border-radius:12px;background:#fff}
.invite-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:16px}.invite-note{font-size:11px;color:#8b7b7f;text-align:center;margin:12px 0 0}
.invite-share-fallback{position:fixed;inset:0;background:rgba(35,22,27,.58);display:grid;place-items:center;padding:18px;z-index:999}
.invite-share-card{width:min(460px,100%);background:#fffaf7;border-radius:22px;padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.3);position:relative}.invite-share-card h2{margin:0 0 7px}.invite-share-card p{font-size:12px;color:#75666b;line-height:1.6}.invite-share-close{position:absolute;right:14px;top:12px;width:34px;height:34px;border:0;border-radius:50%;background:#f3e7e9;color:#8e2438;font-size:21px}.invite-share-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:15px 0}.invite-share-grid a{padding:12px;border:1px solid #e4d9d5;border-radius:12px;text-decoration:none;color:#33272b;font-weight:800;text-align:center;background:#fff}
.share-link-box{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #e2d3c7;background:#fff7ed;border-radius:14px;padding:12px 13px;margin:12px 0 16px}.share-link-box strong,.share-link-box small{display:block}.share-link-box strong{font-size:12px}.share-link-box small{font-size:10px;color:var(--muted);margin-top:3px}.share-tile.native{border-left:4px solid #8e2438;background:#fff5f5}
.copy-now{background:#8e2438;color:#fff;border-color:#8e2438}
@media(max-width:560px){.invite-top{align-items:flex-start;flex-direction:column}.invite-top .btn{width:100%}.invite-pages{padding:6px}.invite-pages iframe{height:72vh;min-height:520px}.invite-share-grid{grid-template-columns:1fr}.share-link-box{align-items:flex-start;flex-direction:column}.share-link-box .mini-btn{width:100%}}

/* v14: unified guest invitation viewer — same site, clean three-page layout */
.invite-only-body{
  margin:0;min-height:100vh;color:#33272b;
  background:
    radial-gradient(circle at 15% 10%,rgba(183,137,67,.10),transparent 24%),
    radial-gradient(circle at 86% 16%,rgba(142,36,56,.07),transparent 26%),
    linear-gradient(145deg,#fffaf0 0%,#f7efe4 48%,#f1e6e3 100%);
}
.invite-only-body::before,.invite-only-body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0}
.invite-only-body::before{opacity:.30;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='120' viewBox='0 0 150 120'%3E%3Cg fill='none' stroke='%23b99a60' stroke-width='1' opacity='.55'%3E%3Cpath d='M20 18l3 8 8 3-8 3-3 8-3-8-8-3 8-3z'/%3E%3Cpath d='M100 74l3 8 8 3-8 3-3 8-3-8-8-3 8-3z'/%3E%3C/g%3E%3C/svg%3E");background-size:150px 120px}
.invite-only-body::after{background:radial-gradient(circle,rgba(183,137,67,.18) 0 1px,transparent 1.5px);background-size:42px 42px;opacity:.20}
.guest-site{position:relative;z-index:1;width:min(1180px,100%);margin:0 auto;padding:22px clamp(14px,3vw,36px) 34px;box-sizing:border-box}
.guest-header{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:6px 0 22px}
.guest-brand{display:flex;align-items:center;gap:12px}.guest-mark{width:44px;height:44px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#8e2438,#b78943);color:#fff;font-size:21px;box-shadow:0 10px 26px rgba(142,36,56,.18)}
.guest-brand span{display:block;font-size:9px;letter-spacing:.2em;color:#a27a35;font-weight:900}.guest-brand strong{display:block;margin-top:3px;font-size:18px}.guest-brand small{display:block;margin-top:2px;color:#7e6d72;font-size:11px}
.guest-header-actions{display:flex;gap:9px}.guest-header-actions .btn{min-width:145px}
.guest-welcome{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px;padding:22px 24px;border:1px solid rgba(183,137,67,.22);border-radius:22px;background:rgba(255,252,246,.82);box-shadow:0 16px 50px rgba(67,42,43,.10);backdrop-filter:blur(8px)}
.guest-kicker{font-size:9px;letter-spacing:.22em;color:#a17a35;font-weight:900}.guest-welcome h1{margin:6px 0 3px;font-size:clamp(24px,4vw,34px);color:#4a2730}.guest-welcome p{margin:0;color:#786a6e;font-size:13px}.guest-quick{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}
.guest-viewer-shell{background:rgba(255,252,247,.90);border:1px solid rgba(183,137,67,.28);border-radius:24px;box-shadow:0 24px 70px rgba(62,38,41,.16);padding:14px;overflow:hidden}.guest-viewer-head{display:flex;justify-content:space-between;align-items:center;padding:6px 8px 14px}.guest-viewer-head strong{display:block;color:#43252d;font-size:15px}.guest-viewer-head small{display:block;color:#87777b;font-size:11px;margin-top:3px}.guest-viewer-head>span{font-size:10px;font-weight:900;color:#a17a35;border:1px solid #e3d3bd;background:#fffaf1;border-radius:999px;padding:7px 10px}
.guest-pages{display:flex;flex-direction:column;gap:18px;align-items:center}.guest-page{position:relative;width:100%;display:flex;justify-content:center;background:#eee6dc;border:1px solid #e0d2c3;border-radius:16px;padding:12px;box-sizing:border-box;box-shadow:0 12px 30px rgba(50,30,34,.10)}.guest-page canvas{display:block;max-width:100%;height:auto;border-radius:3px;box-shadow:0 10px 24px rgba(50,30,34,.14);background:#fff9e7}.guest-page-label{position:absolute;left:20px;top:20px;z-index:2;padding:6px 9px;border-radius:999px;background:rgba(55,35,39,.78);color:#fff;font-size:9px;font-weight:800;letter-spacing:.05em}
.guest-footer{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;padding:18px 4px 0;color:#8a797d;font-size:10px}.guest-footer span:first-child{font-weight:900;color:#a17a35}
@media(max-width:700px){.guest-site{padding:12px 9px 24px}.guest-header{padding-bottom:14px}.guest-brand strong{font-size:15px}.guest-header-actions .btn{min-width:0;width:100%}.guest-header-actions{flex:1}.guest-welcome{align-items:stretch;flex-direction:column;padding:17px}.guest-quick{justify-content:stretch}.guest-quick .btn{flex:1;min-width:130px}.guest-viewer-shell{padding:7px;border-radius:18px}.guest-viewer-head{padding:7px 7px 10px}.guest-page{padding:5px;border-radius:11px}.guest-page-label{left:10px;top:10px}.guest-page canvas{box-shadow:0 7px 18px rgba(50,30,34,.12)}}

/* v16 guest viewer: full invitation pages, not a mini PDF viewer */
.invite-only-body{background:linear-gradient(145deg,#fffaf1 0%,#f8efe4 52%,#f3e7e6 100%)}
.guest-site{width:min(1320px,100%);padding:20px clamp(12px,2.5vw,32px) 42px}
.guest-header{padding:6px 0 18px}
.guest-viewer-shell{padding:0;background:transparent;border:0;box-shadow:none;overflow:visible}
.guest-viewer-head{padding:8px 2px 14px}
.guest-pages{gap:28px;width:100%;align-items:stretch}
.guest-page{width:100%;padding:0;background:transparent;border:0;border-radius:0;box-shadow:none;display:block}
.guest-page canvas{display:block;width:100%!important;height:auto!important;max-width:1120px;margin:0 auto;border-radius:18px;box-shadow:0 18px 50px rgba(58,35,39,.16);background:#fffaf0}
.guest-page-label{position:static;display:block;width:max-content;margin:0 auto 8px;padding:6px 10px;border-radius:999px;background:#fffaf1;color:#9b7537;border:1px solid #e4d4bc;font-size:9px;font-weight:900;letter-spacing:.08em;box-shadow:0 5px 15px rgba(58,35,39,.06)}
.guest-footer{padding-top:24px}
@media(max-width:700px){
  .guest-site{padding:10px 8px 28px}
  .guest-header{padding-bottom:12px}
  .guest-viewer-head{padding:6px 2px 10px}
  .guest-pages{gap:18px}
  .guest-page canvas{border-radius:12px;box-shadow:0 10px 28px rgba(58,35,39,.13)}
  .guest-page-label{margin-bottom:6px}
}

```


## `js/app.js`

```js
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const TEMPLATE_URL='assets/card/final-template.pdf';
const TEMPLATE_VERSION='wedding-card-v19-main-preset-custom-share-lightweight';
// MAIN PRESET — stored in the source code, not browser storage.
// Change these values if you want a different default on every Vercel deployment/device.
const MAIN_PRESET={
  name:'',
  address:'',
  template:{
    id:'main-preset',
    name:'Main Preset',
    layout:{
      name:{page:0,x:196,y:56,maxWidth:420,fontSize:24,fontFamily:'NotoDeva',fontWeight:700,color:'#7c1f31',align:'left'},
      address:{page:0,x:246,y:32,maxWidth:365,fontSize:22,fontFamily:'NotoDeva',fontWeight:700,color:'#7c1f31',align:'left'}
    }
  }
};
const DEFAULT_LAYOUT=MAIN_PRESET.template.layout;
const FONT_OPTIONS=[
  ['NotoDeva','Noto Sans Devanagari'],
  ['Georgia','Georgia'],
  ['Times New Roman','Times New Roman'],
  ['Arial','Arial'],
  ['Trebuchet MS','Trebuchet MS']
];
const $=s=>document.querySelector(s);
const state={pdf:null,page:1,records:[],generated:null,template:{id:'main-preset',name:'Main Preset',layout:structuredClone(DEFAULT_LAYOUT)}};
let db;
let dragState=null;
let patternBytesPromise=null;
let patternDataUrl=null;

async function getPatternBytes(){
  if(!patternBytesPromise){
    patternBytesPromise=fetch('assets/card/page1-pattern.png').then(r=>{if(!r.ok)throw new Error('Pattern asset could not be loaded.');return r.arrayBuffer()}).then(b=>new Uint8Array(b));
  }
  return patternBytesPromise;
}
async function getPatternDataUrl(){
  if(!patternDataUrl){
    const bytes=await getPatternBytes();
    let s='';for(const b of bytes)s+=String.fromCharCode(b);
    patternDataUrl='data:image/png;base64,'+btoa(s);
  }
  return patternDataUrl;
}

const navButtons=[...document.querySelectorAll('.nav-btn')];
navButtons.forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
function switchView(view){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$('#'+view+'View').classList.add('active');navButtons.forEach(b=>b.classList.toggle('active',b.dataset.view===view));if(view==='cards')renderCards();}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2600)}
function showError(msg){const e=$('#formError');e.textContent=msg;e.classList.toggle('hidden',!msg)}
function normalize(v){return v.trim().replace(/\s+/g,' ').toLocaleLowerCase()}
function slugPart(v){return v.normalize('NFKC').replace(/[\\/:*?"<>|]/g,'-').replace(/[\x00-\x1F]/g,'').replace(/\s+/g,' ').trim().replace(/[. ]+$/,'')}
function filename(name,address){return `${slugPart(name)} - ${slugPart(address)} - Wedding Invitation.pdf`}
function uuid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function cloneLayout(layout){return structuredClone(layout||DEFAULT_LAYOUT)}
// Main Preset is source-controlled; browser edits do not overwrite the deployment preset.
function saveMainPreset(){} // Intentionally no-op: Main Preset is hard-coded in this source file.
function applyMainPreset(){
  const p=MAIN_PRESET;
  const name=$('#guestName');
  const address=$('#guestAddress');
  if(name && p.name!=null) name.value=p.name;
  if(address && p.address!=null) address.value=p.address;
  state.template={id:p.template.id,name:p.template.name,layout:cloneLayout(p.template.layout)};
}

function encodeShareState(obj){
  const bytes=new TextEncoder().encode(JSON.stringify(obj));
  let binary=''; bytes.forEach(b=>binary+=String.fromCharCode(b));
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodeShareState(value){
  const s=value.replace(/-/g,'+').replace(/_/g,'/');
  const padded=s+'='.repeat((4-s.length%4)%4);
  const binary=atob(padded),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
function buildShareUrl(){
  const url=new URL('/invite',window.location.origin);
  url.searchParams.set('invite','1');
  url.searchParams.set('card',encodeShareState({
    name:$('#guestName').value.trim(),
    address:$('#guestAddress').value.trim(),
    template:state.template
  }));
  return url.toString();
}
function loadSharedPreset(){
  try{
    const value=new URLSearchParams(window.location.search).get('card');
    if(!value)return false;
    const p=decodeShareState(value);
    if(p?.name!=null)$('#guestName').value=p.name;
    if(p?.address!=null)$('#guestAddress').value=p.address;
    if(p?.template?.layout?.name&&p?.template?.layout?.address){
      state.template={id:p.template.id||'shared',name:p.template.name||'Shared card layout',layout:cloneLayout(p.template.layout)};
    }
    return true;
  }catch(e){console.warn('Invalid shared card link',e);return false}
}


function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('wedding-invitation-studio',3);req.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('invitations'))d.createObjectStore('invitations',{keyPath:'id'});if(!d.objectStoreNames.contains('templates'))d.createObjectStore('templates',{keyPath:'id'});};req.onsuccess=()=>{db=req.result;resolve()};req.onerror=()=>reject(req.error)})}
function store(name,mode='readonly'){return db.transaction(name,mode).objectStore(name)}
function getAll(){return new Promise((resolve,reject)=>{const r=store('invitations').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}
function put(rec){return new Promise((resolve,reject)=>{const r=store('invitations','readwrite').put(rec);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function remove(id){return new Promise((resolve,reject)=>{const r=store('invitations','readwrite').delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function clearAll(){return new Promise((resolve,reject)=>{const r=store('invitations','readwrite').clear();r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function getTemplates(){return new Promise((resolve,reject)=>{const r=store('templates').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}
function putTemplate(t){return new Promise((resolve,reject)=>{const r=store('templates','readwrite').put(t);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function deleteTemplate(id){return new Promise((resolve,reject)=>{const r=store('templates','readwrite').delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}

async function loadTemplate(){
  const bytes=await fetch(TEMPLATE_URL).then(r=>{if(!r.ok)throw new Error('Wedding card PDF could not be loaded.');return r.arrayBuffer()});
  state.pdf=await pdfjsLib.getDocument({data:bytes.slice(0)}).promise;
  renderPage();
  return bytes;
}

function pageScaleForPreview(page){const stage=$('.preview-stage');const base=page.getViewport({scale:1});const maxW=Math.max(260,stage.clientWidth-36),maxH=Math.max(360,stage.clientHeight-36);return Math.min(maxW/base.width,maxH/base.height)}
async function renderPage(){
  if(!state.pdf)return;
  const page=await state.pdf.getPage(state.page);const scale=pageScaleForPreview(page);const viewport=page.getViewport({scale});
  const canvas=$('#previewCanvas'),ctx=canvas.getContext('2d',{alpha:false});canvas.width=Math.ceil(viewport.width*devicePixelRatio);canvas.height=Math.ceil(viewport.height*devicePixelRatio);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';
  await page.render({canvasContext:ctx,viewport,transform:[devicePixelRatio,0,0,devicePixelRatio,0,0]}).promise;
  positionPatternOverlay(viewport);
  $('#pageNumber').textContent=state.page;$('#previewEmpty').classList.add('hidden');positionPreviewOverlay(viewport,page.view[2],page.view[3]);
}
function positionPatternOverlay(viewport){
  const o=$('#patternOverlay');
  if(o)o.style.display='none';
}

function positionPreviewOverlay(viewport,pw,ph){
  const o=$('#previewOverlay');
  if(state.page!==1||(!$('#guestName').value.trim()&&!$('#guestAddress').value.trim())){o.style.display='none';return}
  o.style.display='block';o.style.width=viewport.width+'px';o.style.height=viewport.height+'px';o.style.left='50%';o.style.top='50%';o.style.transform='translate(-50%,-50%)';
  for(const key of ['name','address']){
    const cfg=state.template.layout[key],el=$('#preview'+key[0].toUpperCase()+key.slice(1));const sx=viewport.width/pw,sy=viewport.height/ph;
    Object.assign(el.style,{left:(cfg.x*sx)+'px',bottom:(cfg.y*sy)+'px',fontSize:(cfg.fontSize*sx)+'px',maxWidth:(cfg.maxWidth*sx)+'px',fontFamily:cfg.fontFamily,fontWeight:String(cfg.fontWeight),color:cfg.color,textAlign:cfg.align});
    el.textContent=$(key==='name'?'#guestName':'#guestAddress').value.trim();el.dataset.field=key;
  }
}

async function renderTextPng(text,opts){
  await document.fonts.load(`${opts.fontWeight} ${opts.fontSize}px ${opts.fontFamily}`);await document.fonts.ready;
  const scale=3,pad=8;const c=document.createElement('canvas');const ctx=c.getContext('2d');ctx.font=`${opts.fontWeight} ${opts.fontSize*scale}px ${opts.fontFamily}`;ctx.textBaseline='alphabetic';
  const max=opts.maxWidth*scale;const words=text.split(/\s+/);let lines=[],line='';
  for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width<=max||!line)line=test;else{lines.push(line);line=word}}if(line)lines.push(line);
  const lineH=opts.fontSize*scale*1.28;const width=Math.min(max,Math.max(...lines.map(x=>ctx.measureText(x).width),1))+pad*2;const height=lineH*lines.length+pad*2;c.width=Math.ceil(width);c.height=Math.ceil(height);
  ctx.font=`${opts.fontWeight} ${opts.fontSize*scale}px ${opts.fontFamily}`;ctx.fillStyle=opts.color;ctx.textBaseline='top';ctx.textAlign=opts.align==='center'?'center':opts.align==='right'?'right':'left';
  const tx=opts.align==='center'?c.width/2:opts.align==='right'?c.width-pad:pad;lines.forEach((l,i)=>ctx.fillText(l,tx,pad+i*lineH));
  return {bytes:dataUrlToBytes(c.toDataURL('image/png')),width:c.width/scale,height:c.height/scale};
}
function dataUrlToBytes(url){const b=atob(url.split(',')[1]);const out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out}

async function createPdf(name,address,layout=state.template.layout){
  if(!window.PDFLib)throw new Error('PDF engine has not loaded yet. Refresh and try again.');
  const source=await fetch(TEMPLATE_URL).then(r=>r.arrayBuffer());const doc=await PDFLib.PDFDocument.load(source,{updateMetadata:false});
  // Golden stars and the warm ivory background are already baked into the template.
  const page=doc.getPages()[0];
  const n=await renderTextPng(name,layout.name),a=await renderTextPng(address,layout.address);const ni=await doc.embedPng(n.bytes),ai=await doc.embedPng(a.bytes);
  page.drawImage(ni,{x:layout.name.x,y:layout.name.y,width:n.width,height:n.height});page.drawImage(ai,{x:layout.address.x,y:layout.address.y,width:a.width,height:a.height});
  const bytes=await doc.save({useObjectStreams:true,addDefaultPage:false});return new Blob([bytes],{type:'application/pdf'});
}

function refreshDuplicate(){const name=normalize($('#guestName').value),address=normalize($('#guestAddress').value);const n=$('#duplicateNotice');const hit=state.records.find(r=>normalize(r.name)===name&&normalize(r.address)===address);if(name&&address&&hit&&!state.editingRecordId){n.innerHTML=`An invitation with these details already exists. <button class="mini-btn" id="openDuplicate">Open existing</button>`;n.classList.remove('hidden');$('#openDuplicate').onclick=()=>openRecord(hit)}else n.classList.add('hidden')}
function syncActionButtons(){
  const ready=Boolean($('#guestName').value.trim()&&$('#guestAddress').value.trim());
  $('#downloadBtn').disabled=!ready;$('#shareBtn').disabled=!ready;
}
$('#guestName').addEventListener('input',()=>{state.dirty=true;showError('');refreshDuplicate();syncActionButtons();if(state.page===1&&state.pdf)renderPage()});
$('#guestAddress').addEventListener('input',()=>{state.dirty=true;showError('');refreshDuplicate();syncActionButtons();if(state.page===1&&state.pdf)renderPage()});
$('#prevPage').onclick=()=>{if(state.page>1){state.page--;renderPage()}};$('#nextPage').onclick=()=>{if(state.pdf&&state.page<state.pdf.numPages){state.page++;renderPage()}};
$('#clearBtn').onclick=()=>{$('#guestName').value='';$('#guestAddress').value='';state.generated=null;state.editingRecordId=null;state.dirty=true;showError('');$('#duplicateNotice').classList.add('hidden');syncActionButtons();$('#previewEmpty').classList.remove('hidden');$('#previewOverlay').style.display='none';toast('Form cleared')};
function validate(){const n=$('#guestName').value.trim(),a=$('#guestAddress').value.trim();if(!n){showError('Please enter the guest name.');$('#guestName').focus();return false}if(!a){showError('Please enter the address.');$('#guestAddress').focus();return false}showError('');return true}
function signature(){return JSON.stringify([$('#guestName').value.trim(),$('#guestAddress').value.trim(),state.template.id,state.template.name,state.template.layout])}
async function ensureGenerated(){
  if(!validate())return null;
  const sig=signature();
  if(state.generated&&!state.dirty&&state.generated.signature===sig)return state.generated;
  const name=$('#guestName').value.trim(),address=$('#guestAddress').value.trim();
  try{
    const blob=await createPdf(name,address);
    let rec=state.editingRecordId?state.records.find(r=>r.id===state.editingRecordId):null;
    if(rec){rec.name=name;rec.address=address;rec.filename=filename(name,address);rec.updatedAt=new Date().toISOString();rec.pdfBlob=blob;rec.templateVersion=TEMPLATE_VERSION;rec.templateId=state.template.id;rec.templateName=state.template.name;rec.layout=cloneLayout(state.template.layout);rec.signature=sig}
    else rec={id:uuid(),name,address,filename:filename(name,address),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),pdfBlob:blob,templateVersion:TEMPLATE_VERSION,templateId:state.template.id,templateName:state.template.name,layout:cloneLayout(state.template.layout),signature:sig};
    await put(rec);state.records=await getAll();state.generated=rec;state.dirty=false;renderCards();return rec;
  }catch(e){console.error(e);showError(e.message||'Could not create the PDF.');return null}
}

function downloadRecord(rec){
  if(!rec?.pdfBlob)return;
  downloadBlob(rec.pdfBlob,rec.filename||'Wedding Invitation.pdf');
}
function openSocialShare(rec,shareUrl){
  const text=`Wedding invitation for ${rec.name}`;
  const encText=encodeURIComponent(text);
  const encUrl=encodeURIComponent(shareUrl);
  $('#modalContent').innerHTML=`
    <div class="share-modal-head">
      <div class="share-badge">✦</div>
      <div><h2>Share wedding invitation</h2><p class="share-intro">The link below is guest-only. It opens the invitation page directly and never exposes the personalizer. On phones, <strong>Share PDF</strong> uses the device share sheet when the browser supports PDF files.</p></div>
    </div>
    <div class="share-link-box"><div><strong>Guest invitation link</strong><small>Opens the polished invitation viewer only.</small></div><button class="mini-btn copy-now" id="copyShareLink">Copy link</button></div>
    <div class="share-grid">
      <button class="share-tile whatsapp" data-share-url="https://wa.me/?text=${encText}%20${encUrl}"><span>WhatsApp</span><small>Send guest link</small></button>
      <button class="share-tile telegram" data-share-url="https://t.me/share/url?url=${encUrl}&text=${encText}"><span>Telegram</span><small>Send guest link</small></button>
      <button class="share-tile facebook" data-share-url="https://www.facebook.com/sharer/sharer.php?u=${encUrl}"><span>Facebook</span><small>Share guest link</small></button>
      <button class="share-tile xshare" data-share-url="https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}"><span>X</span><small>Share guest link</small></button>
      <button class="share-tile email" data-share-url="mailto:?subject=${encodeURIComponent('Wedding Invitation')}&body=${encodeURIComponent(text+'\n\n'+shareUrl)}"><span>Email</span><small>Send guest link</small></button>
      <button class="share-tile native" id="shareNativeAgain"><span>Share PDF to phone apps</span><small>Open the phone sharing sheet for the actual PDF</small></button>
    </div>
    <div class="share-footer"><button class="btn primary" id="openGuestView">Open guest view</button><button class="btn secondary" id="shareDownloadFallback">Download PDF</button></div>`;
  $('#modal').classList.remove('hidden');
  $('#modalContent').querySelectorAll('[data-share-url]').forEach(btn=>btn.onclick=()=>{window.open(btn.dataset.shareUrl,'_blank','noopener,noreferrer');toast('Share window opened')});
  $('#copyShareLink').onclick=async()=>{const ok=await copyText(shareUrl);toast(ok?'Guest invitation link copied':'Copy the link from the prompt')};
  $('#shareDownloadFallback').onclick=()=>downloadRecord(rec);
  $('#openGuestView').onclick=()=>{window.location.href=shareUrl};
  $('#shareNativeAgain').onclick=()=>sharePdfOrLink(rec,shareUrl,true);
  // Try once immediately, but never replace the guest link with an editor link.
  copyText(shareUrl).then(ok=>{if(ok)toast('Guest invitation link copied')}).catch(()=>{});
}
async function copyText(text){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch{}
  try{
    const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,ta.value.length);const ok=document.execCommand('copy');ta.remove();if(ok)return true;
  }catch{}
  try{window.prompt('Copy this guest-only invitation link:',text);return false}catch{return false}
}
async function sharePdfOrLink(rec,shareUrl,showFallback=false){
  const file=new File([rec.pdfBlob],rec.filename||'Wedding Invitation.pdf',{type:'application/pdf'});
  if(navigator.share){
    try{
      if(!navigator.canShare || navigator.canShare({files:[file]})){
        await navigator.share({title:`Wedding Invitation — ${rec.name}`,text:`Personalized wedding invitation for ${rec.name}.`,files:[file]});
        toast('PDF shared');return true;
      }
    }catch(e){if(e?.name==='AbortError'){toast('Share cancelled');return true}}
    // If file sharing is not supported, use the phone's normal share sheet with the guest-only link.
    try{await navigator.share({title:`Wedding Invitation — ${rec.name}`,text:`Personalized wedding invitation for ${rec.name}.`,url:shareUrl});toast('Invitation link shared');return true}catch(e){if(e?.name==='AbortError'){toast('Share cancelled');return true}}
  }
  if(showFallback)toast('Phone sharing is not available in this browser. Use the social buttons below.');
  return false;
}
async function shareRecord(rec){
  if(!rec?.pdfBlob)return;
  const shareUrl=buildShareUrl();
  rec.sharedAt=new Date().toISOString();rec.shareUrl=shareUrl;
  await put(rec);state.records=await getAll();
  // Always show our Wedding Invitation Studio share panel first.
  // The native phone share sheet is available as an explicit option inside it,
  // so the user can always see Copy Link + social options before sharing.
  openSocialShare(rec,shareUrl);
}
$('#downloadBtn').onclick=async()=>{const rec=await ensureGenerated();if(rec){downloadRecord(rec);toast('PDF downloaded and saved in Generated Cards')}};
$('#shareBtn').onclick=async()=>{const rec=await ensureGenerated();if(rec)await shareRecord(rec)};

function renderCards(){const q=normalize($('#searchInput').value||'');let arr=state.records.filter(r=>normalize(r.name).includes(q)||normalize(r.address).includes(q));const sort=$('#sortSelect').value;if(sort==='newest')arr.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));if(sort==='oldest')arr.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));if(sort==='name')arr.sort((a,b)=>a.name.localeCompare(b.name));$('#totalCount').textContent=state.records.length;const today=new Date().toISOString().slice(0,10);$('#todayCount').textContent=state.records.filter(r=>r.createdAt.slice(0,10)===today).length;const list=$('#cardsList');if(!arr.length){list.innerHTML=`<div class="empty-list">${q?'No matching invitations found.':'No invitations yet. Create your first personalized wedding invitation.'}</div>`;return}list.innerHTML=arr.map(r=>`<article class="inv-card"><div><div class="inv-name">${escapeHtml(r.name)}</div><div class="inv-address">${escapeHtml(r.address)}</div><div class="inv-meta">Created ${formatDate(r.createdAt)} · ${escapeHtml(r.filename)}${r.sharedAt?` · <span style="color:#347044;font-weight:800">Shared ${formatDate(r.sharedAt)}</span>`:''}</div></div><div class="inv-actions"><button class="mini-btn" data-act="open" data-id="${r.id}">Open</button><button class="mini-btn" data-act="download" data-id="${r.id}">Download</button><button class="mini-btn" data-act="share" data-id="${r.id}">Share</button><button class="mini-btn" data-act="edit" data-id="${r.id}">Edit</button><button class="mini-btn" data-act="delete" data-id="${r.id}">Delete</button></div></article>`).join('');list.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>cardAction(b.dataset.act,b.dataset.id))}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function formatDate(iso){return new Intl.DateTimeFormat(undefined,{day:'2-digit',month:'short',year:'numeric'}).format(new Date(iso))}
async function cardAction(act,id){const r=state.records.find(x=>x.id===id);if(!r)return;if(act==='open')openRecord(r);if(act==='download')downloadRecord(r);if(act==='share')shareRecord(r);if(act==='edit')editRecord(r);if(act==='delete'){if(confirm(`Delete invitation for ${r.name}?`)){await remove(id);state.records=await getAll();renderCards();toast('Invitation deleted')}}}
function openRecord(r){const url=URL.createObjectURL(r.pdfBlob);$('#modalContent').innerHTML=`<h2>${escapeHtml(r.name)}</h2><p>${escapeHtml(r.address)}</p><p class="inv-meta">${formatDate(r.createdAt)} · ${escapeHtml(r.filename)}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn primary" id="mDownload">Download</button><button class="btn share" id="mShare">Share</button><button class="btn ghost" id="mEdit">Edit</button></div><div style="margin-top:18px;border-radius:14px;overflow:hidden;border:1px solid var(--line)"><iframe title="Invitation PDF" src="${url}" style="width:100%;height:520px;border:0"></iframe></div>`;$('#modal').classList.remove('hidden');$('#mDownload').onclick=()=>downloadRecord(r);$('#mShare').onclick=()=>shareRecord(r);$('#mEdit').onclick=()=>{closeModal();editRecord(r)}}
function closeModal(){$('#modal').classList.add('hidden');$('#modalContent').innerHTML=''}$('#modalClose').onclick=closeModal;$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
function editRecord(r){switchView('create');state.editingRecordId=r.id;state.generated=r;state.dirty=true;$('#guestName').value=r.name;$('#guestAddress').value=r.address;if(r.layout)state.template={id:r.templateId||'record',name:r.templateName||'Saved card layout',layout:cloneLayout(r.layout)};syncEditorFromTemplate();syncActionButtons();renderPage();refreshDuplicate();toast('Edit the details, then Download or Share to save the update')}
$('#newCardBtn').onclick=()=>{switchView('create');$('#clearBtn').click();applyMainPreset();syncEditorFromTemplate();syncActionButtons()};$('#searchInput').oninput=renderCards;$('#sortSelect').onchange=renderCards;

function templateById(id,list){return list.find(t=>t.id===id)}
async function refreshTemplateSelect(){const list=await getTemplates();const sel=$('#templateSelect');sel.innerHTML=`<option value="main-preset">Main Preset</option>`+list.map(t=>`<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)}</option>`).join('');sel.value=state.template.id==='main-preset'?'main-preset':state.template.id}
function fieldConfig(field){return state.template.layout[field]}
function syncEditorFromTemplate(){
  $('#templateName').value=state.template.name;
  for(const field of ['name','address']){
    const c=fieldConfig(field);for(const key of ['x','y','fontSize','maxWidth']){$(`#${field}${key[0].toUpperCase()+key.slice(1)}`).value=c[key];$(`#${field}${key[0].toUpperCase()+key.slice(1)}Value`).textContent=Math.round(c[key])}
    $(`#${field}Font`).value=c.fontFamily;$(`#${field}Weight`).value=String(c.fontWeight);$(`#${field}Align`).value=c.align;$(`#${field}Color`).value=c.color;
  }
  $('#dragHint').textContent='Drag the name or address directly on the card preview.';renderPage();
}
function bindRange(field,key){const id=field+key[0].toUpperCase()+key.slice(1);const input=$('#'+id),out=$('#'+id+'Value');input.addEventListener('input',()=>{state.template.layout[field][key]=Number(input.value);state.dirty=true;out.textContent=Math.round(Number(input.value));renderPage();syncActionButtons();saveMainPreset()})}
for(const f of ['name','address']){for(const k of ['x','y','fontSize','maxWidth'])bindRange(f,k);$('#'+f+'Font').addEventListener('change',e=>{state.template.layout[f].fontFamily=e.target.value;state.dirty=true;renderPage();saveMainPreset()});$('#'+f+'Weight').addEventListener('change',e=>{state.template.layout[f].fontWeight=Number(e.target.value);state.dirty=true;renderPage();saveMainPreset()});$('#'+f+'Align').addEventListener('change',e=>{state.template.layout[f].align=e.target.value;state.dirty=true;renderPage();saveMainPreset()});$('#'+f+'Color').addEventListener('input',e=>{state.template.layout[f].color=e.target.value;state.dirty=true;renderPage();saveMainPreset()})}
$('#resetLayout').onclick=()=>{applyMainPreset();state.dirty=true;syncEditorFromTemplate();toast('Main Preset restored')};
$('#saveTemplate').onclick=async()=>{const name=$('#templateName').value.trim()||'Untitled card layout';const id=(state.template.id==='main-preset'||state.template.id==='default')?uuid():state.template.id;state.template={id,name,layout:cloneLayout(state.template.layout)};state.dirty=true;await putTemplate(state.template);await refreshTemplateSelect();$('#templateSelect').value=id;toast('Template saved locally')};
$('#deleteTemplate').onclick=async()=>{const id=$('#templateSelect').value;if(id==='main-preset'||id==='default'){toast('The Main Preset is part of the code and cannot be deleted.');return}if(confirm('Delete this saved layout?')){await deleteTemplate(id);applyMainPreset();state.dirty=true;syncEditorFromTemplate();await refreshTemplateSelect();toast('Main Preset restored')}};
$('#templateSelect').onchange=async e=>{const id=e.target.value;if(id==='main-preset'){applyMainPreset();state.dirty=true;syncEditorFromTemplate();return}const t=templateById(id,await getTemplates());if(t){state.template={id:t.id,name:t.name,layout:cloneLayout(t.layout)};state.dirty=true;syncEditorFromTemplate();toast(`Loaded ${t.name}`)}};
$('#fontReset').onclick=()=>{for(const f of ['name','address']){state.template.layout[f].fontFamily='NotoDeva';state.template.layout[f].fontWeight=700;state.template.layout[f].align='left';state.template.layout[f].color='#7c1f31';state.dirty=true}syncEditorFromTemplate();toast('Font settings reset')};

function attachDrag(el,field){el.addEventListener('pointerdown',e=>{if(state.page!==1)return;const canvas=$('#previewCanvas');const rect=canvas.getBoundingClientRect();const pageW=state.pdf.getPage(1).view[2],pageH=state.pdf.getPage(1).view[3];const sx=rect.width/pageW,sy=rect.height/pageH;dragState={field,sx,sy,startX:e.clientX,startY:e.clientY,origX:state.template.layout[field].x,origY:state.template.layout[field].y};el.setPointerCapture(e.pointerId);el.classList.add('dragging')});el.addEventListener('pointermove',e=>{if(!dragState||dragState.field!==field)return;const dx=(e.clientX-dragState.startX)/dragState.sx,dy=(e.clientY-dragState.startY)/dragState.sy;state.template.layout[field].x=Math.max(0,Math.round(dragState.origX+dx));state.template.layout[field].y=Math.max(0,Math.round(dragState.origY-dy));syncEditorFromTemplate()});el.addEventListener('pointerup',()=>{dragState=null;el.classList.remove('dragging');state.dirty=true;syncActionButtons()});el.addEventListener('pointercancel',()=>{dragState=null;el.classList.remove('dragging')})}
attachDrag($('#previewName'),'name');attachDrag($('#previewAddress'),'address');

async function exportCsv(){const rows=[['Guest Name','Address','Created','Updated','Filename','Template'],...state.records.map(r=>[r.name,r.address,r.createdAt,r.updatedAt,r.filename,r.templateName||'Default Card Layout'])];const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');downloadBlob(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'wedding-invitations.csv')}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
async function exportBackup(){if(!window.JSZip){toast('Backup library is still loading. Try again.');return}const zip=new JSZip();zip.file('guest-records.json',JSON.stringify(state.records.map(({pdfBlob,...meta})=>meta),null,2));zip.file('templates.json',JSON.stringify(await getTemplates(),null,2));const folder=zip.folder('pdf');state.records.forEach((r,i)=>folder.file(`${String(i+1).padStart(3,'0')}-${safeFile(r.filename)}`,r.pdfBlob));const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'});downloadBlob(blob,`Wedding-Invitation-Backup-${new Date().toISOString().slice(0,10)}.zip`);toast('Backup exported')}
function safeFile(s){return s.replace(/[\\/:*?"<>|]/g,'-')}
async function importBackup(file){if(!window.JSZip){toast('Backup library is still loading.');return}try{const zip=await JSZip.loadAsync(file);const metaText=await zip.file('guest-records.json')?.async('string');if(!metaText)throw new Error('guest-records.json is missing.');const metas=JSON.parse(metaText);const templatesText=await zip.file('templates.json')?.async('string');if(templatesText){const ts=JSON.parse(templatesText);for(const t of ts||[])await putTemplate(t)}const pdfFiles=Object.values(zip.files).filter(x=>x.name.startsWith('pdf/')&&!x.dir);let imported=0;for(const m of metas){const match=pdfFiles.find(f=>f.name.toLowerCase().endsWith(safeFile(m.filename).toLowerCase()));if(!match)continue;const blob=new Blob([await match.async('uint8array')],{type:'application/pdf'});await put({...m,pdfBlob:blob,updatedAt:m.updatedAt||m.createdAt||new Date().toISOString()});imported++}state.records=await getAll();await refreshTemplateSelect();renderCards();toast(`${imported} invitation${imported===1?'':'s'} imported`)}catch(e){toast(e.message||'Could not import backup')}}
$('#exportCsv').onclick=exportCsv;$('#exportBackup').onclick=exportBackup;$('#importBackup').onclick=()=>$('#backupFile').click();$('#backupFile').onchange=e=>{const f=e.target.files[0];if(f)importBackup(f);e.target.value=''};$('#clearData').onclick=async()=>{if(confirm('Delete all locally stored invitations and PDFs from this browser?')){await clearAll();state.records=[];renderCards();toast('All local invitation data cleared')}};

function isInviteOnly(){return new URLSearchParams(window.location.search).get('invite')==='1'||window.location.pathname.replace(/\/$/,'')==='/invite'}
async function renderInviteOnly(){
  const value=new URLSearchParams(window.location.search).get('card');
  if(!value)throw new Error('This invitation link is incomplete.');
  const p=decodeShareState(value);
  const name=p?.name||'';const address=p?.address||'';
  const layout=p?.template?.layout?.name&&p?.template?.layout?.address?cloneLayout(p.template.layout):cloneLayout(DEFAULT_LAYOUT);
  const bytes=await fetch(TEMPLATE_URL).then(r=>r.arrayBuffer());
  const doc=await PDFLib.PDFDocument.load(bytes,{updateMetadata:false});
  const n=await renderTextPng(name,layout.name),a=await renderTextPng(address,layout.address);
  const ni=await doc.embedPng(n.bytes),ai=await doc.embedPng(a.bytes);const pg=doc.getPages()[0];
  pg.drawImage(ni,{x:layout.name.x,y:layout.name.y,width:n.width,height:n.height});
  pg.drawImage(ai,{x:layout.address.x,y:layout.address.y,width:a.width,height:a.height});
  const out=new Blob([await doc.save({useObjectStreams:true,addDefaultPage:false})],{type:'application/pdf'});
  const url=URL.createObjectURL(out);const shareUrl=window.location.href;const fileName=filename(name,address);
  document.body.className='invite-only-body';
  document.body.innerHTML=`<main class="guest-site">
    <header class="guest-header">
      <div class="guest-brand"><div class="guest-mark">✦</div><div><span>WEDDING INVITATION</span><strong>Wedding Invitation Studio</strong><small>Guest invitation view</small></div></div>
      <div class="guest-header-actions"><button id="inviteShare" class="btn share">↗ Share</button></div>
    </header>
    <section class="guest-welcome">
      <div><div class="guest-kicker">YOU ARE INVITED</div><h1>${escapeHtml(name)}</h1><p>${escapeHtml(address)}</p></div>
      <div class="guest-quick"><button id="inviteDownload" class="btn secondary">Download PDF</button><button id="inviteCopy" class="btn ghost">Copy invitation link</button></div>
    </section>
    <section class="guest-viewer-shell"><div class="guest-viewer-head"><div><strong>Your invitation</strong><small>All three pages · optimized for phone and desktop</small></div><span>3 pages</span></div><div id="guestPages" class="guest-pages"></div></section>
    <footer class="guest-footer"><span>Wedding Invitation Studio</span><span>Guest-only link · Personalizer is not included</span></footer>
  </main>`;
  const download=()=>downloadBlob(out,fileName);
  $('#inviteDownload').onclick=download;
  $('#inviteCopy').onclick=async()=>toast(await copyText(shareUrl)?'Invitation link copied':'Copy the link from the prompt');
  $('#inviteShare').onclick=async()=>{const rec={name,address,pdfBlob:out,filename:fileName};openInviteSharePanel(name,shareUrl,out,fileName,rec)};

  const pdf=await pdfjsLib.getDocument({data:await out.arrayBuffer()}).promise;
  const host=$('#guestPages');
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const base=page.getViewport({scale:1});
    const maxW=Math.min(1120,Math.max(300,host.clientWidth));
    const scale=maxW/base.width;
    const viewport=page.getViewport({scale});
    const card=document.createElement('article');card.className='guest-page';
    const label=document.createElement('div');label.className='guest-page-label';label.textContent=`Page ${i} of ${pdf.numPages}`;
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width*devicePixelRatio);canvas.height=Math.ceil(viewport.height*devicePixelRatio);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';
    const ctx=canvas.getContext('2d',{alpha:false});
    await page.render({canvasContext:ctx,viewport,transform:[devicePixelRatio,0,0,devicePixelRatio,0,0]}).promise;
    card.append(label,canvas);host.appendChild(card);
  }
  window.addEventListener('resize',()=>{clearTimeout(window._guestResize);window._guestResize=setTimeout(()=>location.reload(),300)});
}

function openInviteSharePanel(name,shareUrl,blob,fileName,rec){
  const text=`Wedding invitation for ${name}`;
  const encText=encodeURIComponent(text),encUrl=encodeURIComponent(shareUrl);
  const modal=document.createElement('div');modal.className='invite-share-fallback';
  modal.innerHTML=`<div class="invite-share-card studio-share-card"><button class="invite-share-close">×</button><div class="share-modal-head"><div class="share-badge">✦</div><div><h2>Share wedding invitation</h2><p class="share-intro">Choose how you want to send this guest-only invitation. The recipient will see the invitation viewer, not the personalizer.</p></div></div><div class="share-link-box"><div><strong>Guest invitation link</strong><small>Opens the invitation viewer directly.</small></div><button class="mini-btn copy-now" id="guestCopyLink">Copy link</button></div><div class="share-grid"><button class="share-tile whatsapp" data-url="https://wa.me/?text=${encText}%20${encUrl}"><span>WhatsApp</span><small>Send guest link</small></button><button class="share-tile telegram" data-url="https://t.me/share/url?url=${encUrl}&text=${encText}"><span>Telegram</span><small>Send guest link</small></button><button class="share-tile facebook" data-url="https://www.facebook.com/sharer/sharer.php?u=${encUrl}"><span>Facebook</span><small>Share guest link</small></button><button class="share-tile xshare" data-url="https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}"><span>X</span><small>Share guest link</small></button><button class="share-tile email" data-url="mailto:?subject=${encodeURIComponent('Wedding Invitation')}&body=${encodeURIComponent(text+'\n\n'+shareUrl)}"><span>Email</span><small>Send guest link</small></button><button class="share-tile native" id="guestNativeShare"><span>Share PDF to phone apps</span><small>Open the phone share sheet</small></button></div><div class="share-footer"><button class="btn primary" id="guestOpenView">Open guest view</button><button class="btn secondary" id="guestDownload">Download PDF</button></div></div>`;
  document.body.appendChild(modal);
  modal.querySelector('.invite-share-close').onclick=()=>modal.remove();
  modal.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>window.open(b.dataset.url,'_blank','noopener,noreferrer'));
  modal.querySelector('#guestCopyLink').onclick=async()=>toast(await copyText(shareUrl)?'Invitation link copied':'Copy the link from the prompt');
  modal.querySelector('#guestOpenView').onclick=()=>{modal.remove();window.location.href=shareUrl};
  modal.querySelector('#guestDownload').onclick=()=>downloadBlob(blob,fileName);
  modal.querySelector('#guestNativeShare').onclick=async()=>{await sharePdfOrLink(rec,shareUrl,true)};
}

function openInviteShareFallback(name,shareUrl,blob,fileName){
  const enc=encodeURIComponent(shareUrl),txt=encodeURIComponent(`Wedding invitation for ${name}`);
  const modal=document.createElement('div');modal.className='invite-share-fallback';modal.innerHTML=`<div class="invite-share-card"><button class="invite-share-close">×</button><h2>Share invitation</h2><p>Direct PDF sharing is not available in this browser. These options share the guest-only invitation link.</p><div class="invite-share-grid"><a href="https://wa.me/?text=${txt}%20${enc}" target="_blank" rel="noopener">WhatsApp</a><a href="https://t.me/share/url?url=${enc}&text=${txt}" target="_blank" rel="noopener">Telegram</a><a href="https://www.facebook.com/sharer/sharer.php?u=${enc}" target="_blank" rel="noopener">Facebook</a><a href="mailto:?subject=${encodeURIComponent('Wedding Invitation')}&body=${encodeURIComponent('Wedding invitation for '+name+'\n\n'+shareUrl)}">Email</a></div><button class="btn secondary" id="inviteFallbackDownload">Download PDF</button></div>`;
  document.body.appendChild(modal);modal.querySelector('.invite-share-close').onclick=()=>modal.remove();modal.querySelector('#inviteFallbackDownload').onclick=()=>downloadBlob(blob,fileName);
}

(async()=>{
  try{
    if(isInviteOnly()){await renderInviteOnly();return;}
    await openDB();
    state.records=await getAll();
    const hadShared=loadSharedPreset();
    if(!hadShared)applyMainPreset();
    await refreshTemplateSelect();
    syncEditorFromTemplate();
    await loadTemplate();
    renderCards();
    syncEditorFromTemplate();
    syncActionButtons();
    if(hadShared){
      state.dirty=true;
      toast('Shared invitation loaded');
    }
  }catch(e){console.error(e);showError('The application could not initialize. Please run it from a local web server and refresh.')}
})();
window.addEventListener('resize',()=>{clearTimeout(window._rt);window._rt=setTimeout(()=>renderPage(),150)});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}))}

```


## `service-worker.js`

```js
const CACHE='wedding-studio-v19-main-preset-custom-share-lightweight';
const CORE=['./','./index.html','./css/styles.css','./js/app.js?v=19','./manifest.webmanifest','./assets/card/final-template.pdf','./assets/fonts/NotoSansDevanagari-Regular.ttf','./assets/fonts/NotoSansDevanagari-Bold.ttf','./assets/icons/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin && (u.pathname==='/'||u.pathname==='/index.html'||u.pathname==='/js/app.js'||u.pathname==='/service-worker.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(u.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>cached)));
});

```


## `vercel.json`

```json
{
  "rewrites": [
    { "source": "/invite", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/index.html", "headers": [{ "key": "Cache-Control", "value": "no-store, max-age=0" }] },
    { "source": "/js/app.js", "headers": [{ "key": "Cache-Control", "value": "no-store, max-age=0" }] },
    { "source": "/service-worker.js", "headers": [{ "key": "Cache-Control", "value": "no-store, max-age=0" }] }
  ]
}

```


## `manifest.webmanifest`

```webmanifest
{"name":"Wedding Invitation Studio","short_name":"Wedding Studio","start_url":"./","display":"standalone","background_color":"#fffaf7","theme_color":"#8e2438","description":"Private local-first wedding invitation personalizer","icons":[{"src":"assets/icons/icon.svg","sizes":"any","type":"image/svg+xml","purpose":"any maskable"}]}

```
