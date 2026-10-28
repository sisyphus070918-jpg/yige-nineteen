(()=>{'use strict';
 const $=id=>document.getElementById(id),albums=BirthdayPhotos,state={kun:0,juhoon:0},version={kun:0,juhoon:0};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function meta(artist,i){const d=$(artist),rows=albums[artist],p=rows[i];d.querySelector('.photo-count').textContent=`${String(i+1).padStart(2,'0')} / ${String(rows.length).padStart(2,'0')}`;d.querySelector('.photo-caption').textContent=p.title+(p.date?' / '+p.date:'');const source=d.querySelector('.photo-source');source.href=p.source;source.textContent='图源 / '+p.credit;const save=d.querySelector('.save-photo');save.href=p.file;save.download=`${artist.toUpperCase()}-${i+1}${p.extension||'.jpg'}`;d.querySelectorAll('.photo-thumbnail').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)))}
 function stop(d){d.querySelectorAll('.photo-face,.photo-sheen').forEach(e=>e.getAnimations().forEach(a=>a.cancel()));d.classList.remove('is-turning')}
 async function render(artist,index,{animate=true,direction=1}={}){
  const rows=albums[artist],d=$(artist),i=(index%rows.length+rows.length)%rows.length,p=rows[i],token=++version[artist];state[artist]=i;stop(d);
  const current=d.querySelector('.portrait-image'),incoming=d.querySelector('.portrait-incoming'),sheen=d.querySelector('.photo-sheen');incoming.style.opacity='0';
  const image=new Image();image.src=p.file;try{await image.decode()}catch{if(token===version[artist])d.querySelector('.photo-caption').textContent='照片暂未读取，可切换下一张。';return}if(token!==version[artist])return;
  const alt=(artist==='kun'?'蔡徐坤':'JUHOON')+' · '+p.title;meta(artist,i);
  if(reduced||!animate||!d.open||!current.getAttribute('src')){current.src=p.file;current.alt=alt;current.style.objectPosition=p.focal||'50% 25%';return}
  incoming.src=p.file;incoming.style.objectPosition=p.focal||'50% 25%';current.style.transformOrigin=direction>0?'0% 50%':'100% 50%';incoming.style.transformOrigin=direction>0?'100% 50%':'0% 50%';d.classList.add('is-turning');
  const timing={duration:760,easing:'cubic-bezier(.22,.72,.18,1)',fill:'both'};
  const out=current.animate([{opacity:1,transform:'translateX(0) rotateY(0) scale(1)',filter:'brightness(1)'},{opacity:0,transform:`translateX(${-direction*76}px) rotateY(${direction*44}deg) scale(.94)`,filter:'brightness(.7)'}],timing);
  const into=incoming.animate([{opacity:0,transform:`translateX(${direction*100}px) rotateY(${-direction*44}deg) scale(1.015)`,filter:'brightness(.7)'},{opacity:1,transform:'translateX(0) rotateY(0) scale(1)',filter:'brightness(1)'}],timing);
  sheen.animate([{opacity:0,transform:`translateX(${-direction*120}%)`},{opacity:.4,offset:.4},{opacity:0,transform:`translateX(${direction*120}%)`}],{...timing,duration:840});
  await Promise.all([out.finished.catch(()=>{}),into.finished.catch(()=>{})]);if(token!==version[artist])return;current.src=p.file;current.alt=alt;current.style.objectPosition=p.focal||'50% 25%';incoming.style.opacity='0';stop(d);
 }
 function show(artist,index=0){document.querySelectorAll('.photo-gallery[open]').forEach(d=>{if(d.id!==artist)d.close()});const d=$(artist);render(artist,index,{animate:false});if(!d.open)d.showModal();$('stage').classList.add(`${artist}-playing`)}
 for(const artist of ['kun','juhoon']){
  const d=$(artist),label=artist==='kun'?'蔡徐坤':'JUHOON',thumbs=d.querySelector('.photo-thumbnails');
  albums[artist].forEach((p,i)=>{const b=document.createElement('button');b.className='photo-thumbnail';b.setAttribute('aria-label',`查看${label}第${i+1}张照片`);b.setAttribute('aria-pressed',String(i===0));const img=document.createElement('img');img.src=p.file;img.alt='';img.loading='lazy';img.decoding='async';img.style.objectPosition=p.focal||'50% 25%';b.append(img);b.onclick=()=>render(artist,i,{direction:i>=state[artist]?1:-1});thumbs.append(b)});
  d.querySelector('.photo-prev').onclick=()=>render(artist,state[artist]-1,{direction:-1});d.querySelector('.photo-next').onclick=()=>render(artist,state[artist]+1,{direction:1});
  d.querySelector('.portrait-button').onclick=()=>render(artist,state[artist]+1);
  d.querySelector('.photo-shuffle').onclick=()=>render(artist,state[artist]+1+Math.floor(Math.random()*(albums[artist].length-1)));
  d.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();render(artist,state[artist]+1)}if(e.key==='ArrowLeft'){e.preventDefault();render(artist,state[artist]-1,{direction:-1})}});
  d.addEventListener('close',()=>{++version[artist];stop(d);const p=albums[artist][state[artist]],image=d.querySelector('.portrait-image');image.src=p.file;image.style.objectPosition=p.focal||'50% 25%';d.querySelector('.portrait-incoming').style.opacity='0'});
  document.querySelectorAll(`[data-open="${artist}"]`).forEach(b=>b.addEventListener('click',()=>show(artist,Number(b.dataset.photoIndex)||0)));
 }
 $('surprise-photo').onclick=()=>{const artist=Math.random()<.5?'kun':'juhoon';show(artist,Math.floor(Math.random()*albums[artist].length))};
})();
