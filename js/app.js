// ============================================================
// Life Spinner — 主应用逻辑
// ============================================================
/* eslint-disable */

// ==================== 全局状态 ====================
let mode = 'family';       // 转盘模式
let catFilter = 'all';
let spinning = false, curRot = 0, weather = null;
let wheelActs = [];
const WHEEL_MAX = 8;

// 月计划当前浏览的起始日期
let mpCursorDate = null;

// 当前选中的折扣分类
let dealFilter = 'all';

// 当前选中的烹饪分类
let recipeFilter = 'all';

// ==================== NAV ====================
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (id === 'pageHome')     renderDashboard();
  if (id === 'pagePlan')     { renderMonthlyPlan(); renderKidsSchedule(); }
  if (id === 'pageDeals')    renderDeals();
  if (id === 'pageMe')       renderMePage();
  updateFab();
}
function toggleSec(id) {
  const b = document.getElementById(id+'-body');
  const a = document.getElementById(id+'-arrow');
  if (b) b.classList.toggle('show');
  if (a) a.classList.toggle('open');
}

// ==================== DASHBOARD (新主页) ====================
function renderDashboard() {
  const state = Store.load();
  const now = new Date();
  const h = now.getHours();
  const greet = h < 6 ? '还没睡吗' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : h < 22 ? '晚上好' : '晚安';
  const name = state.profile.name || '';
  const dateStr = now.toLocaleDateString('zh-CN', {month:'long',day:'numeric',weekday:'short'});

  document.getElementById('dashGreet').textContent = `${greet}${name?'，'+name:''} 👋`;
  document.getElementById('dashDate').textContent = dateStr;

  renderQuoteCard();
  renderAppShortcuts();
  renderPillarCards();
  renderUpcomingReminders();
  renderTodayItems();
}

// ==================== 一键打开外部 App ====================
function renderAppShortcuts() {
  const el = document.getElementById('appShortcuts');
  if (!el || typeof APP_SHORTCUTS === 'undefined') return;
  el.innerHTML = APP_SHORTCUTS.map(a => `
    <button class="app-shortcut" onclick="launchApp('${escAttr(a.id)}')" title="${escAttr(a.label)}">
      <span class="as-emoji">${escapeHtml(a.emoji)}</span>
      <span class="as-label">${escapeHtml(a.label)}</span>
    </button>
  `).join('');
}

// 尝试打开 app；约 1.5s 后页面若仍可见则降级到 web 链接
function launchApp(id) {
  const a = APP_SHORTCUTS.find(x => x.id === id);
  if (!a) return;
  const t0 = Date.now();
  // iOS Safari 对 anchor click 比 window.location 更稳
  const anchor = document.createElement('a');
  anchor.href = a.scheme;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  try { anchor.click(); } catch(e) { window.location.href = a.scheme; }
  document.body.removeChild(anchor);
  setTimeout(() => {
    // 若 1.5s 内页面没被切走（说明 scheme 没装/没响应），打开 web 回退
    if (!document.hidden && Date.now() - t0 < 2500) {
      window.open(a.web, '_blank');
    }
  }, 1500);
}

function renderQuoteCard() {
  const state = Store.load();
  let qi = state.lastDashQuote;
  if (qi == null || qi < 0 || qi >= QUOTES.length) qi = Math.floor(Math.random() * QUOTES.length);
  const q = QUOTES[qi];
  const text = typeof q === 'string' ? q : (q?.text || '');
  const author = typeof q === 'object' ? (q.author || '') : '';
  const tEl = document.getElementById('dashQuote');
  const aEl = document.getElementById('dashQuoteAuthor');
  if (tEl) tEl.textContent = text;
  if (aEl) aEl.textContent = author ? '— ' + author : '';
}

// 点击 quote 卡 → 立刻换一条
function reshuffleQuote() {
  const total = QUOTES.length;
  if (total < 2) return;
  Store.update(s => {
    let next = Math.floor(Math.random() * total);
    if (next === s.lastDashQuote) next = (next + 1) % total;
    s.lastDashQuote = next;
  });
  renderQuoteCard();
}

// ==================== 三大支柱卡片（顶层身份） ====================

// —— 灵感卡的具体建议生成 —— //
// 把多个 VENUES 分类合并成一个池子，daily-rotate 出一个具体地点
function _venuePool(catKeys) {
  if (typeof VENUES === 'undefined') return [];
  const pool = [];
  catKeys.forEach(k => { if (VENUES[k] && VENUES[k].items) pool.push(...VENUES[k].items); });
  return pool;
}
// 「今晚吃」候选：JLT 优先 + Marina/JBR + 米其林中餐 + 平价 + 亚洲 + 网红咖啡
const FOOD_VENUE_KEYS = ['jlt_food','marina_food','michelin_chinese','budget_food','asian_food','cafes'];
// 「今天玩」候选：运动/亲子/自然/夜生活
const PLAY_VENUE_KEYS = ['sports','kids_venues','nature','nightlife','daytrips'];

// 根据 dayOfYear + 偏移量挑一条；不存在时回退到 ACTIVITIES
function pickDailyEat(dayOfYear) {
  const pool = _venuePool(FOOD_VENUE_KEYS);
  if (!pool.length) return null;
  return pool[dayOfYear % pool.length];
}
function pickDailyPlay(dayOfYear) {
  const pool = _venuePool(PLAY_VENUE_KEYS);
  if (pool.length) return pool[(dayOfYear * 7) % pool.length]; // 错位避免和 eat 同步
  // 回退：从 ACTIVITIES 里选一条
  return ACTIVITIES[(dayOfYear * 3) % ACTIVITIES.length];
}

function _shortLoc(addr) {
  if (!addr) return '';
  const parts = String(addr).split(',').map(s => s.trim()).filter(Boolean);
  // 取最后一两段（区/城市）；长则截
  const tail = parts.slice(-2).join(', ');
  return tail.length > 28 ? tail.slice(0, 26) + '…' : tail;
}

function renderPillarCards() {
  const el = document.getElementById('pillarGrid');
  if (!el) return;
  const state = Store.load();

  // 规划卡已移除（用户：到第二页自己查）

  // ========== 灵感：3 条具体建议 ==========
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  const eat = pickDailyEat(dayOfYear);
  const play = pickDailyPlay(dayOfYear);
  const learnItem = LEARNING_POOL[dayOfYear % LEARNING_POOL.length];

  // 缓存到 window 方便点击时复用（避免再算一次/不一致）
  window._dailyInspire = {eat, play, learnItem};

  const eatRow = eat ? `
    <div class="pillar-sugg" onclick="event.stopPropagation();openDailyEat()">
      <span class="ps-tag">🍽️ 今晚吃</span>
      <span class="ps-emoji">${escapeHtml(eat.emoji||'🍽️')}</span>
      <span class="ps-name">${escapeHtml(eat.name)}</span>
      <span class="ps-meta">${escapeHtml(_shortLoc(eat.addr))}${eat.cost?' · '+escapeHtml(eat.cost):''}</span>
      <span class="ps-go">›</span>
    </div>` : '';

  const playName = play ? (play.name) : '';
  const playLoc  = play ? (play.info?.loc || _shortLoc(play.addr || play.info?.addr)) : '';
  const playCost = play ? (play.info?.cost || play.cost) : '';
  const playRow = play ? `
    <div class="pillar-sugg" onclick="event.stopPropagation();openDailyPlay()">
      <span class="ps-tag">🎯 今天玩</span>
      <span class="ps-emoji">${escapeHtml(play.emoji||'🎯')}</span>
      <span class="ps-name">${escapeHtml(playName)}</span>
      <span class="ps-meta">${escapeHtml(playLoc||'')}${playCost?' · '+escapeHtml(playCost):''}</span>
      <span class="ps-go">›</span>
    </div>` : '';

  const learnRow = `
    <div class="pillar-sugg" onclick="event.stopPropagation();quickLog('${escAttr(learnItem.type)}','${escAttr(learnItem.name)}')">
      <span class="ps-tag">📚 学一点</span>
      <span class="ps-emoji">${escapeHtml(learnItem.emoji)}</span>
      <span class="ps-name">${escapeHtml(learnItem.name)}</span>
      <span class="ps-meta">${escapeHtml(learnItem.desc||'')}</span>
      <span class="ps-go">✓</span>
    </div>`;

  // ========== 意义：连续打卡 + 本周记录次数 ==========
  const streak = growthStreak();
  const wk = growthReport('week');
  const meaningLine = streak > 0
    ? `🔥 ${streak} 天连续 · 本周 ${wk.count} 次记录`
    : (wk.count > 0 ? `本周已记录 ${wk.count} 次 · 继续呀` : '今天迈出第一步');

  el.innerHTML = `
    <div class="pillar-card inspire" onclick="showPage('pageSpinner',document.querySelectorAll('.nav-btn')[2])">
      <div class="pillar-head">
        <span class="pillar-emoji">${PILLARS.inspire.emoji}</span>
        <span class="pillar-title">${escapeHtml(PILLARS.inspire.label)}</span>
        <button class="pillar-mini" onclick="event.stopPropagation();reshuffleInspire()" title="换一组">🎲</button>
        <span class="pillar-arrow">›</span>
      </div>
      <div class="pillar-suggs">${eatRow}${playRow}${learnRow}</div>
    </div>

    <div class="pillar-card meaning" onclick="openPillarMeaning()">
      <div class="pillar-head">
        <span class="pillar-emoji">${PILLARS.meaning.emoji}</span>
        <span class="pillar-title">${escapeHtml(PILLARS.meaning.label)}</span>
        <span class="pillar-arrow">›</span>
      </div>
      <div class="pillar-line">${escapeHtml(meaningLine)}</div>
    </div>
  `;
}

function openPillarMeaning() {
  // 跳到「我的」并展开成长区（复用 openDimDetail 的逻辑）
  openDimDetail('grow');
}

