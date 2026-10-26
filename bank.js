// Bank soal: pembuat soal dari data aplikasi (kotoba, kanji, bunpou, cerita, konjugasi, jalur kanji).
// Bentuk soal: {t:'mcq'|'type'|'order', q, big, sub, o:[...], a:indeks, acc:[...], toks:[...], ans, e (penjelasan), key (id SRS), meta, sec}
(function(){
const U=NQU,sh=U.shuf,W=window.NQ_WORDS||[],K=window.NQ_KANJIS||[],B=window.NQ_BUNPOU||[],ST=window.NQ_STORIES||[];
const KJ=/[一-鿿]/,pick=(a,n)=>sh(a).slice(0,n);
const uniq=(a)=>[...new Set(a)];
const plain=t=>t.replace(/([一-鿿々]+)\[([^\]]+)\]/g,'$1').replace(/《([^》]+)》/g,'$1');
const rom=r=>U.settings().romaji?` · ${U.romaji(r)}`:'';
function opts(correct,pool,n){const d=pick(uniq(pool.filter(x=>x!==correct)),n||3);const o=sh([correct].concat(d));return {o,a:o.indexOf(correct)}}
const wpool=f=>W.filter(w=>(!f||!f.cat||f.cat==='Semua'||w[3]===f.cat)&&(!f||!f.lvl||f.lvl==='Semua'||w[4]===f.lvl));
const kpool=f=>K.filter(k=>(!f||!f.klv||f.klv==='Semua'||k[4]===f.klv));
function sameCat(w,pool){const s=pool.filter(x=>x[3]===w[3]&&x[2]!==w[2]);return s.length>=3?s:pool}
const M={
 // Jepang -> Indonesia
 wordJP:(f)=>wpool(f).map(w=>()=>{const {o,a}=opts(w[2],sameCat(w,W).map(x=>x[2]));return {t:'mcq',q:'Apa arti kata ini?',big:w[0],sub:`${w[1]}${rom(w[1])}`,o,a,e:`${w[0]}（${w[1]}）= ${w[2]} · ${w[3]}`,key:'k:'+w[0],meta:{type:'kotoba',lb:w[0],rd:w[1],mn:w[2]}}}),
 // Indonesia -> Jepang
 wordID:(f)=>wpool(f).map(w=>()=>{const lab=x=>KJ.test(x[0])?`${x[0]}（${x[1]}）`:x[0];const {o,a}=opts(lab(w),sameCat(w,W).filter(x=>x[0]!==w[0]).map(lab));return {t:'mcq',q:'Pilih kata Jepang untuk arti ini:',big:w[2],o,a,e:`${w[2]} = ${w[0]}（${w[1]}）`,key:'k:'+w[0],meta:{type:'kotoba',lb:w[0],rd:w[1],mn:w[2]}}}),
 // mengetik jawaban (Indonesia -> Jepang, kana atau kanji)
 typeID:(f)=>wpool(f).filter(w=>w[0].length<=8).map(w=>()=>({t:'type',q:'Ketik dalam bahasa Jepang (kanji atau hiragana):',big:w[2],acc:uniq([w[0],w[1],U.hira2kata(w[1])]),e:`${w[2]} = ${w[0]}（${w[1]}）`,key:'k:'+w[0],meta:{type:'kotoba',lb:w[0],rd:w[1],mn:w[2]}})),
 // tebak bacaan (kata berkanji)
 readWord:(f)=>wpool(f).filter(w=>KJ.test(w[0])&&w[1]!==w[0]).map(w=>()=>{const {o,a}=opts(w[1],W.filter(x=>KJ.test(x[0])&&x[1].length>=Math.max(2,w[1].length-1)&&x[1].length<=w[1].length+1).map(x=>x[1]));return {t:'mcq',q:'Bagaimana cara membaca kata ini?',big:w[0],o,a,e:`${w[0]} dibaca ${w[1]} = ${w[2]}`,key:'k:'+w[0],meta:{type:'kotoba',lb:w[0],rd:w[1],mn:w[2]}}}),
 // kanji: arti & bacaan
 kanjiMean:(f)=>kpool(f).map(k=>()=>{const {o,a}=opts(k[2],K.filter(x=>x[4]===k[4]).map(x=>x[2]));return {t:'mcq',q:'Apa arti kanji ini?',big:k[0],o,a,e:`${k[0]} = ${k[2]} · bacaan ${k[1]} · contoh ${k[3]}`,key:'j:'+k[0],meta:{type:'kanji',lb:k[0],rd:k[1],mn:k[2]}}}),
 kanjiRead:(f)=>kpool(f).map(k=>()=>{const {o,a}=opts(k[1],K.filter(x=>x[4]===k[4]).map(x=>x[1]));return {t:'mcq',q:'Bacaan mana yang benar untuk kanji ini?',big:k[0],o,a,e:`${k[0]} = ${k[2]} · bacaan ${k[1]} · contoh ${k[3]}`,key:'j:'+k[0],meta:{type:'kanji',lb:k[0],rd:k[1],mn:k[2]}}}),
 // lengkapi kalimat dengan pola bunpou
 cloze:()=>{const out=[];B.forEach((b,bi)=>{const segs=b.p.replace(/[（(][^）)]*[）)]/g,'').split(/[、／\/]/).map(s=>s.replace(/～/g,'').trim()).filter(s=>s.length>=2);
   for(const ex of [b.e,b.e2]){const core=segs.find(s=>ex[0].includes(s));if(core)out.push({b,ex,core})}});
  return out.map(x=>()=>{const pool=B.map(y=>y.p.replace(/[（(][^）)]*[）)]/g,'').split(/[、／\/]/)[0].replace(/～/g,'').trim()).filter(c=>c.length>=2&&!x.ex[0].includes(c));
   const {o,a}=opts(x.core,pool);const sent=x.ex[0].replace(x.core,'＿＿＿＿');
   return {t:'mcq',q:'Lengkapi kalimat dengan pola yang tepat:',big:sent,sub:x.ex[1],furi:true,o,a,e:`${x.b.p}: ${x.b.f}. ${x.ex[0]} = ${x.ex[1]}`,key:'b:'+x.b.p,meta:{type:'bunpou',lb:x.b.p,mn:x.b.f}}})},
 // fungsi pola
 bunpouFn:()=>B.map(b=>()=>{const {o,a}=opts(b.f,B.map(x=>x.f));return {t:'mcq',q:`Pola ${b.p} dipakai untuk...`,o,a,e:`${b.p}: ${b.f}. Rumus: ${b.r}. Contoh: ${b.e[0]} = ${b.e[1]}`,key:'b:'+b.p,meta:{type:'bunpou',lb:b.p,mn:b.f}}}),
 // susun kata (kalimat cerita)
 order:()=>{const o=[];ST.forEach(s=>s.s.forEach(x=>{const p=plain(x.t).replace(/[「」]/g,'').trim(),t=p.split(/\s+/).filter(Boolean);if(t.length>=3&&t.length<=8)o.push({s,x,t,p})}));
  return o.map(z=>()=>({t:'order',q:'Susun kata-kata menjadi kalimat yang benar:',sub:z.x.id,toks:sh(z.t),ans:z.t.join('|'),e:`${z.t.join(' ')} = ${z.x.id}`,key:'c:'+z.s.id+':'+z.p.slice(0,10),meta:{type:'cerita',lb:z.p,mn:z.x.id}}))},
 // latihan membaca: kalimat cerita -> arti
 readSent:()=>{const o=[];ST.forEach(s=>s.s.forEach(x=>o.push({s,x})));
  return o.map(z=>()=>{const {o:oo,a}=opts(z.x.id,o.map(y=>y.x.id));return {t:'mcq',q:'Apa arti kalimat ini?',big:z.x.t,furi:'cerita',o:oo,a,e:`${plain(z.x.t)} = ${z.x.id}`,key:'c:'+z.s.id+':'+plain(z.x.t).slice(0,10),meta:{type:'cerita',lb:plain(z.x.t),mn:z.x.id}}})},
 // kosakata cerita
 storyVoc:()=>{const o=[];ST.forEach(s=>s.vocab.forEach(v=>o.push({s,v})));
  return o.map(z=>()=>{const {o:oo,a}=opts(z.v[2],o.map(y=>y.v[2]));return {t:'mcq',q:`Apa arti 「${z.v[0]}」(${z.v[1]})?`,o:oo,a,e:`${z.v[0]}（${z.v[1]}）= ${z.v[2]} · dari cerita 「${plain(z.s.jp)}」`,key:'v:'+z.v[0],meta:{type:'cerita',lb:z.v[0],rd:z.v[1],mn:z.v[2]}}})},
 // konjugasi
 conj:()=>{const C=window.NQCONJ;if(!C)return [];const vs=Object.keys(C.V).filter(w=>/[うくぐすつぬぶむる]$/.test(w)&&w.length<=6&&C.V[w][0]);
  const forms=C.FORMS.map(f=>f[0]);
  return vs.map(w=>()=>{const r=C.V[w][0],g=C.groupOf(w,r),f=forms[Math.floor(Math.random()*forms.length)];const ok=C.conj(w,r,g,f).s;
   const wrong=uniq([1,2,3].filter(x=>x!==g).map(gg=>{try{return C.conj(w,r,gg,f).s}catch(e){return null}}).concat([ok.replace(/ます$/,'る'),w.slice(0,-1)+f]).filter(x=>x&&x!==ok&&x!==w));
   const o=sh([ok].concat(pick(wrong,3)));
   return {t:'mcq',q:`Ubah ${w}（${r}）ke bentuk ${f}:`,o,a:o.indexOf(ok),e:`${w} termasuk kelompok ${g}. Bentuk ${f} = ${ok}`,key:'g:'+w+':'+f,meta:{type:'konjugasi',lb:w+' → '+f,mn:ok}}})},
 // urutan kanji (jalur)
 kanjiPath:()=>{const P=(window.NQJ&&NQJ.path)||[];if(P.length<5)return [];const LV={N5:'N5',Jembatan:'Jembatan N5–N4',N4:'N4'};
  return P.map((p,i)=>()=>{const kind=['next','prev','level'][Math.floor(Math.random()*3)];
   if(kind==='next'&&i<P.length-1){const {o,a}=opts(P[i+1].c,P.map(x=>x.c));return {t:'mcq',q:`Dalam jalur belajar, kanji setelah 「${p.c}」 adalah...`,o,a,e:`Urutan ${i+1} → ${i+2}: ${p.c} lalu ${P[i+1].c} (tahap ${P[i+1].stage}). Ini urutan rekomendasi aplikasi.`,key:'j:'+p.c,meta:{type:'kanji',lb:p.c}}}
   if(kind==='prev'&&i>0){const {o,a}=opts(P[i-1].c,P.map(x=>x.c));return {t:'mcq',q:`Kanji yang sebaiknya dipelajari sebelum 「${p.c}」 adalah...`,o,a,e:`Prasyarat 「${p.c}」 pada jalur: 「${P[i-1].c}」.`,key:'j:'+p.c,meta:{type:'kanji',lb:p.c}}}
   const o=['N5','Jembatan N5–N4','N4'];return {t:'mcq',q:'Kanji ini termasuk jalur yang mana?',big:p.c,o,a:o.indexOf(LV[p.lv]),e:`${p.c}: ${LV[p.lv]}, tahap ${p.stage}, urutan ${p.order}.`,key:'j:'+p.c,meta:{type:'kanji',lb:p.c}}})}
};
window.NQBANK={M,sh,plain,opts};
})();
