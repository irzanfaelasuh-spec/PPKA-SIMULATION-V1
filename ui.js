'use strict';
const $=i=>document.getElementById(i),cv=$('map'),cx=cv.getContext('2d'),ov=$('ov'),ox=ov.getContext('2d');
const DOW=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],MON=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const p2=n=>String(n).padStart(2,'0'),wib=t=>new Date((t+25200)*1000);
const fT=(t,s)=>{const d=wib(t);return p2(d.getUTCHours())+':'+p2(d.getUTCMinutes())+(s?':'+p2(d.getUTCSeconds()):'')};
const fD=t=>{const d=wib(t);return DOW[d.getUTCDay()]+', '+d.getUTCDate()+' '+MON[d.getUTCMonth()]+' '+d.getUTCFullYear()};
const CL={R:'#ef4444',Y:'#f5b73b',G:'#2dd47a'},AN={R:'Merah',Y:'Kuning',G:'Hijau'};
let W=1,H=1,dpr=1,cam={x:0,y:0,z:.5},sel=null,follow=null,tab='info',touch=0;
const rr=(x,y,w,h,r)=>{cx.beginPath();cx.roundRect?cx.roundRect(x,y,w,h,r):cx.rect(x,y,w,h)};
function rs(){dpr=Math.min(devicePixelRatio||1,2);let r=cv.getBoundingClientRect();W=r.width||1;H=r.height||1;cv.width=W*dpr;cv.height=H*dpr;r=ov.getBoundingClientRect();ov.width=(r.width||1)*dpr;ov.height=(r.height||1)*dpr}
addEventListener('resize',rs);new ResizeObserver(rs).observe(document.body);rs();
function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),3200)}
function zoomAt(sx,sy,z){const wx=cam.x+sx/cam.z,wy=cam.y+sy/cam.z;cam.z=Math.max(.04,Math.min(3,z));cam.x=wx-sx/cam.z;cam.y=wy-sy/cam.z}
function center(wx,wy){cam.x=wx-W/2/cam.z;cam.y=wy-H/2/cam.z}
const mid=r=>X(r.t,r.u)+(r.t.d?1:-1)*r.len/MPX/2;
function focus(r){select(r,'train');follow=r;cam.z=Math.max(cam.z,.5);center(mid(r),r.t.y+23)}
function select(o,k){sel=o?{o,k}:null;if(!o)follow=null;buildIB();tabTo('info');panel(true)}
function tabTo(t){tab=t;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));document.querySelectorAll('.pn').forEach(p=>p.classList.toggle('on',p.id==='p-'+t));panel(true)}
// ---- gambar ----
function sigPos(g){const t=g.t,up=!t.d,ty=(t.y-cam.y)*cam.z;return{sx:(X(t,g.u)-cam.x)*cam.z,ty,sy:ty+(up?-19:19),up}}
function drawTrain(r,on){const t=r.t,z=cam.z,hx=X(t,r.u),L=r.len/MPX;if(hx<cam.x-L-20||hx>cam.x+W/z+L+20)return;
 cx.save();cx.translate(hx,t.y);if(t.d)cx.scale(-1,1);
 if(z<.2){const h=Math.max(8,4/z);cx.fillStyle=r.cars[r.cars.length>1?1:0].c;cx.fillRect(-L,-h/2,L,h);cx.fillStyle=r.cars[0].b;cx.fillRect(-L,-h/2,L,h*.25)}
 else{let x=0;for(let i=0;i<r.cars.length;i++){const c=r.cars[i],w=c.l/MPX;x-=w;
   cx.fillStyle=c.c;rr(x,-7,w-.8,14,c.k==='loco'||c.k==='cab'?3:1.5);cx.fill();
   cx.fillStyle=c.b;cx.fillRect(x,2,w-.8,2.4);
   if(c.k==='car'||c.k==='cab'){cx.fillStyle='rgba(18,38,58,.8)';const n=z>.3?5:0,ww=(w-4)/n/1.7;for(let j=0;j<n;j++)cx.fillRect(x+2+j*(w-3)/n,-4.5,ww,4)}
   if(c.k==='loco'){cx.fillStyle='rgba(18,38,58,.85)';cx.fillRect(x+w-5,-4.5,3.5,5);cx.fillStyle='#10161e';cx.fillRect(x+3,-7,w*.25,2)}
   if(c.k==='wag'){cx.fillStyle='rgba(0,0,0,.25)';cx.fillRect(x+1,-5,w-2.8,3)}
   if(c.k==='cab'){cx.fillStyle='rgba(18,38,58,.9)';if(i===0)cx.fillRect(-3.5,-5,2.5,5);else cx.fillRect(x+1,-5,2.5,5)}}
  if(z>.25&&r.v>.5||z>.25&&!r.hold){const g=cx.createRadialGradient(1,0,0,1,0,26);g.addColorStop(0,'rgba(255,238,185,.42)');g.addColorStop(1,'rgba(255,238,185,0)');cx.fillStyle=g;cx.fillRect(0,-26,34,52)}}
 if(on){cx.strokeStyle='#22d3ee';cx.lineWidth=1.6;cx.shadowColor='#22d3ee';cx.shadowBlur=14;rr(-L-2,-10,L+5,20,4);cx.stroke()}
 cx.restore()}
