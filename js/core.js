// ============================================================
// Core: Store (schema v2) · Util · Reminders
// ============================================================

// ==================== STORE ====================
// Schema v2 统一键: ls_v2 包含一切；旧键 s_fam/s_cou/... 只用于迁移
const STORE_KEY = 'ls_v2';
const SCHEMA_VERSION = 2;

const DEFAULT_STATE = {
  v: SCHEMA_VERSION,
  profile: {name:'', addr:'JLT Cluster S', family:'', interests:'', fazaa:'', entertainer:''},
  userRatings: {},     // {actId: {stars, status, note}}
  visited: [],          // [{actId, name, emoji, cat, date}]
  history: [],          // 转盘历史 [{actId, name, emoji, mode, date}]
  weeklyPlan: [],       // 固定周节奏 [{day,time,act,emoji,reminder?}]
  monthlyPlan: null,    // 可编辑月计划 {startDate, weeks:[{plan:{一:[...],...}, dates:{}}]}
  kidsSchedule: [],     // [{day,start,end,name}]
  reminders: [],        // [{id, planKey, fireAt(ISO), title, body, sent:false, leadMin}]
  growthLog: [],        // [{date, type, refId, refName, minutes, note}]
  cookingLog: [],       // [{date, recipeId, rating, note}]
  cookingWishlist: [],  // [recipeId]
  wishlist: [],         // 心愿单 [{id, emoji, title, venue, when, notes, url, cat, createdAt}]
  skillProgress: {},    // {skillId: {startedAt, weeksDone:[...]}}
  userDeals: [],        // 用户自己录入的折扣
  lastDashQuote: -1,
  migratedFromV1: false,
  // —— 反刷视频三件套 ——
  sentinel: {
    enabled: true,
    weekdayHours: ['19:30','21:30'],     // 工作日易刷视频时段
    weekendHours: ['14:00','21:30'],     // 周末易刷视频时段
    lastScheduledDate: null              // 'YYYY-MM-DD'，避免重复排期
  },
  diversityNudge: {
    enabled: true,
    hour: 21,                            // 几点提醒
    minScore: 3,                         // 当日 < 该值才提醒
    lastScheduledDate: null
  },
  quickActionLog: [],                    // [{date, type, label, minutes, completed}]
  // —— 习惯（一等公民） ——
  habits: [],                            // [{id, name, emoji, types[], cadence, target, duration, preferredDays[], preferredTime, active, createdAt}]
  habitsSeeded: false                    // 首次运行时填充默认 6 习惯
};

// 深度合并默认状态（向后兼容新字段）
function _mergeDefaults(s) {
  const merged = {...DEFAULT_STATE, ...s};
  for (const k of Object.keys(DEFAULT_STATE)) {
    if (merged[k] === undefined || merged[k] === null) merged[k] = DEFAULT_STATE[k];
  }
  return merged;
}

const Store = {
  _cache: null,
  load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.v === SCHEMA_VERSION) {
          this._cache = _mergeDefaults(parsed);
          return this._cache;
        }
      }
    } catch(e) { console.warn('Store parse failed', e); }
    // 无 v2 数据 → 尝试从 v1 迁移
    this._cache = this._migrateFromV1();
    this.save();
    return this._cache;
  },
  save() {
    if (!this._cache) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this._cache)); }
    catch(e) { console.error('Store save failed', e); }
  },
  get(k) { return this.load()[k]; },
  set(k, v) { const s = this.load(); s[k] = v; this.save(); },
  update(fn) { const s = this.load(); fn(s); this.save(); },
  // V1 → V2 迁移
  _migrateFromV1() {
    const s = {...DEFAULT_STATE};
    const safeJ = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
    // 个人信息
    const v1Profile = safeJ('s_profile', null);
    if (v1Profile) s.profile = {...s.profile, ...v1Profile};
    // 评分：key 由 name → id
    const v1Ratings = safeJ('s_ratings', {});
    Object.entries(v1Ratings).forEach(([name, r]) => {
      const act = window.ACT_BY_NAME?.[name];
      const id = act ? act.id : window.slugify?.(name) || name;
      s.userRatings[id] = r;
    });
    // 参加过
    const v1Visited = safeJ('s_visited', []);
    s.visited = v1Visited.map(v => {
      const act = window.ACT_BY_NAME?.[v.name];
      return {...v, actId: act ? act.id : window.slugify?.(v.name) || v.name};
    });
    // 历史
    const v1Hist = safeJ('s_hist', []);
    s.history = v1Hist.map(h => {
      const act = window.ACT_BY_NAME?.[h.name];
      return {...h, actId: act ? act.id : window.slugify?.(h.name) || h.name};
    });
    // 周计划
    const v1Plan = safeJ('s_plan', null);
    if (v1Plan && Array.isArray(v1Plan)) s.weeklyPlan = v1Plan;
    else s.weeklyPlan = JSON.parse(JSON.stringify(window.DEFAULT_PLANNER || []));
    // 孩子课表
    s.kidsSchedule = safeJ('s_kids', []);
    s.migratedFromV1 = !!(v1Ratings || v1Visited || v1Hist || v1Plan);
    return s;
  },
  reset() {
    this._cache = {...DEFAULT_STATE};
    this.save();
  },
  exportAll() {
    return {
      ...this.load(),
      exportDate: new Date().toISOString(),
      schema: SCHEMA_VERSION
    };
  }
};