// 灵感卡 · 行点击：打开餐厅/活动地图，或快速打卡
function openDailyEat() {
  const v = window._dailyInspire?.eat;
  if (!v) return;
  const q = v.mapQ || encodeURIComponent(v.name + ' Dubai');
  window.open(`https://www.google.com/maps/search/${q}`, '_blank');
}
function openDailyPlay() {
  const v = window._dailyInspire?.play;
  if (!v) return;
  const q = v.mapQ || v.info?.mapQ || encodeURIComponent(v.name + ' Dubai');
  window.open(`https://www.google.com/maps/search/${q}`, '_blank');
}
// 「换一组」：用随机偏移重新挑一组
function reshuffleInspire() {
  const el = document.getElementById('pillarGrid');
  if (!el) return;
  // 临时覆盖 dayOfYear 算法 — 直接重写卡片内容
  const offset = Math.floor(Math.random() * 9999);
  const eat = (function(){ const p = _venuePool(FOOD_VENUE_KEYS); return p.length? p[(offset*13)%p.length]:null; })();
  const play = (function(){ const p = _venuePool(PLAY_VENUE_KEYS); return p.length? p[(offset*7)%p.length] : ACTIVITIES[(offset*3)%ACTIVITIES.length]; })();
  const learnItem = LEARNING_POOL[(offset*5) % LEARNING_POOL.length];
  window._dailyInspire = {eat, play, learnItem};
  // 局部刷新灵感卡的内容部分
  const card = el.querySelector('.pillar-card.inspire .pillar-suggs');
  if (!card) { renderPillarCards(); return; }
  const playName = play?.name || '';
  const playLoc  = play ? (play.info?.loc || _shortLoc(play.addr || play.info?.addr)) : '';
  const playCost = play ? (play.info?.cost || play.cost) : '';
  card.innerHTML = `
    ${eat ? `<div class="pillar-sugg" onclick="event.stopPropagation();openDailyEat()">
      <span class="ps-tag">🍽️ 今晚吃</span>
      <span class="ps-emoji">${escapeHtml(eat.emoji||'🍽️')}</span>
      <span class="ps-name">${escapeHtml(eat.name)}</span>
      <span class="ps-meta">${escapeHtml(_shortLoc(eat.addr))}${eat.cost?' · '+escapeHtml(eat.cost):''}</span>
      <span class="ps-go">›</span>
    </div>` : ''}
    ${play ? `<div class="pillar-sugg" onclick="event.stopPropagation();openDailyPlay()">
      <span class="ps-tag">🎯 今天玩</span>
      <span class="ps-emoji">${escapeHtml(play.emoji||'🎯')}</span>
      <span class="ps-name">${escapeHtml(playName)}</span>
      <span class="ps-meta">${escapeHtml(playLoc||'')}${playCost?' · '+escapeHtml(playCost):''}</span>
      <span class="ps-go">›</span>
    </div>` : ''}
    <div class="pillar-sugg" onclick="event.stopPropagation();quickLog('${escAttr(learnItem.type)}','${escAttr(learnItem.name)}')">
      <span class="ps-tag">📚 学一点</span>
      <span class="ps-emoji">${escapeHtml(learnItem.emoji)}</span>
      <span class="ps-name">${escapeHtml(learnItem.name)}</span>
      <span class="ps-meta">${escapeHtml(learnItem.desc||'')}</span>
      <span class="ps-go">✓</span>
    </div>
  `;
}

function renderUpcomingReminders() {
  const el = document.getElementById('dashUpcoming');
  if (!el) return;
  const reminders = Store.get('reminders') || [];
  const now = Date.now();
  const upcoming = reminders
    .filter(r => !r.sent && new Date(r.fireAt).getTime() - now < 24*3600000 && new Date(r.fireAt).getTime() > now - 3600000)
    .sort((a,b) => new Date(a.fireAt) - new Date(b.fireAt))
    .slice(0, 3);
  if (!upcoming.length) { el.innerHTML = ''; el.style.display='none'; return; }
  el.style.display='block';
  el.innerHTML = '<div class="dash-up-title">🔔 接下来</div>' + upcoming.map(r => {
    const t = new Date(r.fireAt);
    const timeStr = t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0');
    const isTomorrow = t.getDate() !== new Date().getDate();
    return `<div class="dash-up-item">
      <span class="dash-up-time">${isTomorrow?'明天 ':''}${timeStr}</span>
      <span>${escapeHtml(r.title)}</span>
    </div>`;
  }).join('');
}

function quickLog(type, label) {
  const mins = prompt(`记录：${label}\n花了多少分钟？`, type === 'reading' ? 15 : 30);
  if (mins === null) return;
  const m = parseInt(mins) || 15;
  logGrowth({type, refId:type, refName:label, minutes:m, note:''});
  toast(`✅ 记录 ${label} ${m}分钟`);
  // 触发当前可见页的局部刷新
  if (document.getElementById('pageHome')?.classList.contains('active')) renderDashboard();
  if (document.getElementById('pageMe')?.classList.contains('active')) renderMePage();
}

function renderTodayItems() {
  const el = document.getElementById('todayItems');
  if (!el) return;
  const state = Store.load();
  const dayName = todayDayName();
  const todayItems = state.weeklyPlan.filter(p => p.day === dayName);
  // 也检查月计划中今天的项
  const mp = state.monthlyPlan;
  const mpToday = [];
  if (mp && mp.weeks) {
    const todayStr = fmtDate(new Date(), 'M/D').replace(/^0/,'').replace('/0','/');
    const todayMD = `${new Date().getMonth()+1}/${new Date().getDate()}`;
    mp.weeks.forEach((w,wi) => {
      DAYS.forEach(d => {
        if (w.dates[d] === todayMD && w.plan[d]) {
          w.plan[d].forEach((it,idx) => mpToday.push({...it, wi, day:d, idx}));
        }
      });
    });
  }
  const combined = [...mpToday.map(m=>({time:m.time, name:m.act?.name||m.name, emoji:m.act?.emoji||m.emoji, fromMp:true})),
                    ...todayItems.map(t=>({time:t.time, name:t.act, emoji:t.emoji, fromFixed:true}))];
  combined.sort((a,b) => a.time.localeCompare(b.time));
  if (!combined.length) {
    el.innerHTML = '<div class="today-empty">今天还没有安排 — 给自己留点空白也挺好</div>';
    return;
  }
  el.innerHTML = combined.map(it => {
    const planKey = `fixed:${dayName}:${it.time}:${it.name}`;
    const has = Reminders.isSet(planKey);
    return `<div class="mp-item">
      <span class="mi-time">${escapeHtml(it.time)}</span>
      <span class="mi-emoji">${escapeHtml(it.emoji||'🎯')}</span>
      <span class="mi-name">${escapeHtml(it.name||'待定')}</span>
      <span class="mi-bell ${has?'on':''}" onclick="toggleReminder('${escAttr(planKey)}','${escAttr(it.time)}','${escAttr(it.name||'')}','${escAttr(it.emoji||'')}')" title="${has?'取消提醒':'设置提醒'}">${has?'🔔':'🔕'}</span>
    </div>`;
  }).join('');
}

function openDimDetail(dim) {
  // 对每个维度，显示详细建议页（暂用 toast 引导到对应 tab）
  if (dim === 'grow') {
    // 跳到 Me 的成长区
    showPage('pageMe');
    setTimeout(() => {
      const sec = document.getElementById('sec-growth-body');
      if (sec) { sec.classList.add('show'); document.getElementById('sec-growth-arrow')?.classList.add('open'); sec.scrollIntoView({behavior:'smooth'}); }
    }, 200);
  } else if (dim === 'passion') {
    showPage('pageMe');
    setTimeout(() => {
      const sec = document.getElementById('sec-cooking-body');
      if (sec) { sec.classList.add('show'); document.getElementById('sec-cooking-arrow')?.classList.add('open'); sec.scrollIntoView({behavior:'smooth'}); }
    }, 200);
  } else if (dim === 'connect') {
    showPage('pagePlan');
  } else {
    showPage('pageSpinner');
  }
}

// ==================== WEATHER ====================
async function fetchWeather() {
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=25.08&longitude=55.15&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Dubai&forecast_days=7');
    const d = await r.json(); weather = d;
    const c = d.current, t = Math.round(c.temperature_2m);
    const icons = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',55:'🌧️',61:'🌧️',80:'🌦️',95:'⛈️'};
    const ico = icons[c.weather_code] || '🌤️';
    const mini = document.getElementById('wMini');
    if (mini) mini.textContent = `${ico} ${t}°`;
  } catch(e) { const m = document.getElementById('wMini'); if (m) m.textContent='—'; }
}

// ==================== SPINNER ====================
const CAT_FILTERS = [
  {id:'all', label:'🎯 全部'},
  {id:'sports', label:'⚽ 运动'},
  {id:'food', label:'🍜 美食'},
  {id:'entertainment', label:'🎢 娱乐'},
  {id:'learning', label:'📚 学习'},
  {id:'nature', label:'🌿 自然'},
  {id:'culture', label:'🎭 文化'},
  {id:'leisure', label:'🌴 休闲'},
  {id:'nightlife', label:'🌙 夜间'},
  {id:'daytrip', label:'🚗 短途'},
  {id:'cooking', label:'🍳 烹饪'},
  {id:'family_ritual', label:'🏡 家庭仪式'},
  {id:'reflect', label:'🧘 内省'},
];

function actsPool() {
  const base = actsFor(mode);
  if (catFilter === 'all') return base;
  return base.filter(a => a.cat === catFilter);
}

function hasFazaa(act) {
  if (act.info && act.info.fazaa) return true;
  if (typeof VENUES === 'undefined') return false;
  let found = false;
  Object.values(VENUES).forEach(cat => (cat.items||[]).forEach(v => {
    if (v.name === act.name && v.fazaa) found = true;
  }));
  return found;
}

function sampleWheel() {
  const pool = actsPool().filter(a => getUserRating(a.id).status !== 'blacklist');
  if (pool.length <= WHEEL_MAX) { wheelActs = [...pool]; }
  else {
    const recommended = pool.filter(a => getUserRating(a.id).status === 'recommend');
    const others = pool.filter(a => getUserRating(a.id).status !== 'recommend');
    const picks = [];
    const names = new Set();
    const add = a => { if (a && !names.has(a.id)) { picks.push(a); names.add(a.id); } };
    [...recommended].sort(()=>Math.random()-.5).slice(0,2).forEach(add);
    const fazaa = others.filter(a => hasFazaa(a) && !names.has(a.id)).sort(()=>Math.random()-.5);
    if (fazaa.length) add(fazaa[0]);
    const rest = others.filter(a => !names.has(a.id));
    const dow = new Date().getDay();
    const isWeekendNow = dow === 0 || dow === 5 || dow === 6;
    const nearOut = rest.filter(a=>isNearby(a)&&isOutdoor(a)).sort(()=>Math.random()-.5);
    const nearIn = rest.filter(a=>isNearby(a)&&!isOutdoor(a)).sort(()=>Math.random()-.5);
    const farOut = rest.filter(a=>!isNearby(a)&&isOutdoor(a)).sort(()=>Math.random()-.5);
    const farIn = rest.filter(a=>!isNearby(a)&&!isOutdoor(a)).sort(()=>Math.random()-.5);
    const groups = isWeekendNow ? [farOut,nearOut,farIn,nearIn] : [nearOut,nearIn,nearOut,nearIn,farOut,farIn];
    let gi=0, safety=0;
    while (picks.length < WHEEL_MAX && safety < 32) {
      const g = groups[gi % groups.length];
      if (g.length) add(g.shift());
      gi++; safety++;
    }
    if (picks.length < WHEEL_MAX) {
      rest.filter(a=>!names.has(a.id)).sort(()=>Math.random()-.5).slice(0, WHEEL_MAX-picks.length).forEach(add);
    }
    wheelActs = picks.sort(()=>Math.random()-.5);
  }
  updateWheelInfo();
}

