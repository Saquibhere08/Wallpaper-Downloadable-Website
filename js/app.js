const wallpapers = [
  {id:'quiet-mornings',title:'Quiet mornings',creator:'A. Rivera',category:'Nature',likes:248,added:8,photo:'photo-1470770841072-f978cf4d019e'},
  {id:'somewhere-slow',title:'Somewhere slow',creator:'M. Chen',category:'Nature',likes:192,added:7,photo:'photo-1500530855697-b586d89ba3ee'},
  {id:'soft-geometry',title:'Soft geometry',creator:'Studio Form',category:'Architecture',likes:176,added:6,photo:'photo-1511818966892-d7d671e672a2'},
  {id:'after-the-rain',title:'After the rain',creator:'L. Moreau',category:'Nature',likes:214,added:5,photo:'photo-1470252649378-9c29740c9fa8'},
  {id:'blue-hour',title:'Blue hour',creator:'N. Park',category:'Minimal',likes:163,added:4,photo:'photo-1519681393784-d120267933ba'},
  {id:'desert-study',title:'Desert study',creator:'A. Rivera',category:'Abstract',likes:137,added:3,photo:'photo-1509316785289-025f5b846b35'},
  {id:'open-air',title:'Open air',creator:'E. Laurent',category:'Nature',likes:201,added:2,photo:'photo-1441974231531-c6227db76b6e'},
  {id:'the-still-life',title:'The still life',creator:'Studio Form',category:'Architecture',likes:119,added:1,photo:'photo-1518005020951-eccb494ad742'},
  {id:'wild-coast',title:'Wild coast',creator:'J. Okafor',category:'Nature',likes:184,added:0,photo:'photo-1518837695005-2083093ee35b'},
  {id:'warm-lines',title:'Warm lines',creator:'Studio Form',category:'Abstract',likes:142,added:0,photo:'photo-1518005020951-eccb494ad742'},
  {id:'green-house',title:'Green house',creator:'E. Laurent',category:'Architecture',likes:167,added:0,photo:'photo-1487958449943-2429e8be8625'},
  {id:'night-sky',title:'Night sky',creator:'N. Park',category:'Minimal',likes:221,added:0,photo:'photo-1462331940025-496dfbfc7564'}
];
const imageUrl=(photo,width=900)=>`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`;
const grid=document.querySelector('#wallpaperGrid'), searchInput=document.querySelector('#searchInput'), resultCount=document.querySelector('#resultCount'), emptyState=document.querySelector('#emptyState');
let category='All', query='', sort='featured', saved=new Set(JSON.parse(localStorage.getItem('wallspaper-saved')||'[]')), activeWallpaper=null, toastTimer, visibleCount=8, featuredIndex=0;
const featuredIds=['quiet-mornings','somewhere-slow','blue-hour','open-air'];

