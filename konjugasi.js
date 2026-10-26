// Mesin konjugasi berbasis kelompok kata kerja + pengecualian (menggantikan renderConjugation lama).
// Bentuk: ます, ません, ました, ませんでした, て, た, ない, たい. Data: data/verbs.js (kata -> [bacaan, arti, kelompok]).
(function(){
const V=window.NQ_VERBS||{},$=id=>document.getElementById(id),esc=NQU.esc;
const IROW={う:'い',く:'き',ぐ:'ぎ',す:'し',つ:'ち',ぬ:'に',ぶ:'び',む:'み',る:'り'},AROW={う:'わ',く:'か',ぐ:'が',す:'さ',つ:'た',ぬ:'な',ぶ:'ば',む:'ま',る:'ら'};
const TE={う:['って','った'],つ:['って','った'],る:['って','った'],む:['んで','んだ'],ぶ:['んで','んだ'],ぬ:['んで','んだ'],く:['いて','いた'],ぐ:['いで','いだ'],す:['して','した']};
// Berakhiran いる/える tetapi KELOMPOK 1 (pengecualian)
const G1EXC=new Set(['帰る','入る','走る','切る','知る','要る','減る','参る','返る','散る','握る','限る','滑る','蹴る','焦る','照る','喋る','かえる','はいる','はしる','きる','しる','いる','へる','まいる','ちる','にぎる','かぎる','すべる','ける','あせる','てる','しゃべる']);
// 1 huruf kanji + る yang termasuk kelompok 2 (bacaan tidak terlihat dari tulisan)
const G2K=new Set(['見る','着る','寝る','似る','煮る','居る','得る','出る','経る','射る','干る','借りる']);
const E_I=/[いきしちにひみりぎじびぴえけせてねへめれげぜでべぺ]る$/;
function groupOf(w,r){const e=V[w];if(e&&e[2])return e[2];
 if(/する$/.test(w))return 3;if(/来る$|^くる$/.test(w))return 3;
 if(G1EXC.has(w))return 1;if(/る$/.test(w)&&G2K.has(w.slice(-2)))return 2;
 const rd=r||w;if(/る$/.test(rd)&&E_I.test(rd)&&!(G1EXC.has(rd)))return 2;
 if(/る$/.test(w)&&E_I.test(w)&&!G1EXC.has(w))return 2;
 return 1}
function one(x,g,f,iku,aru){
 if(g===3){
  if(/する$/.test(x)){const b=x.slice(0,-2);return {ます:'します',ません:'しません',ました:'しました',ませんでした:'しませんでした',て:'して',た:'した',ない:'しない',たい:'したい'}[f].replace(/^/,b)}
  const b=x.replace(/(来る|くる)$/,'');const k=/来る$/.test(x)?'来':'';const st=y=>b+(k||y);
  return {ます:st('き')+'ます',ません:st('き')+'ません',ました:st('き')+'ました',ませんでした:st('き')+'ませんでした',て:st('き')+'て',た:st('き')+'た',ない:st('こ')+'ない',たい:st('き')+'たい'}[f]}
 const last=x.slice(-1),stem=x.slice(0,-1);
 if(g===2)return {ます:stem+'ます',ません:stem+'ません',ました:stem+'ました',ませんでした:stem+'ませんでした',て:stem+'て',た:stem+'た',ない:stem+'ない',たい:stem+'たい'}[f];
 const i=IROW[last],a=AROW[last];if(!i)return null;
 let [te,ta]=TE[last]||['',''];if(iku&&last==='く'){te='って';ta='った'}
 return {ます:stem+i+'ます',ません:stem+i+'ません',ました:stem+i+'ました',ませんでした:stem+i+'ませんでした',て:stem+te,た:stem+ta,ない:aru?'ない':stem+a+'ない',たい:stem+i+'たい'}[f]}
function conj(w,r,g,f){const iku=/行く$/.test(w)||(!/[一-鿿]/.test(w)&&/いく$/.test(w)&&w==='いく')||/いく$/.test(r||'')&&/行く$/.test(w),aru=(w==='ある'||w==='有る');
 return {s:one(w,g,f,iku,aru),r:r&&r!==w?one(r,g,f,/いく$/.test(r)&&(/行く$/.test(w)||w===r),aru):null}}
const FORMS=[['ます','Bentuk ます (sopan)'],['ません','Bentuk ません (negatif sopan)'],['ました','Bentuk ました (lampau sopan)'],['ませんでした','Bentuk ませんでした (negatif lampau sopan)'],['て','Bentuk て'],['た','Bentuk た (lampau biasa)'],['ない','Bentuk ない (negatif biasa)'],['たい','Bentuk たい (ingin)']];
function rule(g,f,x){const last=x.slice(-1);
 if(g===3){if(/する$/.test(x))return {ます:'する → し + ます',ません:'する → し + ません',ました:'する → し + ました',ませんでした:'する → し + ませんでした',て:'する → して',た:'する → した',ない:'する → しない',たい:'する → し + たい'}[f];
  return {ます:'くる → き + ます',ません:'くる → き + ません',ました:'くる → き + ました',ませんでした:'くる → き + ませんでした',て:'くる → きて',た:'くる → きた',ない:'くる → こ + ない（き berubah menjadi こ）',たい:'くる → き + たい'}[f]}
 if(g===2)return `buang る + ${f}`;
 const i=IROW[last],a=AROW[last],[te,ta]=TE[last]||['',''];
 return {ます:`${last} → ${i} + ます`,ません:`${last} → ${i} + ません`,ました:`${last} → ${i} + ました`,ませんでした:`${last} → ${i} + ませんでした`,て:`${last} → ${te}`,た:`${last} → ${ta}`,ない:`${last} → ${a} + ない`,たい:`${last} → ${i} + たい`}[f]}
function notes(w,r,g){const n=[],R=r||w;
 if(g===1&&(G1EXC.has(w)||G1EXC.has(R)))n.push(`<b>Pengecualian:</b> ${esc(w)} berakhiran る dan tampak seperti kelompok 2, tetapi termasuk <b>kelompok 1</b> sehingga berubah seperti kata kerja kelompok 1 (contoh ます: ${esc(w.slice(0,-1))}り＋ます).`);
 if(/行く$/.test(w)||R==='いく')n.push('<b>Pengecualian:</b> 行く → 行って / 行った (bukan 行いて / 行いた).');
 if(w==='ある'||w==='有る')n.push('<b>Pengecualian:</b> ある bentuk negatif biasanya <b>ない</b> (bukan あらない).');
 if(g===3&&/来る|^くる$/.test(w))n.push('<b>Tidak beraturan:</b> 来る (くる) berubah き / こ; kanji 来 tetap tetapi bacaannya berubah.');
 if(g===3&&/する$/.test(w))n.push('<b>Tidak beraturan:</b> する berubah menjadi し. Untuk kata benda + する hanya する yang berubah.');
 if(g===2&&/[一-鿿]/.test(w)&&!V[w])n.push('Kata ini dianggap kelompok 2 karena berakhiran 〜える/〜いる (kata kerja 〜える/〜いる dapat juga kelompok 1: periksa di kamus bila ragu).');
 return n}
window.NQCONJ={V,groupOf,conj,FORMS,G1EXC};
window.renderConjugation=function(){const el=$('verbresult');if(!el)return;let v=($('verbinput')?.value||'').trim();
 if(!v){el.innerHTML='<p class="notice">Masukkan kata kerja bentuk kamus.</p>';return}
 let r='',m='',g,guess=false;const e=V[v];
 if(e){r=e[0];m=e[1]}
 else{ // cari lewat bacaan (ketik kana) -> semua kata dengan bacaan sama
  const hit=Object.keys(V).filter(k=>V[k][0]===v&&k!==v);
  if(hit.length===1){$('verbinput').value=hit[0];return window.renderConjugation()}
  if(hit.length){el.innerHTML=hit.slice(0,3).map(k=>`<button class="btn light" style="margin:4px 4px 8px 0" onclick="document.getElementById('verbinput').value='${k}';renderConjugation()">${esc(k)}（${esc(V[k][0])}）${esc(V[k][1])}</button>`).join('')+'<p class="muted">Ada beberapa kata dengan bacaan ini, pilih salah satu.</p>';return}
  if(/(ます|ません|ました|ませんでした)$/.test(v)||(/(て|た|ない)$/.test(v)&&!/[うくぐすつぬぶむる]$/.test(v))){el.innerHTML='<div class="hero-mini"><b>Itu bukan bentuk kamus</b><p>Masukkan kata kerja dalam <b>bentuk kamus</b> (berakhiran う・く・ぐ・す・つ・ぬ・ぶ・む・る), misalnya 食べる bukan 食べます.</p></div>';return}
  if(!/[うくぐすつぬぶむる]$/.test(v)){el.innerHTML='<div class="hero-mini"><b>Belum dapat mengenali kata ini</b><p>Kata kerja bentuk kamus selalu berakhiran う・く・ぐ・す・つ・ぬ・ぶ・む・る (contoh: 食べる、読む、行く、する、来る). "'+esc(v)+'" tidak berakhiran seperti itu atau bukan kata kerja.</p></div>';return}
  guess=true;m='arti belum tersedia di kamus aplikasi'}
 g=groupOf(v,r);const gl=g===1?'Kelompok 1 (godan)':g===2?'Kelompok 2 (ichidan)':'Kelompok 3 (tidak beraturan)';
 const rows=FORMS.map(f=>{const o=conj(v,r,g,f[0]);if(!o||!o.s)return '';
  return `<tr><td style="padding:10px 6px;border-bottom:1px solid var(--line);color:var(--muted);width:38%">${esc(f[1])}<div style="font-size:12px;margin-top:3px;color:#ff9aa3">${esc(rule(g,f[0],v))}</div></td><td style="padding:10px 6px;border-bottom:1px solid var(--line)"><span style="font-size:26px;font-weight:800;color:#fff">${esc(o.s)}</span>${o.r&&o.r!==o.s?`<br><span class="muted">${esc(o.r)}</span>`:''}</td></tr>`}).join('');
 const ex=notes(v,r,g).map(n=>`<p style="margin:6px 0;font-size:14px">${n}</p>`).join('');
 const gs=guess?`<p class="muted" style="margin:6px 0">Kata ini tidak ada di kamus aplikasi, jadi kelompok diperkirakan dari akhir katanya${/[一-鿿]/.test(v)?' dan bacaan hiragana tidak ditampilkan':''}. Cek di kamus bila ragu.</p>`:'';
 el.innerHTML=`<div class="card"><div class="eyebrow">${gl}</div><h3 style="margin:4px 0;font-size:30px;color:#fff">${esc(v)} ${r&&r!==v?`<small class="muted">${esc(r)}</small>`:''}</h3><p class="muted">${esc(m)}</p>${gs}${ex}<table style="width:100%;border-collapse:collapse;margin-top:10px">${rows}</table></div>`};
const inp=$('verbinput');if(inp)inp.setAttribute('placeholder','Ketik kata kerja bentuk kamus, mis. 読む');
})();