function updateWheelInfo() {
  const pool = actsPool();
  const el = document.getElementById('wheelInfo');
  if (!el) return;
  if (pool.length <= WHEEL_MAX) el.textContent = `共 ${pool.length} 个活动`;
  else el.innerHTML = `从 <b style="color:var(--accent)">${pool.length}</b> 个活动中随机选了 <b style="color:var(--accent)">${wheelActs.length}</b> 个`;
}

function setMode(m) {
  mode = m;
  const sl = document.getElementById('mSlider');
  if (sl) sl.className = 'mode-slider' + (m==='couple'?' couple':m==='friend'?' friend':'');
  ['family','couple','friend'].forEach(x => {
    const b = document.getElementById(x+'Btn');
    if (b) b.classList.toggle('active', x===m);
  });
  curRot=0; renderCatFilter(); sampleWheel(); drawWheel();
}

function renderCatFilter() {
  const base = actsFor(mode);
  const el = document.getElementById('catFilter');
  if (!el) return;
  el.innerHTML = CAT_FILTERS.map(c => {
    const count = c.id === 'all' ? base.length : base.filter(a => a.cat === c.id).length;
    if (c.id !== 'all' && count === 0) return '';
    return `<button class="cf-btn ${catFilter===c.id?'active':''}" onclick="setCatFilter('${c.id}')">${escapeHtml(c.label)}<span class="cf-count">${count}</span></button>`;
  }).join('');
}
function setCatFilter(id) { catFilter = id; curRot=0; renderCatFilter(); sampleWheel(); drawWheel(); }

const COLORS=['#f59e0b','#8b5cf6','#06b6d4','#22c55e','#ef4444','#ec4899','#3b82f6','#14b8a6','#f97316','#a855f7','#10b981','#e11d48','#0ea5e9','#d946ef','#84cc16','#f43f5e'];

function drawWheel(hi=-1) {
  const cv = document.getElementById('wheel'); if (!cv) return;
  const ctx = cv.getContext('2d'), a = wheelActs, n = a.length;
  const S = 1024, cx = S/2, cy = S/2, r = S/2-12;
  if (!n) { ctx.clearRect(0,0,S,S); ctx.fillStyle='#333'; ctx.font='bold 36px sans-serif'; ctx.textAlign='center'; ctx.fillText('无活动',cx,cy); return; }
  const arc = Math.PI*2/n;
  ctx.clearRect(0,0,S,S);
  for(let i=0;i<n;i++){
    const sa = curRot+i*arc;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,sa,sa+arc); ctx.closePath();
    ctx.fillStyle = i===hi?'#fff':COLORS[i%COLORS.length]; ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.3)'; ctx.lineWidth=3; ctx.stroke();
    const midAngle = sa+arc/2;
    let normAngle = midAngle % (Math.PI*2);
    if (normAngle < 0) normAngle += Math.PI*2;
    const flipped = normAngle > Math.PI/2 && normAngle < Math.PI*1.5;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(midAngle+(flipped?Math.PI:0));
    ctx.fillStyle = i===hi?'#000':'#fff'; ctx.textAlign='center';
    const dir = flipped?-1:1;
    const emojiSz = n<=4?84:n<=6?72:n<=8?60:50;
    ctx.font = `bold ${emojiSz}px "Noto Sans SC",sans-serif`;
    ctx.fillText(a[i].emoji, dir*r*0.33, emojiSz*0.35);
    const nameSz = n<=4?50:n<=6?44:n<=8?40:32;
    const maxLen = n<=4?10:n<=6?8:n<=8?6:5;
    ctx.font = `bold ${nameSz}px "Noto Sans SC",sans-serif`;
    const nm = a[i].name.length>maxLen ? a[i].name.slice(0,maxLen-1)+'…' : a[i].name;
    ctx.fillText(nm, dir*r*0.65, nameSz*0.35);
    ctx.restore();
  }
  const cr = 60;
  ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2);
  ctx.fillStyle='#0f0f1a'; ctx.fill();
  ctx.strokeStyle='#f59e0b'; ctx.lineWidth=4; ctx.stroke();
  ctx.fillStyle='#fff'; ctx.font='bold 28px sans-serif'; ctx.textAlign='center'; ctx.fillText('GO',cx,cy+10);
}

function spin() {
  sampleWheel(); curRot=0; drawWheel();
  const a = wheelActs; if (!a.length || spinning) return;
  spinning = true;
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('resCard').classList.remove('show');
  const n = a.length, arc = Math.PI*2/n, ti = Math.floor(Math.random()*n);
  const ta = -(ti*arc+arc/2) - Math.PI/2;
  const sp = 5+Math.random()*3, tr = sp*Math.PI*2+ta-(curRot%(Math.PI*2));
  const sr = curRot, dur = 4000+Math.random()*1000, st = performance.now();
  function ease(t){return 1-Math.pow(1-t,4)}
  function anim(now){
    const p = Math.min((now-st)/dur, 1);
    curRot = sr + tr*ease(p); drawWheel();
    if (p<1) requestAnimationFrame(anim);
    else {
      spinning = false;
      document.getElementById('spinBtn').disabled = false;
      showResAct(a[ti]); drawWheel(ti); confetti();
      const d = new Date();
      Store.update(s => {
        s.history.unshift({actId:a[ti].id, emoji:a[ti].emoji, name:a[ti].name, mode, date:d.toLocaleDateString('zh-CN',{month:'short',day:'numeric',weekday:'short'})});
        if (s.history.length > 20) s.history.length = 20;
      });
    }
  }
  requestAnimationFrame(anim);
}

