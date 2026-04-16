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
  migratedFromV1: false
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
  Store, Reminders,
  escapeHtml, escAttr, toast, fmtDate, todayISO,
  todayDayName, dayIdxToName,
  getDistMin, isNearby, isOutdoor, uid,
  getUserRating, setUserStars, setUserStatus, setUserNote, clearRating,
  isVisited, markVisited, removeVisited,
  logGrowth, growthStreak, growthReport,
  cleanupExpiredDeals, importDataFromFile
});