function draw(){const z=cam.z;cx.setTransform(dpr,0,0,dpr,0,0);
 const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#07101d');g.addColorStop(1,'#0b1829');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 cx.strokeStyle='rgba(90,150,200,.055)';cx.lineWidth=1;cx.beginPath();const gs=64;for(let x=-(cam.x*z)%gs;x<W;x+=gs){cx.moveTo(x,0);cx.lineTo(x,H)}for(let y=-(cam.y*z)%gs;y<H;y+=gs){cx.moveTo(0,y);cx.lineTo(W,y)}cx.stroke();
 cx.setTransform(dpr*z,0,0,dpr*z,-cam.x*z*dpr,-cam.y*z*dpr);
 const x0=cam.x-60,x1=cam.x+W/z+60,y0=cam.y-90,y1=cam.y+H/z+90,seg=(a,b,y)=>{cx.beginPath();cx.moveTo(a,y);cx.lineTo(b,y);cx.stroke()};
 for(const ln of LINES){if(ln.y+46<y0||ln.y>y1)continue;
  for(const s of ln.st){const x=s[1]*1000/MPX;if(x<x0-100||x>x1+100)continue;cx.fillStyle='#1b2a3d';cx.strokeStyle='#3b5f80';cx.lineWidth=1;rr(x-85,ln.y+12,170,22,3);cx.fill();cx.stroke()}}
 for(const t of tracks){if(t.y<y0||t.y>y1)continue;const a=Math.max(-200,x0),b=Math.min((t.len)/MPX,x1);if(b<a)continue;
  cx.setLineDash([2.5,7]);cx.strokeStyle='#2a3a50';cx.lineWidth=9;seg(a,b,t.y);cx.setLineDash([]);
  cx.strokeStyle='#8497ad';cx.lineWidth=1.3;seg(a,b,t.y-2.6);seg(a,b,t.y+2.6);
  cx.strokeStyle='rgba(34,211,238,.24)';cx.lineWidth=11;
  t.sig.forEach((g,i)=>{if(!t.occ[i])return;const p=X(t,g.u),q=X(t,i+1<t.sig.length?t.sig[i+1].u:t.len),lo=Math.min(p,q),hi=Math.max(p,q);if(hi<x0||lo>x1)return;seg(Math.max(lo,x0),Math.min(hi,x1),t.y)})}
 for(const r of trains)if(r.t.y>=y0&&r.t.y<=y1)drawTrain(r,sel&&sel.o===r);
 cx.setTransform(dpr,0,0,dpr,0,0);cx.textAlign='center';cx.font='11px system-ui';
 for(const ln of LINES){if(ln.y+46<y0||ln.y>y1)continue;cx.fillStyle='#4f6a86';cx.textAlign='left';cx.fillText(ln.n,8,(ln.y-cam.y)*z-44);cx.textAlign='center';
  for(const s of ln.st){const x=s[1]*1000/MPX;if(x<x0||x>x1)continue;cx.fillStyle=s[2]?'#d6e8f8':'#9bb2c9';cx.fillText(s[0],(x-cam.x)*z,(ln.y-cam.y)*z-31)}}
 for(const r of trains){const t=r.t;if(t.y<y0||t.y>y1)continue;const on=sel&&sel.o===r;if(z<.3&&!on)continue;const sx=(mid(r)-cam.x)*z,sy=(t.y-cam.y)*z+(t.d?24:-17)*Math.max(z,.5);
  if(sx<-80||sx>W+80)continue;cx.fillStyle=on?'#22d3ee':'#c4d5e6';cx.fillText(z>.6||on?r.num+' '+r.ty.n:r.num,sx,sy)}
 for(const t of tracks){if(t.y<y0||t.y>y1)continue;t.sig.forEach(g=>{const x=X(t,g.u);if(x<x0||x>x1)return;const{sx,ty,sy,up}=sigPos(g),on=sel&&sel.o===g;
   cx.strokeStyle='#52657c';cx.lineWidth=1.2;cx.beginPath();cx.moveTo(sx,ty+(up?-4:4));cx.lineTo(sx,sy);cx.stroke();
   const top=up?sy-20:sy;cx.fillStyle='#0d1726';cx.strokeStyle=on?'#22d3ee':'#44576e';cx.lineWidth=on?1.8:1;rr(sx-5,top,10,20,2.5);cx.fill();cx.stroke();
   ['R','Y','G'].forEach((k,i)=>{cx.beginPath();cx.arc(sx,top+4.5+i*5.5,2.4,0,7);if(g.eff===k){cx.fillStyle=CL[k];cx.shadowColor=CL[k];cx.shadowBlur=9}else{cx.fillStyle='#1d2a3a';cx.shadowBlur=0}cx.fill();cx.shadowBlur=0});
   if(z>.55||on){cx.fillStyle=on?'#22d3ee':'#7f93ab';cx.font='9px system-ui';cx.fillText(g.id,sx,up?top-3:top+30);cx.font='11px system-ui'}})}}