function showResAct(act) {
  const info = act.info||{}, card = document.getElementById('resCard');
  const hot = weather && weather.current.temperature_2m >= 35;
  const ww = act.outdoor && hot ? '<span class="rtag ww">⚠️ 高温</span>' : '';
  let lk = '';
  if (info.mapQ) lk += `<a href="https://www.google.com/maps/search/${encodeURIComponent(info.mapQ)}" target="_blank">📍 地图</a>`;
  if (info.bookUrl) lk += `<a href="${escAttr(info.bookUrl)}" target="_blank">🎫 预订</a>`;
  if (info.phone) lk += `<a href="tel:${escAttr(info.phone)}">📞 电话</a>`;
  lk += `<a href="https://www.google.com/search?q=${encodeURIComponent(act.name+' Dubai 2026')}" target="_blank">🔍 搜索</a>`;
  let fazaaInfo = info.fazaa || '';
  if (!fazaaInfo && typeof VENUES !== 'undefined') {
    Object.values(VENUES).forEach(cat => (cat.items||[]).forEach(v => {
      if (v.name === act.name && v.fazaa) fazaaInfo = v.fazaa;
    }));
  }
  if (fazaaInfo) lk += `<a class="fazaa-link" href="https://www.fazaa.ae/search?language=en&keyword=${encodeURIComponent(act.name)}" target="_blank">🏷️ Fazaa</a>`;
  const fazaaRow = fazaaInfo ? `<div class="ir"><span class="ii">🏷️</span><span class="il">Fazaa</span><span class="fazaa-badge">${escapeHtml(fazaaInfo)}</span></div>` : '';
  const cat = CAT_BY_ID[act.cat];
  card.innerHTML = `<div class="rh"><div class="re">${escapeHtml(act.emoji||'🎯')}</div><div class="rn">${escapeHtml(act.name)}</div>
    <span class="rtag ${act.outdoor?'outdoor':'indoor'}">${act.outdoor?'☀️ 户外':'🏠 室内'}</span>${ww}
    ${fazaaInfo?'<span class="rtag" style="background:rgba(0,230,118,.15);color:#00e676">🏷️ 有优惠</span>':''}
    <span class="rtag" style="background:rgba(255,255,255,.08);color:var(--text2)">${escapeHtml(cat?.label||'')}</span></div>
  <div class="ri">
    ${fazaaRow}
    ${info.loc?`<div class="ir"><span class="ii">📍</span><span class="il">地点</span><span>${escapeHtml(info.loc)}</span></div>`:''}
    ${info.addr?`<div class="ir"><span class="ii">🏠</span><span class="il">地址</span><span>${escapeHtml(info.addr)}</span></div>`:''}
    ${info.dist?`<div class="ir"><span class="ii">🚗</span><span class="il">距离</span><span>从JLT ${escapeHtml(info.dist)}</span></div>`:''}
    ${info.cost?`<div class="ir"><span class="ii">💰</span><span class="il">预算</span><span>${escapeHtml(info.cost)}</span></div>`:''}
    ${info.age?`<div class="ir"><span class="ii">👧</span><span class="il">适龄</span><span>${escapeHtml(info.age)}</span></div>`:''}
    ${info.time?`<div class="ir"><span class="ii">⏰</span><span class="il">建议</span><span>${escapeHtml(info.time)}</span></div>`:''}
    ${info.hours?`<div class="ir"><span class="ii">🕐</span><span class="il">营业</span><span>${escapeHtml(info.hours)}</span></div>`:''}
    ${info.tip?`<div class="ir"><span class="ii">💡</span><span class="il">贴士</span><span>${escapeHtml(info.tip)}</span></div>`:''}
  </div>
  ${renderRatingSection(act)}
  <div class="rl">${lk}</div>`;
  card.classList.add('show');
  card.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function renderRatingSection(act) {
  const r = getUserRating(act.id);
  const visited = isVisited(act.id);
  const visitBtn = visited
    ? `<span style="font-size:11px;color:var(--success)">✅ 已参加</span>`
    : `<button class="visit-btn" onclick="confirmVisit('${escAttr(act.id)}')">✅ 确认参加</button>`;
  return `<div class="rating-section">
    <div class="rating-row" style="justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px">
        <span class="rating-label">评分</span>
        <span id="ratingStars" class="rating-stars">${renderStars(act.id)}</span>
      </div>
      ${visitBtn}
    </div>
    <div class="rating-row">
      <span class="rating-label">标记</span>
      <span id="ratingBtns">${renderStatusBtns(act.id)}</span>
    </div>
    <div class="rating-row">
      <input id="ratingNote" class="rating-note" placeholder="写个备注..." value="${escAttr(r.note)}" onblur="saveUserNote('${escAttr(act.id)}')">
    </div>
  </div>`;
}
function renderStars(id) {
  const r = getUserRating(id);
  let html = '';
  for (let s=1;s<=5;s++) {
    const filled = s <= r.stars;
    html += `<span class="rate-star ${filled?'filled':''}" onclick="changeStars('${escAttr(id)}',${s})">${filled?'★':'☆'}</span>`;
  }
  return html;
}
function renderStatusBtns(id) {
  const r = getUserRating(id);
  return `<button class="status-btn ${r.status==='recommend'?'active-rec':''}" onclick="changeStatus('${escAttr(id)}','${r.status==='recommend'?'normal':'recommend'}')">❤️ 推荐</button>`
    +`<button class="status-btn ${r.status==='blacklist'?'active-blk':''}" onclick="changeStatus('${escAttr(id)}','${r.status==='blacklist'?'normal':'blacklist'}')">🚫 拉黑</button>`;
}
function changeStars(id, s) {
  setUserStars(id, s);
  const el = document.getElementById('ratingStars');
  if (el) el.innerHTML = renderStars(id);
}
function changeStatus(id, st) {
  setUserStatus(id, st);
  const el = document.getElementById('ratingBtns');
  if (el) el.innerHTML = renderStatusBtns(id);
  if (st === 'blacklist') { sampleWheel(); drawWheel(); toast('🚫 已拉黑，不再出现在转盘'); }
  else if (st === 'recommend') toast('❤️ 已推荐，转盘优先');
  else toast('已恢复普通状态');
}
function saveUserNote(id) {
  const el = document.getElementById('ratingNote');
  if (el) { setUserNote(id, el.value); toast('💬 备注已保存'); }
}
function confirmVisit(id) {
  const act = ACT_BY_ID[id]; if (!act) return;
  markVisited(id, act.name, act.emoji, act.cat);
  toast('✅ 已记录参加「' + act.name.slice(0,15) + '」');
  const card = document.getElementById('resCard');
  if (card) card.querySelectorAll('.visit-btn').forEach(b => b.outerHTML = '<span style="font-size:11px;color:var(--success)">✅ 已参加</span>');
}

function confetti() {
  const c = document.getElementById('confC');
  if (!c) return;
  const cols = ['#f59e0b','#8b5cf6','#22c55e','#ef4444','#ec4899','#3b82f6'];
  for (let i=0;i<50;i++) {
    const e = document.createElement('div');
    e.className='confetti';
    e.style.cssText=`left:${30+Math.random()*40}%;top:-10px;width:${6+Math.random()*7}px;height:${6+Math.random()*7}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${Math.random()>.5?'50%':'2px'}`;
    c.appendChild(e);
    const x=(Math.random()-.5)*280, y=280+Math.random()*450;
    e.animate([{opacity:1,transform:'translate(0,0) rotate(0)'},{opacity:0,transform:`translate(${x}px,${y}px) rotate(${Math.random()*720}deg)`}],{duration:1200+Math.random()*1400,easing:'cubic-bezier(.25,.46,.45,.94)'}).onfinish=()=>e.remove();
  }
}

// ==================== MONTHLY PLAN (可编辑) ====================
function renderMonthlyPlan() {
  const state = Store.load();
  if (!mpCursorDate) {
    if (state.monthlyPlan && state.monthlyPlan.startDate) {
      mpCursorDate = new Date(state.monthlyPlan.startDate);
    } else {
      mpCursorDate = _nextMondayOrToday();
    }
  }
  const mp = state.monthlyPlan;
  const container = document.getElementById('mpContent');
  if (!container) return;

  // 月份导航栏
  const mm = mpCursorDate.getMonth()+1, yy = mpCursorDate.getFullYear();
  document.getElementById('mpTitle').textContent = `${yy}年${mm}月计划`;

  if (!mp || !mp.weeks || !mp.weeks.length) {
    container.innerHTML = `<div class="sec" style="margin:20px 16px;padding:24px 16px;text-align:center">
      <div style="font-size:40px;margin-bottom:8px">📅</div>
      <div style="font-size:14px;color:var(--text)">还没有月计划</div>
      <div style="font-size:12px;color:var(--text2);margin-top:6px">点下面按钮一键生成 · 或手动添加</div>
    </div>`;
    return;
  }
  const kidBusy = {};
  state.kidsSchedule.forEach(k => { if(!kidBusy[k.day])kidBusy[k.day]=[]; kidBusy[k.day].push(k); });
  const todayMD = `${new Date().getMonth()+1}/${new Date().getDate()}`;

  let html = '';
  mp.weeks.forEach((week, wi) => {
    const firstDate = week.dates['一'], lastDate = week.dates['日'];
    html += `<div class="mp-week">
      <div class="mp-week-h">第${wi+1}周 <span style="font-weight:400;color:var(--text2)">${firstDate} - ${lastDate}</span></div>`;
    DAYS.forEach(day => {
      const items = week.plan[day] || [];
      const busy = kidBusy[day];
      const isWd = isWeekday(day);
      const isToday = week.dates[day] === todayMD;
      html += `<div class="mp-day${isToday?' today':''}"><div class="mp-day-h">
        <span>${isWd?'🏠':'🚗'}</span>
        <span class="dn">${week.dates[day]} 周${day}</span>
        <span style="font-size:10px;color:${isWd?'var(--accent3)':'var(--success)'}">${isWd?'JLT内':'可出行'}</span>
        ${busy?`<span class="kb">🎒 ${busy.map(b=>escapeHtml(b.start+' '+b.name)).join(', ')}</span>`:''}
        <button class="add" onclick="openPlanItemEdit(${wi},'${day}',-1)">+ 添加</button>
      </div>`;
      items.forEach((it, idx) => {
        const a = it.act || {};
        const nm = a.name || it.name || '待定';
        const em = a.emoji || it.emoji || '🎯';
        const planKey = `mp:${wi}:${day}:${idx}:${it.time}:${nm}`;
        const hasR = Reminders.isSet(planKey);
        html += `<div class="mp-item">
          <span class="mi-time">${escapeHtml(it.time)}</span>
          <span class="mi-emoji">${escapeHtml(em)}</span>
          <span class="mi-name">${escapeHtml(nm)}</span>
          <span class="mi-bell ${hasR?'on':''}" onclick="toggleMpReminder(${wi},'${day}',${idx})" title="${hasR?'取消提醒':'设置提醒'}">${hasR?'🔔':'🔕'}</span>
          <button class="mi-act-btn" onclick="openPlanItemEdit(${wi},'${day}',${idx})" title="编辑">✏️</button>
          <button class="mi-act-btn del" onclick="deletePlanItem(${wi},'${day}',${idx})" title="删除">🗑️</button>
        </div>`;
      });
      if (!items.length) html += `<div style="font-size:11px;color:var(--text2);padding:4px 8px">— 这天没安排 —</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  });
  container.innerHTML = html;
}

function _nextMondayOrToday() {
  const today = new Date();
  const dow = today.getDay();
  const daysToMon = dow === 0 ? 1 : dow === 1 ? 0 : (8 - dow);
  const d = new Date(today);
  d.setDate(today.getDate() + daysToMon);
  return d;
}

function generateMonthlyPlan() {
  const state = Store.load();
  const fam = actsFor('family');
  const cou = actsFor('couple');
  const startDate = _nextMondayOrToday();
  const kidBusy = {};
  state.kidsSchedule.forEach(k => { if(!kidBusy[k.day])kidBusy[k.day]=[]; kidBusy[k.day].push(k); });

  // 周中 JLT 仪式池
  const jltPool = ACTIVITIES.filter(a => a.jlt && a.audiences.includes('family'));
  const sports = jltPool.filter(a => a.cat === 'sports');
  const learningOrReflect = jltPool.filter(a => ['learning','reading','reflect','skill'].includes(a.cat));
  const leisure = jltPool.filter(a => ['family_ritual','leisure'].includes(a.cat));

  function pick(pool, exclude) {
    const exIds = new Set((Array.isArray(exclude)?exclude:[exclude]).filter(Boolean).map(e => e.id||e));
    const valid = pool.filter(a => !exIds.has(a.id));
    if (!valid.length) return pool[Math.floor(Math.random()*pool.length)];
    return valid[Math.floor(Math.random()*valid.length)];
  }
  function pickBalanced(pool, exclude, preferOutdoor, preferFar) {
    const exIds = new Set((Array.isArray(exclude)?exclude:[exclude]).filter(Boolean).map(e => e.id||e));
    let valid = pool.filter(a => !exIds.has(a.id));
    if (!valid.length) valid = pool;
    if (preferOutdoor !== undefined) {
      const f = valid.filter(a => isOutdoor(a) === preferOutdoor);
      if (f.length) valid = f;
    }
    if (preferFar !== undefined) {
      const f = valid.filter(a => isNearby(a) !== preferFar);
      if (f.length) valid = f;
    }
    return valid[Math.floor(Math.random()*valid.length)];
  }

  const monSport = sports[Math.floor(Math.random()*sports.length)];
  const wedSport = pick(sports, monSport);
  const weeks = [];
  const usedWeekend = [];

  for (let w=0; w<4; w++) {
    const plan = {};
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + w*7);
    const weekDates = {};
    DAYS.forEach((day, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      weekDates[day] = `${d.getMonth()+1}/${d.getDate()}`;
    });
    plan['一'] = [{time:'19:30', act:monSport, note:'JLT运动', jlt:true}];
    const tueLearn = pickBalanced(learningOrReflect, null, w%2===0);
    plan['二'] = [{time:'19:30', act:tueLearn, note:'JLT学习/内省', jlt:true}];
    plan['三'] = [{time:'19:30', act:wedSport, note:'JLT运动', jlt:true}];
    const thuLeis = pickBalanced(leisure, null, w%2===1);
    plan['四'] = [{time:'19:30', act:thuLeis, note:'JLT休闲', jlt:true}];
    plan['五'] = [{time:'20:00', act:{id:'fri-tennis',emoji:'🎾',name:'网球 + 夫妻晚餐',outdoor:true}, note:'固定', jlt:false}];
    const satFar = w%2 === 0;
    const satMorning = pickBalanced(fam, usedWeekend, true, satFar);
    const satAft = pickBalanced(fam, [...usedWeekend, satMorning], !isOutdoor(satMorning), !satFar);
    usedWeekend.push(satMorning, satAft);
    plan['六'] = [
      {time:'08:00', act:satMorning, note:isNearby(satMorning)?'附近出行':'远足出行', jlt:false},
      {time:'14:00', act:satAft, note:isNearby(satAft)?'附近活动':'远处探索', jlt:false},
      {time:'21:30', act:pick(cou.length?cou:[{id:'couple-chat',emoji:'💑',name:'两人深聊',outdoor:false}]), note:'夫妻时间', jlt:false}
    ];
    const sunFar = !satFar;
    const sunAct = pickBalanced(fam, usedWeekend, undefined, sunFar);
    usedWeekend.push(sunAct);
    plan['日'] = [
      {time:'09:00', act:sunAct, note:isNearby(sunAct)?'附近出行':'远足出行', jlt:false},
      {time:'19:30', act:{id:'sun-movie',emoji:'🎬',name:'家庭电影夜',outdoor:false}, note:'JLT收尾', jlt:true}
    ];
    weeks.push({plan, dates:weekDates});
  }
  Store.set('monthlyPlan', {startDate: startDate.toISOString(), weeks});
  mpCursorDate = startDate;
  renderMonthlyPlan();
  toast('✅ 已生成本月4周计划，可点 ✏️ 编辑，🔔 设提醒');
}

function regenerateWeek(wi) {
  if (!confirm('重新生成第' + (wi+1) + '周？')) return;
  generateMonthlyPlan();
}

// 编辑面板
let _editCtx = null;
function openPlanItemEdit(wi, day, idx) {
  const mp = Store.get('monthlyPlan');
  if (!mp) return;
  _editCtx = {wi, day, idx};
  const isNew = idx < 0;
  const item = isNew ? {time:'19:30', act:{name:'',emoji:'🎯',outdoor:false}, note:''} : mp.weeks[wi].plan[day][idx];
  document.getElementById('editTitle').textContent = isNew ? '➕ 添加活动' : '✏️ 编辑活动';
  document.getElementById('edTime').value = item.time || '19:30';
  document.getElementById('edName').value = item.act?.name || item.name || '';
  document.getElementById('edEmoji').value = item.act?.emoji || item.emoji || '🎯';
  document.getElementById('edNote').value = item.note || '';
  document.getElementById('edOutdoor').checked = !!(item.act?.outdoor);
  const delBtn = document.getElementById('edDeleteBtn');
  if (delBtn) delBtn.style.display = isNew ? 'none' : 'inline-block';
  // 提醒设置
  const planKey = _planKey(wi, day, idx, item);
  const rem = Reminders.getFor(planKey);
  document.getElementById('edReminder').checked = !!(rem && !rem.sent);
  document.getElementById('edLead').value = (rem && rem.leadMin) || 30;
  document.getElementById('editModal').classList.add('show');
}
function _planKey(wi, day, idx, item) {
  const nm = item?.act?.name || item?.name || '';
  return `mp:${wi}:${day}:${idx}:${item?.time||''}:${nm}`;
}
function closePlanEdit() {
  document.getElementById('editModal').classList.remove('show');
  _editCtx = null;
}
function savePlanItem() {
  if (!_editCtx) return;
  const {wi, day, idx} = _editCtx;
  const mp = Store.get('monthlyPlan');
  if (!mp) return;
  const time = document.getElementById('edTime').value || '19:30';
  const name = document.getElementById('edName').value.trim();
  const emoji = document.getElementById('edEmoji').value.trim() || '🎯';
  const note = document.getElementById('edNote').value.trim();
  const outdoor = document.getElementById('edOutdoor').checked;
  if (!name) { toast('⚠️ 请输入活动名称'); return; }
  const item = {time, note, act:{name, emoji, outdoor}, jlt:false};
  if (idx < 0) {
    if (!mp.weeks[wi].plan[day]) mp.weeks[wi].plan[day] = [];
    mp.weeks[wi].plan[day].push(item);
    mp.weeks[wi].plan[day].sort((a,b) => a.time.localeCompare(b.time));
  } else {
    // 删掉老提醒
    const old = mp.weeks[wi].plan[day][idx];
    Reminders.cancel(_planKey(wi, day, idx, old));
    mp.weeks[wi].plan[day][idx] = item;
  }
  Store.set('monthlyPlan', mp);
  // 提醒
  const wantRem = document.getElementById('edReminder').checked;
  const lead = parseInt(document.getElementById('edLead').value) || 30;
  if (wantRem) {
    const newIdx = mp.weeks[wi].plan[day].indexOf(item);
    const pk = _planKey(wi, day, newIdx, item);
    const dateStr = mp.weeks[wi].dates[day]; // "M/D"
    const [mm, dd] = dateStr.split('/').map(Number);
    const [hh, mi] = time.split(':').map(Number);
    const year = new Date(mp.startDate).getFullYear();
    const fire = new Date(year, mm-1, dd, hh, mi);
    Reminders.schedule({planKey:pk, fireAt:fire.toISOString(), title:`${emoji} ${name}`, body:note||'', leadMin:lead});
    Reminders.requestPermission();
    toast('🔔 提醒已设置');
  }
  closePlanEdit();
  renderMonthlyPlan();
  toast('✅ 已保存');
}
function deleteCurrentPlanItem() {
  if (!_editCtx) return;
  const {wi, day, idx} = _editCtx;
  if (idx < 0) return;
  deletePlanItem(wi, day, idx);
  closePlanEdit();
}
function deletePlanItem(wi, day, idx) {
  if (!confirm('删除这个活动？')) return;
  const mp = Store.get('monthlyPlan');
  if (!mp) return;
  const item = mp.weeks[wi].plan[day][idx];
  Reminders.cancel(_planKey(wi, day, idx, item));
  mp.weeks[wi].plan[day].splice(idx, 1);
  Store.set('monthlyPlan', mp);
  renderMonthlyPlan();
  toast('🗑️ 已删除');
}
function toggleMpReminder(wi, day, idx) {
  const mp = Store.get('monthlyPlan');
  if (!mp) return;
  const item = mp.weeks[wi].plan[day][idx];
  const pk = _planKey(wi, day, idx, item);
  if (Reminders.isSet(pk)) { Reminders.cancel(pk); toast('🔕 提醒已取消'); }
  else {
    const dateStr = mp.weeks[wi].dates[day];
    const [mm, dd] = dateStr.split('/').map(Number);
    const [hh, mi] = item.time.split(':').map(Number);
    const year = new Date(mp.startDate).getFullYear();
    const fire = new Date(year, mm-1, dd, hh, mi);
    const nm = item.act?.name || item.name || '活动';
    const em = item.act?.emoji || item.emoji || '🎯';
    Reminders.schedule({planKey:pk, fireAt:fire.toISOString(), title:`${em} ${nm}`, body:item.note||'', leadMin:30});
    Reminders.requestPermission();
    toast('🔔 已设置提醒（提前30分钟）');
  }
  renderMonthlyPlan();
}
function toggleReminder(planKey, time, name, emoji) {
  if (Reminders.isSet(planKey)) { Reminders.cancel(planKey); toast('🔕 已取消'); }
  else {
    const now = new Date();
    const [hh, mi] = time.split(':').map(Number);
    const fire = new Date(now); fire.setHours(hh, mi, 0, 0);
    if (fire.getTime() < now.getTime()) fire.setDate(fire.getDate()+1);
    Reminders.schedule({planKey, fireAt:fire.toISOString(), title:`${emoji} ${name}`, body:'', leadMin:15});
    Reminders.requestPermission();
    toast('🔔 已设置提醒');
  }
  renderDashboard();
  renderMonthlyPlan();
}

// ==================== KIDS SCHEDULE ====================
function renderKidsSchedule() {
  const el = document.getElementById('ksList');
  if (!el) return;
  const ks = Store.get('kidsSchedule') || [];
  el.innerHTML = ks.map((k,i) =>
    `<div class="ks-row"><span class="ks-day">${escapeHtml(k.day)}</span><span class="ks-time">${escapeHtml(k.start)}-${escapeHtml(k.end)}</span><span class="ks-act">${escapeHtml(k.name)}</span><button class="ks-del" onclick="delKidsClass(${i})">✕</button></div>`
  ).join('');
}
function addKidsClass() {
  const day = document.getElementById('ksDay').value;
  const start = document.getElementById('ksStart').value;
  const end = document.getElementById('ksEnd').value;
  const name = document.getElementById('ksName').value.trim();
  if (!name) return;
  Store.update(s => s.kidsSchedule.push({day, start, end, name}));
  document.getElementById('ksName').value='';
  renderKidsSchedule();
  toast('✅ 已添加');
}
function delKidsClass(i) {
  Store.update(s => s.kidsSchedule.splice(i,1));
  renderKidsSchedule();
}

// ==================== DEALS PAGE ====================
// 渲染「本周精选具体优惠」— 与下方"渠道汇总"分离
function renderFeaturedDeals() {
  const el = document.getElementById('featuredDeals');
  if (!el) return;
  const today = todayISO();
  const list = (typeof FEATURED_DEALS !== 'undefined' ? FEATURED_DEALS : []).filter(d => {
    if (d.expiresAt) return d.expiresAt >= today;
    return true; // evergreen
  });
  if (!list.length) {
    el.innerHTML = '<div style="text-align:center;padding:14px;color:var(--text2);font-size:12px">本周精选暂无 — 都过期了，等下次更新</div>';
    return;
  }
  el.innerHTML = list.map(d => {
    let dayBadge = '';
    if (d.evergreen) {
      dayBadge = '<span class="fd-evergreen">常年</span>';
    } else if (d.expiresAt) {
      const daysLeft = Math.ceil((new Date(d.expiresAt).getTime() - Date.now()) / 86400000);
      const cls = daysLeft <= 3 ? 'fd-soon' : 'fd-days';
      dayBadge = `<span class="${cls}">${daysLeft <= 0 ? '今天截止' : '剩 ' + daysLeft + ' 天'}</span>`;
    }
    return `<div class="fd-card">
      <div class="fd-emoji">${escapeHtml(d.emoji||'🏷️')}</div>
      <div class="fd-body">
        <div class="fd-title">${escapeHtml(d.title)} ${dayBadge}</div>
        <div class="fd-venue">📍 ${escapeHtml(d.venue||'')}</div>
        <div class="fd-desc">${escapeHtml(d.desc||'')}</div>
        <div class="fd-meta">
          ${d.savings?`<span class="fd-savings">💰 ${escapeHtml(d.savings)}</span>`:''}
          ${d.source?`<span class="fd-source">via ${escapeHtml(d.source)}</span>`:''}
        </div>
      </div>
      ${d.url?`<a class="fd-go" href="${escAttr(d.url)}" target="_blank" rel="noopener">去看 →</a>`:''}
    </div>`;
  }).join('');
}

function renderDeals() {
  renderFeaturedDeals();
  const tabs = document.getElementById('dealTabs');
  const grid = document.getElementById('dealGrid');
  if (!tabs || !grid) return;
  tabs.innerHTML = DEAL_CATEGORIES.map(c =>
    `<div class="deal-tab ${dealFilter===c.id?'active':''}" onclick="setDealFilter('${c.id}')">${escapeHtml(c.emoji)} ${escapeHtml(c.label)}</div>`
  ).join('');
  const userDeals = Store.get('userDeals') || [];
  const allDeals = [...userDeals.map(d=>({...d,_user:true})), ...DEALS];
  const filtered = dealFilter === 'all' ? allDeals : allDeals.filter(d => d.cat === dealFilter);
  if (!filtered.length) { grid.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);font-size:12px">这个分类还没有内容</div>'; return; }
  grid.innerHTML = filtered.map(d => {
    const exp = d.expiresAt ? new Date(d.expiresAt) : null;
    const expTag = exp && exp.getTime() > Date.now() ? `<span class="expiry">${fmtDate(exp,'MM/DD')} 截止</span>` : '';
    const newTag = d._user ? '<span class="new-tag">我添加的</span>' : '';
    return `<div class="deal-card">
      <div class="deal-emoji">${escapeHtml(d.emoji)}</div>
      <div class="deal-body">
        <div class="deal-name">${escapeHtml(d.name)} ${newTag} ${expTag}</div>
        <div class="deal-desc">${escapeHtml(d.desc||'')}</div>
        <div class="deal-meta">
          ${d.savings?`<span class="savings">💰 ${escapeHtml(d.savings)}</span>`:''}
          ${d.meta?`<span>${escapeHtml(d.meta)}</span>`:''}
        </div>
      </div>
      ${d.url?`<a class="deal-link" href="${escAttr(d.url)}" target="_blank" rel="noopener">去看</a>`:''}
      ${d._user?`<button class="mi-act-btn del" onclick="deleteUserDeal('${escAttr(d.id)}')" title="删除">🗑️</button>`:''}
    </div>`;
  }).join('');
}
function setDealFilter(id) { dealFilter = id; renderDeals(); }

function openAddDealModal() {
  document.getElementById('addDealModal').classList.add('show');
  document.getElementById('adName').value='';
  document.getElementById('adDesc').value='';
  document.getElementById('adUrl').value='';
  document.getElementById('adSavings').value='';
  document.getElementById('adExpiry').value='';
  document.getElementById('adEmoji').value='🏷️';
  document.getElementById('adCat').value='dining';
}
function closeAddDealModal() { document.getElementById('addDealModal').classList.remove('show'); }
function saveUserDeal() {
  const name = document.getElementById('adName').value.trim();
  if (!name) { toast('⚠️ 请输入名称'); return; }
  const deal = {
    id: 'u_' + uid(),
    name,
    emoji: document.getElementById('adEmoji').value.trim() || '🏷️',
    desc: document.getElementById('adDesc').value.trim(),
    url: document.getElementById('adUrl').value.trim(),
    savings: document.getElementById('adSavings').value.trim(),
    cat: document.getElementById('adCat').value,
    expiresAt: document.getElementById('adExpiry').value || null,
    createdAt: new Date().toISOString()
  };
  Store.update(s => s.userDeals.unshift(deal));
  closeAddDealModal();
  renderDeals();
  toast('✅ 已添加折扣');
}
function deleteUserDeal(id) {
  if (!confirm('删除这个折扣？')) return;
  Store.update(s => { s.userDeals = s.userDeals.filter(d => d.id !== id); });
  renderDeals();
}

// ==================== ME PAGE ====================
function renderMePage() {
  renderProfile();
  renderWishlist();
  renderStats();
  renderVisited();
  renderGrowthSection();
  renderCookingSection();
  renderSkillsSection();
}

// ==================== 心愿单（想做的事） ====================
const WISH_CAT_LABEL = {
  explore:'✨ 探索', food:'🍜 美食', sports:'⚽ 运动', culture:'🎭 文化',
  nature:'🌿 自然', travel:'✈️ 旅行', learning:'📚 学习', family:'👨‍👩‍👧 家庭', other:'📌 其他'
};
let _editingWishId = null;

function renderWishlist() {
  const list = Store.get('wishlist') || [];
  const countEl = document.getElementById('wishCount');
  if (countEl) countEl.textContent = list.length;
  const el = document.getElementById('wishlistList');
  if (!el) return;
  if (!list.length) {
    el.innerHTML = '<div style="text-align:center;color:var(--text2);font-size:12px;padding:14px 8px;line-height:1.6">还没有想做的事 — 点下面按钮，把脑子里的好主意存下来<br><span style="font-size:10px;opacity:.7">比如「去音乐节」「带孩子看流星雨」「一个人去 staycation」</span></div>';
    return;
  }
  el.innerHTML = list.map(w => `
    <div class="wish-item">
      <div class="wi-emoji">${escapeHtml(w.emoji||'💭')}</div>
      <div class="wi-body">
        <div class="wi-title">${escapeHtml(w.title)} <span class="wi-cat">${escapeHtml(WISH_CAT_LABEL[w.cat]||'')}</span></div>
        ${w.venue?`<div class="wi-venue">📍 ${escapeHtml(w.venue)}</div>`:''}
        ${(w.when||w.cost)?`<div class="wi-meta">${w.when?'⏰ '+escapeHtml(w.when):''}${w.when&&w.cost?' · ':''}${w.cost?'💰 '+escapeHtml(w.cost):''}</div>`:''}
        ${w.notes?`<div class="wi-notes">💡 ${escapeHtml(w.notes)}</div>`:''}
        <div class="wi-actions">
          ${w.url?`<a class="wi-link" href="${escAttr(w.url)}" target="_blank" rel="noopener">🔗 链接</a>`:''}
          <button class="wi-btn" onclick="completeWishlist('${escAttr(w.id)}')" title="完成">✅ 做了</button>
          <button class="wi-btn" onclick="openWishlistModal('${escAttr(w.id)}')" title="编辑">✏️</button>
          <button class="wi-btn del" onclick="deleteWishlist('${escAttr(w.id)}')" title="删除">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openWishlistModal(id) {
  _editingWishId = id || null;
  const w = id ? (Store.get('wishlist') || []).find(x => x.id === id) : null;
  document.getElementById('wishModalTitle').textContent = w ? '✏️ 编辑想做的事' : '💭 想做的事';
  document.getElementById('wlEmoji').value  = w?.emoji  || '💭';
  document.getElementById('wlCat').value    = w?.cat    || 'explore';
  document.getElementById('wlTitle').value  = w?.title  || '';
  document.getElementById('wlVenue').value  = w?.venue  || '';
  document.getElementById('wlWhen').value   = w?.when   || '';
  document.getElementById('wlCost').value   = w?.cost   || '';
  document.getElementById('wlNotes').value  = w?.notes  || '';
  document.getElementById('wlUrl').value    = w?.url    || '';
  document.getElementById('wlDeleteBtn').style.display = w ? '' : 'none';
  document.getElementById('wishlistModal').classList.add('show');
}

function closeWishlistModal() {
  document.getElementById('wishlistModal').classList.remove('show');
  _editingWishId = null;
}

function saveWishlistItem() {
  const title = document.getElementById('wlTitle').value.trim();
  if (!title) { toast('⚠️ 请填「想做什么」'); return; }
  const data = {
    emoji: document.getElementById('wlEmoji').value.trim() || '💭',
    cat:   document.getElementById('wlCat').value || 'explore',
    title,
    venue: document.getElementById('wlVenue').value.trim(),
    when:  document.getElementById('wlWhen').value.trim(),
    cost:  document.getElementById('wlCost').value.trim(),
    notes: document.getElementById('wlNotes').value.trim(),
    url:   document.getElementById('wlUrl').value.trim()
  };
  Store.update(s => {
    if (!s.wishlist) s.wishlist = [];
    if (_editingWishId) {
      const i = s.wishlist.findIndex(x => x.id === _editingWishId);
      if (i >= 0) s.wishlist[i] = {...s.wishlist[i], ...data};
    } else {
      s.wishlist.unshift({id:'w_'+uid(), ...data, createdAt: todayISO()});
    }
  });
  closeWishlistModal();
  renderWishlist();
  toast(_editingWishId ? '✅ 已更新' : '✅ 已加入心愿单');
}

function deleteWishlist(id) {
  if (!confirm('删除这个想做的事？')) return;
  Store.update(s => { s.wishlist = (s.wishlist || []).filter(x => x.id !== id); });
  renderWishlist();
}

function deleteCurrentWishlist() {
  if (!_editingWishId) return;
  if (!confirm('删除这个想做的事？')) return;
  Store.update(s => { s.wishlist = (s.wishlist || []).filter(x => x.id !== _editingWishId); });
  closeWishlistModal();
  renderWishlist();
  toast('🗑️ 已删除');
}

// 标记完成 → 移到「参加过」+ 从心愿单移除
function completeWishlist(id) {
  const list = Store.get('wishlist') || [];
  const w = list.find(x => x.id === id);
  if (!w) return;
  const visitId = 'wish_' + w.id;
  markVisited(visitId, w.title, w.emoji||'💭', w.cat||'explore');
  Store.update(s => { s.wishlist = (s.wishlist || []).filter(x => x.id !== id); });
  renderWishlist();
  renderVisited();
  renderStats();
  toast('🎉 已标记为做过 — 移到了「参加过」');
}
function renderProfile() {
  const p = Store.get('profile') || {};
  ['name','addr','family','interests'].forEach(k => {
    const el = document.getElementById('pf_'+k);
    if (el) el.value = p[k] || '';
  });
  ['fazaa','entertainer'].forEach(k => {
    const el = document.getElementById('pf_'+k);
    if (el) el.value = p[k] || '';
  });
}
function saveProfile() {
  Store.update(s => {
    ['name','addr','family','interests','fazaa','entertainer'].forEach(k => {
      const el = document.getElementById('pf_'+k);
      if (el) s.profile[k] = el.value;
    });
  });
  toast('✅ 已保存个人信息');
}
function renderStats() {
  const state = Store.load();
  const visited = state.visited, ratings = state.userRatings;
  const total = visited.length;
  const unique = new Set(visited.map(v => v.actId)).size;
  const ratedArr = Object.values(ratings).filter(r => r.stars > 0);
  const avg = ratedArr.length ? (ratedArr.reduce((s,r)=>s+r.stars,0)/ratedArr.length).toFixed(1) : '-';
  const rec = Object.values(ratings).filter(r => r.status === 'recommend').length;
  const blk = Object.values(ratings).filter(r => r.status === 'blacklist').length;
  const streak = growthStreak();
  const growthTotal = state.growthLog.length;
  const growthMin = state.growthLog.reduce((s,l)=>s+(l.minutes||0),0);
  const cooked = state.cookingLog.length;

  const statsEl = document.getElementById('statsContent');
  if (statsEl) statsEl.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num">${total}</div><div class="stat-label">参加次数</div></div>
      <div class="stat-card"><div class="stat-num">${unique}</div><div class="stat-label">不同活动</div></div>
      <div class="stat-card"><div class="stat-num">${avg}</div><div class="stat-label">平均评分</div></div>
      <div class="stat-card"><div class="stat-num">${streak}</div><div class="stat-label">连续天数</div></div>
    </div>
    <div class="growth-stats" style="margin-top:8px">
      <div class="gs-card"><div class="gs-num">${growthTotal}</div><div class="gs-label">成长记录</div></div>
      <div class="gs-card"><div class="gs-num">${Math.round(growthMin/60)}h</div><div class="gs-label">累计时长</div></div>
      <div class="gs-card"><div class="gs-num">${cooked}</div><div class="gs-label">烹饪次数</div></div>
      <div class="gs-card"><div class="gs-num">${rec}</div><div class="gs-label">已推荐</div></div>
    </div>`;
}
function renderVisited() {
  const visited = Store.get('visited') || [];
  const el = document.getElementById('visitedList');
  const cntEl = document.getElementById('visitedCount');
  if (cntEl) cntEl.textContent = new Set(visited.map(v => v.actId)).size;
  if (!el) return;
  el.innerHTML = visited.length
    ? visited.slice(0,60).map((v,i) => {
        const r = getUserRating(v.actId);
        const stars = r.stars ? '★'.repeat(r.stars) : '';
        return `<div class="visited-item">
          <span class="vi-date">${escapeHtml(v.date)}</span>
          <span>${escapeHtml(v.emoji)}</span>
          <span style="flex:1">${escapeHtml(v.name)}</span>
          <span class="vi-stars">${stars}</span>
          <button class="vi-remove" onclick="removeVisitedAt(${i})">✕</button>
        </div>`;
      }).join('')
    : '<div style="font-size:12px;color:var(--text2);padding:8px">还没记录 — 转盘转到后点「确认参加」</div>';

  // 推荐 / 黑名单
  const ratings = Store.get('userRatings');
  const recs = Object.entries(ratings).filter(([,r])=>r.status==='recommend');
  const blks = Object.entries(ratings).filter(([,r])=>r.status==='blacklist');
  const recCntEl = document.getElementById('recCount');
  const blkCntEl = document.getElementById('blkCount');
  if (recCntEl) recCntEl.textContent = recs.length;
  if (blkCntEl) blkCntEl.textContent = blks.length;
  const recEl = document.getElementById('recList');
  const blkEl = document.getElementById('blkList');
  if (recEl) recEl.innerHTML = recs.length ? recs.map(([id,r]) => {
    const name = ACT_BY_ID[id]?.name || id;
    return `<div class="visited-item"><span>❤️</span><span style="flex:1">${escapeHtml(name)}</span><span class="vi-stars">${r.stars?'★'.repeat(r.stars):''}</span><button class="vi-remove" onclick="unsetStatus('${escAttr(id)}','rec')">✕</button></div>`;
  }).join('') : '<div style="font-size:12px;color:var(--text2);padding:8px">暂无推荐</div>';
  if (blkEl) blkEl.innerHTML = blks.length ? blks.map(([id,r]) => {
    const name = ACT_BY_ID[id]?.name || id;
    return `<div class="visited-item"><span>🚫</span><span style="flex:1">${escapeHtml(name)}</span><button class="vi-remove" onclick="unsetStatus('${escAttr(id)}','blk')">✕</button></div>`;
  }).join('') : '<div style="font-size:12px;color:var(--text2);padding:8px">暂无黑名单</div>';
}
function removeVisitedAt(i) { removeVisited(i); renderVisited(); renderStats(); }
function unsetStatus(id, kind) {
  setUserStatus(id, 'normal');
  renderVisited();
  toast(kind==='rec' ? '已取消推荐' : '已解除拉黑');
}

// 成长模块（每日一学 + 累计统计 + 日志 + 周月报告）
let growthScope = 'week';
const TYPE_LABELS = {reading:'📖 读书',podcast:'🎙️ 播客',exercise:'🏃 运动',reflect:'🧘 内省',cooking:'🍳 做饭',connect:'💞 陪家人',skill:'🎯 技能',writing:'✍️ 写作',language:'🗣️ 语言',course:'💻 课程',documentary:'🎬 纪录片',video:'💡 视频',app:'📱 App'};

function renderGrowthSection() {
  const el = document.getElementById('growthContent');
  if (!el) return;
  const log = Store.get('growthLog') || [];
  const recent = log.slice(0, 20);
  const rep = growthReport(growthScope);
  const streak = growthStreak();

  // 「快速记录」chips 已经由 index.html 的 .growth-quicklog 静态渲染，这里不再重复

  let html = '<div style="font-size:11px;color:var(--text2);margin-bottom:8px">💡 每天做一件让自己成长的小事，积累起来就是人生</div>';

  // 报告切换（用 deal-tab 样式，原 cat-tab 已删）
  html += '<div style="display:flex;gap:4px;margin-bottom:8px">';
  [['week','本周'],['month','本月'],['all','累计']].forEach(([v,l]) => {
    html += `<button class="deal-tab ${growthScope===v?'active':''}" onclick="setGrowthScope('${v}')">${l}</button>`;
  });
  html += '</div>';

  // 报告汇总卡
  html += `<div style="background:var(--card2);border-radius:10px;padding:10px 12px;margin-bottom:10px">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px">
      <div style="text-align:center"><div style="font-size:18px;font-weight:900;color:var(--dim-grow)">${rep.count}</div><div style="font-size:9px;color:var(--text2)">次打卡</div></div>
      <div style="text-align:center"><div style="font-size:18px;font-weight:900;color:var(--dim-grow)">${rep.totalHours}h</div><div style="font-size:9px;color:var(--text2)">总时长</div></div>
      <div style="text-align:center"><div style="font-size:18px;font-weight:900;color:var(--dim-grow)">${rep.days}</div><div style="font-size:9px;color:var(--text2)">天数</div></div>
      <div style="text-align:center"><div style="font-size:18px;font-weight:900;color:var(--accent)">${streak}🔥</div><div style="font-size:9px;color:var(--text2)">连续</div></div>
    </div>`;
  const typeEntries = Object.entries(rep.byType).sort((a,b) => b[1]-a[1]);
  if (typeEntries.length) {
    html += '<div style="font-size:10px;color:var(--text2);margin-bottom:4px">分类分布</div>';
    const max = Math.max(...typeEntries.map(e=>e[1]));
    typeEntries.forEach(([t, n]) => {
      const w = Math.round(n/max*100);
      html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0;font-size:11px">
        <span style="min-width:80px">${escapeHtml(TYPE_LABELS[t] || t)}</span>
        <div style="flex:1;height:6px;background:rgba(15,23,42,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:${w}%;background:linear-gradient(90deg,var(--dim-grow),var(--accent2));border-radius:3px"></div></div>
        <span style="min-width:26px;text-align:right;font-weight:700">${n}</span>
      </div>`;
    });
  } else {
    html += '<div style="font-size:11px;color:var(--text2);text-align:center;padding:10px">这段时间还没打卡 — 从上面的按钮开始</div>';
  }
  html += '</div>';

  // 最近记录
  html += '<div style="font-size:12px;color:var(--text);font-weight:700;margin-bottom:4px">📜 最近记录</div>';
  html += recent.length
    ? recent.map(l => `<div class="visited-item">
        <span class="vi-date">${escapeHtml(l.date)}</span>
        <span style="flex:1">${escapeHtml(l.refName||TYPE_LABELS[l.type]||l.type)}${l.minutes?' · '+l.minutes+'分钟':''}</span>
        ${l.note?`<span style="font-size:10px;color:var(--text2);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(l.note)}</span>`:''}
      </div>`).join('')
    : '<div style="font-size:12px;color:var(--text2);padding:8px">还没有记录 — 点上面的按钮开始吧</div>';
  el.innerHTML = html;
}
function setGrowthScope(s) { growthScope = s; renderGrowthSection(); }

// 烹饪模块
function tonightDinnerSuggestion() {
  const state = Store.load();
  const done = new Set(state.cookingLog.map(l => l.recipeId));
  const wish = new Set(state.cookingWishlist);
  const dow = new Date().getDay();
  const isWeekend = dow === 0 || dow === 5 || dow === 6;
  // 优先心愿单里、没做过的；其次工作日简单/周末挑战
  const candidates = RECIPES.filter(r => !done.has(r.id));
  // 权重
  const scored = candidates.map(r => {
    let score = Math.random();
    if (wish.has(r.id)) score += 10;
    // 工作日偏好时间短、难度低
    if (!isWeekend) {
      if (r.time <= 20) score += 2;
      if (r.difficulty <= 2) score += 1.5;
    } else {
      if (r.difficulty >= 3) score += 1;
      if (r.time >= 45) score += 0.5;
    }
    // 有孩子可参与的加分
    if (r.kidFriendly) score += 0.8;
    return {r, score};
  });
  scored.sort((a,b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.r);
}

function renderCookingSection() {
  const el = document.getElementById('cookingContent');
  if (!el) return;
  const state = Store.load();
  const done = new Set(state.cookingLog.map(l => l.recipeId));
  const wish = new Set(state.cookingWishlist);
  // 今晚推荐
  const suggestions = tonightDinnerSuggestion();
  let html = `<div style="background:linear-gradient(135deg,rgba(239,68,68,.1),rgba(245,158,11,.08));border-radius:10px;padding:10px 12px;margin-bottom:10px">
    <div style="font-size:12px;color:var(--dim-passion);font-weight:700;margin-bottom:6px">🍽️ 今晚吃什么？ <span style="font-size:10px;color:var(--text2);font-weight:400">基于你的心愿单+工作日/周末+孩子</span></div>`;
  suggestions.forEach(r => {
    html += `<div class="item-card" style="background:var(--card);margin:4px 0">
      <div class="item-emoji">${escapeHtml(r.emoji)}</div>
      <div class="item-body">
        <div class="item-name">${escapeHtml(r.name)}</div>
        <div class="item-meta">
          <span class="item-tag">难度 ${'★'.repeat(r.difficulty)}</span>
          <span class="item-tag">${r.time}分钟</span>
          ${r.kidFriendly?'<span class="item-tag" style="color:var(--success)">👶 可参与</span>':''}
          ${wish.has(r.id)?'<span class="item-tag" style="color:#f472b6">❤️ 心愿</span>':''}
        </div>
      </div>
      <button class="item-done-btn" onclick="logRecipeMade('${escAttr(r.id)}','${escAttr(r.name)}')">✓ 就做这个</button>
    </div>`;
  });
  html += '<button class="btn-ghost" style="width:100%;margin-top:4px;font-size:11px;padding:6px" onclick="renderCookingSection()">🔄 换一批</button></div>';
  // 分类 tabs
  html += '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">';
  RECIPE_CATS.forEach(c => {
    html += `<div class="cat-tab ${recipeFilter===c.id?'active':''}" onclick="setRecipeFilter('${c.id}')">${escapeHtml(c.emoji)} ${escapeHtml(c.label)}</div>`;
  });
  html += '</div>';
  const recipes = recipeFilter === 'all' ? RECIPES : RECIPES.filter(r => r.cat === recipeFilter);
  html += `<div style="font-size:11px;color:var(--text2);margin-bottom:6px">已做 ${done.size}/${RECIPES.length} · 心愿 ${wish.size}</div>`;
  html += recipes.map(r => {
    const isDone = done.has(r.id);
    const isWish = wish.has(r.id);
    return `<div class="item-card">
      <div class="item-emoji">${escapeHtml(r.emoji)}</div>
      <div class="item-body">
        <div class="item-name">${escapeHtml(r.name)}</div>
        <div class="item-desc">${escapeHtml(r.desc||r.steps||'')}</div>
        <div class="item-meta">
          <span class="item-tag">难度 ${'★'.repeat(r.difficulty)}</span>
          <span class="item-tag">${r.time}分钟</span>
          ${r.kidFriendly?'<span class="item-tag" style="color:var(--success)">👶 孩子可参与</span>':''}
        </div>
      </div>
      <button class="item-done-btn ${isDone?'done':''}" onclick="logRecipeMade('${escAttr(r.id)}','${escAttr(r.name)}')">${isDone?'✓ 再做':'✓ 做过'}</button>
      <button class="mi-act-btn" onclick="toggleWishRecipe('${escAttr(r.id)}')" title="${isWish?'取消心愿':'加心愿'}">${isWish?'❤️':'🤍'}</button>
    </div>`;
  }).join('');
  el.innerHTML = html;
}
function setRecipeFilter(c) { recipeFilter = c; renderCookingSection(); }
function logRecipeMade(id, name) {
  Store.update(s => s.cookingLog.unshift({date:todayISO(), recipeId:id, name}));
  logGrowth({type:'cooking', refId:id, refName:name, minutes:45, note:''});
  toast('🍳 已记录 ' + name);
  renderCookingSection(); renderStats();
}
function toggleWishRecipe(id) {
  Store.update(s => {
    const i = s.cookingWishlist.indexOf(id);
    if (i >= 0) s.cookingWishlist.splice(i,1);
    else s.cookingWishlist.unshift(id);
  });
  renderCookingSection();
}

// 技能模块
function renderSkillsSection() {
  const el = document.getElementById('skillsContent');
  if (!el) return;
  const progress = Store.get('skillProgress') || {};
  let html = '<div style="font-size:11px;color:var(--text2);margin-bottom:6px">💡 选一个技能 · 每周一个任务 · 小步前进</div>';
  html += SKILLS.map(sk => {
    const p = progress[sk.id] || {startedAt:null, weeksDone:[]};
    const done = p.weeksDone.length;
    const pct = Math.round(done / sk.weeks * 100);
    return `<div class="skill-path">
      <div class="skill-path-h">
        <span style="font-size:22px">${escapeHtml(sk.emoji)}</span>
        <span class="skill-path-name">${escapeHtml(sk.name)}</span>
        <span style="font-size:10px;color:var(--text2)">${done}/${sk.weeks}周</span>
      </div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:4px">${escapeHtml(sk.desc)}</div>
      <div class="skill-progress"><div class="skill-progress-fill" style="width:${pct}%"></div></div>
      <div class="skill-weeks">
        ${sk.plan.map((task, wk) => {
          const isDone = p.weeksDone.includes(wk);
          return `<div class="skill-week ${isDone?'done':''}" onclick="toggleSkillWeek('${escAttr(sk.id)}',${wk})" title="${escAttr(task)}">W${wk+1}${isDone?' ✓':''}<br><span style="font-size:8px;opacity:.7">${escapeHtml(task.slice(0,6))}</span></div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
  el.innerHTML = html;
}
function toggleSkillWeek(skillId, weekIdx) {
  Store.update(s => {
    if (!s.skillProgress[skillId]) s.skillProgress[skillId] = {startedAt: new Date().toISOString(), weeksDone:[]};
    const p = s.skillProgress[skillId];
    const i = p.weeksDone.indexOf(weekIdx);
    if (i >= 0) p.weeksDone.splice(i,1);
    else p.weeksDone.push(weekIdx);
  });
  const sk = SKILLS.find(s=>s.id===skillId);
  if (sk) logGrowth({type:'skill', refId:skillId, refName:`${sk.name} 第${weekIdx+1}周`, minutes:30, note:sk.plan[weekIdx]});
  renderSkillsSection();
  renderStats();
  toast('🎯 进度已更新');
}

// 数据管理
function exportData() {
  const data = Store.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `life-spinner-backup-${todayISO()}.json`;
  a.click();
  toast('📤 数据已导出');
}
function clearAllData() {
  if (!confirm('确定清除全部数据？此操作不可恢复！')) return;
  if (!confirm('真的要清除吗？')) return;
  localStorage.clear();
  location.reload();
}
function openImportPicker() {
  const el = document.getElementById('importFile');
  if (el) el.click();
}
async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!confirm('导入会覆盖当前数据（现有数据会被替换）。继续？')) { e.target.value = ''; return; }
  try {
    await importDataFromFile(file);
    toast('✅ 导入成功，刷新中...');
    setTimeout(() => location.reload(), 800);
  } catch(err) {
    toast('❌ 导入失败：' + err.message);
    console.error(err);
  }
  e.target.value = '';
}

// ==================== FAB (add activity) ====================
function updateFab() {
  const fab = document.getElementById('fabAdd');
  if (!fab) return;
  const spinnerActive = document.getElementById('pageSpinner').classList.contains('active');
  fab.style.display = spinnerActive ? 'flex' : 'none';
}
let _addModalMode='family', _addModalCat='leisure', _addModalType='outdoor';
function openAddModal() {
  _addModalMode = mode;
  document.querySelectorAll('.am-mode-chip').forEach(c => c.classList.toggle('active', c.dataset.mode === _addModalMode));
  document.getElementById('addModalOverlay').classList.add('show');
}
function closeAddModal() { document.getElementById('addModalOverlay').classList.remove('show'); }
function setAddMode(el, m) { _addModalMode = m; document.querySelectorAll('.am-mode-chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); }
function setAddCat(el) { _addModalCat = el.dataset.cat; document.querySelectorAll('#amCatChips .am-chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); }
function setAddType(el) { _addModalType = el.dataset.type; document.querySelectorAll('#amTypeChips .am-chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); }
function submitAddModal() {
  const name = document.getElementById('amName').value.trim();
  if (!name) { toast('⚠️ 请输入活动名称'); return; }
  const emoji = document.getElementById('amEmoji').value.trim() || '🎯';
  const id = slugify(name) + '-u' + uid().slice(-4);
  const info = {};
  ['Loc','Addr','Dist','Cost','Age','Time','Hours','Phone','Tip','BookUrl'].forEach(k => {
    const v = document.getElementById('am'+k)?.value.trim();
    if (v) info[k.toLowerCase()] = v;
  });
  info.mapQ = encodeURIComponent(name + ' Dubai');
  const newAct = {id, name, emoji, audiences:[_addModalMode], cat:_addModalCat, outdoor: _addModalType==='outdoor', info, userAdded:true};
  // push into ACTIVITIES global
  ACTIVITIES.push(newAct);
  ACT_BY_ID[id] = newAct;
  ACT_BY_NAME[name] = newAct;
  // persist user-added list (v2)
  Store.update(s => {
    if (!s.userActivities) s.userActivities = [];
    s.userActivities.push(newAct);
  });
  sampleWheel(); drawWheel(); renderCatFilter();
  // clear form
  ['amName','amLoc','amAddr','amDist','amCost','amAge','amTime','amHours','amPhone','amTip','amBookUrl','amEmoji'].forEach(i => {
    const el = document.getElementById(i); if (el) el.value='';
  });
  closeAddModal();
  toast('✅ 已添加活动');
}

function loadUserActivities() {
  const ua = Store.get('userActivities') || [];
  ua.forEach(a => {
    if (!ACT_BY_ID[a.id]) {
      ACTIVITIES.push(a);
      ACT_BY_ID[a.id] = a;
      ACT_BY_NAME[a.name] = a;
    }
  });
}

// ==================== INIT ====================
window.addEventListener('DOMContentLoaded', () => {
  Store.load();            // 加载 + 迁移
  loadUserActivities();    // 合并用户自定义活动
  cleanupExpiredDeals();   // 清理过期折扣
  // 每日一句轮换
  Store.update(s => { s.lastDashQuote = (s.lastDashQuote + 1) % QUOTES.length; });
  fetchWeather();
  renderDashboard();
  renderCatFilter(); sampleWheel(); drawWheel();
  document.getElementById('wheel')?.addEventListener('click', () => { if (!spinning) spin(); });
  // Reminders
  Reminders.start();
  Reminders.cleanup();
  // 导入文件监听
  document.getElementById('importFile')?.addEventListener('change', handleImportFile);
  // Service Worker
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
});

// 导出所有全局函数（便于 HTML 内 onclick 调用）
Object.assign(window, {
  showPage, toggleSec,
  renderDashboard, renderQuoteCard, reshuffleQuote, renderAppShortcuts, launchApp, renderPillarCards, openPillarMeaning, openDailyEat, openDailyPlay, reshuffleInspire, openDimDetail, quickLog, toggleReminder,
  setMode, setCatFilter, spin,
  changeStars, changeStatus, saveUserNote, confirmVisit,
  renderMonthlyPlan, generateMonthlyPlan,
  openPlanItemEdit, closePlanEdit, savePlanItem, deleteCurrentPlanItem,
  deletePlanItem, toggleMpReminder,
  addKidsClass, delKidsClass,
  renderDeals, renderFeaturedDeals, setDealFilter,
  openAddDealModal, closeAddDealModal, saveUserDeal, deleteUserDeal,
  renderMePage, saveProfile, removeVisitedAt, unsetStatus,
  renderWishlist, openWishlistModal, closeWishlistModal, saveWishlistItem, deleteWishlist, deleteCurrentWishlist, completeWishlist,
  setRecipeFilter, logRecipeMade, toggleWishRecipe, toggleSkillWeek,
  setGrowthScope,
  exportData, clearAllData, openImportPicker, handleImportFile,
  openAddModal, closeAddModal, setAddMode, setAddCat, setAddType, submitAddModal
});
