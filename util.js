// Utilitas bersama: kana<->romaji, pengaturan global (romaji opsional), pengulangan cerdas (SRS), riwayat kuis.
(function(){
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const kata2hira=s=>String(s).replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const hira2kata=s=>String(s).replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60));
const M={あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',や:'ya',ゆ:'yu',よ:'yo',ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',わ:'wa',を:'o',ん:'n',が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',ぁ:'a',ぃ:'i',ぅ:'u',ぇ:'e',ぉ:'o'};
const D={きゃ:'kya',きゅ:'kyu',きょ:'kyo',しゃ:'sha',しゅ:'shu',しょ:'sho',ちゃ:'cha',ちゅ:'chu',ちょ:'cho',にゃ:'nya',にゅ:'nyu',にょ:'nyo',ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',みゃ:'mya',みゅ:'myu',みょ:'myo',りゃ:'rya',りゅ:'ryu',りょ:'ryo',ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',じゃ:'ja',じゅ:'ju',じょ:'jo',びゃ:'bya',びゅ:'byu',びょ:'byo',ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',ふぁ:'fa',ふぃ:'fi',ふぇ:'fe',ふぉ:'fo',てぃ:'ti',でぃ:'di',うぃ:'wi',うぇ:'we',ゔぁ:'va'};
function romaji(t){t=kata2hira(String(t));let o='',i=0;
 while(i<t.length){const c=t[i],d=t.slice(i,i+2);
  if(D[d]){o+=D[d];i+=2;continue}
  if(c==='っ'){const n=t.slice(i+1,i+3),r=D[n]||M[t[i+1]];if(r){o+=(r.startsWith('ch')?'t':r[0]);i++;continue}o+='';i++;continue}
  if(c==='ー'){o+=o.slice(-1);i++;continue}
  o+=M[c]!==undefined?M[c]:c;i++}
 return o.replace(/\s+/g,' ').replace(/\bkonnichiha\b/g,'konnichiwa').replace(/\bkonbanha\b/g,'konbanwa')}
const settings=()=>LS.get('nqset',{romaji:false});
// ---- Pengulangan cerdas (Leitner sederhana) ----
const SRS={KEY:'nqsrs',DAYS:[0,1,2,4,8,16,32],
 all(){return LS.get(this.KEY,{})},
 today(){return new Date().toISOString().slice(0,10)},
 add(d,n){const x=new Date(d+'T00:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)},
 rec(key,ok,meta){const a=this.all(),t=this.today(),r=a[key]||Object.assign({a:0,ok:0,ng:0,box:0},meta||{});
  r.a++;r.last=t;if(ok){r.ok++;r.box=Math.min(r.box+1,6)}else{r.ng++;r.box=0}
  r.due=this.add(t,this.DAYS[r.box]);a[key]=r;LS.set(this.KEY,a);return r},
 due(){const a=this.all(),t=this.today();return Object.keys(a).filter(k=>a[k].due<=t).map(k=>Object.assign({key:k},a[k])).sort((x,y)=>(y.ng-y.ok)-(x.ng-x.ok)||(x.due<y.due?-1:1))},
 wrong(){const a=this.all();return Object.keys(a).filter(k=>a[k].ng>a[k].ok||(a[k].box<=1&&a[k].ng>0)).map(k=>Object.assign({key:k},a[k])).sort((x,y)=>(y.ng-y.ok)-(x.ng-x.ok))},
 isWrong(key){const r=this.all()[key];return !!r&&r.ng>0&&r.ng>=r.ok},
 has(key){return !!this.all()[key]}};
// ---- Riwayat kuis ----
const HIST={add(o){const h=LS.get('nqhist',[]);h.push(o);LS.set('nqhist',h.slice(-60))},all(){return LS.get('nqhist',[])}};
window.NQU={LS,kata2hira,hira2kata,romaji,settings,SRS,HIST,
 setRomaji(v){const s=settings();s.romaji=v;LS.set('nqset',s)},
 esc:s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 shuf:a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}};
})();
