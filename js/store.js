// "Adatbázis" (DEMO): localStorage. Éles használatnál ezt szerver + adatbázis váltja ki.
const K='bw_db',S='bw_sess';
const db=()=>JSON.parse(localStorage.getItem(K)||'{"users":[]}');
const save=d=>localStorage.setItem(K,JSON.stringify(d));
const sess=()=>localStorage.getItem(S);
const hash=s=>btoa(unescape(encodeURIComponent('bw$'+s))); // DEMO! Élesben bcrypt/argon2 szerveroldalon
const defaults=()=>({mods:{status:true,countdown:true,location:true,contact:true},
hours:[0,1,2,3,4,5,6].map(i=>({on:i>0&&i<6,open:'08:00',close:'18:00',cutoff:'13:00',x_open:'',x_closed:'',x_ship:''})),
ov:[],
tx:{open:{i:'🟢',t:'Most nyitva'},until:{i:'⌚',t:'Ma {close}-ig várjuk rendelésed'},count:{i:'⏳',t:'Már csak {time} maradt, hogy ma feldolgozzuk a rendelésed'},ship:{i:'🚚',t:'Rendeld meg {cutoff}-ig és holnap kiszállítjuk'},closed:{i:'🔴',t:'Jelenleg zárva'},next:{i:'📅',t:'Legközelebb {when} {open}-kor nyitunk'},shipC:{i:'🚚',t:'A most leadott rendeléseket a következő nyitvatartási napon dolgozzuk fel'},dist:{i:'📍',t:'{km} km-re vagy tőlünk (kb. {min} perc autóval)'}},
ui:{min:true,close:true,start:'open',anim:'none',again:'always'},
color:'#0d9488',size:15,pos:'br',addr:'',lat:47.4979,lng:19.0402,phone:'+3612345678',email:'info@cegem.hu',wa:'36201234567',fb:'cegem'});
// Régi (korábbi verziós) beállítások kiegészítése az újakkal
const norm=c=>{const d=defaults();c=c||{};return {...d,...c,mods:{...d.mods,...c.mods},hours:c.hours||d.hours,tx:{...d.tx,...c.tx},ov:c.ov||[],ui:{...d.ui,...c.ui}}};
// Téma (világos/sötét)
document.documentElement.dataset.t=localStorage.bw_t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
document.addEventListener('click',e=>{if(e.target.closest('.th')){const t=document.documentElement.dataset.t=='dark'?'light':'dark';document.documentElement.dataset.t=t;localStorage.bw_t=t}});
// Görgetéses megjelenés
addEventListener('DOMContentLoaded',()=>{const o=new IntersectionObserver(a=>a.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.2});document.querySelectorAll('.rv').forEach(e=>o.observe(e))});
const toast=t=>{const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2200)};
const confetti=()=>{for(let i=0;i<40;i++){const e=document.createElement('span');e.className='cf';e.textContent=['🎉','✨','🟢','⏳'][i%4];e.style.left=Math.random()*100+'vw';e.style.animationDelay=Math.random()*.8+'s';document.body.append(e);setTimeout(()=>e.remove(),3200)}};