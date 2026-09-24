import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const TEMPLATE_URL='assets/card/final-template.pdf';
const TEMPLATE_VERSION='wedding-card-v24-custom-fonts-messenger';
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
// Central font resolver used by preview and PDF text rendering.
function fontStack(font){
  const stacks={
    NotoDeva:'Noto Sans Devanagari, sans-serif',
    NotoDevaItalic:'Noto Sans Devanagari, sans-serif',
    Georgia:'Georgia, serif',
    'Times New Roman':'Times New Roman, Times, serif',
    Arial:'Arial, Helvetica, sans-serif',
    'Trebuchet MS':'Trebuchet MS, Arial, sans-serif',
    Garamond:'Garamond, Georgia, serif',
    'Palatino Linotype':'Palatino Linotype, Palatino, serif',
    'Courier New':'Courier New, monospace',
    CursiveElegant:'Brush Script MT, Segoe Script, cursive',
    Handwritten:'Segoe Print, Comic Sans MS, cursive',
    BrushScript:'Brush Script MT, Segoe Script, cursive'
  };
  return stacks[font] || stacks.NotoDeva;
}
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
    Object.assign(el.style,{left:(cfg.x*sx)+'px',bottom:(cfg.y*sy)+'px',fontSize:(cfg.fontSize*sx)+'px',maxWidth:(cfg.maxWidth*sx)+'px',fontFamily:fontStack(cfg.fontFamily),fontWeight:String(cfg.fontWeight),color:cfg.color,textAlign:cfg.align});
    el.textContent=$(key==='name'?'#guestName':'#guestAddress').value.trim();el.dataset.field=key;
  }
}