// ==================== UTIL ====================
// 安全 HTML 转义
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
// 安全 attribute 转义
function escAttr(s) { return escapeHtml(s); }

// Toast
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._h);
  toast._h = setTimeout(()=>t.classList.remove('show'), 2200);
}

// 日期工具
function fmtDate(d, fmt='YYYY-MM-DD') {
  if (!(d instanceof Date)) d = new Date(d);
  const p = n => n<10?'0'+n:n;
  return fmt.replace('YYYY', d.getFullYear())
    .replace('MM', p(d.getMonth()+1))
    .replace('DD', p(d.getDate()))
    .replace('HH', p(d.getHours()))
    .replace('mm', p(d.getMinutes()));
}
function todayISO() { return fmtDate(new Date()); }

// 星期映射
const DAY_MAP_IDX = {1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',0:'日'};
function dayIdxToName(idx) { return DAY_MAP_IDX[idx]; }
function todayDayName() { return DAY_MAP_IDX[new Date().getDay()]; }

// 距离
function getDistMin(act) {
  if (!act) return 0;
  if (act.jlt) return 0;
  const d = act.info && act.info.dist;
  if (!d) return 0;
  if (typeof d === 'number') return [0,10,20,30,60][d] || 0;
  const m = String(d).match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}
function isNearby(act) { return getDistMin(act) <= 15; }
function isOutdoor(act) { return !!act.outdoor; }

// 随机 uid
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

// ==================== REMINDERS ====================
// 核心：打开应用时每 30s 检查一次即将到期的提醒
const Reminders = {
  _interval: null,
  permissionAsked: false,

  async requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    if (this.permissionAsked) return false;
    this.permissionAsked = true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  },

  start() {
    if (this._interval) return;
    this._interval = setInterval(() => this.tick(), 30000);
    // 页面可见时立即检查一次
    this.tick();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.tick();
    });
  },

  stop() {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
  },

  // 注册一个新提醒（对应 plan item）
  schedule({planKey, fireAt, title, body, leadMin=30}) {
    const list = Store.get('reminders') || [];
    // 去重（同 planKey 只保留最新）
    const filtered = list.filter(r => r.planKey !== planKey);
    filtered.push({
      id: uid(), planKey, fireAt,
      title: title || '活动提醒',
      body: body || '',
      leadMin, sent:false,
      createdAt: new Date().toISOString()
    });
    Store.set('reminders', filtered);
    // 真实活动加入后，让位附近的 sentinel
    if (!String(planKey || '').startsWith('sentinel:') && typeof Sentinel !== 'undefined') {
      Sentinel.pruneConflictsWith(new Date(fireAt).getTime());
    }
    return filtered[filtered.length-1];
  },

  cancel(planKey) {
    const list = Store.get('reminders') || [];
    Store.set('reminders', list.filter(r => r.planKey !== planKey));
  },

  isSet(planKey) {
    const list = Store.get('reminders') || [];
    return list.some(r => r.planKey === planKey && !r.sent);
  },

  getFor(planKey) {
    const list = Store.get('reminders') || [];
    return list.find(r => r.planKey === planKey);
  },

  tick() {
    const list = Store.get('reminders') || [];
    const now = Date.now();
    let dirty = false;
    list.forEach(r => {
      if (r.sent) return;
      const fire = new Date(r.fireAt).getTime();
      if (isNaN(fire)) return;
      // 提前 leadMin 触发
      const triggerAt = fire - (r.leadMin || 0) * 60000;
      if (now >= triggerAt) {
        this._fire(r);
        r.sent = true;
        dirty = true;
      }
    });
    if (dirty) Store.set('reminders', list);
    // 清理 1 天前的已发送提醒
    const cleaned = list.filter(r => {
      const age = now - new Date(r.fireAt).getTime();
      return !(r.sent && age > 86400000);
    });
    if (cleaned.length !== list.length) Store.set('reminders', cleaned);
  },

  _fire(r) {
    // Toast 总会显示
    toast(`🔔 ${r.title}${r.body?' — '+r.body:''}`);
    // 系统通知 — 优先用 SW（iOS/Android PWA 更可靠），降级到 new Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        try {
          navigator.serviceWorker.controller.postMessage({
            type: 'notify',
            title: r.title, body: r.body,
            tag: r.id, url: location.pathname
          });
        } catch(e) {
          try { new Notification(r.title, {body:r.body, icon:'icon-192.png', tag:r.id}); } catch(err) {}
        }
      } else {
        try { new Notification(r.title, {body:r.body, icon:'icon-192.png', tag:r.id}); } catch(err) {}
      }
    }
    // 震动（手机）
    if (navigator.vibrate) navigator.vibrate([200,100,200]);
  },

  // 清除过期（已过触发时间但未发的）
  cleanup() {
    const list = Store.get('reminders') || [];
    const now = Date.now();
    const fresh = list.filter(r => {
      if (r.sent) return now - new Date(r.fireAt).getTime() < 86400000;
      return new Date(r.fireAt).getTime() > now - 86400000;
    });
    if (fresh.length !== list.length) Store.set('reminders', fresh);
  }
};

