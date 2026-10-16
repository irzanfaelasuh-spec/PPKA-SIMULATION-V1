const fs=require('fs'),vm=require('vm'),rd=f=>fs.readFileSync(__dirname+'/../js/'+f+'.js','utf8');
const E=vm.runInNewContext(rd('data')+'\n'+rd('engine')+';({tracks,trains,step,sim,setSig,LOG})',{});
const bad=[];let gap=1e9,moved=0;const n0=E.trains.length;
// uji: sinyal manual ditolak/dibatasi saat blok terisi
let tested=false;
for(let i=0;i<30000;i++){
 const pre=[];for(const t of E.tracks)for(const r of t.tr)pre.push([r,t.sig[r.si],t.sig[r.si]&&t.sig[r.si].eff,r.u]);
 E.step(.25);
 for(const[r,g,e,u0]of pre){if(g&&g.u>u0&&e==='R'&&r.u>g.u)bad.push('melanggar merah '+g.id);if(r.u>u0+.01)moved++}
 for(const t of E.tracks)t.tr.forEach((r,k)=>{const l=t.tr[k-1];if(l)gap=Math.min(gap,l.u-l.len-r.u);if(!isFinite(r.u))bad.push('NaN')});
 if(!tested)for(const t of E.tracks){const i2=t.occ.findIndex(Boolean);if(i2>=0&&t.sig[i2].eff==='R'){const m=E.setSig(t.sig[i2],'G');if(/tetap Merah/.test(m)&&t.sig[i2].eff==='R')tested=true;else bad.push('hijau dipaksa: '+m)}}
}
const arr=E.LOG.length,tiba=E.LOG.filter(l=>/tiba di/.test(l.x)).length;
console.log({awal:n0,akhir:E.trains.length,jarakMin:+gap.toFixed(1),bergerak:moved>0,tiba,uji_sinyal_tidak_dipaksa:tested,pelanggaran:bad.length});
if(bad.length||gap<0||!tested||moved===0||E.trains.length<20){console.log('GAGAL',bad.slice(0,5));process.exit(1)}console.log('LULUS');
