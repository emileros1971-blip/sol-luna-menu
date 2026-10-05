let lang='es', data=[];
const strings={
  es:{title:'A tu gusto,<br><em>junto al mar.</em>',subtitle:'Nuestra carta',featuretag:'PARA COMPARTIR · 2 PERSONAS',featurename:'Paella mixta',map:'Ver ubicación',allergy:'Para información sobre alérgenos, consulta con nuestro equipo.'},
  en:{title:'Your favourites,<br><em>by the sea.</em>',subtitle:'Our menu',featuretag:'TO SHARE · 2 PEOPLE',featurename:'Mixed paella',map:'View location',allergy:'For allergen information, please speak to our team.'}
};
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function formattedPrice(price){return new Intl.NumberFormat(lang==='es'?'es-ES':'en-IE',{style:'currency',currency:'EUR'}).format(price)}
function renderItem(item){
  const [es,en,price,img,detailEs,detailEn]=item;
  const name=lang==='es'?es:en, detail=lang==='es'?detailEs:detailEn;
  const priceMarkup=price===null?'':`<span class="price">${formattedPrice(price)}</span>`;
  if(img){return `<article class="card"><div class="image-frame"><img src="assets/${esc(img)}.webp" alt="${esc(name)}" loading="lazy" width="1200" height="1200"></div><div class="body"><div class="item-line"><h3>${esc(name)}</h3>${priceMarkup}</div>${detail?`<p>${esc(detail)}</p>`:''}</div></article>`}
  return `<article class="menu-row"><div class="row-name">${esc(name)}${detail?`<small>${esc(detail)}</small>`:''}</div>${priceMarkup}</article>`;
}
function render(){
  const t=strings[lang]; document.documentElement.lang=lang;
  Object.entries(t).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.innerHTML=value});
  document.getElementById('es').setAttribute('aria-pressed',lang==='es');
  document.getElementById('en').setAttribute('aria-pressed',lang==='en');
  document.getElementById('categories').innerHTML=data.map(([id,es,en])=>`<a href="#${esc(id)}">${esc(lang==='es'?es:en)}</a>`).join('');
  document.getElementById('menu').innerHTML=data.map(([id,es,en,items],i)=>`<section id="${esc(id)}"><div class="section-title"><small>${String(i+1).padStart(2,'0')}</small><h2>${esc(lang==='es'?es:en)}</h2></div><div class="cards">${items.filter(item=>item[3]).map(renderItem).join('')}</div><div class="menu-list">${items.filter(item=>!item[3]).map(renderItem).join('')}</div></section>`).join('');
  observer.disconnect();document.querySelectorAll('#menu section').forEach(section=>observer.observe(section));
}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('#categories a').forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id))}})},{rootMargin:'-10% 0px -65% 0px'});
document.getElementById('es').onclick=()=>{lang='es';render()};
document.getElementById('en').onclick=()=>{lang='en';render()};
fetch('menu.json').then(response=>{if(!response.ok)throw Error('Menu unavailable');return response.json()}).then(menu=>{data=menu;render()}).catch(()=>{document.getElementById('menu').textContent='La carta no está disponible. Consulta con nuestro equipo.'});
