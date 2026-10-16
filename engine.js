'use strict';
// Mesin simulasi: bebas UI. Posisi u = meter sepanjang arah jalan; kereta hanya bergerak di jalur terhubung.
const sim={t:Date.now()/1000,speed:10,paused:false,acc:0},tracks=[],trains=[],LOG=[],MPX=2;let uid=0,sv=20261016;
const rnd=()=>{sv|=0;sv=sv+0x6D2B79F5|0;let t=Math.imul(sv^sv>>>15,1|sv);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)],ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const log=x=>{LOG.unshift({t:sim.t,x});if(LOG.length>150)LOG.pop()};
const X=(t,u)=>(t.d?t.ln.tot-u:u)/MPX;
const bi=(s,x)=>{let l=0,h=s.length;while(l<h){const m=(l+h)>>1;if(s[m].u<=x)l=m+1;else h=m}return l-1};
function build(){tracks.length=0;
 LINES.forEach((ln,li)=>{ln.tot=ln.st[ln.st.length-1][1]*1000;ln.y=170+li*220;
  for(let d=0;d<2;d++){const tot=ln.tot,t={ln,d,y:ln.y+d*46,len:tot+400,sig:[],stn:[],tr:[],occ:[],sp:ri(5,60)};
   const S=ln.st.map(s=>({name:s[0],km:s[1],maj:s[2],u:d?tot-s[1]*1000:s[1]*1000}));if(d)S.reverse();
   S.forEach((s,k)=>{s.k=k;s.stop=s.u+150});t.stn=S;
   const add=(u,ty,nm)=>t.sig.push({t,u,ty,nm,man:null,eff:'G',safe:'G',why:''});
   S.forEach((s,k)=>{if(k)add(s.u-350,'Masuk','Sinyal Masuk '+s.name);
    if(k<S.length-1){add(s.u+250,'Keluar','Sinyal Keluar '+s.name);const n=S[k+1];for(let g=s.u+2750;g<n.u-1550;g+=2500)add(g,'Blok','Sinyal Blok km '+((d?tot-g:g)/1000).toFixed(1))}});
   t.sig.sort((a,b)=>a.u-b.u);t.sig.forEach((g,i)=>g.id=ln.id+(d?'T':'N')+String(i+1).padStart(2,'0'));
   t.dir=S[S.length-1].name;tracks.push(t)}})}
function form(y){const c=[];
 if(y.k==='krl')for(let i=0;i<y.cars;i++)c.push({l:20,k:i&&i<y.cars-1?'car':'cab',c:y.body,b:y.band});
 else{c.push({l:17,k:'loco',c:LC[y.loco],b:'#e8edf2'});
  if(y.k==='ka'){for(let i=0;i<y.cars;i++)c.push({l:21,k:'car',c:y.body,b:y.band});if(y.cat==='Eksekutif')c.push({l:20,k:'car',c:'#556270',b:y.band})}
  else for(let i=ri(14,22);i>0;i--)c.push({l:14,k:'wag',c:y.body||pick(FW),b:y.band})}
 return c}
function mk(t,y,u,fresh){const cars=form(y),len=cars.reduce((a,c)=>a+c.l+1,0),kr=y.k,st=[];
 t.stn.forEach(s=>{if(s.stop>u+5&&(kr==='krl'||(kr==='ka'&&(s.maj||rnd()<.4))||s.k===t.stn.length-1))st.push(s.k)});
 const r={id:++uid,ty:y,t,u,v:0,len,cars,vmax:y.v,a:kr==='krl'?.85:kr==='ka'?.55:.3,b:kr==='krl'?.85:kr==='ka'?.6:.45,stops:st,plan:{},delay:0,dwell:fresh?ri(20,60):0,hold:false,si:0,lim:0,state:'Berjalan',at:fresh?t.stn[0]:null,cause:'',term:false,dead:false,
  num:'KA '+(kr==='krl'?ri(1100,1999):kr==='frt'?ri(5000,5999):ri(1,899))};
 let tt=sim.t+r.dwell,pu=u;st.forEach(k=>{const s=t.stn[k];tt+=(s.stop-pu)/(y.v*.7);r.plan[k]=tt;tt+=y.dw;pu=s.stop});
 while(r.si<t.sig.length&&t.sig[r.si].u<=u)r.si++;
 t.tr.push(r);trains.push(r);return r}
function seed(){tracks.forEach(t=>{const pool=TYPES.filter(y=>y.ln.includes(t.ln.id));
 for(let u=1500+rnd()*t.ln.sp*.6;u<t.ln.tot-3000;u+=t.ln.sp*(.8+rnd()*.4))mk(t,pick(pool),u,false)})}
function asp(t){const s=t.sig,n=s.length;t.occ=new Array(n).fill(null);
 for(const r of t.tr){const a=Math.max(bi(s,r.u-r.len),0),b=bi(s,r.u);for(let i=a;i<=b;i++)t.occ[i]=r}
 let nx='G';for(let i=n-1;i>=0;i--){const g=s[i],o=t.occ[i];let f='G',w='Blok kosong';
  if(o){f='R';w='Blok terisi '+o.num}else if(nx==='R'){f='Y';w='Sinyal berikutnya merah'}
  g.safe=f;g.eff=g.man==='R'?'R':g.man==='Y'&&f==='G'?'Y':f;if(g.man)w='Dibatasi PPKA ('+(g.man==='R'?'merah':'kuning')+'); '+w;g.why=w;nx=g.eff}}
