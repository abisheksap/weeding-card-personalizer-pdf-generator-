import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const TEMPLATE_URL='assets/card/wedding-invitation.pdf';
const TEMPLATE_VERSION='wedding-card-v3-handwritten-glitter';
const NAME_FONT='Kalam';
const NAME_COLOR='#7b1f35';
const GLITTER_COLORS=['#d7b46a','#f3dfaa','#fff4cf','#b8864a'];
// Calibrated for the supplied 3-page card. Coordinates are in source-PDF points.
const LAYOUT={name:{page:0,x:760,y:700,maxWidth:1550,fontSize:62},address:{page:0,x:945,y:525,maxWidth:1300,fontSize:54}};
const $=s=>document.querySelector(s);
const state={pdf:null,page:1,records:[],generated:null,fontStyle:'kalam',inkFinish:'glitter'};
let db;

const navButtons=[...document.querySelectorAll('.nav-btn')];
navButtons.forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
function switchView(view){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active')); $('#'+view+'View').classList.add('active'); navButtons.forEach(b=>b.classList.toggle('active',b.dataset.view===view)); if(view==='cards')renderCards();}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2600)}
function showError(msg){const e=$('#formError');e.textContent=msg;e.classList.toggle('hidden',!msg)}
function normalize(v){return v.trim().replace(/\s+/g,' ').toLocaleLowerCase();}
function slugPart(v){return v.normalize('NFKC').replace(/[\\/:*?"<>|]/g,'-').replace(/[\x00-\x1F]/g,'').replace(/\s+/g,' ').trim().replace(/[. ]+$/,'')}
function filename(name,address){return `${slugPart(name)} - ${slugPart(address)} - Wedding Invitation.pdf`}
function uuid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}

function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('wedding-invitation-studio',2);req.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('invitations'))d.createObjectStore('invitations',{keyPath:'id'});};req.onsuccess=()=>{db=req.result;resolve()};req.onerror=()=>reject(req.error)});}
function getAll(){return new Promise((resolve,reject)=>{const r=db.transaction('invitations','readonly').objectStore('invitations').getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}
function put(rec){return new Promise((resolve,reject)=>{const r=db.transaction('invitations','readwrite').objectStore('invitations').put(rec);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function remove(id){return new Promise((resolve,reject)=>{const r=db.transaction('invitations','readwrite').objectStore('invitations').delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function clearAll(){return new Promise((resolve,reject)=>{const r=db.transaction('invitations','readwrite').objectStore('invitations').clear();r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}

async function loadTemplate(){
  const bytes=await fetch(TEMPLATE_URL).then(r=>{if(!r.ok)throw new Error('Wedding card PDF could not be loaded.');return r.arrayBuffer()});
  state.pdf=await pdfjsLib.getDocument({data:bytes.slice(0)}).promise;
  renderPage();
  return bytes;
}

function pageScaleForPreview(page){
  const stage=$('.preview-stage'); const base=page.getViewport({scale:1});
  const maxW=Math.max(260,stage.clientWidth-36), maxH=Math.max(360,stage.clientHeight-36);
  return Math.min(maxW/base.width,maxH/base.height);
}
async function renderPage(){
  if(!state.pdf)return; const page=await state.pdf.getPage(state.page); const scale=pageScaleForPreview(page); const viewport=page.getViewport({scale});
  const canvas=$('#previewCanvas'),ctx=canvas.getContext('2d',{alpha:false});canvas.width=Math.ceil(viewport.width*devicePixelRatio);canvas.height=Math.ceil(viewport.height*devicePixelRatio);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';
  await page.render({canvasContext:ctx,viewport,transform:[devicePixelRatio,0,0,devicePixelRatio,0,0]}).promise;
  $('#pageNumber').textContent=state.page; $('#previewEmpty').classList.add('hidden');
  positionPreviewOverlay(viewport,page.view[2],page.view[3]);
}
function currentFontWeight(){return state.fontStyle==='kalam-bold'?700:700}
function closeCustomize(){const d=$('#customizeDetails');if(d)d.removeAttribute('open')}
function stylePreviewText(el){el.style.fontFamily=`${NAME_FONT}, cursive`;el.style.fontWeight=currentFontWeight();el.style.color=NAME_COLOR;el.style.textShadow=state.inkFinish==='glitter'?'0 0 .6px #f3dfaa, 0 0 1.4px rgba(215,180,106,.55)':'0 0 .25px #7b1f35'}
function positionPreviewOverlay(viewport,pw,ph){
  const o=$('#previewOverlay'); if(state.page!==1 || !$('#guestName').value.trim()){o.style.display='none';return} o.style.display='block';o.style.width=viewport.width+'px';o.style.height=viewport.height+'px';o.style.left='50%';o.style.top='50%';o.style.transform='translate(-50%,-50%)';
  const n=$('#previewName'),a=$('#previewAddress');
  const sx=viewport.width/pw, sy=viewport.height/ph;
  Object.assign(n.style,{left:(LAYOUT.name.x*sx)+'px',bottom:(LAYOUT.name.y*sy)+'px',fontSize:(LAYOUT.name.fontSize*sx)+'px',maxWidth:(LAYOUT.name.maxWidth*sx)+'px'});
  Object.assign(a.style,{left:(LAYOUT.address.x*sx)+'px',bottom:(LAYOUT.address.y*sy)+'px',fontSize:(LAYOUT.address.fontSize*sx)+'px',maxWidth:(LAYOUT.address.maxWidth*sx)+'px'});
  n.textContent=$('#guestName').value.trim();a.textContent=$('#guestAddress').value.trim();stylePreviewText(n);stylePreviewText(a);
}

function seededRandom(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}}
async function renderTextPng(text,opts){
  const weight=currentFontWeight();
  await document.fonts.load(`${weight} ${opts.fontSize}px ${NAME_FONT}`); await document.fonts.ready;
  const scale=5,pad=24; const c=document.createElement('canvas');const ctx=c.getContext('2d');
  ctx.font=`${weight} ${opts.fontSize*scale}px ${NAME_FONT}`;ctx.textBaseline='alphabetic';
  const max=opts.maxWidth*scale; const words=text.split(/\s+/); let lines=[],line='';
  for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width<=max||!line)line=test;else{lines.push(line);line=word}} if(line)lines.push(line);
  const lineH=opts.fontSize*scale*1.30; const width=Math.min(max,Math.max(...lines.map(x=>ctx.measureText(x).width),1))+pad*2; const height=lineH*lines.length+pad*2;
  c.width=Math.ceil(width);c.height=Math.ceil(height);ctx.font=`${weight} ${opts.fontSize*scale}px ${NAME_FONT}`;ctx.textBaseline='top';
  ctx.fillStyle=NAME_COLOR;ctx.shadowColor='rgba(115,22,45,.16)';ctx.shadowBlur=0.9*scale;ctx.shadowOffsetY=.35*scale;
  lines.forEach((l,i)=>ctx.fillText(l,pad,pad+i*lineH));
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  if(state.inkFinish==='glitter'){
    const seed=[...text].reduce((a,ch)=>((a*31+ch.codePointAt(0))>>>0),2166136261);const rand=seededRandom(seed);
    ctx.globalCompositeOperation='source-atop';
    const dots=Math.max(18,Math.floor((width/scale)*.11));
    for(let i=0;i<dots;i++){
      const x=pad+rand()*(Math.max(1,width-pad*2)); const y=pad+rand()*(Math.max(1,height-pad*2));
      const r=(.28+rand()*.8)*scale; ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=GLITTER_COLORS[i%GLITTER_COLORS.length];ctx.globalAlpha=.38+rand()*.42;ctx.fill();
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  }
  return {bytes:dataUrlToBytes(c.toDataURL('image/png')),width:c.width/scale,height:c.height/scale};
}
function dataUrlToBytes(url){const b=atob(url.split(',')[1]);const out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out}

async function createPdf(name,address){
  if(!window.PDFLib)throw new Error('PDF engine has not loaded yet. Refresh and try again.');
  const source=await fetch(TEMPLATE_URL).then(r=>r.arrayBuffer()); const doc=await PDFLib.PDFDocument.load(source,{updateMetadata:false});
  const page=doc.getPages()[0];
  const n=await renderTextPng(name,LAYOUT.name);const a=await renderTextPng(address,LAYOUT.address);
  const ni=await doc.embedPng(n.bytes), ai=await doc.embedPng(a.bytes);
  page.drawImage(ni,{x:LAYOUT.name.x,y:LAYOUT.name.y,width:n.width,height:n.height});
  page.drawImage(ai,{x:LAYOUT.address.x,y:LAYOUT.address.y,width:a.width,height:a.height});
  const bytes=await doc.save({useObjectStreams:true,addDefaultPage:false}); return new Blob([bytes],{type:'application/pdf'});
}

async function refreshDuplicate(){const name=normalize($('#guestName').value),address=normalize($('#guestAddress').value);const n=$('#duplicateNotice');const hit=state.records.find(r=>normalize(r.name)===name&&normalize(r.address)===address);if(name&&address&&hit){n.innerHTML=`An invitation with these details already exists. <button class="mini-btn" id="openDuplicate">Open existing</button>`;n.classList.remove('hidden');$('#openDuplicate').onclick=()=>openRecord(hit)}else n.classList.add('hidden')}
$('#guestName').addEventListener('input',()=>{showError('');refreshDuplicate();if(state.page===1&&state.pdf)renderPage()});$('#guestAddress').addEventListener('input',()=>{showError('');refreshDuplicate();if(state.page===1&&state.pdf)renderPage()});
$('#fontStyle').addEventListener('change',e=>{state.fontStyle=e.target.value;closeCustomize();if(state.page===1&&state.pdf)renderPage()});
$('#inkFinish').addEventListener('change',e=>{state.inkFinish=e.target.value;closeCustomize();if(state.page===1&&state.pdf)renderPage()});
$('#customizeDetails').addEventListener('toggle',e=>{if(e.target.open){document.addEventListener('click',closeOnOutsideCustomize,{once:true});}});
function closeOnOutsideCustomize(e){const d=$('#customizeDetails');if(d&&d.open&&!d.contains(e.target))d.removeAttribute('open');}

$('#prevPage').onclick=()=>{if(state.page>1){state.page--;renderPage()}};$('#nextPage').onclick=()=>{if(state.pdf&&state.page<state.pdf.numPages){state.page++;renderPage()}};
$('#previewBtn').onclick=()=>{if(validate())renderPage()};
$('#clearBtn').onclick=()=>{$('#guestName').value='';$('#guestAddress').value='';showError('');$('#duplicateNotice').classList.add('hidden');closeCustomize();$('#downloadBtn').disabled=true;$('#shareBtn').disabled=true;$('#previewEmpty').classList.remove('hidden');$('#previewOverlay').style.display='none';toast('Form cleared')};
function validate(){const n=$('#guestName').value.trim(),a=$('#guestAddress').value.trim();if(!n){showError('Please enter the guest name.');$('#guestName').focus();return false}if(!a){showError('Please enter the address.');$('#guestAddress').focus();return false}showError('');return true}
async function generate(){if(!validate())return;const name=$('#guestName').value.trim(),address=$('#guestAddress').value.trim();const btn=$('#generateBtn');btn.disabled=true;btn.textContent='Generating…';try{const blob=await createPdf(name,address);const rec={id:uuid(),name,address,filename:filename(name,address),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),pdfBlob:blob,templateVersion:TEMPLATE_VERSION};await put(rec);state.records=await getAll();state.generated=rec;$('#downloadBtn').disabled=false;$('#shareBtn').disabled=false;closeCustomize();toast('Invitation generated and saved locally');renderCards();}catch(e){console.error(e);showError(e.message||'Could not generate the PDF.');}finally{btn.disabled=false;btn.textContent='Generate PDF'}}
$('#generateBtn').onclick=generate;
function downloadRecord(rec){const url=URL.createObjectURL(rec.pdfBlob);const a=document.createElement('a');a.href=url;a.download=rec.filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$('#downloadBtn').onclick=()=>{if(state.generated)downloadRecord(state.generated)};
async function shareRecord(rec){if(!navigator.share||!navigator.canShare||!navigator.canShare({files:[new File([rec.pdfBlob],rec.filename,{type:'application/pdf'})]})){downloadRecord(rec);toast('File sharing is not supported here. The PDF was downloaded instead.');return}try{const file=new File([rec.pdfBlob],rec.filename,{type:'application/pdf'});await navigator.share({files:[file],title:rec.name,text:'Wedding Invitation'});}catch(e){if(e.name!=='AbortError')toast('Sharing was not completed.')}}
$('#shareBtn').onclick=()=>{if(state.generated)shareRecord(state.generated)};

function renderCards(){const q=normalize($('#searchInput').value||'');let arr=state.records.filter(r=>normalize(r.name).includes(q)||normalize(r.address).includes(q));const sort=$('#sortSelect').value;if(sort==='newest')arr.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));if(sort==='oldest')arr.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));if(sort==='name')arr.sort((a,b)=>a.name.localeCompare(b.name));$('#totalCount').textContent=state.records.length;const today=new Date().toISOString().slice(0,10);$('#todayCount').textContent=state.records.filter(r=>r.createdAt.slice(0,10)===today).length;const list=$('#cardsList');if(!arr.length){list.innerHTML=`<div class="empty-list">${q?'No matching invitations found.':'No invitations yet. Create your first personalized wedding invitation.'}</div>`;return}list.innerHTML=arr.map(r=>`<article class="inv-card"><div><div class="inv-name">${escapeHtml(r.name)}</div><div class="inv-address">${escapeHtml(r.address)}</div><div class="inv-meta">Created ${formatDate(r.createdAt)} · ${escapeHtml(r.filename)}</div></div><div class="inv-actions"><button class="mini-btn" data-act="open" data-id="${r.id}">Open</button><button class="mini-btn" data-act="download" data-id="${r.id}">Download</button><button class="mini-btn" data-act="share" data-id="${r.id}">Share</button><button class="mini-btn" data-act="edit" data-id="${r.id}">Edit</button><button class="mini-btn" data-act="delete" data-id="${r.id}">Delete</button></div></article>`).join('');list.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>cardAction(b.dataset.act,b.dataset.id))}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function formatDate(iso){return new Intl.DateTimeFormat(undefined,{day:'2-digit',month:'short',year:'numeric'}).format(new Date(iso))}
async function cardAction(act,id){const r=state.records.find(x=>x.id===id);if(!r)return;if(act==='open')openRecord(r);if(act==='download')downloadRecord(r);if(act==='share')shareRecord(r);if(act==='edit')editRecord(r);if(act==='delete'){if(confirm(`Delete invitation for ${r.name}?`)){await remove(id);state.records=await getAll();renderCards();toast('Invitation deleted')}}}
function openRecord(r){const url=URL.createObjectURL(r.pdfBlob);$('#modalContent').innerHTML=`<h2>${escapeHtml(r.name)}</h2><p>${escapeHtml(r.address)}</p><p class="inv-meta">${formatDate(r.createdAt)} · ${escapeHtml(r.filename)}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn primary" id="mDownload">Download</button><button class="btn share" id="mShare">Share</button><button class="btn ghost" id="mEdit">Edit</button></div><div style="margin-top:18px;border-radius:14px;overflow:hidden;border:1px solid var(--line)"><iframe title="Invitation PDF" src="${url}" style="width:100%;height:520px;border:0"></iframe></div>`;$('#modal').classList.remove('hidden');$('#mDownload').onclick=()=>downloadRecord(r);$('#mShare').onclick=()=>shareRecord(r);$('#mEdit').onclick=()=>{closeModal();editRecord(r)}}
function closeModal(){$('#modal').classList.add('hidden');$('#modalContent').innerHTML=''}$('#modalClose').onclick=closeModal;$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
function editRecord(r){switchView('create');$('#guestName').value=r.name;$('#guestAddress').value=r.address;state.generated=r;closeCustomize();$('#downloadBtn').disabled=false;$('#shareBtn').disabled=false;$('#generateBtn').textContent='Update invitation';$('#generateBtn').onclick=()=>updateExisting(r);renderPage();refreshDuplicate()}
async function updateExisting(r){if(!validate())return;const name=$('#guestName').value.trim(),address=$('#guestAddress').value.trim();const btn=$('#generateBtn');btn.disabled=true;btn.textContent='Updating…';try{r.name=name;r.address=address;r.filename=filename(name,address);r.updatedAt=new Date().toISOString();r.pdfBlob=await createPdf(name,address);r.templateVersion=TEMPLATE_VERSION;await put(r);state.records=await getAll();state.generated=r;btn.textContent='Generate PDF';btn.onclick=generate;closeCustomize();toast('Invitation updated');renderCards()}catch(e){showError(e.message||'Could not update the PDF.')}finally{btn.disabled=false}}
$('#newCardBtn').onclick=()=>{switchView('create');$('#clearBtn').click();$('#generateBtn').textContent='Generate PDF';$('#generateBtn').onclick=generate;closeCustomize()};$('#searchInput').oninput=renderCards;$('#sortSelect').onchange=renderCards;

async function exportCsv(){const rows=[['Guest Name','Address','Created','Updated','Filename'],...state.records.map(r=>[r.name,r.address,r.createdAt,r.updatedAt,r.filename])];const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');downloadBlob(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'wedding-invitations.csv')}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
async function exportBackup(){if(!window.JSZip){toast('Backup library is still loading. Try again.');return}const zip=new JSZip();zip.file('guest-records.json',JSON.stringify(state.records.map(({pdfBlob,...meta})=>meta),null,2));const folder=zip.folder('pdf');state.records.forEach((r,i)=>folder.file(`${String(i+1).padStart(3,'0')}-${safeFile(r.filename)}`,r.pdfBlob));const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'});downloadBlob(blob,`Wedding-Invitation-Backup-${new Date().toISOString().slice(0,10)}.zip`);toast('Backup exported')}
function safeFile(s){return s.replace(/[\\/:*?"<>|]/g,'-')}
async function importBackup(file){if(!window.JSZip){toast('Backup library is still loading.');return}try{const zip=await JSZip.loadAsync(file);const metaText=await zip.file('guest-records.json')?.async('string');if(!metaText)throw new Error('guest-records.json is missing.');const metas=JSON.parse(metaText);if(!Array.isArray(metas))throw new Error('Invalid backup format.');const pdfFiles=Object.values(zip.files).filter(x=>x.name.startsWith('pdf/')&&!x.dir);let imported=0;for(const m of metas){const match=pdfFiles.find(f=>f.name.toLowerCase().endsWith(safeFile(m.filename).toLowerCase()));if(!match)continue;const blob=new Blob([await match.async('uint8array')],{type:'application/pdf'});await put({...m,pdfBlob:blob,updatedAt:m.updatedAt||m.createdAt||new Date().toISOString()});imported++}state.records=await getAll();renderCards();toast(`${imported} invitation${imported===1?'':'s'} imported`)}catch(e){toast(e.message||'Could not import backup')}}
$('#exportCsv').onclick=exportCsv;$('#exportBackup').onclick=exportBackup;$('#importBackup').onclick=()=>$('#backupFile').click();$('#backupFile').onchange=e=>{const f=e.target.files[0];if(f)importBackup(f);e.target.value=''};$('#clearData').onclick=async()=>{if(confirm('Delete all locally stored invitations and PDFs from this browser?')){await clearAll();state.records=[];renderCards();toast('All local invitation data cleared')}};

(async()=>{try{await openDB();state.records=await getAll();await loadTemplate();renderCards()}catch(e){console.error(e);showError('The application could not initialize. Please run it from a local web server and refresh.')}})();
window.addEventListener('resize',()=>{clearTimeout(window._rt);window._rt=setTimeout(()=>renderPage(),150)});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
