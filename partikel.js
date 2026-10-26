// Penjelasan partikel dasar + contoh + latihan isian. Contoh kalimat sederhana ditulis tangan.
(function(){
const U=NQU,esc=U.esc,$=id=>document.getElementById(id);
// [partikel, nama, fungsi, [[kalimat berfurigana, arti, isian(partikel yg dikosongkan)|''], ...], pengecoh]
const P=[
['は','Penanda topik','Menunjukkan topik pembicaraan ("kalau soal ..."). Dibaca "wa".',[['私[わたし]は学生[がくせい]です。','Saya adalah pelajar.','は'],['これは本[ほん]です。','Ini adalah buku.','は']],['を','で','と']],
['が','Penanda subjek / objek rasa','Menandai subjek yang baru atau ditekankan; juga dipakai dengan 好き, 上手, ある, いる, わかる.',[['庭[にわ]に猫[ねこ]がいます。','Ada kucing di kebun.','が'],['私[わたし]は水[みず]が好[す]きです。','Saya suka air.','が']],['で','に','と']],
['を','Penanda objek','Menandai objek langsung dari kata kerja. Dibaca "o".',[['パンを食[た]べます。','Saya makan roti.','を'],['日本語[にほんご]を勉強[べんきょう]します。','Saya belajar bahasa Jepang.','を']],['は','に','で']],
['に','Waktu, tujuan, tempat keberadaan','Menandai jam tertentu, tujuan gerakan, dan tempat benda/orang berada (ある/いる).',[['七時[しちじ]に起[お]きます。','Saya bangun jam tujuh.','に'],['机[つくえ]の上[うえ]に本[ほん]があります。','Ada buku di atas meja.','に']],['を','で','と']],
['で','Tempat kegiatan, alat','Menandai tempat berlangsungnya kegiatan, atau alat/cara.',[['図書館[としょかん]で本[ほん]を読[よ]みます。','Saya membaca buku di perpustakaan.','で'],['電車[でんしゃ]で行[い]きます。','Saya pergi naik kereta.','で']],['に','を','と']],
['へ','Arah','Menunjukkan arah gerakan. Dibaca "e". Mirip に pada tujuan.',[['日本[にほん]へ行[い]きます。','Saya pergi ke Jepang.',''],['家[いえ]へ帰[かえ]ります。','Saya pulang ke rumah.','']],['を','で','と']],
['と','Bersama / dan','Menandai teman yang melakukan bersama, atau menghubungkan benda ("dan").',[['友達[ともだち]と話[はな]します。','Saya bicara dengan teman.','と'],['りんごとみかんを買[か]います。','Saya membeli apel dan jeruk.','と']],['を','で','が']],
['も','Juga','Menggantikan は/が/を untuk arti "juga".',[['私[わたし]も学生[がくせい]です。','Saya juga pelajar.','も'],['コーヒーも飲[の]みます。','Saya juga minum kopi.','も']],['に','で','と']],
['の','Kepemilikan / penjelas','Menghubungkan dua kata benda: milik atau penjelas ("punya ...").',[['私[わたし]の本[ほん]です。','Ini buku saya.','の'],['日本語[にほんご]の先生[せんせい]です。','Dia guru bahasa Jepang.','の']],['を','に','で']],
['から・まで','Dari ... sampai ...','から = titik awal (waktu/tempat), まで = titik akhir.',[['九時[くじ]から五時[ごじ]まで働[はたら]きます。','Saya bekerja dari jam sembilan sampai jam lima.','から'],['家[いえ]から学校[がっこう]まで歩[ある]きます。','Saya berjalan dari rumah sampai sekolah.','から']],['を','に','と']]];
const rb=t=>esc(t).replace(/([一-鿿々]+)\[([^\]]+)\]/g,'<ruby>$1<rt>$2</rt></ruby>');
const plain=t=>t.replace(/([一-鿿々]+)\[([^\]]+)\]/g,'$1');
const sec=document.createElement('section');sec.id='partikel';sec.className='page';$('bunpou').after(sec);
let pr=null;
window.renderPartikel=function(){pr=null;sec.innerHTML=`<div class="subhead"><button class="back" onclick="go('bunpou')">←</button><div><h2>Partikel Dasar</h2><p>は が を に で へ と も の から まで</p></div></div><div class="kz-body">
 <button class="btn wide" onclick="ptQuiz()">Latihan isian partikel</button>
 ${P.map(p=>`<div class="notice"><h3 style="margin:0;font-size:26px">${esc(p[0])} <small style="font-size:13px;color:#b9b9c6">${esc(p[1])}</small></h3><p>${esc(p[2])}</p>${p[3].map(e=>`<div class="word"><div style="flex:1"><h4 style="font-size:18px">${rb(e[0])}</h4><p>${esc(e[1])}</p></div></div>`).join('')}</div>`).join('')}</div>`};