function render(){
  let items=wallpapers.filter(w=>(category==='All'||(category==='Saved'?saved.has(w.id):w.category===category))&&`${w.title} ${w.creator} ${w.category}`.toLowerCase().includes(query));
  if(sort==='newest')items.sort((a,b)=>b.added-a.added); if(sort==='popular')items.sort((a,b)=>b.likes-a.likes);
  const hasMore=items.length>visibleCount; items=items.slice(0,visibleCount);
  const total=wallpapers.filter(w=>(category==='All'||(category==='Saved'?saved.has(w.id):w.category===category))&&`${w.title} ${w.creator} ${w.category}`.toLowerCase().includes(query)).length;
  resultCount.textContent=category==='Saved'?`Your saved wallpapers · ${total}`:`Showing ${items.length===total?total:`${items.length} of ${total}`} wallpaper${total===1?'':'s'}${category!=='All'?` · ${category}`:''}`;
  grid.innerHTML=items.map(w=>`<article class="wallpaper-card" data-id="${w.id}" tabindex="0" aria-label="Preview ${w.title}">
    <div class="card-image-wrap"><div class="card-image" style="background-image:url('${imageUrl(w.photo,700)}')"></div><div class="card-overlay"></div><span class="card-category">${w.category}</span>
      <div class="card-actions"><button class="card-action ${saved.has(w.id)?'saved':''}" data-save="${w.id}" aria-label="${saved.has(w.id)?'Remove saved':'Save'} ${w.title}" title="${saved.has(w.id)?'Remove from saved':'Save wallpaper'}">${saved.has(w.id)?'♥':'♡'}</button><button class="card-action download" data-download="${w.id}" aria-label="Open download for ${w.title}" title="Download wallpaper">↓</button></div></div>
    <div class="card-info"><div><h3>${w.title}</h3><p>by ${w.creator} · 4K</p></div><span class="card-loves"><span>♥</span> ${w.likes}</span></div><button class="preview-link" data-preview="${w.id}">Preview wallpaper <span>↗</span></button></article>`).join('');
  emptyState.hidden=items.length>0; grid.hidden=items.length===0;
  document.querySelector('#loadMore').hidden=!hasMore;
  document.querySelector('#loadMore').innerHTML=hasMore?'Load more wallpapers <span>↓</span>':'You’re all caught up <span>✦</span>';
  document.querySelector('#savedCount').textContent=saved.size;
  const toggle=document.querySelector('#savedToggle');toggle.classList.toggle('is-active',category==='Saved');toggle.setAttribute('aria-pressed',category==='Saved');
}
function toggleSaved(id){if(saved.has(id)){saved.delete(id);toast('Removed from your saved wallpapers');}else{saved.add(id);toast('Saved for later ♥');}localStorage.setItem('wallspaper-saved',JSON.stringify([...saved]));render();showFeatured(featuredIndex);if(activeWallpaper?.id===id)syncModalSave();}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
function openModal(w){activeWallpaper=w;const modal=document.querySelector('#wallpaperModal');document.querySelector('#modalImage').style.backgroundImage=`url('${imageUrl(w.photo,1400)}')`;document.querySelector('#modalTitle').textContent=w.title;document.querySelector('#modalCategory').textContent=w.category.toUpperCase();document.querySelector('#modalByline').textContent=`by ${w.creator} · 4K`;document.querySelector('#downloadButton').href=imageUrl(w.photo,2400);syncModalSave();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.querySelector('#modalClose').focus();}
function closeModal(){const modal=document.querySelector('#wallpaperModal');modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';activeWallpaper=null;}
function syncModalSave(){const button=document.querySelector('#modalSave');button.classList.toggle('saved',saved.has(activeWallpaper?.id));button.innerHTML=saved.has(activeWallpaper?.id)?'♥ Saved':'♡ Save';}
function showFeatured(index){featuredIndex=(index+featuredIds.length)%featuredIds.length;const w=wallpapers.find(item=>item.id===featuredIds[featuredIndex]);document.querySelector('#heroImage').style.backgroundImage=`url('${imageUrl(w.photo,1400)}')`;document.querySelector('#heroTitle').textContent=w.title;document.querySelector('#heroByline').innerHTML=`by ${w.creator} <b>·</b> 4K`;document.querySelector('#heroCurrent').textContent=String(featuredIndex+1).padStart(2,'0');const save=document.querySelector('#heroSave');save.dataset.id=w.id;save.classList.toggle('saved',saved.has(w.id));save.textContent=saved.has(w.id)?'♥':'♡';save.setAttribute('aria-label',`${saved.has(w.id)?'Remove saved':'Save'} ${w.title} wallpaper`);}

document.querySelector('#categoryFilters').addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===button));render();});
searchInput.addEventListener('input',()=>{query=searchInput.value.trim().toLowerCase();render();});
document.querySelector('#sortSelect').addEventListener('change',e=>{sort=e.target.value;render();});
grid.addEventListener('click',e=>{const saveButton=e.target.closest('[data-save]');if(saveButton){e.stopPropagation();toggleSaved(saveButton.dataset.save);return;}const downloadButton=e.target.closest('[data-download]');if(downloadButton){e.stopPropagation();const w=wallpapers.find(item=>item.id===downloadButton.dataset.download);window.open(imageUrl(w.photo,2400),'_blank','noopener');toast('Original image opened in a new tab');return;}const preview=e.target.closest('[data-preview]');const card=e.target.closest('.wallpaper-card');if(preview||card)openModal(wallpapers.find(w=>w.id===(preview?.dataset.preview||card?.dataset.id)));});
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.wallpaper-card')){e.preventDefault();openModal(wallpapers.find(w=>w.id===e.target.dataset.id));}});
document.querySelector('#savedToggle').addEventListener('click',()=>{category=category==='Saved'?'All':'Saved';query='';searchInput.value='';document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));if(category==='All')document.querySelector('[data-category="All"]').classList.add('active');render();document.querySelector('#explore').scrollIntoView({behavior:'smooth'});});
document.querySelector('#clearFilters').addEventListener('click',()=>{category='All';query='';searchInput.value='';document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.category==='All'));render();});
document.querySelector('#loadMore').addEventListener('click',()=>{visibleCount+=4;render();});
document.querySelector('#heroSave').addEventListener('click',e=>toggleSaved(e.currentTarget.dataset.id||'quiet-mornings'));
document.querySelector('#heroPrev').addEventListener('click',()=>showFeatured(featuredIndex-1));
document.querySelector('#heroNext').addEventListener('click',()=>showFeatured(featuredIndex+1));
document.querySelector('#surpriseButton').addEventListener('click',()=>{const pool=wallpapers.filter(w=>w.id!==activeWallpaper?.id);openModal(pool[Math.floor(Math.random()*pool.length)]);});
document.querySelector('#modalSave').addEventListener('click',()=>toggleSaved(activeWallpaper.id));
document.querySelector('#modalClose').addEventListener('click',closeModal);
document.querySelector('#wallpaperModal').addEventListener('click',e=>{if(e.target.dataset.close)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchInput.focus();}});
document.querySelector('#menuButton').addEventListener('click',e=>{const open=document.querySelector('.main-nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open);});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.main-nav').classList.remove('open');document.querySelector('#menuButton').setAttribute('aria-expanded','false');}));
render();showFeatured(0);
