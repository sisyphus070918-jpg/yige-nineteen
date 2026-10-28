(()=>{'use strict';
 const $=id=>document.getElementById(id);let storage;try{storage=localStorage}catch{storage={getItem(){return null},setItem(){throw Error('unavailable')}}}
 function fit(){document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1440,innerHeight/900))}fit();addEventListener('resize',fit);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const sky=$('sky'),ctx=sky.getContext('2d');sky.width=1440;sky.height=900;let seed=110319;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const stars=Array.from({length:180},()=>({x:rand()*1440,y:rand()*900,r:rand()*1.1+.2,a:rand()*.5+.15}));
 function drawSky(t=0){ctx.clearRect(0,0,1440,900);for(const s of stars){ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(224,232,227,${s.a*(.8+.2*Math.sin(t*.0004+s.x))})`;ctx.fill()}if(!reduced)requestAnimationFrame(drawSky)}drawSky();
 const audio=$('ambience'),sound=$('sound');audio.volume=.24;let toastTimer,wasMusic=false;
 function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3300)}
 function updateSound(){sound.setAttribute('aria-pressed',String(!audio.paused));sound.setAttribute('aria-label',audio.paused?'开启背景音乐':'关闭背景音乐')}
 sound.onclick=async()=>{try{if(audio.paused)await audio.play();else audio.pause();updateSound()}catch{notify('音乐未能读取，请从完整礼物文件夹打开。')}};
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{notify('可使用浏览器的 F11 进入全屏。')}};
 function open(id){const d=$(id);if(!d.open)d.showModal();if(id==='wish')renderWishes();if(id==='card')drawCard();if(id==='cinema'){wasMusic=!audio.paused;audio.pause();updateSound();$('birthday-video').play().catch(()=>{})}}
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open));
 document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close()});d.addEventListener('close',()=>{if(d.id==='cinema'){$('birthday-video').pause();if(wasMusic){audio.play().then(updateSound).catch(()=>{});wasMusic=false}}})});
 $('planet').onclick=()=>open('wish');$('keepsake').onclick=()=>open('card');
 const blessings=['愿你的世界，永远有歌可听，有人可念。','十九岁，快乐可以不讲道理。','宜格，你值得所有不期而遇的温柔。','愿喜欢的都能靠近，讨厌的都能远离。','去做你想做的事，今天宇宙给你撑腰。','愿你眼里有光，也有说“不”的底气。'];let blessingIndex=0;
 $('lucky').onclick=()=>notify(blessings[blessingIndex++%blessings.length]);
 document.querySelectorAll('.egg-wish').forEach(b=>b.onclick=()=>{b.closest('dialog').close();notify('这份偏爱，已经放进宜格的十九岁。')});
 document.addEventListener('gift:notify',e=>notify(String(e.detail).slice(0,120)));
 let currentWishes=GiftCore.readWishes(storage);
 function renderWishes(){const list=$('wish-list');list.replaceChildren();currentWishes.slice(-4).reverse().forEach(w=>{const p=document.createElement('p');p.textContent='✧ '+w;list.append(p)})}
 $('wish-form').onsubmit=e=>{e.preventDefault();const result=GiftCore.writeWish(storage,$('wish-input').value);if(!result.ok)return;currentWishes=result.wishes;$('wish-status').textContent=result.saved?'星星收到了。愿它慢慢实现。':'星星收到了。这次愿望会留在当前页面。';$('wish-input').value='';renderWishes();burst();document.dispatchEvent(new CustomEvent('gift:wish',{detail:currentWishes}))};
 function burst(){if(reduced)return;const p=$('planet');p.animate([{filter:'brightness(1)'},{filter:'brightness(1.5)'},{filter:'brightness(1)'}],{duration:1800,easing:'ease-out'})}
 $('birthday-video').addEventListener('error',()=>{$('video-error').hidden=false});
 function drawCard(){const c=$('card-canvas'),g=c.getContext('2d');const bg=g.createLinearGradient(0,0,1600,1000);bg.addColorStop(0,'#14243b');bg.addColorStop(1,'#29465b');g.fillStyle=bg;g.fillRect(0,0,1600,1000);g.save();g.strokeStyle='#cfbc993f';g.lineWidth=2;g.beginPath();g.ellipse(1050,460,520,150,-.4,0,Math.PI*2);g.stroke();const moon=g.createRadialGradient(960,300,5,1120,460,310);moon.addColorStop(0,'#fff9e4');moon.addColorStop(.4,'#ced5c9');moon.addColorStop(.8,'#738f94');moon.addColorStop(1,'#36536b');g.fillStyle=moon;g.beginPath();g.arc(1090,440,290,0,Math.PI*2);g.fill();g.textAlign='center';g.fillStyle='#e8e6d4';g.font='330px Georgia';g.fillText('19',1080,530);g.restore();g.fillStyle='#dbc6a5';g.font='24px Microsoft YaHei';g.fillText('给，吕宜格',130,155);g.fillStyle='#f2eee5';g.font='75px SimSun';g.fillText('十九岁。',130,315);g.fillText('尽兴而为。',130,430);g.font='23px SimSun';g.fillStyle='#c6d0d6';g.fillText('愿你热烈，也自在。',130,535);g.font='56px Georgia';g.fillText('11 / 02',130,839);g.font='18px Microsoft YaHei';g.fillStyle='#a6b8ca';g.fillText('2026',360,838);g.font='20px SimSun';g.textAlign='right';g.fillText('今天，所有星光都偏向你。',1465,837);g.strokeStyle='#cfbc9933';g.beginPath();g.moveTo(130,885);g.lineTo(1470,885);g.stroke();g.textAlign='left';g.font='14px Georgia';g.fillText('a little universe, all yours.',130,928)}
 $('save-card').onclick=()=>{$('card-canvas').toBlob(blob=>{if(!blob){notify('纪念卡生成失败，请重试。');return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='吕宜格的十九岁.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')};
 document.querySelector('.brand').onclick=e=>{e.preventDefault();document.querySelectorAll('dialog[open]').forEach(d=>d.close())};
})();