function setSig(g,m){const t=g.t,W={R:'Merah',Y:'Kuning',G:'Hijau'};
 if(m==='R'){const b=t.tr.find(x=>x.u<g.u&&g.u-x.u<x.v*x.v/(2*x.b)+60);if(b)return 'Ditolak: '+b.num+' sudah dalam jarak pengereman '+g.id}
 g.man=m==='R'||m==='Y'?m:null;asp(t);
 const msg=m==='A'?g.id+' kembali otomatis':g.eff===m?g.id+' diatur '+W[m]:'Diminta '+W[m]+', tetap '+W[g.eff]+': '+g.why;log('PPKA: '+msg);return msg}
function hold(r,on){r.hold=on;
 if(on&&!r.at){const need=r.v*r.v/(2*r.b)+60,s=r.t.stn.find(s=>s.stop>r.u+need);
  if(s&&!r.stops.includes(s.k)){r.stops.push(s.k);r.stops.sort((a,b)=>a-b);r.term=false;r.plan[s.k]=r.plan[s.k]||sim.t+(s.stop-r.u)/(r.vmax*.7)}}
 log('PPKA '+(on?'menahan ':'melepas ')+r.num+' '+r.ty.n)}
function mv(r,k,dt){const t=r.t,L=t.sig,b=r.b;
 if(r.dwell>0){r.dwell-=dt;r.v=0;r.lim=0;
  if(r.term){r.state='Mengakhiri perjalanan';if(r.dwell<=0){r.dead=true;log(r.num+' '+r.ty.n+' mengakhiri perjalanan di '+r.at.name)}return}
  if(r.dwell<=0&&r.hold){r.dwell=1;r.state='Ditahan PPKA';return}
  r.state=r.at?'Berhenti di peron':'Menunggu berangkat';
  if(r.dwell<=0&&r.at){log(r.num+' berangkat dari '+r.at.name);r.at=null}return}
 let lim=r.vmax,c='';while(r.si<L.length&&L[r.si].u<=r.u)r.si++;
 for(let j=r.si;j<r.si+3&&j<L.length;j++){const g=L[j];
  if(g.eff==='R'){const l=Math.sqrt(2*b*Math.max(g.u-r.u-8,0));if(l<lim){lim=l;c='sig'}}
  else if(g.eff==='Y'&&j===r.si&&lim>22){lim=22;c='kuning'}}
 const ld=t.tr[k-1];
 if(ld){const l=Math.sqrt(2*b*Math.max(ld.u-ld.len-r.u-30,0));if(l<lim){lim=l;c='gap'}}
 if(r.stops.length){const s=t.stn[r.stops[0]],d=s.stop-r.u;
  if(d<=.6){r.u=s.stop;r.v=0;r.lim=0;r.stops.shift();r.at=s;r.delay=Math.max(0,Math.round((sim.t-r.plan[s.k])/60));r.term=!r.stops.length;r.dwell=r.term?40:Math.max(r.ty.dw,1);
   r.state=r.term?'Mengakhiri perjalanan':'Berhenti di peron';log(r.num+' tiba di '+s.name+(r.delay?' (terlambat '+r.delay+' mnt)':' (tepat waktu)'));return}
  const l=Math.sqrt(2*b*Math.max(d-.4,0));if(l<lim){lim=l;c='stn'}}
 r.lim=lim;r.cause=c;
 if(r.v<lim)r.v=Math.min(lim,r.v+r.a*dt);else r.v=Math.max(lim,r.v-1.5*b*dt);
 let nu=r.u+r.v*dt;const g0=L[r.si];
 if(g0&&g0.eff==='R'&&nu>g0.u-2){nu=Math.max(r.u,g0.u-2);r.v=0}
 if(ld&&nu>ld.u-ld.len-8){nu=Math.max(r.u,ld.u-ld.len-8);r.v=Math.min(r.v,ld.v)}
 r.u=nu;
 r.state=r.v<.5?(c==='sig'?'Berhenti di sinyal':c==='gap'?'Menunggu KA di depan':'Berhenti'):r.v>lim+.3?'Mengerem':r.v<lim-.5?'Berakselerasi':'Berjalan'}
function spawn(t,dt){t.sp-=dt;if(t.sp>0)return;if(!t.tr.every(r=>r.u-r.len>190)){t.sp=15;return}
 mk(t,pick(TYPES.filter(y=>y.ln.includes(t.ln.id))),150,true);t.sp=t.ln.hw*(.7+rnd()*.6)}
function step(dt){sim.t+=dt;
 for(const t of tracks){t.tr.sort((a,b)=>b.u-a.u);t.tr.forEach((r,k)=>mv(r,k,dt));
  if(t.tr.some(r=>r.dead))t.tr=t.tr.filter(r=>!r.dead);asp(t);spawn(t,dt)}
 for(let i=trains.length-1;i>=0;i--)if(trains[i].dead)trains.splice(i,1)}
function reset(){trains.length=0;LOG.length=0;tracks.forEach(t=>{t.tr=[];t.sig.forEach(g=>{g.man=null})});seed();tracks.forEach(asp);sim.t=Date.now()/1000}
build();seed();tracks.forEach(asp);