async function renderTextPng(text,opts){
  await document.fonts.load(`${opts.fontWeight} ${opts.fontSize}px ${fontStack(opts.fontFamily)}`);await document.fonts.ready;
  const scale=3,pad=8;const c=document.createElement('canvas');const ctx=c.getContext('2d');ctx.font=`${opts.fontWeight} ${opts.fontSize*scale}px ${fontStack(opts.fontFamily)}`;ctx.textBaseline='alphabetic';
  const max=opts.maxWidth*scale;const words=text.split(/\s+/);let lines=[],line='';
  for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width<=max||!line)line=test;else{lines.push(line);line=word}}if(line)lines.push(line);
  const lineH=opts.fontSize*scale*1.28;const width=Math.min(max,Math.max(...lines.map(x=>ctx.measureText(x).width),1))+pad*2;const height=lineH*lines.length+pad*2;c.width=Math.ceil(width);c.height=Math.ceil(height);
  ctx.font=`${opts.fontWeight} ${opts.fontSize*scale}px ${fontStack(opts.fontFamily)}`;ctx.fillStyle=opts.color;ctx.textBaseline='top';ctx.textAlign=opts.align==='center'?'center':opts.align==='right'?'right':'left';
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
      <div><h2>Share wedding invitation</h2><p class="share-intro">Choose <strong>Share PDF</strong> for the actual PDF file, or <strong>Share Link</strong> for the lightweight guest invitation webpage. The guest link never exposes the personalizer.</p></div>
    </div>
    <div class="share-choice-grid">
      <button class="share-choice pdf-choice" id="sharePdfChoice"><span class="share-choice-icon">▣</span><strong>Share PDF</strong><small>Send the actual PDF through your device's share sheet.</small></button>
      <button class="share-choice link-choice" id="shareLinkChoice"><span class="share-choice-icon">↗</span><strong>Share Link</strong><small>Send a fast guest-only invitation webpage.</small></button>
    </div>
    <div id="linkShareArea" class="link-share-area hidden">
      <div class="share-link-box"><div><strong>Guest invitation link</strong><small>Opens the polished invitation viewer only.</small></div><button class="mini-btn copy-now" id="copyShareLink">Copy link</button></div>
      <div class="share-grid">
        <button class="share-tile whatsapp" data-share-url="https://wa.me/?text=${encText}%20${encUrl}"><span>WhatsApp</span><small>Send guest link</small></button>
        <button class="share-tile telegram" data-share-url="https://t.me/share/url?url=${encUrl}&text=${encText}"><span>Telegram</span><small>Send guest link</small></button>
        <button class="share-tile facebook" data-share-url="https://www.facebook.com/sharer/sharer.php?u=${encUrl}"><span>Facebook</span><small>Share guest link</small></button>
      <button class="share-tile messenger" data-share-url="https://www.facebook.com/dialog/send?link=${encUrl}"><span>Messenger</span><small>Send guest link</small></button>
        <button class="share-tile xshare" data-share-url="https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}"><span>X</span><small>Share guest link</small></button>
        <button class="share-tile email" data-share-url="mailto:?subject=${encodeURIComponent('Wedding Invitation')}&body=${encodeURIComponent(text+'\n\n'+shareUrl)}"><span>Email</span><small>Send guest link</small></button>
      </div>
    </div>
    <div class="share-footer"><button class="btn primary" id="openGuestView">Open guest view</button><button class="btn secondary" id="shareDownloadFallback">Download PDF</button></div>`;
  $('#modal').classList.remove('hidden');
  const fallbackLinkPanel=()=>{$('#linkShareArea').classList.remove('hidden');$('#modal').scrollTop=0};
  const nativeLinkShare=async()=>{
    if(!navigator.share)return false;
    try{
      await navigator.share({title:`Wedding Invitation — ${rec.name}`,text:`Wedding invitation for ${rec.name}.`,url:shareUrl});
      toast('Invitation link shared');
      return true;
    }catch(e){
      if(e?.name==='AbortError'){toast('Share cancelled');return true}
      return false;
    }
  };
  $('#sharePdfChoice').onclick=async()=>{
    closeModal();
    const ok=await sharePdfOrLink(rec,shareUrl,false);
    if(!ok){openSocialShare(rec,shareUrl);toast('PDF file sharing is unavailable here. Choose Share Link instead.');}
  };
  $('#shareLinkChoice').onclick=async()=>{
    const ok=await nativeLinkShare();
    if(ok){closeModal();return;}
    // Desktop browsers commonly do not expose navigator.share. Keep our
    // share panel open and reveal real social share actions instead of
    // silently copying the URL.
    fallbackLinkPanel();
    toast('Choose an app below to share the guest link.');
  };
  $('#modalContent').querySelectorAll('[data-share-url]').forEach(btn=>btn.onclick=()=>{window.open(btn.dataset.shareUrl,'_blank','noopener,noreferrer');toast('Share window opened')});
  $('#copyShareLink').onclick=async()=>{const ok=await copyText(shareUrl);toast(ok?'Guest invitation link copied':'Copy the link from the prompt')};
  $('#shareDownloadFallback').onclick=()=>downloadRecord(rec);
  $('#openGuestView').onclick=()=>{window.location.href=shareUrl};
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

async function nativeLinkShare(name,shareUrl){
  if(!navigator.share)return false;
  try{
    await navigator.share({title:`Wedding Invitation — ${name}`,text:`Wedding invitation for ${name}.`,url:shareUrl});
    toast('Invitation link shared');
    return true;
  }catch(e){
    if(e?.name==='AbortError'){toast('Share cancelled');return true;}
    return false;
  }
}

function openInviteSharePanel(name,shareUrl,blob,fileName,rec){
  const text=`Wedding invitation for ${name}`;
  const encText=encodeURIComponent(text),encUrl=encodeURIComponent(shareUrl);
  const modal=document.createElement('div');modal.className='invite-share-fallback';
  modal.innerHTML=`<div class="invite-share-card studio-share-card"><button class="invite-share-close">×</button><div class="share-modal-head"><div class="share-badge">✦</div><div><h2>Share wedding invitation</h2><p class="share-intro">Choose <strong>Share PDF</strong> for the actual file, or <strong>Share Link</strong> for the fast guest webpage.</p></div></div><div class="share-choice-grid"><button class="share-choice pdf-choice" id="guestPdfChoice"><span class="share-choice-icon">▣</span><strong>Share PDF</strong><small>Send the actual PDF through your device's share sheet.</small></button><button class="share-choice link-choice" id="guestLinkChoice"><span class="share-choice-icon">↗</span><strong>Share Link</strong><small>Send a lightweight guest-only invitation page.</small></button></div><div id="guestLinkArea" class="link-share-area hidden"><div class="share-link-box"><div><strong>Guest invitation link</strong><small>Opens the invitation viewer directly.</small></div><button class="mini-btn copy-now" id="guestCopyLink">Copy link</button></div><div class="share-grid"><button class="share-tile whatsapp" data-url="https://wa.me/?text=${encText}%20${encUrl}"><span>WhatsApp</span><small>Send guest link</small></button><button class="share-tile telegram" data-url="https://t.me/share/url?url=${encUrl}&text=${encText}"><span>Telegram</span><small>Send guest link</small></button><button class="share-tile facebook" data-url="https://www.facebook.com/sharer/sharer.php?u=${encUrl}"><span>Facebook</span><small>Share guest link</small></button><button class="share-tile xshare" data-url="https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}"><span>X</span><small>Share guest link</small></button><button class="share-tile email" data-url="mailto:?subject=${encodeURIComponent('Wedding Invitation')}&body=${encodeURIComponent(text+'\n\n'+shareUrl)}"><span>Email</span><small>Send guest link</small></button></div></div><div class="share-footer"><button class="btn primary" id="guestOpenView">Open guest view</button><button class="btn secondary" id="guestDownload">Download PDF</button></div></div>`;
  document.body.appendChild(modal);
  modal.querySelector('.invite-share-close').onclick=()=>modal.remove();
  modal.querySelector('#guestPdfChoice').onclick=async()=>{const ok=await sharePdfOrLink(rec,shareUrl,false);if(!ok)toast('PDF sharing is unavailable here. Use Share Link or Download PDF.')};
  modal.querySelector('#guestLinkChoice').onclick=async()=>{
    const ok=await nativeLinkShare(name,shareUrl);
    if(ok){modal.remove();return;}
    modal.querySelector('#guestLinkArea').classList.remove('hidden');
    toast('Choose an app below to share the guest link.');
  };
  modal.querySelectorAll('[data-url]').forEach(btn=>btn.onclick=()=>{window.open(btn.dataset.url,'_blank','noopener,noreferrer');toast('Share window opened')});
  modal.querySelector('#guestCopyLink').onclick=async()=>toast(await copyText(shareUrl)?'Invitation link copied':'Copy the link from the prompt');
  modal.querySelector('#guestOpenView').onclick=()=>{modal.remove();window.location.href=shareUrl};
  modal.querySelector('#guestDownload').onclick=()=>downloadBlob(blob,fileName);
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
if('serviceWorker' in navigator){window.addEventListener('load',async()=>{try{const regs=await navigator.serviceWorker.getRegistrations();for(const r of regs)await r.unregister();const keys=await caches.keys();for(const k of keys)await caches.delete(k)}catch{}})}
