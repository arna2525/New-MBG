// Pusat Kuis: berbagai mode soal + Ulangi Cerdas (SRS). Data hanya dari penyimpanan lokal nyata.
(function(){
const U=NQU,B=NQBANK,esc=U.esc;
const MODES=[['wordJP','Kotoba JP → ID','Pilih arti kata'],['wordID','Kotoba ID → JP','Pilih kata Jepang'],['typeID','Ketik Jawaban','Ketik kata Jepang'],['readWord','Bacaan Kata','Tebak cara baca kanji'],
['kanjiMean','Kanji: Arti','Arti kanji'],['kanjiRead','Kanji: Bacaan','Bacaan kanji'],['kanjiPath','Urutan Kanji','Jalur N5→N4'],['cloze','Lengkapi Kalimat','Pola bunpou'],['bunpouFn','Fungsi Pola','Arti pola bunpou'],
['order','Susun Kata','Kalimat cerita'],['readSent','Latihan Membaca','Arti kalimat cerita'],['storyVoc','Kosakata Cerita','Dari cerita'],['conj','Konjugasi','Bentuk kata kerja']];
let S=null,cfg={n:10,mode:'wordJP',lvl:'Semua',klv:'Semua'};
const $=id=>document.getElementById(id);
const sec=document.createElement('section');sec.id='kuis';sec.className='page';
document.getElementById('latihan').after(sec);
const ruby=t=>esc(t).replace(/([一-鿿々]+)\[([^\]]+)\]/g,'<ruby>$1<rt>$2</rt></ruby>').replace(/《([^》]+)》/g,'$1');
const norm=s=>U.kata2hira(String(s)).replace(/[\s　・]/g,'').toLowerCase();
function head(t,back){return `<div class="subhead"><button class="back" onclick="${back||"go('latihan')"}">←</button><div><h2>${t}</h2></div></div>`}
function levels(){const s=new Set((window.NQ_WORDS||[]).map(w=>w[4]));return ['Semua',...s]}
window.renderKuisHub=function(){S=null;const due=U.SRS.due().length,wr=U.SRS.wrong().length,h=U.HIST.all().slice(-3).reverse();
 sec.innerHTML=head('Pusat Kuis')+`<div class="kz-body">
 <div class="notice kz-srs"><b>Ulangi Cerdas</b><p>${due} item jatuh tempo · ${wr} item sering salah</p><button class="btn wide" onclick="kzStartSRS()" ${due||wr?'':'disabled'}>Mulai Ulangi Cerdas</button>${due||wr?'':'<p class="muted">Belum ada data. Kerjakan kuis dulu — jawabanmu akan tercatat otomatis.</p>'}</div>
 <h3 class="kz-h">Pilih mode</h3><div class="kz-grid">${MODES.map(m=>`<button class="kz-mode ${cfg.mode===m[0]?'on':''}" onclick="kzSet('mode','${m[0]}')"><b>${m[1]}</b><span>${m[2]}</span></button>`).join('')}</div>
 <h3 class="kz-h">Pengaturan</h3>
 <div class="kz-row"><span>Jumlah soal</span><div class="pills">${[10,20,30].map(n=>`<button class="pill ${cfg.n===n?'active':''}" onclick="kzSet('n',${n})">${n}</button>`).join('')}</div></div>
 <div class="kz-row"><span>Level kotoba</span><select onchange="kzSet('lvl',this.value)">${levels().map(l=>`<option ${l===cfg.lvl?'selected':''}>${esc(l)}</option>`).join('')}</select></div>
 <div class="kz-row"><span>Level kanji</span><select onchange="kzSet('klv',this.value)">${['Semua','N5','N4'].map(l=>`<option ${l===cfg.klv?'selected':''}>${l}</option>`).join('')}</select></div>
 <button class="btn wide" onclick="kzStart()">Mulai Kuis →</button>
 ${h.length?`<h3 class="kz-h">Riwayat terakhir</h3>${h.map(x=>`<div class="word"><div style="flex:1"><h4>${esc(x.mode)}</h4><p>${x.ok}/${x.n} benar · ${x.acc}% · ${x.sec} dtk</p><span class="muted">${esc(x.date)}</span></div></div>`).join('')}`:''}</div>`};
window.kzState=()=>S;window.kzSet=(k,v)=>{cfg[k]=v;renderKuisHub()};
function begin(items,label){if(!items.length){alert('Tidak ada soal untuk pengaturan ini. Coba ubah level atau mode.');return}
 S={list:items,i:0,ok:0,wrong:[],t0:Date.now(),locked:false,label,sel:[],cur:null};show()}
window.kzStart=()=>{const gens=NQBANK.M[cfg.mode](cfg);
 const pick=B.sh(gens).slice(0,cfg.n);begin(pick,(MODES.find(m=>m[0]===cfg.mode)||[])[1]||cfg.mode)};
window.kzStartSRS=()=>{const keys=new Set(U.SRS.due().concat(U.SRS.wrong()).map(r=>r.key));
 const all=[];['wordJP','kanjiMean','bunpouFn'].forEach(m=>NQBANK.M[m]({}).forEach(g=>all.push(g)));
 const seen=new Set(),sel=[];for(const g of B.sh(all)){const q=g();if(keys.has(q.key)&&!seen.has(q.key)){seen.add(q.key);sel.push(()=>q)}if(sel.length>=cfg.n)break}
 begin(sel,'Ulangi Cerdas')};
function show(){const q=S.cur=S.list[S.i]();S.locked=false;S.sel=[];const n=S.list.length;
 let body='';
 const big=q.big?`<div class="kz-big ${/[一-鿿]/.test(q.big)?'kj':''}">${q.furi==='cerita'?ruby(q.big):(q.furi&&window.furi?window.furi(esc(q.big)):esc(q.big))}</div>`:'';
 if(q.t==='mcq')body=`<div class="kz-opts">${q.o.map((x,i)=>`<button class="quizopt" onclick="kzPick(${i})">${['A','B','C','D'][i]}. ${esc(x)}</button>`).join('')}</div>`;
 else if(q.t==='type')body=`<input id="kzin" class="kz-in" autocomplete="off" placeholder="Ketik jawaban…" onkeydown="if(event.key==='Enter')kzCheck()"><button class="btn wide" onclick="kzCheck()">Cek Jawaban</button>`;
 else body=`<div class="kz-slot" id="kzslot"></div><div class="kz-toks">${q.toks.map((t,i)=>`<button class="pill" data-i="${i}" onclick="kzTok(${i},this)">${esc(t)}</button>`).join('')}</div><div class="kz-act"><button class="btn ghost" onclick="kzClr()">Ulang</button><button class="btn" onclick="kzCheck()">Cek Jawaban</button></div>`;
 sec.innerHTML=head(S.label,'kzExit()')+`<div class="kz-body"><div class="kz-meta"><span>Soal ${S.i+1} dari ${n}</span><span>Benar ${S.ok}</span></div><div class="progress"><span style="width:${S.i/n*100}%"></span></div>
 <div class="hero-mini"><p>${esc(q.q)}</p>${big}${q.sub&&q.t!=='order'?`<p class="kz-sub">${esc(q.sub)}</p>`:''}${q.t==='order'?`<p class="kz-sub">Arti: ${esc(q.sub)}</p>`:''}</div>${body}<div id="kzfb"></div></div>`;
 sec.scrollTop=0}
function finish1(ok,q,given){if(S.locked)return;S.locked=true;if(ok){S.ok++;window.nqGain&&nqGain(2)}else S.wrong.push({q,given});
 if(q.key)U.SRS.rec(q.key,ok,q.meta);
 $('kzfb').innerHTML=`<div class="hero-mini kz-fb ${ok?'good':'bad'}"><b>${ok?'Benar!':'Belum tepat'}</b><p>${esc(q.e)}</p></div><button class="btn wide" onclick="kzNext()">${S.i+1>=S.list.length?'Lihat Hasil':'Soal berikutnya →'}</button>`}
window.kzPick=i=>{if(S.locked)return;const q=S.cur,ok=i===q.a;sec.querySelectorAll('.quizopt').forEach((b,j)=>{b.disabled=true;if(j===q.a)b.classList.add('ok');else if(j===i)b.classList.add('ng')});finish1(ok,q,q.o[i])};
window.kzTok=(i,b)=>{if(S.locked||b.disabled)return;b.disabled=true;S.sel.push(S.cur.toks[i]);$('kzslot').textContent=S.sel.join(' ')};
window.kzClr=()=>{if(S.locked)return;S.sel=[];$('kzslot').textContent='';sec.querySelectorAll('.kz-toks .pill').forEach(b=>b.disabled=false)};
window.kzCheck=()=>{if(S.locked)return;const q=S.cur;
 if(q.t==='type'){const v=norm($('kzin').value);if(!v){$('kzfb').innerHTML='<p class="muted">Isi jawabanmu dulu ya.</p>';return}finish1(q.acc.some(a=>norm(a)===v),q,$('kzin').value);$('kzin').disabled=true}
 else{if(!S.sel.length){$('kzfb').innerHTML='<p class="muted">Susun kata dulu ya.</p>';return}finish1(S.sel.join('|')===q.ans,q,S.sel.join(' '))}};
window.kzNext=()=>{if(!S||!S.locked)return;S.i++;S.i>=S.list.length?summary():show()};
window.kzExit=()=>{if(S&&S.i>0&&!confirm('Keluar dari kuis? Kemajuan sesi ini tidak disimpan ke riwayat.'))return;renderKuisHub()};
function summary(){const n=S.list.length,acc=Math.round(S.ok/n*100),sec_=Math.round((Date.now()-S.t0)/1000);
 U.HIST.add({mode:S.label,n,ok:S.ok,acc,sec:sec_,date:new Date().toLocaleString('id-ID')});window.nqGain&&nqGain(5);
 sec.innerHTML=head('Hasil')+`<div class="kz-body"><div class="hero-mini kz-res"><h3>${S.ok} / ${n}</h3><p>Akurasi ${acc}% · Waktu ${sec_} detik</p></div>
 ${S.wrong.length?`<h3 class="kz-h">Jawaban yang salah</h3>${S.wrong.map(w=>`<div class="word"><div style="flex:1"><h4>${esc(w.q.big?B.plain(w.q.big):w.q.q)}</h4><p>Jawabanmu: ${esc(w.given)}</p><span class="muted">${esc(w.q.e)}</span></div></div>`).join('')}`:'<p class="notice">Sempurna, tidak ada yang salah!</p>'}
 <button class="btn wide" onclick="kzStart()">Ulangi mode ini</button><button class="btn wide ghost" onclick="renderKuisHub()">Kembali ke Pusat Kuis</button></div>`;S=null}
const g=window.go;window.go=function(id,b){g(id,b);if(id==='kuis')renderKuisHub()};
const L=$('latihan');if(L&&!$('kzlink')){const a=document.createElement('button');a.id='kzlink';a.className='btn wide';a.textContent='Buka Pusat Kuis (13 mode + Ulangi Cerdas)';a.onclick=()=>go('kuis');L.querySelector('.subhead').after(a)}
// catat SRS dari fitur lama
const rc=window.rateCard;if(rc)window.rateCard=function(known){try{const a=currentDeck();const c=a[ci];if(c)U.SRS.rec('k:'+c[0],!!known,{type:'kotoba',lb:c[0],rd:c[1],mn:c[2]})}catch(e){}return rc.apply(this,arguments)};
})();
