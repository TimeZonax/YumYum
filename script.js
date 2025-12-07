/* script.js - core logic for prototype (use with pages) */

const STORAGE_KEY = 'tastelink_proto_v1';
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) return JSON.parse(raw);
  // initial
  const init = {
    user: null,
    restaurants: RESTAURANTS.slice(),
    feed: [] // posts: {id,user,restId,restName,menu,star,comment,ts}
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
  return init;
}
function saveState(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
let state = loadState();

/* Utility */
function $(id){ return document.getElementById(id); }
function fmtDate(ts){ return new Date(ts).toLocaleString(); }

/* --------- Auth & avatar --------- */
function mockLogin(){ // index.html usage
  const name = $('username')?.value?.trim();
  if(!name){ alert('กรุณากรอกชื่อที่จะแสดง'); return; }
  state.user = { id: 'u_'+Date.now(), name, avatar:'🙂', color:'#1e90ff' };
  saveState(state);
  window.location.href = 'avatar.html';
}
function guestLogin(){
  state.user = { id: 'guest_'+Date.now(), name: 'Guest', avatar:'🙂', color:'#1e90ff' };
  saveState(state);
  window.location.href = 'avatar.html';
}
function loadUserArea(){ // header area on each page
  const ua = $('userArea'); if(!ua) return;
  ua.innerHTML = '';
  if(!state.user){ ua.textContent = 'ยังไม่ได้ล็อกอิน'; return; }
  const d = document.createElement('div'); d.style.display='flex'; d.style.gap='8px'; d.style.alignItems='center';
  const av = document.createElement('div'); av.style.width='36px'; av.style.height='36px'; av.style.borderRadius='8px'; av.style.background=state.user.color; av.style.display='flex'; av.style.alignItems='center'; av.style.justifyContent='center'; av.style.color='#fff'; av.style.fontWeight='700'; av.textContent = state.user.avatar;
  const nm = document.createElement('div'); nm.textContent = state.user.name; nm.style.fontWeight='700';
  d.appendChild(av); d.appendChild(nm); ua.appendChild(d);
}

/* --------- Avatar page ------- */
function saveAvatarSelection(){
  const face = document.querySelector('input[name="avatarChoice"]:checked')?.value || '🙂';
  const color = document.querySelector('input[name="avatarColor"]:checked')?.value || '#1e90ff';
  state.user.avatar = face; state.user.color=color; saveState(state);
  window.location.href = 'restaurants.html';
}

/* --------- Restaurants list (restaurants.html) ------- */
function renderRestaurants(){
  const container = $('restaurantList'); if(!container) return;
  container.innerHTML = '';
  state.restaurants.forEach(r=>{
    const div = document.createElement('div'); div.className='rest-row';
    div.innerHTML = `<img src="${r.img}"><div style="flex:1">
      <div style="font-weight:700">${r.name}</div>
      <div class="muted">เมนูยอดฮิต: ${(r.menus.slice().sort((a,b)=>b.stars-a.stars)[0]||{}).name||'-'}</div>
    </div>
    <div style="text-align:right">
      <div class="status ${r.busy==='busy'?'busy':r.busy==='avail'?'avail':'normal'}">${r.busy==='busy'?'คิวยาว':r.busy==='avail'?'ว่าง':'ปกติ'}</div>
      <div style="margin-top:8px"><button onclick="openRestaurant('${r.id}')">ดู</button></div>
    </div>`;
    container.appendChild(div);
  });
}

/* open restaurant detail */
function openRestaurant(id){
  localStorage.setItem('tastelink_selected_rest', id);
  window.location.href = 'restaurant-detail.html';
}

/* --------- Restaurant detail (restaurant-detail.html) --------- */
function renderRestaurantDetail(){
  const id = localStorage.getItem('tastelink_selected_rest');
  if(!id){ alert('ไม่มีร้านที่เลือก'); window.location.href='restaurants.html'; return; }
  const r = state.restaurants.find(x=>x.id===id);
  if(!r){ alert('ไม่พบร้าน'); window.location.href='restaurants.html'; return; }
  $('rName').textContent = r.name;
  $('rStatus').innerHTML = `<div class="status ${r.busy==='busy'?'busy':r.busy==='avail'?'avail':'normal'}">${r.busy==='busy'?'คิวยาว':r.busy==='avail'?'ว่าง':'ปกติ'}</div>`;
  const menuArea = $('menuList'); menuArea.innerHTML = '';
  r.menus.forEach(m=>{
    const el = document.createElement('div'); el.className='menu-item';
    el.innerHTML = `<div style="font-weight:700">${m.name} <span style="font-size:13px;color:var(--muted)">(${m.price} ฿)</span></div>
      <div class="muted">Rating: ${m.rating} (${m.stars}) ${m.soldOut?'<span style="color:#a00;font-weight:700"> • หมดแล้ว</span>':''}</div>`;
    menuArea.appendChild(el);
  });
  loadUserArea();
}

/* --------- Mark eaten => rating.html --------- */
function goToRating(){
  if(!state.user){ alert('กรุณาลงชื่อก่อน'); window.location.href='index.html'; return; }
  window.location.href = 'rating.html';
}
function submitRating(){
  const restId = localStorage.getItem('tastelink_selected_rest');
  const r = state.restaurants.find(x=>x.id===restId);
  const star = Math.max(1, Math.min(5, parseInt($('star').value)||5));
  const comment = $('comment').value || '';
  const post = { id:'p_'+Date.now(), user:{name:state.user.name,avatar:state.user.avatar,color:state.user.color}, restId, restName:r.name, menu: (r.menus[0]||{}).name || '', star, comment, ts: Date.now() };
  state.feed.unshift(post);
  // update menu stars (simple demo)
  if(r.menus[0]) r.menus[0].stars = (r.menus[0].stars||0) + star;
  saveState(state);
  alert('ขอบคุณสำหรับรีวิว! ระบบอัปเดตเรียบร้อย');
  window.location.href = 'community.html';
}

/* --------- Community & feed (community.html) ---------- */
function renderFeed(){
  const feedArea = $('feedList'); if(!feedArea) return;
  feedArea.innerHTML = '';
  state.feed.forEach(p=>{
    const el = document.createElement('div'); el.className='post';
    el.innerHTML = `<div style="width:64px;text-align:center">
      <div style="width:48px;height:48px;border-radius:8px;background:${p.user.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">${p.user.avatar}</div>
    </div>
    <div style="flex:1">
      <div style="font-weight:700">${p.user.name} <span class="muted">• ${fmtDate(p.ts)}</span></div>
      <div class="muted">กินที่ <strong>${p.restName}</strong> — เมนู: ${p.menu}</div>
      <div style="margin-top:8px">${'⭐'.repeat(p.star)} ${p.comment}</div>
    </div>`;
    feedArea.appendChild(el);
  });
}

/* --------- Ranking (ranking.html) ---------- */
function renderRanking(){
  const rankArea = $('rankList'); if(!rankArea) return;
  rankArea.innerHTML = '';
  const arr = state.restaurants.map(r=>{
    const score = r.menus.reduce((s,m)=>s+(m.stars||0),0);
    return { id:r.id, name:r.name, score };
  }).sort((a,b)=>b.score-a.score);
  arr.forEach((a,i)=>{
    const el = document.createElement('div'); el.className='card small';
    el.innerHTML = `<div style="font-weight:700">${i+1}. ${a.name}</div><div class="muted">คะแนนรวม: ${a.score}</div>`;
    rankArea.appendChild(el);
  });
}

/* --------- Voting UI (on restaurants page left) ---------- */
function renderVoteOptions(){
  const vl = $('voteList'); if(!vl) return;
  vl.innerHTML = '';
  state.restaurants.forEach(r=>{
    const id = 'v_'+r.id;
    const row = document.createElement('div'); row.style.display='flex'; row.style.justifyContent='space-between'; row.style.alignItems='center'; row.style.padding='8px 0';
    row.innerHTML = `<div style="display:flex;gap:8px;align-items:center"><img src="${r.img}" style="width:48px;height:48px;border-radius:6px;object-fit:cover"><div><div style="font-weight:700">${r.name}</div><div class="muted">โหวต: ${r.votes||0}</div></div></div>
      <div><input type="checkbox" id="${id}"></div>`;
    vl.appendChild(row);
  });
}
function submitVote(){
  if(!state.user){ alert('กรุณาเข้าสู่ระบบก่อนโหวต'); return; }
  const checked = state.restaurants.filter(r=> document.getElementById('v_'+r.id).checked);
  if(!checked.length){ alert('เลือก 1 ร้านขึ้นไป'); return; }
  checked.forEach(r=> r.votes = (r.votes||0) + 1);
  saveState(state); renderVoteOptions(); renderRestaurants(); alert('โหวตเรียบร้อย ขอบคุณ!');
}

/* --------- Init helpers per page --------- */
function initIndex(){
  loadUserArea();
}
function initAvatar(){
  loadUserArea();
  // set default selections
  const a = document.querySelector('input[name="avatarChoice"][value="🙂"]');
  if(a) a.checked = true;
  const c = document.querySelector('input[name="avatarColor"][value="#1e90ff"]');
  if(c) c.checked = true;
}
function initRestaurants(){
  loadUserArea(); renderRestaurants(); renderVoteOptions();
}
function initRestaurantDetail(){ loadUserArea(); renderRestaurantDetail(); }
function initRating(){ loadUserArea(); const r = localStorage.getItem('tastelink_selected_rest'); if(!r) alert('เลือกร้านก่อน'); }
function initCommunity(){ loadUserArea(); renderFeed(); }
function initRanking(){ loadUserArea(); renderRanking(); }

/* Expose for HTML to call onload / onclick */
window.mockLogin = mockLogin;
window.guestLogin = guestLogin;
window.saveAvatarSelection = saveAvatarSelection;
window.renderRestaurants = renderRestaurants;
window.openRestaurant = openRestaurant;
window.renderRestaurantDetail = renderRestaurantDetail;
window.goToRating = goToRating;
window.submitRating = submitRating;
window.renderFeed = renderFeed;
window.renderRanking = renderRanking;
window.renderVoteOptions = renderVoteOptions;
window.submitVote = submitVote;
window.initIndex = initIndex;
window.initAvatar = initAvatar;
window.initRestaurants = initRestaurants;
window.initRestaurantDetail = initRestaurantDetail;
window.initRating = initRating;
window.initCommunity = initCommunity;
window.initRanking = initRanking;