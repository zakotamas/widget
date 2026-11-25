// Business Widget – beágyazható. Demo: a beállításokat localStorage-ból olvassa (azonos origin).
// Élesben: fetch('https://te-szervered/api/widget/'+id) – így a kódot sosem kell cserélni.
(()=>{const sc=document.currentScript,id=sc.dataset.id,pv=!!sc.dataset.preview;document.getElementById('bw-host')?.remove();
const rd=()=>JSON.parse(localStorage.getItem('bw_db')||'{"users":[]}'),U=rd().users.find(x=>x.id==id);
if(!U||!U.active||U.banned||!U.cfg.hours||!U.cfg.tx)return;const c=U.cfg,ui={min:true,close:true,start:'open',anim:'none',again:'always',...c.ui};
const p2=n=>String(n).padStart(2,0),iso=d=>`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;
const CK='bw_cl_'+id,SK='bw_st_'+id;let st=ui.start=='min'?'min':'open';
if(!pv){if(ui.again=='daily'&&localStorage[CK]==iso(new Date()))return;st=sessionStorage[SK]||st} // aznap bezárt widget nem jelenik meg
const hit=k=>{const d=rd(),x=d.users.find(y=>y.id==id);x.stats[k]++;localStorage.setItem('bw_db',JSON.stringify(d))};
if(!pv||!sessionStorage['bwv'+id]){hit('views');sessionStorage['bwv'+id]=1}
const m=t=>{const[a,b]=(t||'0:0').split(':');return a*60+ +b},N=['vasárnap','hétfőn','kedden','szerdán','csütörtökön','pénteken','szombaton'];
// Egy adott nap beállítása: heti rend + az arra a napra eső időzítés (ünnepnap stb.) felülírása
const dayCfg=d=>{const x={...c.hours[d.getDay()]},s=iso(d),o=(c.ov||[]).find(o=>o.from<=s&&s<=(o.to||o.from));
 if(o){x.on=!o.closed;if(o.open)x.open=o.open;if(o.close)x.close=o.close;if(o.text)x.x_open=x.x_closed=o.text}return x};
const fill=(s,v)=>s.replace(/\{(\w+)\}/g,(_,k)=>v[k]??'');
const ln=(k,x,v)=>`<p>${c.tx[k].i} ${fill((x&&x['x_'+k])||c.tx[k].t,v)}</p>`;
const pos={br:'bottom:16px;right:16px',bl:'bottom:16px;left:16px',tr:'top:16px;right:16px',tl:'top:16px;left:16px'}[c.pos];
const AN={none:'',float:'animation:fl 3.2s ease-in-out infinite',pulse:'animation:pu 2s infinite',glow:'animation:gl 2.4s ease-in-out infinite',bounce:'animation:bo 4s infinite'}[ui.anim]||'';
const CSS=`.b,.bub{position:fixed;${pos};z-index:2147483000;${AN}}.b{font:${c.size}px/1.4 system-ui,sans-serif;background:#fff;color:#111;border-left:5px solid ${c.color};border-radius:14px;padding:8px 16px 10px;max-width:min(340px,calc(100vw - 32px));box-shadow:0 8px 30px rgba(0,0,0,.25)}
.bub{width:54px;height:54px;border-radius:50%;background:${c.color};font-size:26px;padding:0;box-shadow:0 6px 20px rgba(0,0,0,.3)}
p{margin:6px 0}.k{display:flex;flex-wrap:wrap;gap:6px}a,button{background:${c.color};color:#fff;border:0;border-radius:8px;padding:5px 10px;text-decoration:none;font:inherit;cursor:pointer}
.hd{display:flex;justify-content:flex-end;gap:4px;margin-right:-8px}.hd button{background:transparent;color:#555;padding:0 8px;font-size:1.2em;line-height:1.2}
@keyframes fl{50%{transform:translateY(-7px)}}@keyframes pu{0%{box-shadow:0 0 0 0 ${c.color}99}70%{box-shadow:0 0 0 16px ${c.color}00}100%{box-shadow:0 0 0 0 ${c.color}00}}
@keyframes gl{50%{box-shadow:0 0 26px 4px ${c.color}aa}}@keyframes bo{0%,80%,100%{transform:none}88%{transform:translateY(-10px)}94%{transform:translateY(-3px)}}
@media(prefers-reduced-motion:reduce){.b,.bub{animation:none}}`;
const h=document.createElement('div');h.id='bw-host';const r=h.attachShadow({mode:'open'});document.body.append(h);
let dist='',last='';
function shell(){last='';r.innerHTML=`<style>${CSS}</style>`+(st=='min'?`<button class="bub" id="bb" data-a="open" aria-label="Widget megnyitása"></button>`:st=='open'?`<div class="b"><div class="hd">${ui.min?'<button data-a="min" aria-label="Kicsinyítés">–</button>':''}${ui.close?'<button data-a="close" aria-label="Bezárás">×</button>':''}</div><div id="in"></div></div>`:'')}
function set(s){st=s;if(s!='closed'&&!pv)sessionStorage[SK]=s;if(s=='closed'&&!pv&&ui.again=='daily')localStorage[CK]=iso(new Date());shell();draw()}
function draw(){if(st=='closed')return;const n=new Date(),sec=n.getHours()*3600+n.getMinutes()*60+n.getSeconds(),min=sec/60,x=dayCfg(n);
 const o=x.on&&min>=m(x.open)&&min<m(x.close),v={close:x.close,open:x.open,cutoff:x.cutoff};
 if(st=='min'){const b=r.getElementById('bb');if(b)b.textContent=c.mods.status?(o?c.tx.open.i:c.tx.closed.i):'💬';return}
 let L='';
 if(o){const left=m(x.close)*60-sec;v.time=`<b>${[left/3600|0,left/60%60|0,left%60].map(p2).join(':')}</b>`;
  if(c.mods.status)L+=ln('open',x,v)+ln('until',x,v);
  if(c.mods.countdown&&left<=3600)L+=ln('count',x,v);
  if(c.mods.status)L+=ln('ship',x,v)}
 else if(c.mods.status){for(let i=0;i<120;i++){const d=new Date(n);d.setDate(n.getDate()+i);const y=dayCfg(d);
   if(y.on&&(i>0||min<m(y.open))){v.when=i==0?'ma':i==1?'holnap':N[d.getDay()];v.open=y.open;break}}
  L+=ln('closed',x,v)+ln('next',x,v)+ln('shipC',x,v)}
 if(c.mods.location)L+=`<p>${dist||`<button id="lc">${c.tx.dist.i} Milyen messze vagyok?</button>`}</p>`;
 if(c.mods.contact)L+=`<p class="k">${c.phone?`<a data-c href="tel:${c.phone}">📞 Hívás</a>`:''}${c.email?`<a data-c href="mailto:${c.email}">📧 E-mail</a>`:''}${c.wa?`<a data-c target="_blank" href="https://wa.me/${c.wa}">💬 WhatsApp</a>`:''}${c.fb?`<a data-c target="_blank" href="https://m.me/${c.fb}">💬 Messenger</a>`:''}</p>`;
 const el=r.getElementById('in');if(el&&L!==last){last=L;el.innerHTML=L}}
function locate(){navigator.geolocation.getCurrentPosition(g=>{hit('loc');const R=Math.PI/180,a=(g.coords.latitude-c.lat)*R,o=(g.coords.longitude-c.lng)*R,q=Math.sin(a/2)**2+Math.cos(c.lat*R)*Math.cos(g.coords.latitude*R)*Math.sin(o/2)**2,km=12742*Math.asin(Math.sqrt(q))*1.3;
 dist=`${c.tx.dist.i} ${fill(c.tx.dist.t,{km:km.toFixed(1).replace('.',','),min:Math.max(1,Math.round(km/40*60))})}`;draw()},()=>{dist='📍 Helyadat nem érhető el';draw()})}
r.addEventListener('click',e=>{const t=e.target.closest('[data-a],[data-c],#lc');if(!t)return;if(t.hasAttribute('data-c'))hit('contact');if(t.dataset.a)set(t.dataset.a);if(t.id=='lc')locate()});
shell();draw();const t=setInterval(()=>h.isConnected?draw():clearInterval(t),1000)})();