window.ptQuiz=function(){const all=[];P.forEach(p=>p[3].forEach(e=>{if(e[2])all.push({p,e})}));pr={list:U.shuf(all).slice(0,10),i:0,ok:0,lock:false};ptShow()};
function ptShow(){const z=pr.list[pr.i],part=z.e[2],o=U.shuf([part].concat(z.p[4]));pr.cur={o,a:o.indexOf(part),z};pr.lock=false;
 const sent=z.e[0].replace(new RegExp('(\\]|^|[^\\u4e00-\\u9fff\\[])'+part+'(?![^\\[]*\\])'),'$1＿');
 sec.innerHTML=`<div class="subhead"><button class="back" onclick="renderPartikel()">←</button><div><h2>Latihan Partikel</h2></div></div><div class="kz-body"><div class="kz-meta"><span>Soal ${pr.i+1} dari ${pr.list.length}</span><span>Benar ${pr.ok}</span></div><div class="hero-mini"><p>Isi partikel yang tepat:</p><div class="kz-big">${rb(sent)}</div><p class="kz-sub">${esc(z.e[1])}</p></div><div class="kz-opts">${o.map((x,i)=>`<button class="quizopt" onclick="ptPick(${i})">${esc(x)}</button>`).join('')}</div><div id="ptfb"></div></div>`}
window.ptPick=function(i){if(!pr||pr.lock)return;pr.lock=true;const c=pr.cur,ok=i===c.a;if(ok){pr.ok++;window.nqGain&&nqGain(2)}
 U.SRS.rec('p:'+c.z.p[0],ok,{type:'partikel',lb:c.z.p[0],mn:c.z.p[1]});
 sec.querySelectorAll('.quizopt').forEach((b,j)=>{b.disabled=true;if(j===c.a)b.classList.add('ok');else if(j===i)b.classList.add('ng')});
 $('ptfb').innerHTML=`<div class="hero-mini kz-fb ${ok?'good':'bad'}"><b>${ok?'Benar!':'Belum tepat'}</b><p>${esc(plain(c.z.e[0]))} = ${esc(c.z.e[1])}</p><p class="muted">${esc(c.z.p[0])}: ${esc(c.z.p[2])}</p></div><button class="btn wide" onclick="ptNext()">${pr.i+1>=pr.list.length?'Lihat Hasil':'Berikutnya →'}</button>`};
window.ptNext=function(){if(!pr||!pr.lock)return;pr.i++;if(pr.i<pr.list.length)return ptShow();const n=pr.list.length,acc=Math.round(pr.ok/n*100);U.HIST.add({mode:'Partikel',n,ok:pr.ok,acc,sec:0,date:new Date().toLocaleString('id-ID')});
 sec.innerHTML=`<div class="subhead"><button class="back" onclick="renderPartikel()">←</button><div><h2>Hasil</h2></div></div><div class="kz-body"><div class="hero-mini kz-res"><h3>${pr.ok} / ${n}</h3><p>Akurasi ${acc}%</p></div><button class="btn wide" onclick="ptQuiz()">Ulangi</button><button class="btn wide ghost" onclick="renderPartikel()">Kembali ke penjelasan</button></div>`;pr=null};
const g=window.go;window.go=function(id,b){g(id,b);if(id==='partikel')renderPartikel()};
const bp=$('bunpou'),sh=bp&&bp.querySelector('.subhead');if(sh&&!$('ptlink')){const a=document.createElement('button');a.id='ptlink';a.className='btn wide';a.textContent='Partikel Dasar (は が を に で ...)';a.onclick=()=>go('partikel');sh.after(a)}
window.NQ_PARTIKEL=P;
})();
