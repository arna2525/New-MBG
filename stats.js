// Dasbor statistik di Profil: hanya angka dari data yang benar-benar tersimpan.
(function(){
const U=NQU,L=U.LS,esc=U.esc,P=document.getElementById('profil');if(!P)return;
const box=document.createElement('div');box.id='nqstats';P.appendChild(box);
const bar=(l,a,b)=>`<div class="jbar"><span>${l}</span><div class="progress"><span style="width:${b?Math.round(a/b*100):0}%"></span></div><b>${a}/${b}</b></div>`;
function draw(){
 const xp=(L.get('nqv9',{}).xp)||0,h=U.HIST.all(),sv=L.get('nqv5',{}),jp=L.get('nqjalur',{p:{}}).p||{},st=L.get('nqst',{done:[]}),srs=U.SRS.all();
 const days=(sv.days||[]).slice().sort();let streak=0;const t=new Date();for(;;){const d=new Date(t.getTime()-streak*864e5).toISOString().slice(0,10);if(days.includes(d))streak++;else if(streak===0&&!days.includes(d)){t.setDate(t.getDate()-1);if(!days.includes(new Date(t.getTime()).toISOString().slice(0,10)))break}else break;if(streak>400)break}
 const J=(window.NQJ&&NQJ.path)||[],ms=lv=>{const a=J.filter(p=>p.lv===lv);return [a.filter(p=>(jp[p.c]||{}).s==='mastered').length,a.length]};
 const n5=ms('N5'),jb=ms('Jembatan'),n4=ms('N4'),tot=J.length,mt=n5[0]+jb[0]+n4[0];
 const q=h.reduce((a,x)=>{a.n+=x.n;a.ok+=x.ok;return a},{n:0,ok:0}),acc=q.n?Math.round(q.ok/q.n*100):null;
 const stories=(window.NQ_STORIES||[]).length,sd=(st.done||[]).length,wr=U.SRS.wrong().length,due=U.SRS.due().length;
 const ach=[['Langkah pertama',h.length>=1,'Selesaikan 1 kuis'],['Rajin 10 kuis',h.length>=10,'Selesaikan 10 kuis'],['Level 3',xp>=200,'Capai 200 XP'],['Streak 3 hari',streak>=3,'Belajar 3 hari berturut-turut'],['10 kanji dikuasai',mt>=10,'Kuasai 10 kanji di jalur'],['Pembaca cerita',sd>=1,'Selesaikan 1 cerita'],['Akurasi 80%',acc!==null&&q.n>=30&&acc>=80,'Akurasi ≥80% dari ≥30 soal']];
 const rec=wr?`Ulangi ${wr} item yang sering salah di Pusat Kuis.`:mt<tot?`Lanjutkan jalur kanji (${mt}/${tot} dikuasai).`:'Coba simulasi JFT.';
 box.innerHTML=`<div class="sec"><h3>Statistik Belajar</h3></div><div class="notice"><p>XP total <b>${xp}</b> · Streak <b>${streak}</b> hari · Hari belajar <b>${days.length}</b></p><p>Akurasi kuis: <b>${acc===null?'belum ada data':acc+'% ('+q.ok+'/'+q.n+')'}</b> · Sesi kuis: <b>${h.length}</b></p><p>Item tercatat di Ulangi Cerdas: <b>${Object.keys(srs).length}</b> · jatuh tempo <b>${due}</b> · sering salah <b>${wr}</b></p></div>
 <div class="notice">${bar('Jalur kanji',mt,tot)}${bar('N5',n5[0],n5[1])}${bar('Jembatan N5–N4',jb[0],jb[1])}${bar('N4',n4[0],n4[1])}${bar('Cerita dibaca',sd,stories)}<p class="muted">Progres Bab 1–50 belum dilacak karena belum ada data latihan per bab.</p></div>
 <div class="notice"><b>Rekomendasi</b><p>${esc(rec)}</p></div>
 <div class="notice"><b>Pencapaian</b>${ach.map(a=>`<p>${a[1]?'🏆':'🔒'} ${a[0]} <span class="muted">— ${a[2]}</span></p>`).join('')}</div>
 <div class="notice"><b>Pengaturan</b><label class="kz-row"><span>Tampilkan romaji (bantuan baca)</span><input type="checkbox" id="nqro" ${U.settings().romaji?'checked':''}></label></div>`;
 const c=document.getElementById('nqro');if(c)c.onchange=()=>U.setRomaji(c.checked)}
const g=window.go;window.go=function(id,b){g(id,b);if(id==='profil')draw()};draw();
})();