function drawOv(){const w=ov.width/dpr,h=ov.height/dpr;ox.setTransform(dpr,0,0,dpr,0,0);ox.clearRect(0,0,w,h);ox.font='10px system-ui';
 LINES.forEach((ln,i)=>{const y=14+i*20,x0=22,ww=w-30;ox.fillStyle='#7f93ab';ox.fillText(ln.id,5,y+3);ox.strokeStyle='#2b3f57';ox.beginPath();ox.moveTo(x0,y);ox.lineTo(x0+ww,y);ox.stroke();
  ox.fillStyle='#3d5a78';ln.st.forEach(s=>ox.fillRect(x0+ww*s[1]*1000/ln.tot-.5,y-3,1,6))});
 for(const r of trains){const i=LINES.indexOf(r.t.ln),ln=r.t.ln,y=14+i*20+(r.t.d?5:-5),x=22+(w-30)*(r.t.d?ln.tot-r.u:r.u)/ln.tot,on=sel&&sel.o===r;
  ox.fillStyle=on?'#22d3ee':r.cars[r.cars.length>1?1:0].b||'#ccc';ox.fillRect(x-1.5,y-1.5,on?5:3,on?5:3)}}
// ---- panel ----
function buildIB(){const b=$('ib');if(!sel){b.innerHTML='';return}
 b.innerHTML=sel.k==='train'?'<button data-a="fol">Ikuti</button><button data-a="hold">Tahan</button><button data-a="rel">Lanjutkan</button><button data-a="x">Tutup</button>'
 :'<button data-a="R" style="border-color:#ef4444">Merah</button><button data-a="Y" style="border-color:#f5b73b">Kuning</button><button data-a="G" style="border-color:#2dd47a">Hijau</button><button data-a="A">Otomatis</button><button data-a="x">Tutup</button>'}
$('ib').addEventListener('click',e=>{const a=e.target.dataset.a;if(!a||!sel)return;const o=sel.o;
 if(a==='x')return select(null);
 if(sel.k==='sig'){toast(setSig(o,a));return panel(true)}
 if(a==='fol'){follow=follow===o?null:o;toast(follow?'Mengikuti '+o.num:'Berhenti mengikuti')}
 if(a==='hold'){hold(o,true);toast(o.num+' akan ditahan di stasiun berikut')}if(a==='rel'){hold(o,false);toast(o.num+' dilepas')}panel(true)});
