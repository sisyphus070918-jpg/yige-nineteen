(()=>{'use strict';
 const $=id=>document.getElementById(id),stage=$('stage'),cover=$('opening'),enter=$('enter-gift'),audio=$('ambience');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let entered=false,openingTimer,audioContext,candleLit=true;
 const whisper=text=>document.dispatchEvent(new CustomEvent('gift:notify',{detail:text}));
 function soundState(){const b=$('sound');b.setAttribute('aria-pressed',String(!audio.paused));b.setAttribute('aria-label',audio.paused?'开启背景音乐':'关闭背景音乐')}
 function notes(type='entry'){
  if(audio.paused)return;
  try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
   const pitches={entry:[523.25,659.25,783.99,1046.5],kun:[392,493.88,587.33],juhoon:[440,659.25,880],wish:[659.25,783.99,1046.5],candle:[523.25,659.25,783.99]}[type];
   pitches.forEach((freq,i)=>{const start=audioContext.currentTime+i*.15,o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(.035,start+.018);g.gain.exponentialRampToValueAtTime(.0001,start+1.8);o.connect(g);g.connect(audioContext.destination);o.start(start);o.stop(start+1.85)});
  }catch{}
 }
 function reveal(){
  if(entered)return;entered=true;enter.disabled=true;stage.inert=false;stage.removeAttribute('aria-hidden');cover.setAttribute('aria-hidden','true');document.body.classList.add('entered');
  audio.volume=.19;audio.play().then(()=>{soundState();notes()}).catch(()=>{});
  openingTimer=setTimeout(()=>{cover.hidden=true;document.querySelector('.brand').focus({preventScroll:true})},reduced?0:1350);
 }
 enter.onclick=reveal;
 document.querySelector('.brand').onclick=e=>{
  e.preventDefault();clearTimeout(openingTimer);document.querySelectorAll('dialog[open]').forEach(d=>d.close());$('toast').classList.remove('visible');entered=false;cover.hidden=false;cover.removeAttribute('aria-hidden');enter.disabled=false;stage.inert=true;stage.setAttribute('aria-hidden','true');audio.pause();soundState();document.body.classList.remove('entered');enter.focus({preventScroll:true});
 };
 stage.addEventListener('pointermove',e=>{
  if(reduced||!entered)return;const b=stage.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
  stage.style.setProperty('--tilt-x',`${x*6}deg`);stage.style.setProperty('--tilt-y',`${-y*5}deg`);stage.style.setProperty('--object-x',`${x*-12}px`);stage.style.setProperty('--object-y',`${y*-9}px`);
 });
 stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--tilt-x','0deg');stage.style.setProperty('--tilt-y','0deg');stage.style.setProperty('--object-x','0px');stage.style.setProperty('--object-y','0px')});
 const canvas=$('stardust'),g=canvas.getContext('2d');canvas.width=1440;canvas.height=900;let meteors=[],animating=false;
 function meteor(x=980,y=300,count=1){
  if(reduced)return;const now=performance.now();for(let i=0;i<count;i++){const a=.42+i*.19;meteors.push({x:x-i*22,y:y+i*34,a,start:now+i*110,life:1150+i*140})}meteors=meteors.slice(-24);if(!animating){animating=true;requestAnimationFrame(paint)}
 }
 function paint(now){
  g.clearRect(0,0,1440,900);meteors=meteors.filter(m=>now<m.start+m.life);
  for(const m of meteors){const p=(now-m.start)/m.life;if(p<0)continue;const head=p*390,x=m.x+Math.cos(m.a)*head,y=m.y+Math.sin(m.a)*head,tail=100*Math.sin(Math.PI*Math.min(p,.99)),alpha=Math.sin(p*Math.PI);const grad=g.createLinearGradient(x,y,x-tail,y-tail*.45);grad.addColorStop(0,`rgba(255,243,208,${alpha})`);grad.addColorStop(1,'rgba(238,218,173,0)');g.beginPath();g.moveTo(x,y);g.lineTo(x-tail,y-tail*.45);g.strokeStyle=grad;g.lineWidth=1.5;g.stroke();g.beginPath();g.arc(x,y,2,0,Math.PI*2);g.fillStyle=`rgba(255,248,220,${alpha})`;g.fill()}
  if(meteors.length)requestAnimationFrame(paint);else animating=false;
 }
 stage.addEventListener('click',e=>{if(e.target.closest('button,a,input,textarea'))return;const b=stage.getBoundingClientRect();meteor((e.clientX-b.left)*1440/b.width,(e.clientY-b.top)*900/b.height)});
 $('lucky').addEventListener('click',()=>{meteor(710,390,3);notes('wish')});
 for(const id of ['kun','juhoon']){
  document.querySelector(`[data-open="${id}"]`).addEventListener('click',()=>{stage.classList.add(`${id}-playing`);notes(id)});
  $(id).addEventListener('close',()=>stage.classList.remove(`${id}-playing`));
 }
 function constellation(wishes){const root=$('wish-stars');root.replaceChildren();wishes.slice(-19).forEach((w,i)=>{const b=document.createElement('button'),angle=i*2.399963;const r=198+(i%3)*17;b.className='wish-star';b.style.left=`${408+Math.cos(angle)*r}px`;b.style.top=`${316+Math.sin(angle)*r}px`;b.setAttribute('aria-label',`心愿：${w}`);b.textContent='✧';b.onclick=e=>{e.stopPropagation();whisper(w);notes('wish');meteor(600+parseFloat(b.style.left),130+parseFloat(b.style.top))};root.append(b)})}
 let stored=[];try{stored=GiftCore.readWishes(localStorage)}catch{}constellation(stored);
 document.addEventListener('gift:wish',e=>{constellation(e.detail);meteor(820,260,5);notes('wish')});
 $('candle-sculpture').onclick=()=>{
  candleLit=!candleLit;$('candle-sculpture').classList.toggle('extinguished',!candleLit);$('candle-sculpture').setAttribute('aria-label',candleLit?'吹灭生日蜡烛':'重新点亮生日蜡烛');$('candle-message').textContent=candleLit?'把喜欢的明天，悄悄放进心里。':'愿所爱皆如愿。十九岁，生日快乐。';$('candle').classList.toggle('wish-made',!candleLit);
  if(!candleLit){meteor(610,160,7);notes('candle')}
 };
})();