// ==================== USER RATINGS / VISITED 辅助 ====================
function getUserRating(actId) {
  const r = Store.get('userRatings')[actId];
  return r || {stars:0, status:'normal', note:''};
}
function setUserStars(actId, stars) {
  Store.update(s => {
    if (!s.userRatings[actId]) s.userRatings[actId] = {stars:0, status:'normal', note:''};
    s.userRatings[actId].stars = stars;
  });
}
function setUserStatus(actId, status) {
  Store.update(s => {
    if (!s.userRatings[actId]) s.userRatings[actId] = {stars:0, status:'normal', note:''};
    s.userRatings[actId].status = status;
  });
}
function setUserNote(actId, note) {
  Store.update(s => {
    if (!s.userRatings[actId]) s.userRatings[actId] = {stars:0, status:'normal', note:''};
    s.userRatings[actId].note = note;
  });
}
function clearRating(actId) {
  Store.update(s => { delete s.userRatings[actId]; });
}
function isVisited(actId) {
  return Store.get('visited').some(v => v.actId === actId);
}
function markVisited(actId, name, emoji, cat) {
  Store.update(s => {
    if (s.visited.some(v => v.actId === actId)) return;
    s.visited.unshift({actId, name, emoji, cat, date: todayISO()});
    if (s.visited.length > 200) s.visited.length = 200;
  });
}
function removeVisited(idx) {
  Store.update(s => { s.visited.splice(idx, 1); });
}

// 成长日志
function logGrowth({type, refId, refName, minutes, note=''}) {
  Store.update(s => {
    s.growthLog.unshift({date: todayISO(), type, refId, refName, minutes: minutes||0, note});
    if (s.growthLog.length > 1000) s.growthLog.length = 1000;
  });
}