const tr=(a,b)=>'<tr><td>'+a+'</td><td>'+b+'</td></tr>';
function infoHTML(){if(!sel)return '<div class="sub">Ketuk kereta atau sinyal di peta. Geser untuk menggeser, cubit untuk zoom.</div>';const o=sel.o;
 if(sel.k==='sig'){const t=o.t,n=t.occ[t.sig.indexOf(o)];return '<h3>'+o.nm+'</h3><div class="sub">'+o.id+' · '+o.ty+' · arah '+t.dir+' ('+t.ln.n+')</div><table>'+
  tr('Aspek efektif','<span class="dot" style="background:'+CL[o.eff]+'"></span>'+AN[o.eff])+tr('Aman otomatis','<span class="dot" style="background:'+CL[o.safe]+'"></span>'+AN[o.safe])+tr('Permintaan PPKA',o.man==='R'?'Merah':o.man==='Y'?'Kuning':'Otomatis')+tr('Blok',n?'Terisi '+n.num+' '+n.ty.n:'Kosong')+tr('Alasan',o.why)+tr('Lokasi','km '+((t.d?t.ln.tot-o.u:o.u)/1000).toFixed(1))+'</table>'}
 const r=o,t=r.t,nx=r.stops.length?t.stn[r.stops[0]]:null,sg=t.sig[r.si],eta=nx?sim.t+(nx.stop-r.u)/(r.vmax*.7)+(r.dwell>0&&!r.at?r.dwell:0):0,dl=nx?Math.max(r.delay,Math.round((eta-r.plan[nx.k])/60)):r.delay;
 return '<h3>'+r.num+' · '+r.ty.n+'</h3><div class="sub">'+r.ty.cat+' · '+(r.ty.k==='krl'?'EMU':r.ty.loco)+' · '+r.cars.length+' kereta · '+Math.round(r.len)+' m</div><table>'+
  tr('Kecepatan',(r.v*3.6).toFixed(0)+' km/j')+tr('Kecepatan target',(r.lim*3.6).toFixed(0)+' km/j (maks '+(r.vmax*3.6).toFixed(0)+')')+tr('Status',r.hold?'Ditahan PPKA · '+r.state:r.state)+
  tr('Stasiun berikut',nx?nx.name+' · '+((nx.stop-r.u)/1000).toFixed(1)+' km':r.at?r.at.name+' (akhir)':'-')+tr('Tujuan',t.dir)+tr('Perkiraan tiba',nx?fT(eta):'-')+tr('Keterlambatan',dl+' menit')+
  tr('Sinyal depan',sg?'<span class="dot" style="background:'+CL[sg.eff]+'"></span>'+sg.id+' '+AN[sg.eff]+' · '+((sg.u-r.u)/1000).toFixed(2)+' km':'-')+tr('Blok','#'+(bi(t.sig,r.u)+2))+tr('Jalur',t.ln.n+' · '+(t.d?'turun':'naik'))+'</table>'}
function panel(f){const n=performance.now(),s=sim.t;
 $('clk').innerHTML='<b>'+fT(s,1)+' WIB</b>'+fD(s)+(sim.paused?' · JEDA':' · '+sim.speed+'×');
 let occ=0,wr=0;tracks.forEach(t=>t.occ.forEach(o=>{if(o)occ++}));trains.forEach(r=>{if(r.cause==='sig'&&r.v<.5||r.delay>=5||r.hold)wr++});
 $('stats').textContent='Kereta '+trains.length+' · Blok terisi '+occ+' · Peringatan '+wr;
 if(sel&&sel.o.dead)select(null);
 if(tab==='info')$('iv').innerHTML=infoHTML();
 else if(f||n-touch>1500){
  if(tab==='list')$('p-list').innerHTML=trains.slice().sort((a,b)=>a.t.ln.id<b.t.ln.id?-1:a.t.ln.id>b.t.ln.id?1:a.num.localeCompare(b.num)).map(r=>'<div class="row" data-id="'+r.id+'"><span><b>'+r.num+'</b> '+r.ty.n+'<br><i>'+r.t.ln.id+(r.t.d?'↓':'↑')+' '+r.state+'</i></span><span>'+(r.v*3.6|0)+' km/j<br><i>+'+r.delay+' mnt</i></span></div>').join('');
  if(tab==='log')$('p-log').innerHTML=LOG.slice(0,60).map(l=>'<div class="row"><span>'+l.x+'</span><i>'+fT(l.t,1)+'</i></div>').join('')||'<div class="sub">Belum ada kejadian.</div>'}}
