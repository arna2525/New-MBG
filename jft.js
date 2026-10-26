// Simulasi ujian gaya JFT-Basic (latihan mandiri). BUKAN ujian resmi dan tidak menjamin kelulusan.
// Tanpa bagian mendengar (tidak ada audio). Soal dibuat otomatis dari data aplikasi.
(function(){
const U=NQU,B=NQBANK,esc=U.esc,KEY='nqjft',HK='nqjfth',DUR=30*60*1000;
const SECS=[['Kosakata & Kanji',['wordJP','readWord','kanjiMean','kanjiRead'],10],['Tata Bahasa & Ungkapan',['cloze','bunpouFn'],10],['Membaca',['readSent','storyVoc'],10]];
const sec=document.createElement('section');sec.id='jft';sec.className='page';document.getElementById('kuis').after(sec);
let T=null,tick=null,busy=false;
const $=id=>document.getElementById(id);
const ruby=t=>esc(t).replace(/([一-鿿々]+)\[([^\]]+)\]/g,'<ruby>$1<rt>$2</rt></ruby>').replace(/《([^》]+)》/g,'$1');
const head=(t,b)=>`<div class="subhead"><button class="back" onclick="${b||"go('kuis')"}">←</button><div><h2>${t}</h2></div></div>`;
const fmt=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const save=()=>U.LS.set(KEY,T);
function build(){const qs=[];SECS.forEach((s,si)=>{const got=[],seen=new Set();let guard=0;
  while(got.length<s[2]&&guard++<400){const m=s[1][guard%s[1].length],g=B.sh(NQBANK.M[m]({}))[0];if(!g)continue;const q=g();if(q.t!=='mcq'||seen.has(q.q+q.big))continue;seen.add(q.q+q.big);
   got.push({q:q.q,big:q.big||'',sub:q.sub||'',furi:q.furi||false,o:q.o,a:q.a,e:q.e,key:q.key,meta:q.meta,sec:si})}
  qs.push(...got)});return qs}
window.renderJft=function(){clearInterval(tick);const old=U.LS.get(KEY,null),h=U.LS.get(HK,[]);
 if(old&&!old.done&&Date.now()<old.end){T=old;return run()}
 if(old&&!old.done&&Date.now()>=old.end){T=old;return submit(true)}
 sec.innerHTML=head('Simulasi JFT')+`<div class="kz-body"><div class="notice"><b>Penting</b><p>Ini simulasi latihan buatan aplikasi, <b>bukan ujian resmi</b> dan tidak menjamin hasil ujian sebenarnya. Soal dibuat otomatis dari data di aplikasi ini. Bagian mendengar (listening) tidak tersedia karena belum ada audio.</p></div>
 <div class="hero-mini"><p>30 soal · 30 menit</p>${SECS.map(s=>`<p class="kz-sub">${s[0]}: ${s[2]} soal</p>`).join('')}</div>
 <button class="btn wide" onclick="jftStart()">Mulai Simulasi</button>
 ${h.length?`<h3 class="kz-h">Hasil sebelumnya</h3>${h.slice(-5).reverse().map(x=>`<div class="word"><div style="flex:1"><h4>${x.ok}/${x.n} benar (${x.acc}%)</h4><p>${esc(x.parts)}</p><span class="muted">${esc(x.date)} · ${x.timeUp?'waktu habis':'selesai'}</span></div></div>`).join('')}`:''}</div>`};
window.jftStart=()=>{if(busy)return;T={qs:build(),ans:{},flag:{},i:0,start:Date.now(),end:Date.now()+DUR,done:false};save();run()};
function run(){clearInterval(tick);paint();tick=setInterval(()=>{if(!T||T.done){clearInterval(tick);return}const left=T.end-Date.now(),el=$('jfttm');if(el)el.textContent=fmt(left);if(left<=0)submit(true)},500)}
function paint(){const q=T.qs[T.i],n=T.qs.length,a=T.ans[T.i];
 sec.innerHTML=head('JFT · '+esc(SECS[q.sec][0]),'jftLeave()')+`<div class="kz-body"><div class="kz-meta"><span>Soal ${T.i+1}/${n}</span><b id="jfttm" style="color:var(--red2)">${fmt(T.end-Date.now())}</b></div>
 <div class="hero-mini"><p>${esc(q.q)}</p>${q.big?`<div class="kz-big ${/[一-鿿]/.test(q.big)&&q.big.length<4?'kj':''}">${q.furi==='cerita'?ruby(q.big):(q.furi&&window.furi?window.furi(esc(q.big)):esc(q.big))}</div>`:''}${q.sub?`<p class="kz-sub">${esc(q.sub)}</p>`:''}</div>
 <div class="kz-opts">${q.o.map((x,i)=>`<button class="quizopt ${a===i?'ok':''}" onclick="jftAns(${i})">${['A','B','C','D'][i]}. ${esc(x)}</button>`).join('')}</div>
 <div class="kz-act"><button class="btn ghost" onclick="jftGo(-1)" ${T.i===0?'disabled':''}>← Sebelumnya</button><button class="btn ghost" onclick="jftFlag()">${T.flag[T.i]?'Hapus ragu':'Ragu-ragu'}</button><button class="btn" onclick="jftGo(1)" ${T.i===n-1?'disabled':''}>Lanjut →</button></div>
 <div class="kz-grid5">${T.qs.map((_,i)=>`<button class="kz-n ${i===T.i?'cur':''} ${T.ans[i]!==undefined?'ans':''} ${T.flag[i]?'flag':''}" onclick="jftJump(${i})">${i+1}</button>`).join('')}</div>
 <p class="muted">Terjawab ${Object.keys(T.ans).length}/${n} · ragu ${Object.keys(T.flag).filter(k=>T.flag[k]).length}</p>
 <button class="btn wide" onclick="jftFinish()">Selesai & Kumpulkan</button></div>`}
window.jftAns=i=>{if(!T||T.done)return;T.ans[T.i]=i;save();paint()};
window.jftGo=d=>{if(!T||T.done)return;T.i=Math.min(T.qs.length-1,Math.max(0,T.i+d));save();paint()};
window.jftJump=i=>{if(!T||T.done)return;T.i=i;save();paint()};
window.jftFlag=()=>{if(!T||T.done)return;T.flag[T.i]=!T.flag[T.i];save();paint()};
window.jftLeave=()=>{clearInterval(tick);go('kuis')}; // waktu tetap berjalan; bisa dilanjutkan dari menu
window.jftFinish=()=>{const un=T.qs.length-Object.keys(T.ans).length;if(confirm(un?`Masih ${un} soal belum dijawab. Kumpulkan sekarang?`:'Kumpulkan jawaban sekarang?'))submit(false)};
function submit(timeUp){if(busy||!T||T.done&&!T.res&&false)return;if(T.done&&T.res)return showRes();busy=true;clearInterval(tick);T.done=true;
 const parts=SECS.map(()=>[0,0]);let ok=0;T.qs.forEach((q,i)=>{parts[q.sec][1]++;const good=T.ans[i]===q.a;if(good){ok++;parts[q.sec][0]++}
  if(T.ans[i]!==undefined&&q.key)U.SRS.rec(q.key,good,q.meta)});
 const n=T.qs.length,acc=Math.round(ok/n*100);T.res={ok,n,acc,parts,timeUp:!!timeUp,used:Math.min(DUR,Date.now()-T.start)};save();
 const h=U.LS.get(HK,[]);h.push({ok,n,acc,timeUp:!!timeUp,date:new Date().toLocaleString('id-ID'),parts:SECS.map((s,i)=>`${s[0]} ${parts[i][0]}/${parts[i][1]}`).join(' · ')});U.LS.set(HK,h.slice(-20));
 U.HIST.add({mode:'Simulasi JFT',n,ok,acc,sec:Math.round(T.res.used/1000),date:new Date().toLocaleString('id-ID')});window.nqGain&&nqGain(10+Math.round(ok/2));busy=false;showRes()}
function showRes(){const r=T.res;sec.innerHTML=head('Hasil Simulasi','jftExit()')+`<div class="kz-body"><div class="hero-mini kz-res"><h3>${r.ok} / ${r.n}</h3><p>Akurasi ${r.acc}% · Waktu ${fmt(r.used)}${r.timeUp?' (waktu habis, otomatis dikumpulkan)':''}</p></div>
 <div class="notice">${SECS.map((s,i)=>`<p>${s[0]}: <b>${r.parts[i][0]}/${r.parts[i][1]}</b></p>`).join('')}<p class="muted">Simulasi latihan, bukan skor resmi JFT.</p></div>
 <h3 class="kz-h">Pembahasan</h3>${T.qs.map((q,i)=>{const a=T.ans[i],good=a===q.a;return `<div class="word"><div style="flex:1"><h4>${i+1}. ${good?'✔':'✘'} ${esc(q.big?B.plain(q.big):q.q)}</h4><p>Jawabanmu: ${a===undefined?'(kosong)':esc(q.o[a])} · Benar: ${esc(q.o[q.a])}</p><span class="muted">${esc(q.e)}</span></div></div>`}).join('')}
 <button class="btn wide" onclick="jftExit(true)">Simulasi baru</button><button class="btn wide ghost" onclick="jftExit()">Kembali</button></div>`}
window.jftExit=again=>{U.LS.set(KEY,null);T=null;again?renderJft():go('kuis')};
const g=window.go;window.go=function(id,b){g(id,b);if(id==='jft')renderJft()};
// tombol dari Pusat Kuis
const rk=window.renderKuisHub;window.renderKuisHub=function(){rk();const o=U.LS.get(KEY,null),act=o&&!o.done&&Date.now()<o.end;const b=document.querySelector('#kuis .kz-body');if(b)b.insertAdjacentHTML('afterbegin',`<button class="btn wide" onclick="go('jft')">${act?'Lanjutkan Simulasi JFT ('+fmt(o.end-Date.now())+')':'Simulasi JFT (30 soal, timer)'}</button>`)};
})();