// 连续打卡天数
function growthStreak() {
  const log = Store.get('growthLog');
  if (!log.length) return 0;
  const dates = new Set(log.map(l => l.date));
  let streak = 0;
  const d = new Date();
  while (dates.has(fmtDate(d))) {
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

// 报告聚合（本周/本月/全部）
function growthReport(scope='week') {
  const log = Store.get('growthLog') || [];
  const now = new Date();
  let start;
  if (scope === 'week') {
    start = new Date(now);
    const dow = start.getDay(); // 0=Sun
    const daysFromMon = dow === 0 ? 6 : dow - 1;
    start.setDate(start.getDate() - daysFromMon);
    start.setHours(0,0,0,0);
  } else if (scope === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(0);
  }
  const items = log.filter(l => new Date(l.date) >= start);
  const byType = {};
  const byDay = {};
  let totalMin = 0;
  items.forEach(l => {
    byType[l.type] = (byType[l.type] || 0) + 1;
    totalMin += (l.minutes || 0);
    byDay[l.date] = (byDay[l.date] || 0) + 1;
  });
  return {
    scope, count: items.length, totalMin,
    totalHours: Math.round(totalMin / 60 * 10) / 10,
    days: Object.keys(byDay).length,
    byType, byDay
  };
}

// ==================== 反刷视频三件套 ====================

// —— 多元化维度（与「成长记录」的快速记录按钮对齐） ——
const DIVERSITY_DIMS = [
  {key:'reading',  emoji:'📖', label:'读书',   matchTypes:['reading','book']},
  {key:'podcast',  emoji:'🎙️', label:'听学',   matchTypes:['podcast','documentary','video','course','language','app','ted']},
  {key:'exercise', emoji:'🏃', label:'运动',   matchTypes:['exercise','sports','sport']},
  {key:'reflect',  emoji:'🧘', label:'内省',   matchTypes:['reflect','writing','meditate','journal']},
  {key:'cooking',  emoji:'🍳', label:'做饭',   matchTypes:['cooking']},
  {key:'connect',  emoji:'💞', label:'陪家人', matchTypes:['connect','family']}
];

// 计算今日多元化覆盖
function todayDiversityScore() {
  const log = Store.get('growthLog') || [];
  const today = todayISO();
  const todayTypes = new Set(log.filter(l => l.date === today).map(l => l.type));
  return DIVERSITY_DIMS.map(d => ({
    ...d,
    done: d.matchTypes.some(t => todayTypes.has(t))
  }));
}

// —— 快速行动建议库（"现在就来一个"） ——
const QUICK_ACTIONS = [
  // type, label, emoji, minutes, energy(low/mid/high), timeOk(数组或'all')
  {type:'reading',  label:'读 15 页书',         emoji:'📖', minutes:15, energy:'low',  timeOk:'all'},
  {type:'reading',  label:'读 5 分钟（开个头）', emoji:'📖', minutes:5,  energy:'low',  timeOk:'all'},
  {type:'reflect',  label:'写 10 分钟日记',     emoji:'📝', minutes:10, energy:'low',  timeOk:[6,7,8,21,22,23]},
  {type:'reflect',  label:'冥想 10 分钟',       emoji:'🧘', minutes:10, energy:'low',  timeOk:'all'},
  {type:'reflect',  label:'写 3 件感恩的事',    emoji:'🌅', minutes:5,  energy:'low',  timeOk:[20,21,22,23]},
  {type:'exercise', label:'JLT 湖边走 20 分钟', emoji:'🚶', minutes:20, energy:'mid',  timeOk:[6,7,8,9,17,18,19,20]},
  {type:'exercise', label:'家里拉伸 5 分钟',    emoji:'🤸', minutes:5,  energy:'low',  timeOk:'all'},
  {type:'exercise', label:'10 分钟核心训练',    emoji:'💪', minutes:10, energy:'mid',  timeOk:[6,7,8,9,10,17,18,19,20]},
  {type:'connect',  label:'给爸妈打个电话',     emoji:'📞', minutes:15, energy:'low',  timeOk:[10,11,12,13,14,15,16,17,18,19,20]},
  {type:'connect',  label:'和家人聊 10 分钟',   emoji:'💞', minutes:10, energy:'low',  timeOk:'all'},
  {type:'connect',  label:'给老朋友发消息',     emoji:'💬', minutes:5,  energy:'low',  timeOk:'all'},
  {type:'cooking',  label:'计划明天的一顿饭',   emoji:'🍳', minutes:10, energy:'low',  timeOk:'all'},
  {type:'cooking',  label:'整理冰箱 / 食材清单', emoji:'🧊', minutes:15, energy:'low',  timeOk:[9,10,11,17,18,19,20]},
  {type:'podcast',  label:'听一集 18 分钟播客', emoji:'🎙️', minutes:18, energy:'low',  timeOk:'all'},
  {type:'podcast',  label:'看一个 TED 演讲',    emoji:'💡', minutes:18, energy:'low',  timeOk:'all'},
  {type:'language', label:'Duolingo 5 分钟',    emoji:'🦉', minutes:5,  energy:'low',  timeOk:'all'},
  {type:'writing',  label:'随手写 200 字',      emoji:'✍️', minutes:15, energy:'mid',  timeOk:'all'},
];

const QuickAction = {
  // 综合所有数据源生成候选 — 这是"行动路线"的核心
  candidates() {
    const out = [];
    const now = new Date();
    const h = now.getHours();

    // 0. 落后的习惯（最高权重 — 比心愿单还高）
    Habits.behindSchedule().forEach(hb => {
      const def = Habits.deficit(hb);
      const prog = Habits.progressFor(hb);
      out.push({
        type: (hb.types && hb.types[0]) || 'plan',
        label: hb.name + (def > 1 ? `（还差 ${def} 次）` : ''),
        emoji: hb.emoji,
        minutes: hb.duration || 30,
        source: 'habit',
        sourceData: hb,
        trend: hb.cadence === 'daily' ? '今日未做' : `本周 ${prog.current}/${prog.target}`,
        weight: 5
      });
    });

    // 1. 静态种子库（按当前时段过滤）
    QUICK_ACTIONS.forEach(a => {
      if (a.timeOk !== 'all' && !a.timeOk.includes(h)) return;
      out.push({...a, source:'static', weight:1});
    });

    // 2. 心愿单 — 用户自己想做的，最高权重 + 等待时长趋势
    const wish = Store.get('wishlist') || [];
    wish.forEach(w => {
      const days = w.createdAt ? Math.floor((Date.now() - new Date(w.createdAt))/86400000) : 0;
      let trend = null;
      if (days >= 30) trend = `心愿等了 ${days} 天`;
      else if (days >= 14) trend = `等了 ${days} 天`;
      out.push({
        type: w.cat || 'explore',
        label: w.title,
        emoji: w.emoji || '💭',
        minutes: 30,
        source: 'wish',
        sourceId: w.id,
        sourceData: w,
        trend,
        weight: 4
      });
    });

    // 3. 今日计划（每周固定 + 月计划）
    const dayName = todayDayName();
    const fixed = (Store.get('weeklyPlan') || []).filter(p => p.day === dayName);
    fixed.forEach(p => {
      out.push({
        type: 'plan',
        label: p.act,
        emoji: p.emoji || '📅',
        minutes: 30,
        source: 'plan',
        sourceData: p,
        trend: `今日 ${p.time}`,
        weight: 3
      });
    });
    const mp = Store.get('monthlyPlan');
    if (mp && mp.weeks && typeof DAYS !== 'undefined') {
      const todayMD = `${now.getMonth()+1}/${now.getDate()}`;
      mp.weeks.forEach((w) => {
        DAYS.forEach(d => {
          if (w.dates && w.dates[d] === todayMD && w.plan && w.plan[d]) {
            w.plan[d].forEach(it => {
              const name = it.act?.name || it.name;
              const emoji = it.act?.emoji || it.emoji || '📅';
              if (!name) return;
              out.push({
                type: 'plan',
                label: name,
                emoji,
                minutes: 30,
                source: 'plan',
                sourceData: it,
                trend: `今日 ${it.time||''}`.trim(),
                weight: 3
              });
            });
          }
        });
      });
    }

    // 4. 烹饪心愿菜谱
    const cookWish = Store.get('cookingWishlist') || [];
    if (typeof RECIPES !== 'undefined') {
      cookWish.slice(0, 6).forEach(rid => {
        const r = RECIPES.find(x => x.id === rid);
        if (!r) return;
        out.push({
          type: 'cooking',
          label: '做：' + r.name,
          emoji: r.emoji || '🍳',
          minutes: r.minutes || 45,
          source: 'recipe',
          sourceData: r,
          trend: '心愿菜谱',
          weight: 2
        });
      });
    }

    // 5. 学习池
    if (typeof LEARNING_POOL !== 'undefined') {
      LEARNING_POOL.forEach(l => {
        out.push({
          type: l.type,
          label: l.name,
          emoji: l.emoji,
          minutes: l.minutes || 15,
          source: 'learning',
          sourceData: l,
          weight: 1
        });
      });
    }

    // 6. 限时优惠（≤7 天过期的，紧迫感）
    if (typeof FEATURED_DEALS !== 'undefined') {
      FEATURED_DEALS.forEach(d => {
        if (!d.expiresAt) return;
        const left = (new Date(d.expiresAt) - Date.now()) / 86400000;
        if (left < 0 || left > 7) return;
        out.push({
          type: 'explore',
          label: d.name,
          emoji: d.emoji || '🏷️',
          minutes: 60,
          source: 'deal',
          sourceData: d,
          trend: left < 2 ? '今晚最后机会' : `还剩 ${Math.ceil(left)} 天`,
          weight: 2
        });
      });
    }

    // 7. 技能下一周
    const skProg = Store.get('skillProgress') || {};
    if (typeof SKILLS !== 'undefined') {
      Object.entries(skProg).forEach(([sid, p]) => {
        const sk = SKILLS.find(s => s.id === sid);
        if (!sk || !sk.plan) return;
        const next = sk.plan.findIndex((_, i) => !(p.weeksDone || []).includes(i));
        if (next < 0) return;
        out.push({
          type: 'skill',
          label: `${sk.name} 第${next+1}周`,
          emoji: sk.emoji || '🎯',
          minutes: 30,
          source: 'skill',
          sourceData: {sk, weekIdx: next},
          trend: '技能进度',
          weight: 2
        });
      });
    }

    // 8. VENUES 每日轮换 2 个
    const dayOfYear = Math.floor((Date.now() - new Date(now.getFullYear(),0,0)) / 86400000);
    if (typeof VENUES !== 'undefined') {
      const pool = [];
      Object.keys(VENUES).forEach(k => (VENUES[k].items || []).forEach(v => pool.push(v)));
      if (pool.length) {
        [3, 7].forEach(off => {
          const v = pool[(dayOfYear * off) % pool.length];
          if (!v) return;
          out.push({
            type: 'explore',
            label: '去：' + v.name,
            emoji: v.emoji || '📍',
            minutes: 90,
            source: 'venue',
            sourceData: v,
            weight: 1
          });
        });
      }
    }

    return out;
  },

  // 优先推荐：时长 + 类型多元化 + 加权随机
  pick(durationFilter) {
    const all = this.candidates();
    const log = Store.get('growthLog') || [];
    const today = todayISO();
    const todayTypes = new Set(log.filter(l => l.date === today).map(l => l.type));

    let pool = all;
    if (durationFilter === 'short') pool = pool.filter(a => a.minutes <= 10);
    else if (durationFilter === 'medium') pool = pool.filter(a => a.minutes > 10 && a.minutes <= 30);
    else if (durationFilter === 'long') pool = pool.filter(a => a.minutes > 30);
    if (!pool.length) pool = all;

    // 多元化：优先未覆盖的维度
    const fresh = pool.filter(a => !todayTypes.has(a.type));
    if (fresh.length >= 3) pool = fresh;

    // 加权随机
    const total = pool.reduce((s,a) => s + (a.weight || 1), 0);
    if (total === 0) return pool[0];
    let r = Math.random() * total;
    for (const a of pool) {
      r -= (a.weight || 1);
      if (r <= 0) return a;
    }
    return pool[pool.length - 1];
  },

  // 链式：完成一个后挑下一个，专门补未覆盖的多元化维度
  pickNextForMissingDim() {
    const dims = todayDiversityScore();
    const missing = dims.filter(d => !d.done);
    if (!missing.length) return null;
    const wantedTypes = new Set(missing.flatMap(d => d.matchTypes));
    const all = this.candidates().filter(a => wantedTypes.has(a.type));
    if (!all.length) return null;
    const total = all.reduce((s,a) => s + (a.weight || 1), 0);
    let r = Math.random() * total;
    for (const a of all) {
      r -= (a.weight || 1);
      if (r <= 0) return a;
    }
    return all[0];
  },

  log(action, completed) {
    Store.update(s => {
      if (!s.quickActionLog) s.quickActionLog = [];
      s.quickActionLog.unshift({
        date: todayISO(),
        time: new Date().toISOString(),
        type: action.type,
        label: action.label,
        minutes: action.minutes,
        completed: !!completed
      });
      if (s.quickActionLog.length > 500) s.quickActionLog.length = 500;
    });
    if (completed) {
      logGrowth({type: action.type, refId: 'qa-'+action.type, refName: action.label, minutes: action.minutes, note:'快速行动'});
    }
  }
};

// ==================== 习惯（一等公民） ====================
// 6 个默认习惯 — 与多元化维度完全对齐，首次开 App 自动种入
const DEFAULT_HABITS = [
  {name:'读书',     emoji:'📖', types:['reading','book'],                                              cadence:'daily',  target:1, duration:15, preferredTime:'21:00'},
  {name:'听学/看片', emoji:'🎙️', types:['podcast','documentary','video','course','language','app','ted'], cadence:'weekly', target:3, duration:30, preferredTime:'07:30'},
  {name:'运动',     emoji:'🏃', types:['exercise','sports','sport'],                                   cadence:'weekly', target:3, duration:30, preferredDays:['一','三','五'], preferredTime:'19:30'},
  {name:'内省',     emoji:'🧘', types:['reflect','writing','meditate','journal'],                      cadence:'daily',  target:1, duration:10, preferredTime:'22:00'},
  {name:'做饭',     emoji:'🍳', types:['cooking'],                                                     cadence:'weekly', target:4, duration:45, preferredTime:'18:30'},
  {name:'陪家人',   emoji:'💞', types:['connect','family'],                                            cadence:'daily',  target:1, duration:30, preferredTime:'19:30'}
];

// 周一为本周开始
function _startOfWeek(d) {
  d = d || new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const s = new Date(d);
  s.setDate(d.getDate() - diff);
  s.setHours(0,0,0,0);
  return s;
}

const Habits = {
  all() { return Store.get('habits') || []; },

  ensureDefaults() {
    const seeded = Store.get('habitsSeeded');
    if (seeded) return;
    const cur = this.all();
    if (cur.length > 0) {
      Store.update(s => { s.habitsSeeded = true; });
      return;
    }
    Store.update(s => {
      s.habits = DEFAULT_HABITS.map(h => ({
        id: 'h_' + uid(),
        active: true,
        createdAt: new Date().toISOString(),
        preferredDays: [],
        ...h
      }));
      s.habitsSeeded = true;
    });
  },

  add(habit) {
    Store.update(s => {
      if (!s.habits) s.habits = [];
      s.habits.push({
        id: 'h_' + uid(),
        active: true,
        createdAt: new Date().toISOString(),
        preferredDays: [],
        ...habit
      });
    });
  },

  update(id, patch) {
    Store.update(s => {
      const h = (s.habits || []).find(x => x.id === id);
      if (h) Object.assign(h, patch);
    });
  },

  remove(id) {
    Store.update(s => { s.habits = (s.habits || []).filter(x => x.id !== id); });
  },

  // 当前周期完成进度
  progressFor(habit) {
    const log = Store.get('growthLog') || [];
    const types = new Set(habit.types || []);
    if (habit.cadence === 'daily') {
      const today = todayISO();
      const count = log.filter(l => l.date === today && types.has(l.type)).length;
      return {current: count, target: habit.target || 1, period: '今日', done: count >= (habit.target || 1)};
    } else {
      const start = _startOfWeek();
      const count = log.filter(l => new Date(l.date) >= start && types.has(l.type)).length;
      return {current: count, target: habit.target || 1, period: '本周', done: count >= (habit.target || 1)};
    }
  },

  // 缺多少次
  deficit(habit) {
    const p = this.progressFor(habit);
    return Math.max(0, p.target - p.current);
  },

  // 落后的习惯（用于 QuickAction 优先推荐）
  behindSchedule() {
    return this.all().filter(h => h.active && this.deficit(h) > 0);
  },

  // 连续达成天数（仅 daily 习惯）
  streakFor(habit) {
    if (habit.cadence !== 'daily') return 0;
    const log = Store.get('growthLog') || [];
    const types = new Set(habit.types || []);
    const dates = new Set(log.filter(l => types.has(l.type)).map(l => l.date));
    let streak = 0;
    const d = new Date();
    while (dates.has(fmtDate(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }
};

// —— 易沉迷时段哨兵：每天最多排一次 ——
// 与真实活动冲突时（±30 分钟内已有非 sentinel 提醒）让位，不提示
const Sentinel = {
  CONFLICT_WINDOW_MS: 30 * 60 * 1000,

  _hasRealReminderNear(targetMs) {
    const list = Store.get('reminders') || [];
    return list.some(r => {
      if (!r || r.sent) return false;
      if (String(r.planKey || '').startsWith('sentinel:')) return false;
      const t = new Date(r.fireAt).getTime();
      return Math.abs(t - targetMs) <= this.CONFLICT_WINDOW_MS;
    });
  },

  scheduleToday() {
    const cfg = Store.get('sentinel');
    if (!cfg || !cfg.enabled) return;
    const today = todayISO();
    if (cfg.lastScheduledDate === today) return;
    // Dubai 周末是 Sat/Sun（5/6/0 中以本地为准；这里用 Sat=6, Sun=0）
    const dow = new Date().getDay();
    const isWeekend = dow === 0 || dow === 6;
    const hours = isWeekend ? (cfg.weekendHours || []) : (cfg.weekdayHours || []);
    const now = Date.now();
    hours.forEach(hm => {
      const m = String(hm).match(/^(\d{1,2}):(\d{2})$/);
      if (!m) return;
      const fireAt = new Date();
      fireAt.setHours(parseInt(m[1]), parseInt(m[2]), 0, 0);
      if (fireAt.getTime() <= now + 60000) return; // 已过或马上到的跳过
      const planKey = `sentinel:${today}:${hm}`;
      // 真实活动已在 ±30min 内：让位，并清掉之前可能排过的同一 sentinel
      if (this._hasRealReminderNear(fireAt.getTime())) {
        Reminders.cancel(planKey);
        return;
      }
      Reminders.schedule({
        planKey,
        fireAt: fireAt.toISOString(),
        title: '📵 易刷视频的点',
        body: '换一个 15 分钟的事？打开 App 看看推荐',
        leadMin: 0
      });
    });
    Store.update(s => { s.sentinel.lastScheduledDate = today; });
  },

  // 真实活动新增后，主动清掉 ±30min 内的 sentinel
  pruneConflictsWith(realFireAtMs) {
    const list = Store.get('reminders') || [];
    const kept = list.filter(r => {
      if (!String(r.planKey || '').startsWith('sentinel:')) return true;
      const t = new Date(r.fireAt).getTime();
      return Math.abs(t - realFireAtMs) > this.CONFLICT_WINDOW_MS;
    });
    if (kept.length !== list.length) Store.set('reminders', kept);
  }
};

// —— 多元化晚间提醒 ——
const DiversityNudge = {
  scheduleToday() {
    const cfg = Store.get('diversityNudge');
    if (!cfg || !cfg.enabled) return;
    const today = todayISO();
    if (cfg.lastScheduledDate === today) return;
    const fireAt = new Date();
    fireAt.setHours(cfg.hour || 21, 0, 0, 0);
    if (fireAt.getTime() <= Date.now() + 60000) return;
    Reminders.schedule({
      planKey: `diversity-nudge:${today}`,
      fireAt: fireAt.toISOString(),
      title: '🌈 今日多元化',
      body: '看看今天还差几个维度 — 打开 App 补一个',
      leadMin: 0
    });
    Store.update(s => { s.diversityNudge.lastScheduledDate = today; });
  }
};

// 清理过期的用户折扣
function cleanupExpiredDeals() {
  const today = todayISO();
  Store.update(s => {
    const before = s.userDeals.length;
    s.userDeals = s.userDeals.filter(d => {
      if (!d.expiresAt) return true;
      return d.expiresAt >= today;
    });
    if (before !== s.userDeals.length) console.log(`清理过期折扣 ${before - s.userDeals.length} 条`);
  });
}

// 数据导入
function importDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') throw new Error('格式不对');
        if (data.v !== SCHEMA_VERSION) {
          if (!confirm('备份的 schema 版本与当前不匹配，强行导入可能丢数据。继续？')) return reject(new Error('取消'));
        }
        // 只合并已知字段
        Store.update(s => {
          Object.keys(DEFAULT_STATE).forEach(k => {
            if (data[k] !== undefined) s[k] = data[k];
          });
        });
        resolve();
      } catch(e) { reject(e); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// 挂到全局
Object.assign(window, {
  Store, Reminders, Sentinel, DiversityNudge, QuickAction, Habits,
  DIVERSITY_DIMS, todayDiversityScore, DEFAULT_HABITS,
  escapeHtml, escAttr, toast, fmtDate, todayISO,
  todayDayName, dayIdxToName,
  getDistMin, isNearby, isOutdoor, uid,
  getUserRating, setUserStars, setUserStatus, setUserNote, clearRating,
  isVisited, markVisited, removeVisited,
  logGrowth, growthStreak, growthReport,
  cleanupExpiredDeals, importDataFromFile
});