$('p-list').addEventListener('click',e=>{const d=e.target.closest('.row');if(!d)return;const r=trains.find(x=>x.id==d.dataset.id);if(r){focus(r);follow=null}});
$('sh').addEventListener('pointerdown',()=>{touch=performance.now()});
$('tabs').addEventListener('click',e=>{if(e.target.dataset.t)tabTo(e.target.dataset.t)});
// ---- kontrol ----
function setSpeed(s){sim.speed=s;document.querySelectorAll('#sp button').forEach(b=>b.classList.toggle('on',+b.dataset.s===s));try{localStorage.setItem('ppka',JSON.stringify({s}))}catch(e){}}
$('sp').addEventListener('click',e=>{if(e.target.dataset.s)setSpeed(+e.target.dataset.s)});
$('ps').onclick=()=>{sim.paused=!sim.paused;$('ps').textContent=sim.paused?'Lanjut':'Jeda';$('ps').classList.toggle('on',sim.paused)};
$('rst').onclick=()=>{reset();select(null);follow=null;toast('Skenario direset')};
$('ln').addEventListener('click',e=>{const i=e.target.dataset.l;if(i==null)return;document.querySelectorAll('#ln button').forEach(b=>b.classList.toggle('on',b===e.target));
 const ln=LINES[i],r=trains.find(x=>x.t.ln===ln);follow=null;cam.z=.5;center(r?mid(r):200,ln.y+23);if(r)select(r,'train')});
const P=new Map();let pinch=null;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:performance.now()});
 if(P.size===2){const[a,b]=[...P.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:cam.z}}});
cv.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;const R=cv.getBoundingClientRect();
 if(P.size===1){if(Math.hypot(p.x-p.x0,p.y-p.y0)>6)follow=null;cam.x-=dx/cam.z;cam.y-=dy/cam.z}
 else if(P.size===2&&pinch){const[a,b]=[...P.values()];zoomAt((a.x+b.x)/2-R.left,(a.y+b.y)/2-R.top,pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d)}});
const up=e=>{const p=P.get(e.pointerId);P.delete(e.pointerId);pinch=null;if(p&&!P.size&&Math.hypot(p.x-p.x0,p.y-p.y0)<6&&performance.now()-p.t<450){const R=cv.getBoundingClientRect();tap(p.x-R.left,p.y-R.top)}};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{P.delete(e.pointerId);pinch=null});
cv.addEventListener('wheel',e=>{e.preventDefault();const R=cv.getBoundingClientRect();zoomAt(e.clientX-R.left,e.clientY-R.top,cam.z*(e.deltaY<0?1.15:.87))},{passive:false});
function tap(sx,sy){let best=null,bd=22;
 for(const t of tracks)for(const g of t.sig){const p=sigPos(g),d=Math.hypot(p.sx-sx,(p.up?p.sy-10:p.sy+10)-sy);if(d<bd){bd=d;best=g}}
 if(best)return select(best,'sig');
 const wx=cam.x+sx/cam.z,wy=cam.y+sy/cam.z,pad=14/cam.z;
 for(const r of trains){const t=r.t;if(Math.abs(wy-t.y)>Math.max(10,pad))continue;const h=X(t,r.u),L=r.len/MPX,lo=t.d?h:h-L,hi=t.d?h+L:h;if(wx>=lo-pad&&wx<=hi+pad)return select(r,'train')}
 select(null)}
ov.addEventListener('pointerdown',e=>{const R=ov.getBoundingClientRect(),i=Math.max(0,Math.min(LINES.length-1,Math.floor((e.clientY-R.top-4)/20))),ln=LINES[i],f=Math.max(0,Math.min(1,(e.clientX-R.left-22)/(R.width-30)));
 follow=null;center(f*ln.tot/MPX,ln.y+23);let b=null,bd=1e9;for(const r of trains)if(r.t.ln===ln){const d=Math.abs((r.t.d?ln.tot-r.u:r.u)/ln.tot-f);if(d<bd){bd=d;b=r}}if(b&&bd<.03)select(b,'train')});
// ---- loop ----
let last=performance.now(),lu=0;
function loop(n){const dt=Math.min((n-last)/1000,.1);last=n;
 if(!sim.paused){sim.acc+=dt*sim.speed;let c=0;while(sim.acc>=.25&&c++<800){step(.25);sim.acc-=.25}}
 if(follow&&!follow.dead){const tx=mid(follow)-W/2/cam.z,ty=follow.t.y+23-H/2/cam.z;cam.x+=(tx-cam.x)*.18;cam.y+=(ty-cam.y)*.18}
 draw();drawOv();if(n-lu>250){lu=n;panel()}requestAnimationFrame(loop)}
try{const s=JSON.parse(localStorage.getItem('ppka'));if(s&&s.s)sim.speed=s.s}catch(e){}
setSpeed(sim.speed);document.querySelector('#ln button').classList.add('on');
{const r=trains.find(x=>x.t.ln===LINES[0]);cam.z=.5;center(r?mid(r):300,LINES[0].y+23);if(r)select(r,'train')}
requestAnimationFrame(loop);
