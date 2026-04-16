// ============================================================
// 活动/折扣/烹饪/学习/技能 统一数据层
// 每条都有稳定 id；转盘/发现/Dashboard 共用
// ============================================================

// ==================== 三大人生支柱（顶层定位） ====================
// 这个 App 的本质：帮你 规划生活 · 寻找灵感 · 走向意义
const PILLARS = {
  plan:    {id:'plan',    label:'规划', emoji:'📅', color:'var(--accent3)', desc:'让生活有方向，不再被日子推着走',     cta:'打开月计划', page:'pagePlan'},
  inspire: {id:'inspire', label:'灵感', emoji:'✨', color:'var(--accent)',  desc:'不知道做什么时，让运气和清单帮你',   cta:'转一下',     page:'pageSpinner'},
  meaning: {id:'meaning', label:'意义', emoji:'🌱', color:'var(--accent2)', desc:'把时间花在让自己变好的事上',         cta:'看成长',     page:'pageMe'}
};

// ==================== 四大人生维度（每日具体抓手） ====================
const DIMENSIONS = {
  grow:    {id:'grow',    label:'成长', emoji:'🌱', color:'var(--dim-grow)',    desc:'读书 · 学习 · 思考'},
  passion: {id:'passion', label:'热爱', emoji:'🔥', color:'var(--dim-passion)', desc:'烹饪 · 运动 · 创作'},
  connect: {id:'connect', label:'关系', emoji:'💞', color:'var(--dim-connect)', desc:'家庭 · 朋友 · 长辈'},
  explore: {id:'explore', label:'探索', emoji:'✨', color:'var(--dim-explore)', desc:'户外 · 美食 · 文化'}
};

// ==================== 分类体系（单一事实源） ====================
const CATEGORIES = [
  {id:'sports',        label:'运动', emoji:'⚽', dim:'passion'},
  {id:'food',          label:'美食', emoji:'🍜', dim:'explore'},
  {id:'entertainment', label:'娱乐', emoji:'🎢', dim:'explore'},
  {id:'learning',      label:'学习', emoji:'📚', dim:'grow'},
  {id:'nature',        label:'自然', emoji:'🌿', dim:'explore'},
  {id:'culture',       label:'文化', emoji:'🎭', dim:'grow'},
  {id:'leisure',       label:'休闲', emoji:'🌴', dim:'connect'},
  {id:'nightlife',     label:'夜间', emoji:'🌙', dim:'connect'},
  {id:'daytrip',       label:'短途', emoji:'🚗', dim:'explore'},
  {id:'cooking',       label:'烹饪', emoji:'🍳', dim:'passion'},
  {id:'reading',       label:'阅读', emoji:'📖', dim:'grow'},
  {id:'skill',         label:'技能', emoji:'🎯', dim:'grow'},
  {id:'reflect',       label:'内省', emoji:'🧘', dim:'grow'},
  {id:'family_ritual', label:'家庭仪式', emoji:'🏡', dim:'connect'},
];
const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c=>[c.id,c]));

// ==================== 工具 ====================
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[\s\u4e00-\u9fa5]+/g,'-')  // 中文/空格转 -
    .replace(/[^\w\-]/g,'')
    .replace(/-+/g,'-').replace(/^-|-$/g,'')
    .slice(0,40) || ('a'+Math.random().toString(36).slice(2,8));
}

// ==================== 活动库（统一） ====================
// 每条活动：id/emoji/name/audiences/dim/cat/outdoor/info
// audiences 数组：['family','couple','friend'] 任意组合
const ACTIVITIES_RAW = [
  // ========== 家庭活动（迁移自 DB_FAMILY） ==========
  {name:'Al Qudra骑行', emoji:'🚴', audiences:['family','friend'], cat:'sports', outdoor:true, info:{loc:'Al Qudra Cycle Track',addr:'Dubai - Al Ain Road, Exit D63',dist:'35min',cost:'免费/租车100 AED',age:'7+',time:'早7-9点',hours:'24小时开放',tip:'带足水，湖边可以看火烈鸟',mapQ:'Al+Qudra+Cycle+Track+Dubai'}},
  {name:"Clip'n Climb攀岩", emoji:'🧗', audiences:['family','friend'], cat:'sports', outdoor:false, info:{loc:"Clip'n Climb Dubai",addr:'Gravity Zone, Al Quoz Industrial 3',dist:'15min',cost:'80-100 AED/人',age:'4+',time:'任何时间',hours:'周一-周四 12-10pm, 周五-周日 10am-10pm',phone:'+971 4 338 4443',tip:'穿运动鞋，建议提前网上订',mapQ:'Clip+n+Climb+Dubai',bookUrl:'https://www.clipnclimbdubai.com'}},
  {name:'Kite Beach家庭日', emoji:'🏖️', audiences:['family','couple','friend'], cat:'leisure', outdoor:true, info:{loc:'Kite Beach',addr:'Umm Suqeim, Jumeirah',dist:'20min',cost:'免费+餐饮100-200',age:'所有年龄',time:'早8或下午4后',hours:'全天',tip:'有游乐设施、排球场、餐车',mapQ:'Kite+Beach+Dubai'}},
  {name:'Museum of the Future', emoji:'🏛️', audiences:['family','couple'], cat:'culture', outdoor:false, info:{loc:'Museum of the Future',addr:'Sheikh Zayed Rd, Trade Centre 2',dist:'15min',cost:'成人149/儿童免费',age:'7+',time:'任何时间',hours:'每天 10am-7:30pm',phone:'+971 800 2071',tip:'提前买票，预留2小时',mapQ:'Museum+of+the+Future+Dubai',bookUrl:'https://museumofthefuture.ae'}},
  {name:'JBR皮划艇/SUP', emoji:'🛶', audiences:['family','couple','friend'], cat:'sports', outdoor:true, info:{loc:'JBR Beach',addr:'The Walk, JBR',dist:'10min',cost:'100-150 AED/人/时',age:'7+需家长',time:'早8-10点',hours:'8am-6pm',phone:'+971 50 551 0702',tip:'穿能湿的衣服，带防晒',mapQ:'kayak+SUP+JBR+Dubai'}},
  {name:'Mushrif Park野餐', emoji:'🌳', audiences:['family'], cat:'leisure', outdoor:true, info:{loc:'Mushrif National Park',addr:'Al Khawaneej',dist:'30min',cost:'入园5 AED',age:'所有年龄',time:'早上或傍晚',hours:'8am-10pm',phone:'+971 4 288 3624',tip:'带野餐垫和球，有烧烤区',mapQ:'Mushrif+Park+Dubai'}},
  {name:'全家网球', emoji:'🎾', audiences:['family','couple','friend'], cat:'sports', outdoor:true, info:{loc:'SPORTSMANIA JLT',addr:'Cluster I, JLT',dist:'5min',cost:'50-100 AED/时',age:'所有年龄',time:'早上或傍晚',hours:'7am-11pm',phone:'+971 4 362 4888',tip:'可以教孩子基础挥拍',mapQ:'SPORTSMANIA+JLT+Dubai',bookUrl:'http://sportsmania.ae'}},
  {name:'VOX亲子电影', emoji:'🎬', audiences:['family'], cat:'entertainment', outdoor:false, info:{loc:'VOX Cinemas',addr:'Ibn Battuta Mall',dist:'5min',cost:'50-70 AED/人',age:'查看分级',time:'任何时间',hours:'10am-12am',phone:'+971 600 599 905',tip:'离JLT最近的VOX',mapQ:'VOX+Cinema+Ibn+Battuta',bookUrl:'https://uae.voxcinemas.com'}},
  {name:'亲子陶艺/手工', emoji:'🎨', audiences:['family'], cat:'learning', outdoor:false, info:{loc:'Ceramics By You',addr:'The Village, Jumeirah 1',dist:'15min',cost:'100-150 AED/人',age:'5+',time:'任何时间',hours:'10am-10pm',phone:'+971 4 344 7791',tip:'作品可带回家做纪念',mapQ:'Ceramics+By+You+Dubai'}},
  {name:'Dubai Aquarium', emoji:'🐠', audiences:['family'], cat:'entertainment', outdoor:false, info:{loc:'Dubai Mall',addr:'Downtown Dubai',dist:'20min',cost:'成人155/儿童120',age:'所有年龄',time:'工作日人少',hours:'10am-12am',phone:'+971 4 448 5200',tip:'可以加潜水体验',mapQ:'Dubai+Aquarium+Mall',bookUrl:'https://www.thedubaiaquarium.com'}},
  {name:'Wild Wadi水上乐园', emoji:'🏊', audiences:['family','friend'], cat:'entertainment', outdoor:true, info:{loc:'Wild Wadi Waterpark',addr:'Jumeirah Beach Rd',dist:'20min',cost:'250-300 AED/人',age:'有儿童区',time:'开园就去',hours:'10am-6pm',phone:'+971 4 348 4444',tip:'自带毛巾，园内餐饮较贵',mapQ:'Wild+Wadi+Waterpark',bookUrl:'https://www.wildwadi.com'}},
  {name:'沙漠露营半日', emoji:'⛺', audiences:['family','couple','friend'], cat:'nature', outdoor:true, info:{loc:'Big Red/Fossil Rock',addr:'Hatta-Sharjah Rd',dist:'45-60min',cost:'自驾免费/团200',age:'所有年龄',time:'下午4点出发',hours:'全天',tip:'带足水和零食，看日落',mapQ:'Big+Red+Desert+Dubai'}},
  {name:'Ain Dubai摩天轮', emoji:'🎡', audiences:['family','couple','friend'], cat:'entertainment', outdoor:true, info:{loc:'Ain Dubai',addr:'Bluewaters Island',dist:'10min',cost:'约130 AED/人',age:'所有年龄',time:'傍晚最佳',hours:'12pm-10pm',phone:'+971 800 362 4246',tip:'夜景震撼',mapQ:'Ain+Dubai'}},
  {name:'Dubai Autodrome卡丁车', emoji:'🏎️', audiences:['family','friend'], cat:'sports', outdoor:true, info:{loc:'Dubai Autodrome',addr:'Motor City',dist:'25min',cost:'约120 AED/人',age:'9+可独立驾驶',time:'任何时间',hours:'8am-11pm',phone:'+971 4 367 8700',tip:'刺激又安全',mapQ:'Dubai+Autodrome',bookUrl:'https://www.dubaiautodrome.ae'}},
  {name:'Ras Al Khor火烈鸟', emoji:'🦩', audiences:['family','couple'], cat:'nature', outdoor:true, info:{loc:'Ras Al Khor Wildlife Sanctuary',addr:'Ras Al Khor Rd',dist:'20min',cost:'免费',age:'所有年龄',time:'早上最佳',hours:'周六-周四 7:30am-4pm',phone:'+971 4 606 6822',tip:'带望远镜',mapQ:'Ras+Al+Khor+flamingo'}},
  {name:'iFLY室内跳伞', emoji:'🪂', audiences:['family','friend'], cat:'sports', outdoor:false, info:{loc:'iFLY Dubai',addr:'City Centre Mirdif',dist:'20min',cost:'约200 AED/人',age:'3+',time:'任何时间',hours:'10am-10pm',phone:'+971 4 231 6292',tip:'模拟自由落体',mapQ:'iFLY+Dubai',bookUrl:'https://www.iflyworld.ae'}},
  {name:'Miracle Garden花园', emoji:'🌺', audiences:['family','couple'], cat:'nature', outdoor:true, info:{loc:'Dubai Miracle Garden',addr:'Al Barsha South 3',dist:'20min',cost:'约55 AED/人',age:'所有年龄',time:'下午4点后',hours:'9am-9pm',phone:'+971 4 422 8902',tip:'11月-5月开放',mapQ:'Dubai+Miracle+Garden'}},
  {name:'Surf House冲浪', emoji:'🏄', audiences:['family','friend'], cat:'sports', outdoor:false, info:{loc:'Surf House Dubai',addr:'JBR, The Walk',dist:'10min',cost:'约150 AED/人',age:'7+',time:'任何时间',hours:'10am-10pm',phone:'+971 4 578 6576',tip:'初学者友好',mapQ:'Surf+House+Dubai'}},
  {name:'Hatta山区徒步', emoji:'🏔️', audiences:['family','couple','friend'], cat:'nature', outdoor:true, info:{loc:'Hatta',dist:'90min',cost:'免费-100 AED',age:'7+',time:'早上出发',hours:'全天',phone:'+971 800 637 227',tip:'皮划艇+徒步+蜜蜂花园',mapQ:'Hatta+hiking+Dubai',bookUrl:'https://visithatta.com'}},
  {name:'骆驼骑行体验', emoji:'🐪', audiences:['family','couple','friend'], cat:'nature', outdoor:true, info:{loc:'Al Marmoom Heritage Village',addr:'Al Marmoom',dist:'40min',cost:'约150 AED/人',age:'5+',time:'日落前1小时',hours:'需预约',phone:'+971 4 832 6826',tip:'孩子超兴奋',mapQ:'camel+riding+Dubai'}},
  {name:'Dubai Safari Park', emoji:'🦎', audiences:['family'], cat:'nature', outdoor:true, info:{loc:'Dubai Safari Park',addr:"Al Warqa'a 5",dist:'25min',cost:'约50 AED/人',age:'所有年龄',time:'早上',hours:'9am-5pm (周二关)',phone:'+971 800 900',tip:'2500+动物',mapQ:'Dubai+Safari+Park',bookUrl:'https://www.dubaisafari.ae'}},
  {name:'MBR图书馆', emoji:'📚', audiences:['family','couple'], cat:'learning', outdoor:false, info:{loc:'Mohammed Bin Rashid Library',addr:'Al Jaddaf',dist:'20min',cost:'免费',age:'所有年龄',time:'任何时间',hours:'周六-周四 8am-9pm',phone:'+971 4 282 0202',tip:'儿童区棒极了',mapQ:'Mohammed+Bin+Rashid+Library',bookUrl:'https://www.mbrl.ae'}},
  {name:'IMG冒险世界', emoji:'🎢', audiences:['family','friend'], cat:'entertainment', outdoor:false, info:{loc:'IMG Worlds of Adventure',addr:'City of Arabia',dist:'25min',cost:'约300 AED/人',age:'5+',time:'开园就去',hours:'12pm-10pm',phone:'+971 4 403 8888',tip:'全球最大室内主题公园',mapQ:'IMG+Worlds+Adventure',bookUrl:'https://www.imgworlds.com'}},
  {name:'OliOli儿童博物馆', emoji:'🔬', audiences:['family'], cat:'learning', outdoor:false, info:{loc:'OliOli',addr:'Al Quoz 1',dist:'15min',cost:'约120 AED',age:'2-11',time:'任何时间',hours:'9am-7pm',phone:'+971 4 702 7300',tip:'八个主题互动画廊',mapQ:'OliOli+museum+Dubai',bookUrl:'https://olioli.ae'}},
  {name:'KidZania职业体验', emoji:'🎭', audiences:['family'], cat:'learning', outdoor:false, info:{loc:'KidZania',addr:'The Dubai Mall',dist:'20min',cost:'约150 AED',age:'4-14',time:'工作日人少',hours:'10am-10pm',phone:'+971 4 448 5222',tip:'扮演消防员/医生/飞行员',mapQ:'KidZania+Dubai+Mall',bookUrl:'https://dubai.kidzania.com'}},
  {name:'蝴蝶园', emoji:'🦋', audiences:['family','couple'], cat:'nature', outdoor:false, info:{loc:'Dubai Butterfly Garden',addr:'Al Barsha South 3',dist:'20min',cost:'约55 AED',age:'所有年龄',time:'下午',hours:'9am-6pm',phone:'+971 4 422 8902',tip:'1.5万只蝴蝶',mapQ:'Dubai+Butterfly+Garden'}},
  {name:'Dubai Ice Rink', emoji:'⛸️', audiences:['family','couple','friend'], cat:'sports', outdoor:false, info:{loc:'Dubai Ice Rink',addr:'The Dubai Mall',dist:'20min',cost:'约80 AED',age:'所有年龄',time:'任何时间',hours:'10am-12am',phone:'+971 800 382 246 255',tip:'奥运级冰场',mapQ:'Dubai+Ice+Rink+Mall'}},
  {name:'Motiongate乐园', emoji:'🎠', audiences:['family','friend'], cat:'entertainment', outdoor:true, info:{loc:'Motiongate Dubai',addr:'Dubai Parks & Resorts',dist:'20min',cost:'约250 AED/人',age:'5+',time:'开园就去',hours:'11am-8pm',phone:'+971 4 820 0000',tip:'蓝精灵/怪物史莱克',mapQ:'Motiongate+Dubai',bookUrl:'https://www.motiongatedubai.com'}},
  {name:'La Mer海滨区', emoji:'🌊', audiences:['family','couple','friend'], cat:'leisure', outdoor:true, info:{loc:'La Mer',addr:'Jumeirah 1',dist:'15min',cost:'免费入场',age:'所有年龄',time:'傍晚',hours:'10am-12am',tip:'涂鸦墙+餐厅',mapQ:'La+Mer+Dubai'}},
  {name:'Zabeel Park', emoji:'🌴', audiences:['family'], cat:'leisure', outdoor:true, info:{loc:'Zabeel Park',addr:'Zabeel',dist:'15min',cost:'5 AED入场',age:'所有年龄',time:'傍晚',hours:'8am-10pm',phone:'+971 4 398 6888',tip:'小火车、恐龙乐园',mapQ:'Zabeel+Park+Dubai'}},
  {name:'亲子烘焙课', emoji:'🧁', audiences:['family'], cat:'cooking', outdoor:false, info:{loc:'Sugar Moo / SCAFA',addr:'多个地点',dist:'15-20min',cost:'150-250 AED/人',age:'5+',time:'周末',hours:'需预约',tip:'和孩子一起学做蛋糕饼干',mapQ:'kids+baking+class+Dubai'}},
  {name:'保龄球', emoji:'🎳', audiences:['family','friend'], cat:'entertainment', outdoor:false, info:{loc:'Dubai Bowling Centre',addr:'Al Mamzar',dist:'15min',cost:'40-60 AED/局',age:'5+',time:'任何时间',hours:'10am-2am',phone:'+971 4 339 1010',tip:'全家娱乐',mapQ:'bowling+Dubai'}},
  {name:'羽毛球', emoji:'🏸', audiences:['family','friend'], cat:'sports', outdoor:false, info:{loc:'Al Nasr Leisureland',addr:'Oud Metha',dist:'20min',cost:'50-80 AED/时',age:'7+',time:'傍晚',hours:'7am-11pm',phone:'+971 4 337 1234',tip:'华人群很活跃',mapQ:'badminton+court+Dubai'}},
  {name:'Global Village美食', emoji:'🥘', audiences:['family','couple','friend'], cat:'food', outdoor:true, info:{loc:'Global Village',addr:'Sheikh Mohammed Bin Zayed Rd',dist:'25min',cost:'25 AED入场+餐饮',age:'所有年龄',time:'傍晚',hours:'4pm-12am (11月-4月)',phone:'+971 4 362 4114',tip:'30+国家美食',mapQ:'Global+Village+Dubai',bookUrl:'https://www.globalvillage.ae'}},
  {name:'Jumeirah Mosque参观', emoji:'🕌', audiences:['family','couple'], cat:'culture', outdoor:false, info:{loc:'Jumeirah Mosque',addr:'Jumeirah Beach Rd',dist:'15min',cost:'约35 AED',age:'7+',time:'周六/周日10am',hours:'需预约',phone:'+971 4 353 6666',tip:'唯一对非穆斯林开放',mapQ:'Jumeirah+Mosque+visit'}},
  // ========== 夫妻活动（迁移自 DB_COUPLE） ==========
  {name:'随机菜系晚餐', emoji:'🍽️', audiences:['couple','friend'], cat:'food', outdoor:false, info:{loc:'迪拜各区',dist:'视餐厅',cost:'200-400 AED/两人',age:'两人',time:'晚9:30后',tip:'日/意/黎/印轮着来',mapQ:'best+restaurants+Dubai'}},
  {name:'沙漠日落', emoji:'🌅', audiences:['couple','family'], cat:'nature', outdoor:true, info:{loc:'Fossil Rock',addr:'Hatta-Sharjah Rd',dist:'45min',cost:'免费自驾',age:'两人',time:'日落前1h',hours:'全天',tip:'带毯子和热饮',mapQ:'Fossil+Rock+sunset+Dubai'}},
  {name:'精品咖啡探店', emoji:'☕', audiences:['couple','friend','family'], cat:'food', outdoor:false, info:{loc:'Al Quoz / DIFC',addr:'多个地点',dist:'15min',cost:'50-100 AED',age:'两人',time:'任何时间',tip:'Nightjar, % Arabica, RAW',mapQ:'specialty+coffee+Dubai'}},
  {name:'JLT湖边夜散步', emoji:'🚶', audiences:['couple','family'], cat:'leisure', outdoor:true, info:{loc:'JLT Lakes',addr:'JLT Cluster S',dist:'下楼即到',cost:'免费',age:'两人',time:'晚9:30后',hours:'全天',tip:'买杯咖啡，聊聊天',mapQ:'JLT+Lakes+Dubai'}},
  {name:'Dubai Opera', emoji:'🎭', audiences:['couple','friend'], cat:'culture', outdoor:false, info:{loc:'Dubai Opera',addr:'Sheikh Mohammed bin Rashid Blvd',dist:'20min',cost:'200-600 AED/人',age:'两人',time:'晚上',hours:'视演出',phone:'+971 4 440 8888',tip:'提前一个月查排期',mapQ:'Dubai+Opera',bookUrl:'https://www.dubaiopera.com'}},
  {name:'Spa放松', emoji:'💆', audiences:['couple'], cat:'leisure', outdoor:false, info:{loc:'Spa近JLT',addr:'JLT / Marina',dist:'5-10min',cost:'300-500 AED/两人',age:'两人',time:'周末白天',hours:'需预约',tip:'双人套餐更划算',mapQ:'couple+spa+near+JLT'}},
  {name:'Marina游船', emoji:'🛥️', audiences:['couple','friend','family'], cat:'leisure', outdoor:true, info:{loc:'Dubai Marina',addr:'Dubai Marina Walk',dist:'10min',cost:'150-300 AED/人',age:'两人',time:'下午5-7点',hours:'需预约',phone:'+971 50 744 2800',tip:'日落时段最好',mapQ:'Dubai+Marina+boat+cruise'}},
  {name:'酒吧/Lounge', emoji:'🍷', audiences:['couple','friend'], cat:'nightlife', outdoor:false, info:{loc:'DIFC / JBR',addr:'多个地点',dist:'10-15min',cost:'200-400 AED',age:'两人',time:'晚上',hours:'5pm-2am',tip:'Ladies Night有优惠',mapQ:'best+rooftop+bar+Dubai'}},
  {name:'城市摄影散步', emoji:'📸', audiences:['couple','friend','family'], cat:'culture', outdoor:true, info:{loc:'Al Fahidi / Al Seef',addr:'Al Fahidi Historical District',dist:'20min',cost:'免费',age:'两人',time:'下午5点',hours:'全天',tip:'金色时段光线最好',mapQ:'Al+Fahidi+photography'}},
  {name:'Omakase体验', emoji:'🍣', audiences:['couple'], cat:'food', outdoor:false, info:{loc:'DIFC / Downtown',dist:'20min',cost:'400-800 AED/人',age:'两人',time:'晚上',hours:'需预约',tip:'两人约会首选',mapQ:'best+omakase+Dubai'}},
  {name:'哈利法塔夜景', emoji:'🌃', audiences:['couple','family','friend'], cat:'entertainment', outdoor:false, info:{loc:'At The Top, Burj Khalifa',addr:'Downtown',dist:'20min',cost:'约150 AED/人',age:'两人',time:'日落时段',hours:'8:30am-11pm',phone:'+971 4 888 8888',tip:'夜间票更便宜',mapQ:'Burj+Khalifa+At+The+Top',bookUrl:'https://www.burjkhalifa.ae'}},
  {name:'KTV之夜', emoji:'🎤', audiences:['couple','friend','family'], cat:'nightlife', outdoor:false, info:{loc:'Lucky Voice',addr:'Grand Millennium, DIFC',dist:'15min',cost:'100-200 AED/人',age:'两人',time:'晚上',hours:'6pm-2am',phone:'+971 4 321 7798',tip:'有中文歌库',mapQ:'karaoke+Dubai'}},
  {name:'露天电影', emoji:'🍿', audiences:['couple','family'], cat:'entertainment', outdoor:true, info:{loc:'Rooftop Cinema',addr:'Galleria Mall',dist:'15min',cost:'约100 AED/人',age:'两人',time:'晚上',hours:'季节性',phone:'+971 4 346 9000',tip:'浪漫约会',mapQ:'outdoor+cinema+Dubai'}},
  {name:'Topgolf', emoji:'🏌️', audiences:['couple','friend','family'], cat:'sports', outdoor:true, info:{loc:'Topgolf Dubai',addr:'Emirates Golf Club',dist:'10min',cost:'约150 AED/时',age:'两人',time:'傍晚',hours:'10am-12am',phone:'+971 4 390 7777',tip:'不会打也好玩',mapQ:'Topgolf+Dubai',bookUrl:'https://topgolf.com/ae/dubai'}},
  {name:'Alserkal艺术区', emoji:'🖼️', audiences:['couple','friend','family'], cat:'culture', outdoor:false, info:{loc:'Alserkal Avenue',addr:'Al Quoz Industrial 1',dist:'15min',cost:'免费',age:'两人',time:'下午',hours:'10am-7pm',tip:'画廊+咖啡+独立书店',mapQ:'Alserkal+Avenue+Dubai',bookUrl:'https://alserkal.online'}},
  {name:'阿布扎比一日游', emoji:'🏰', audiences:['couple','family','friend'], cat:'daytrip', outdoor:false, info:{loc:'Abu Dhabi',addr:'Sheikh Zayed Grand Mosque + Louvre',dist:'90min',cost:'油费+门票200',age:'两人',time:'早出发',hours:'全天',tip:'清真寺+卢浮宫',mapQ:'Abu+Dhabi+day+trip'}},
  {name:'Jebel Jais滑索', emoji:'🏔️', audiences:['couple','friend'], cat:'sports', outdoor:true, info:{loc:'Jebel Jais, RAK',addr:'Ras Al Khaimah',dist:'90min',cost:'约400 AED/人',age:'两人',time:'早上',hours:'需预约',phone:'+971 7 203 0300',tip:'世界最长高空滑索',mapQ:'Jebel+Jais+zipline+RAK',bookUrl:'https://www.visitjebeljais.com'}},

  // ========== 在家仪式（新增 family_ritual / 家庭仪式） ==========
  {name:'JLT湖边全家散步', emoji:'🚶', audiences:['family'], cat:'family_ritual', outdoor:true, jlt:true, info:{loc:'JLT湖边',dist:'下楼即到',cost:'免费',tip:'晚餐后散步，和孩子聊今天发生的事',mapQ:'JLT+Lakes'}},
  {name:'家庭阅读时间', emoji:'📖', audiences:['family'], cat:'reading', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'每人一本书，互不打扰30分钟'}},
  {name:'家庭桌游之夜', emoji:'🎲', audiences:['family'], cat:'family_ritual', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'大富翁、Uno、卡坦岛，2小时不看手机'}},
  {name:'家庭电影夜', emoji:'🎬', audiences:['family'], cat:'family_ritual', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'每周六晚，让孩子轮流选片'}},
  {name:'拼图/乐高时间', emoji:'🧩', audiences:['family'], cat:'learning', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'建立专注力'}},
  {name:'画画/手工时间', emoji:'🎨', audiences:['family'], cat:'learning', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'主题绘画：今天画一样让你开心的东西'}},
  {name:'乐器练习', emoji:'🎹', audiences:['family'], cat:'skill', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'固定时间练30分钟'}},
  {name:'亲子编程/学习', emoji:'💻', audiences:['family'], cat:'learning', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'Scratch/Khan Academy/Duolingo'}},
  {name:'JLT湖边瑜伽', emoji:'🧘', audiences:['family','couple'], cat:'reflect', outdoor:true, jlt:true, info:{loc:'JLT湖边',cost:'免费',tip:'清晨或日落前，15分钟拉伸+呼吸'}},
  {name:'楼下踢球/运动', emoji:'⚽', audiences:['family'], cat:'sports', outdoor:true, jlt:true, info:{loc:'JLT小区',cost:'免费',tip:'30分钟户外运动'}},
  {name:'全家一起做饭', emoji:'🍳', audiences:['family','couple'], cat:'cooking', outdoor:false, jlt:true, info:{loc:'在家',cost:'材料费',tip:'让孩子负责一道菜，从选菜到上桌'}},
  {name:'日记/写作时间', emoji:'📝', audiences:['family','couple'], cat:'reflect', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'记录今天3件感恩的事'}},
  {name:'纪录片之夜', emoji:'📺', audiences:['family','couple'], cat:'learning', outdoor:false, jlt:true, info:{loc:'在家',cost:'订阅费',tip:'BBC Planet Earth / 舌尖上的中国'}},
  {name:'国际象棋/围棋', emoji:'♟️', audiences:['family','friend'], cat:'skill', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'锻炼思维，可以教孩子基础'}},
  {name:'家庭KTV', emoji:'🎤', audiences:['family','friend'], cat:'family_ritual', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'每人轮流点一首'}},
  {name:'写给未来的信', emoji:'✉️', audiences:['family','couple'], cat:'reflect', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'每季度一次，和孩子一起写给明年的自己'}},
  {name:'感恩三件事', emoji:'🙏', audiences:['family','couple'], cat:'reflect', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'晚餐时每人说3件今天感恩的事'}},
  {name:'长辈电话/视频', emoji:'📞', audiences:['family','couple'], cat:'connect' in {} ? 'connect':'family_ritual', outdoor:false, jlt:true, info:{loc:'在家',cost:'免费',tip:'每周固定打给父母，别只发消息'}},
  {name:'两人深聊时间', emoji:'💑', audiences:['couple'], cat:'family_ritual', outdoor:false, jlt:true, info:{loc:'阳台/客厅',cost:'免费',tip:'睡前30分钟，不看手机，聊这周感受'}},
];

// 添加稳定 id + 确保 dim 字段
const ACTIVITIES = ACTIVITIES_RAW.map(a => {
  const id = slugify(a.name);
  const cat = CAT_BY_ID[a.cat] ? a.cat : 'leisure';
  return {
    ...a,
    id,
    cat,
    dim: a.dim || CAT_BY_ID[cat]?.dim || 'explore',
    info: a.info || {}
  };
});

const ACT_BY_ID = Object.fromEntries(ACTIVITIES.map(a=>[a.id,a]));
const ACT_BY_NAME = Object.fromEntries(ACTIVITIES.map(a=>[a.name,a])); // for migration

// 按 audience 取池
function actsFor(audience) {
  return ACTIVITIES.filter(a => a.audiences.includes(audience));
}

// ==================== 本周精选具体优惠 ====================
// 与下方"渠道汇总"DEALS 不同，这里每条是「具体哪家店/景点的什么优惠」，
// 带"去看"深链直接跳该平台的搜索结果页，找得到才真有用。
// 维护方式：手动每周/每月更新一次；过期 (expiresAt) 自动隐藏。
// `evergreen:true` 表示这是常年回收的优惠，不必非要带 expiresAt。
const FEATURED_DEALS = [
  // —— 餐饮：Brunch / 米其林 / 网红 ——
  {id:'fd-bla-bla-brunch', emoji:'🥂', cat:'dining', evergreen:true,
   title:'Bla Bla JBR · Friday Brunch BOGO',
   venue:'Bla Bla Beach Club, JBR',
   desc:'周五 Brunch 通过 Groupon 经常出 2 人套票 5-6 折，含无限酒水',
   savings:'~50%', source:'Groupon',
   url:'https://www.groupon.ae/coupons/dubayy?query=Bla+Bla+brunch'},

  {id:'fd-atmosphere-bogo', emoji:'🌃', cat:'dining', evergreen:true,
   title:'Atmosphere · Burj Khalifa 122F',
   venue:'Atmosphere Restaurant',
   desc:'通过 Entertainer App 主菜买一送一 · 适合纪念日/求婚',
   savings:'BOGO 主菜', source:'Entertainer',
   url:'https://www.theentertainerme.com/dubai/restaurants?search=atmosphere'},

  {id:'fd-haidilao-fazaa', emoji:'🍲', cat:'dining', evergreen:true,
   title:'海底捞 Dubai Mall · Fazaa 9 折',
   venue:'Haidilao @ Chinatown, Dubai Mall',
   desc:'Fazaa 卡常年 9-10% 折扣 · 等位免费小食/美甲/饮料',
   savings:'~10%', source:'Fazaa',
   url:'https://www.fazaa.ae/search?language=en&keyword=Haidilao'},

  {id:'fd-hakkasan-yum-cha', emoji:'🥟', cat:'dining', expiresAt:'2026-05-31',
   title:'Hakkasan Dubai · Yum Cha Brunch',
   venue:'Hakkasan @ Atlantis The Palm',
   desc:'周五/周六 Yum Cha brunch 套餐 295 AED 起，含点心+主菜',
   savings:'套餐价 295 AED', source:'官方/Reserve Out',
   url:'https://www.reserveout.com/en/dubai/restaurant/hakkasan-dubai'},

  {id:'fd-coya-zomato', emoji:'🍷', cat:'dining', evergreen:true,
   title:'COYA Dubai · Zomato Pro 8 折',
   venue:'COYA @ Four Seasons DIFC / Restaurant Village',
   desc:'秘鲁高端餐厅，Zomato Pro 会员 8 折，周一-周三全菜单适用',
   savings:'~20%', source:'Zomato Pro',
   url:'https://www.zomato.com/dubai/coya-difc'},

  // —— 景点门票 ——
  {id:'fd-burj-klook', emoji:'🏙️', cat:'tickets', evergreen:true,
   title:'Burj Khalifa At The Top · Klook 8 折',
   venue:'Burj Khalifa Levels 124+125',
   desc:'Klook 比现场便宜 15-20%，含 skip-the-line 快速通道',
   savings:'~20%', source:'Klook',
   url:'https://www.klook.com/en-AE/search/result/?keyword=burj+khalifa'},

  {id:'fd-aquarium-combo', emoji:'🐠', cat:'tickets', evergreen:true,
   title:'Dubai Aquarium · Klook 套票',
   venue:'Dubai Aquarium & Underwater Zoo',
   desc:'水族馆 + 企鹅互动 + VR Zoo 套票，比单买省 30%',
   savings:'~30%', source:'Klook',
   url:'https://www.klook.com/en-AE/search/result/?keyword=dubai+aquarium'},

  {id:'fd-img-kidzapp', emoji:'🎢', cat:'kids', evergreen:true,
   title:'IMG Worlds · Kidzapp 8 折',
   venue:'IMG Worlds of Adventure',
   desc:'Kidzapp 会员预订主题乐园+水上乐园，家庭票最划算',
   savings:'~20%', source:'Kidzapp',
   url:'https://kidzapp.com/search?q=img+worlds'},

  {id:'fd-wildwadi-twilight', emoji:'🌅', cat:'tickets', evergreen:true,
   title:'Wild Wadi · 黄昏票 (3pm 后)',
   venue:'Wild Wadi Waterpark',
   desc:'下午 3 点后入场半价 (~150 AED)，正好凉快下来玩到关门',
   savings:'~50% 后半天', source:'官方',
   url:'https://www.wildwadi.com/tickets'},

  {id:'fd-skidubai-kids', emoji:'⛄', cat:'kids', evergreen:true,
   title:'Ski Dubai · Kids Snow Park (季节促)',
   venue:'Ski Dubai @ Mall of the Emirates',
   desc:'夏季常推 12 岁以下儿童免费 / 第二人半价，关注官网 Promo 页',
   savings:'儿童免费窗口', source:'官方',
   url:'https://www.skidxb.com/promotions'},

  // —— Spa / 美容 ——
  {id:'fd-spa-couple-groupon', emoji:'💆', cat:'dining', evergreen:true,
   title:'JLT/Marina Spa 双人套餐 4-5 折',
   venue:'多家酒店 Spa',
   desc:'Groupon 长期有 60-90 分钟双人按摩+足浴套票，原价的 40-50%',
   savings:'40-50%', source:'Groupon',
   url:'https://www.groupon.ae/coupons/dubayy/health-and-beauty?query=couple+spa'},

  // —— 酒店/Staycation ——
  {id:'fd-atlantis-resident', emoji:'🏝️', cat:'travel', evergreen:true,
   title:'Atlantis The Palm · Resident Rate',
   venue:'Atlantis The Palm',
   desc:'UAE 居民身份证预订工作日房价比游客低 30-40%，含 Aquaventure',
   savings:'~35%', source:'官方',
   url:'https://www.atlantis.com/atlantis-the-palm/special-offers'},

  {id:'fd-hatta-staycation', emoji:'🏔️', cat:'travel', evergreen:true,
   title:'Hatta Resorts · 周中房价',
   venue:'Hatta Damani Lodges / Hatta Wadi Hub',
   desc:'周日-周三入住价格不到周末一半，含皮划艇/徒步免费体验',
   savings:'~50%', source:'官方',
   url:'https://visithatta.com/stay'},

  // —— 购物/超市 ——
  {id:'fd-carrefour-thursday', emoji:'🛒', cat:'shopping', evergreen:true,
   title:'Carrefour · 周四特价刊',
   venue:'Carrefour 全 UAE 门店',
   desc:'每周四 0 点刷新特价，肉/菜/乳制品/零食循环 30-50% 折',
   savings:'30-50%', source:'Carrefour',
   url:'https://www.carrefouruae.com/mafuae/en/c/promotions'},

  {id:'fd-noon-yellow-fri', emoji:'📦', cat:'shopping', evergreen:true,
   title:'Noon Yellow Friday · 月度大促',
   venue:'Noon.com',
   desc:'每月大促配合信用卡折扣码，电子产品/家居骨折价',
   savings:'5 折起', source:'Noon',
   url:'https://www.noon.com/uae-en/sale/'},

  // —— 外卖/订阅 ——
  {id:'fd-talabat-first', emoji:'🛵', cat:'dining', evergreen:true,
   title:'Talabat 新用户首单 -50%',
   venue:'Talabat 全平台',
   desc:'新账号首单立减 50% (上限 30 AED)，每月新人福利',
   savings:'最高 30 AED', source:'Talabat',
   url:'https://www.talabat.com/uae/dubai/restaurants'},
];

// ==================== 优惠专区 ====================
// 类型：membership(会员卡)/groupbuy(团购)/dining(餐饮)/tickets(景点票务)/shopping(购物)/kids(亲子)/travel(旅行)/bank(信用卡)
const DEAL_CATEGORIES = [
  {id:'all',        label:'全部', emoji:'🎯'},
  {id:'membership', label:'会员卡', emoji:'🏷️'},
  {id:'groupbuy',   label:'团购', emoji:'🎫'},
  {id:'dining',     label:'餐饮', emoji:'🍽️'},
  {id:'tickets',    label:'景点', emoji:'🎢'},
  {id:'kids',       label:'亲子', emoji:'👶'},
  {id:'shopping',   label:'购物', emoji:'🛒'},
  {id:'travel',     label:'旅行', emoji:'✈️'},
  {id:'bank',       label:'信用卡', emoji:'💳'},
];

const DEALS = [
  // ========== 会员卡 ==========
  {id:'fazaa',           emoji:'🏷️', name:'Fazaa',              cat:'membership', desc:'内政部员工家属卡，UAE最实用折扣卡之一 · 餐饮/娱乐/零售/学校/保险全覆盖',           savings:'最高50%',  url:'https://www.fazaa.ae',                                                     meta:'约300 AED/年'},
  {id:'entertainer',     emoji:'🎫', name:'The Entertainer',    cat:'membership', desc:'买一送一神卡 · 餐厅+景点+Spa+Kids 4大类，App扫码即可用',                              savings:'买一送一',  url:'https://www.theentertainerme.com',                                        meta:'约500 AED/年'},
  {id:'smiles',          emoji:'😊', name:'Smiles by Etisalat', cat:'membership', desc:'Etisalat/du 话费用户免费开通，每天新推送折扣，餐饮和外卖特别多',                      savings:'最高70%',  url:'https://www.smilesuae.com',                                               meta:'免费'},
  {id:'privilee',        emoji:'🏖️', name:'Privilee',           cat:'membership', desc:'五星酒店+海滩+健身房无限次使用，家庭年卡很值',                                     savings:'酒店日卡',  url:'https://privilee.ae',                                                    meta:'约2500 AED/人/年'},
  {id:'enbd-rewards',    emoji:'💳', name:'ENBD U by Emaar',    cat:'membership', desc:'Emaar旗下所有景点/餐厅积分+折扣（Dubai Mall/哈利法塔/Miracle Garden等）',              savings:'积分+8折',  url:'https://uae.emaar.com/en/experiences/u-by-emaar',                        meta:'免费注册'},
  {id:'adcb-lulu',       emoji:'🛒', name:'Lulu Privilege',     cat:'membership', desc:'Lulu超市免费会员卡，经常有积分翻倍+专属折扣',                                       savings:'最高20%',  url:'https://www.luluhypermarket.com',                                         meta:'免费'},

  // ========== 团购平台 ==========
  {id:'groupon-family',  emoji:'💰', name:'Groupon 家庭折扣',     cat:'groupbuy',  desc:'家庭活动团购集合 · 室内游乐场/卡丁车/游船各种折扣',                                   savings:'3-5折',   url:'https://www.groupon.ae/coupons/dubayy/family'},
  {id:'groupon-dining',  emoji:'🍽️', name:'Groupon 餐饮',        cat:'groupbuy',  desc:'自助餐/下午茶/Brunch团购，Ramadan大促期间特别值',                                    savings:'3-6折',   url:'https://www.groupon.ae/coupons/dubayy/food-and-drink'},
  {id:'cobone',          emoji:'🎫', name:'Cobone',              cat:'groupbuy',  desc:'UAE本土团购老牌，活动/餐饮/Spa折扣',                                                savings:'5折起',    url:'https://www.cobone.com'},
  {id:'platinumlist',    emoji:'🎭', name:'Platinumlist Flash', cat:'groupbuy',  desc:'演出票务平台，经常有Flash Sale最后一刻折扣',                                          savings:'最高50%',  url:'https://dubai.platinumlist.net'},
  {id:'sharafdg-deals',  emoji:'📱', name:'Sharaf DG Week',     cat:'groupbuy',  desc:'电器连锁每周折扣，Apple/Samsung活动期最便宜',                                       savings:'节日大促', url:'https://uae.sharafdg.com/c/sdg-weekly-deals-2'},

  // ========== 餐饮 ==========
  {id:'zomato-gold',     emoji:'🥇', name:'Zomato Gold',        cat:'dining',    desc:'订阅制餐饮特权，合作餐厅买一送一或送酒水，超过1000家',                                 savings:'买一送一',  url:'https://www.zomato.com/dubai/gold'},
  {id:'reserveout',      emoji:'🍷', name:'Reserve Out',        cat:'dining',    desc:'高端餐厅订位平台，有独家早鸟/晚鸟折扣',                                              savings:'10-30%',  url:'https://www.reserveout.com'},
  {id:'dubai-food-fest', emoji:'🎉', name:'Dubai Food Fest',    cat:'dining',    desc:'每年4-5月美食节，餐厅推出Fest Menu（固定价套餐99/149/249 AED）',                       savings:'套餐价',    url:'https://www.dubaifoodfestival.com',                                      meta:'季节性'},
  {id:'dsf-dining',      emoji:'🎊', name:'Dubai Shopping Fest Dining', cat:'dining', desc:'每年12月-1月购物节期间大量餐厅折扣+抽奖',                                       savings:'5折起',    url:'https://www.mydsf.ae',                                                   meta:'12-1月'},
  {id:'talabat-pro',     emoji:'🛵', name:'Talabat Pro',        cat:'dining',    desc:'外卖平台订阅，免配送费+独家折扣',                                                   savings:'免配送',   url:'https://www.talabat.com',                                                meta:'约25 AED/月'},
  {id:'careem-plus',     emoji:'🛵', name:'Careem Plus',        cat:'dining',    desc:'Careem订阅，外卖免运费+打车折扣',                                                   savings:'免配送+打车折扣', url:'https://www.careem.com/pricing',                                  meta:'约25 AED/月'},

  // ========== 景点门票 ==========
  {id:'klook',           emoji:'🎢', name:'Klook',              cat:'tickets',   desc:'景点/门票/主题乐园，比现场买便宜，经常有限时Promo Code',                            savings:'10-30%',  url:'https://www.klook.com/en-AE/coureg/81-dubai-things-to-do'},
  {id:'tiqets',          emoji:'🎟️', name:'Tiqets',             cat:'tickets',   desc:'欧洲起家的景点票平台，迪拜主要景点都有',                                            savings:'8-9折',    url:'https://www.tiqets.com/en/dubai-attractions-c74477'},
  {id:'getyourguide',    emoji:'🌍', name:'GetYourGuide',       cat:'tickets',   desc:'景点/一日游/体验，退订政策好',                                                      savings:'限时折扣', url:'https://www.getyourguide.com/dubai-l173'},
  {id:'visit-dxb-card',  emoji:'🏙️', name:'Dubai Pass',         cat:'tickets',   desc:'一卡打卡所有主要景点，游客或2-3天集中玩最划算',                                      savings:'套票',      url:'https://www.visitdubai.com/en/discover-dubai/tours-and-excursions/dubai-pass'},
  {id:'ifly-student',    emoji:'🪂', name:'iFLY 学生/生日优惠',   cat:'tickets',   desc:'iFLY 学生卡/生日月特惠，关注官方社媒',                                              savings:'学生价',   url:'https://www.iflyworld.ae/promotions'},

  // ========== 亲子 ==========
  {id:'kidzapp',         emoji:'👶', name:'Kidzapp',            cat:'kids',      desc:'亲子活动平台，订阅会员后活动+课程折扣',                                              savings:'最高50%',  url:'https://kidzapp.com'},
  {id:'yalla-kids',      emoji:'🎪', name:'Yalla Kids Pass',    cat:'kids',      desc:'多个儿童游乐场通票（Caboodle/BOUNCE/Adventure HQ等）',                             savings:'通票',      url:'https://yallakids.com'},
  {id:'emirates-snow',   emoji:'⛄', name:'Ski Dubai Kids Free',cat:'kids',      desc:'Ski Dubai 不定期推出"小孩免费"日，关注官方',                                          savings:'儿童免费', url:'https://www.skidxb.com',                                                  meta:'限时活动'},
  {id:'dubai-parks-fam', emoji:'🎠', name:'Dubai Parks年票',     cat:'kids',      desc:'Motiongate/Legoland/Bollywood Parks全年无限次，家庭4人套装最划算',                  savings:'年票',      url:'https://www.dubaiparksandresorts.com'},

  // ========== 购物 ==========
  {id:'noon-promo',      emoji:'🛒', name:'Noon Promo Days',    cat:'shopping',  desc:'本地电商每月大促，信用卡+优惠码组合能到骨折价',                                       savings:'5折起',    url:'https://www.noon.com/uae-en/'},
  {id:'amazon-ae-sale',  emoji:'📦', name:'Amazon.ae 大促',     cat:'shopping',  desc:'Prime Day/Black Friday/Ramadan 三大促',                                           savings:'限时折扣', url:'https://www.amazon.ae'},
  {id:'carrefour-week',  emoji:'🛍️', name:'Carrefour 本周特价', cat:'shopping',  desc:'每周四刷新特价商品，肉菜/乳制品/零食循环打折',                                        savings:'每周更新', url:'https://www.carrefouruae.com',                                            meta:'周四更新'},
  {id:'dsf',             emoji:'🎊', name:'Dubai Shopping Fest',cat:'shopping',  desc:'每年12月-1月，几乎所有商场折扣+抽车/金条',                                          savings:'5折+抽奖',  url:'https://www.mydsf.ae',                                                   meta:'12-1月'},
  {id:'ramadan-deals',   emoji:'🌙', name:'Ramadan 促销',       cat:'shopping',  desc:'斋月期间商场/餐饮/电器普遍促销',                                                     savings:'最大促销期', url:'',                                                                       meta:'斋月期间'},
  {id:'duty-free',       emoji:'✈️', name:'Dubai Duty Free',    cat:'shopping',  desc:'机场免税店，电子产品+香水有时比商场便宜',                                             savings:'免税',      url:'https://www.dubaidutyfree.com'},

  // ========== 旅行 ==========
  {id:'booking-genius',  emoji:'🏨', name:'Booking Genius',     cat:'travel',    desc:'订过几次后自动升Genius会员，酒店有10-15%折扣+免早餐',                                  savings:'10-15%+福利', url:'https://www.booking.com'},
  {id:'agoda-insider',   emoji:'🏖️', name:'Agoda Insider',      cat:'travel',    desc:'亚洲酒店便宜，经常有限时闪购',                                                       savings:'限时闪购', url:'https://www.agoda.com'},
  {id:'flydubai-sale',   emoji:'✈️', name:'flydubai Sale',      cat:'travel',    desc:'flydubai 每月大促，伊斯坦布尔/曼谷/莫斯科往返1500起',                                 savings:'月度促销', url:'https://www.flydubai.com'},
  {id:'skyscanner',      emoji:'🔍', name:'Skyscanner 价格提醒', cat:'travel',    desc:'航线设置价格提醒，便宜机票第一时间通知',                                              savings:'追踪低价', url:'https://www.skyscanner.ae'},
  {id:'emirates-skywards',emoji:'🌟',name:'Emirates Skywards',  cat:'travel',    desc:'阿联酋航空里程卡免费注册，积分能换升舱/住酒店',                                       savings:'积分',      url:'https://www.emirates.com/ae/english/skywards'},

  // ========== 信用卡 ==========
  {id:'mashreq-solitaire',emoji:'💳',name:'Mashreq Solitaire',  cat:'bank',      desc:'高端卡餐饮5x积分+机场休息室，年费可刷积分抵',                                           savings:'5x积分',    url:'https://www.mashreqbank.com/uae/en/personal/cards/credit-cards'},
  {id:'fab-elite',       emoji:'💳', name:'FAB Elite Dining',   cat:'bank',      desc:'FAB Elite系列卡餐饮25%返现，合作餐厅很多',                                           savings:'最高25%返现', url:'https://www.bankfab.com'},
  {id:'enbd-infinite',   emoji:'💳', name:'ENBD Infinite',      cat:'bank',      desc:'外币消费返现+高端卡福利',                                                           savings:'返现+福利', url:'https://www.emiratesnbd.com'},
  {id:'adcb-touchpoints',emoji:'💳', name:'ADCB TouchPoints',   cat:'bank',      desc:'ADCB 信用卡积分能换 AED/餐饮券，换率不错',                                           savings:'积分',      url:'https://www.adcb.com'},
];

// ==================== 烹饪食谱库 ====================
const RECIPES = [
  // 家常
  {id:'tomato-egg',          emoji:'🍅', name:'番茄炒蛋',            difficulty:1, time:10, kidFriendly:true,  cat:'chinese', desc:'国民菜，孩子也爱',              steps:'1. 番茄切块 2. 蛋打散炒软 3. 下番茄炒出汁 4. 合炒出味'},
  {id:'gongbao-chicken',     emoji:'🥜', name:'宫保鸡丁',            difficulty:3, time:25, kidFriendly:false, cat:'chinese', desc:'经典川菜',                      steps:'鸡肉腌制→花生炸→下锅爆炒→收汁'},
  {id:'mapo-tofu',           emoji:'🌶️', name:'麻婆豆腐',            difficulty:2, time:20, kidFriendly:false, cat:'chinese', desc:'家常下饭神器'},
  {id:'fried-rice',          emoji:'🍚', name:'扬州炒饭',            difficulty:1, time:15, kidFriendly:true,  cat:'chinese', desc:'剩饭最佳归宿'},
  {id:'beef-noodle',         emoji:'🍜', name:'兰州牛肉面',          difficulty:4, time:180,kidFriendly:true,  cat:'chinese', desc:'周末花时间炖',                  steps:'牛骨熬汤3小时→手擀面→配葱香菜'},
  {id:'dumplings',           emoji:'🥟', name:'全家包饺子',          difficulty:2, time:90, kidFriendly:true,  cat:'chinese', desc:'周末活动 — 全家一起包',        tip:'让孩子负责包，大人调馅'},
  {id:'sweet-sour-pork',     emoji:'🍖', name:'糖醋里脊',            difficulty:3, time:40, kidFriendly:true,  cat:'chinese'},
  {id:'egg-drop-soup',       emoji:'🥣', name:'西红柿鸡蛋汤',        difficulty:1, time:10, kidFriendly:true,  cat:'chinese'},
  {id:'scrambled-shrimp',    emoji:'🍤', name:'滑蛋虾仁',            difficulty:2, time:15, kidFriendly:true,  cat:'chinese'},
  {id:'braised-pork',        emoji:'🥩', name:'红烧肉',              difficulty:3, time:90, kidFriendly:true,  cat:'chinese', desc:'经典，孩子爱'},
  {id:'kungpao-tofu',        emoji:'🌶️', name:'宫保豆腐（素）',      difficulty:2, time:20, kidFriendly:true,  cat:'chinese'},
  {id:'stirfry-beef-broc',   emoji:'🥦', name:'西兰花牛肉',          difficulty:2, time:20, kidFriendly:true,  cat:'chinese'},

  // 亚洲
  {id:'japanese-curry',      emoji:'🍛', name:'日式咖喱饭',          difficulty:1, time:40, kidFriendly:true,  cat:'asian',   desc:'用咖喱块，几乎零失败'},
  {id:'ramen-home',          emoji:'🍜', name:'家庭版拉面',          difficulty:2, time:30, kidFriendly:true,  cat:'asian',   desc:'用日式拉面包+叉烧'},
  {id:'thai-basil-chicken',  emoji:'🌿', name:'泰式罗勒鸡',          difficulty:2, time:20, kidFriendly:false, cat:'asian'},
  {id:'korean-bibimbap',     emoji:'🍚', name:'韩式拌饭',            difficulty:2, time:30, kidFriendly:true,  cat:'asian',   desc:'蔬菜+肉+蛋拌在一起'},
  {id:'vietnamese-pho',      emoji:'🍲', name:'越南牛肉粉',          difficulty:3, time:60, kidFriendly:true,  cat:'asian'},
  {id:'sushi-rolls',         emoji:'🍣', name:'自制寿司卷',          difficulty:3, time:60, kidFriendly:true,  cat:'asian',   desc:'和孩子一起卷',                tip:'黄瓜+鳄梨+蟹柳最简单'},

  // 西式
  {id:'carbonara',           emoji:'🍝', name:'Carbonara 意面',      difficulty:2, time:20, kidFriendly:true,  cat:'western', desc:'正宗版只用蛋黄+奶酪+培根'},
  {id:'pomodoro',            emoji:'🍝', name:'番茄意面',            difficulty:1, time:20, kidFriendly:true,  cat:'western'},
  {id:'margherita-pizza',    emoji:'🍕', name:'自制玛格丽特披萨',    difficulty:3, time:90, kidFriendly:true,  cat:'western', desc:'孩子揉面+铺料，最有参与感'},
  {id:'roast-chicken',       emoji:'🍗', name:'烤全鸡',              difficulty:2, time:90, kidFriendly:true,  cat:'western', desc:'黄油+迷迭香+柠檬'},
  {id:'risotto-mushroom',    emoji:'🍄', name:'蘑菇Risotto',         difficulty:3, time:45, kidFriendly:true,  cat:'western'},
  {id:'shakshuka',           emoji:'🍳', name:'Shakshuka',           difficulty:1, time:25, kidFriendly:true,  cat:'western', desc:'中东经典早餐'},
  {id:'steak-dinner',        emoji:'🥩', name:'煎牛排 + 土豆泥',     difficulty:2, time:30, kidFriendly:true,  cat:'western'},
  {id:'burger-home',         emoji:'🍔', name:'自制汉堡',            difficulty:2, time:30, kidFriendly:true,  cat:'western', tip:'和孩子一起做肉饼'},

  // 早餐
  {id:'pancakes',            emoji:'🥞', name:'松饼',                difficulty:1, time:20, kidFriendly:true,  cat:'breakfast',desc:'周末早餐，孩子最爱'},
  {id:'french-toast',        emoji:'🍞', name:'法式吐司',            difficulty:1, time:15, kidFriendly:true,  cat:'breakfast'},
  {id:'eggs-benedict',       emoji:'🥚', name:'班尼迪克蛋',          difficulty:3, time:30, kidFriendly:true,  cat:'breakfast', desc:'挑战荷兰酱'},
  {id:'congee',              emoji:'🍚', name:'皮蛋瘦肉粥',          difficulty:1, time:60, kidFriendly:true,  cat:'breakfast'},
  {id:'smoothie-bowl',       emoji:'🥣', name:'水果 Smoothie 碗',    difficulty:1, time:10, kidFriendly:true,  cat:'breakfast'},
  {id:'avocado-toast',       emoji:'🥑', name:'牛油果吐司',          difficulty:1, time:10, kidFriendly:true,  cat:'breakfast'},

  // 烘焙 & 甜点
  {id:'choc-chip-cookies',   emoji:'🍪', name:'巧克力曲奇',          difficulty:2, time:40, kidFriendly:true,  cat:'bake',    desc:'和孩子一起烤，必备'},
  {id:'brownies',            emoji:'🍫', name:'布朗尼',              difficulty:2, time:50, kidFriendly:true,  cat:'bake'},
  {id:'cheesecake',          emoji:'🍰', name:'芝士蛋糕',            difficulty:3, time:120,kidFriendly:true,  cat:'bake'},
  {id:'madeleine',           emoji:'🫓', name:'玛德琳',              difficulty:3, time:60, kidFriendly:true,  cat:'bake'},
  {id:'banana-bread',        emoji:'🍌', name:'香蕉面包',            difficulty:1, time:70, kidFriendly:true,  cat:'bake',    desc:'熟香蕉别扔，做这个'},
  {id:'scones',              emoji:'🍞', name:'英式司康',            difficulty:2, time:45, kidFriendly:true,  cat:'bake'},
  {id:'chinese-steam-bun',   emoji:'🥟', name:'叉烧包',              difficulty:4, time:180,kidFriendly:true,  cat:'bake'},
  {id:'tangyuan',            emoji:'🍡', name:'汤圆',                difficulty:2, time:45, kidFriendly:true,  cat:'bake',    desc:'元宵/冬至和孩子一起搓'},
  {id:'mooncake',            emoji:'🥮', name:'自制月饼',            difficulty:4, time:240,kidFriendly:true,  cat:'bake',    desc:'中秋家庭活动'},
  {id:'crepes',              emoji:'🥞', name:'法式薄饼',            difficulty:2, time:30, kidFriendly:true,  cat:'bake'},

  // 健康/轻食
  {id:'kale-salad',          emoji:'🥗', name:'羽衣甘蓝沙拉',        difficulty:1, time:15, kidFriendly:false, cat:'healthy'},
  {id:'quinoa-bowl',         emoji:'🥗', name:'藜麦碗',              difficulty:1, time:25, kidFriendly:true,  cat:'healthy'},
  {id:'grilled-salmon',      emoji:'🐟', name:'烤三文鱼',            difficulty:1, time:20, kidFriendly:true,  cat:'healthy'},
  {id:'veggie-soup',         emoji:'🍲', name:'蔬菜浓汤',            difficulty:1, time:30, kidFriendly:true,  cat:'healthy'},
  {id:'hummus-home',         emoji:'🧆', name:'自制鹰嘴豆泥',        difficulty:1, time:15, kidFriendly:true,  cat:'healthy'},

  // 给孩子动手
  {id:'kids-cookies',        emoji:'🧑‍🍳', name:'孩子主导：糖霜饼干', difficulty:2, time:120,kidFriendly:true, cat:'kids',    desc:'孩子从零开始做，培养成就感'},
  {id:'kids-pizza-mini',     emoji:'🍕', name:'孩子主导：迷你披萨',  difficulty:1, time:45, kidFriendly:true,  cat:'kids',    desc:'英式玛芬底+番茄酱+奶酪'},
  {id:'kids-smoothie',       emoji:'🥤', name:'孩子主导：水果奶昔',  difficulty:1, time:10, kidFriendly:true,  cat:'kids'},
  {id:'kids-sushi',          emoji:'🍙', name:'孩子主导：饭团',      difficulty:1, time:30, kidFriendly:true,  cat:'kids'},
];

const RECIPE_CATS = [
  {id:'all',       label:'全部', emoji:'🎯'},
  {id:'chinese',   label:'中餐', emoji:'🥢'},
  {id:'asian',     label:'亚洲', emoji:'🍱'},
  {id:'western',   label:'西式', emoji:'🍝'},
  {id:'breakfast', label:'早餐', emoji:'🥞'},
  {id:'bake',      label:'烘焙', emoji:'🍰'},
  {id:'healthy',   label:'轻食', emoji:'🥗'},
  {id:'kids',      label:'孩子主导', emoji:'🧑‍🍳'},
];

// ==================== 技能学习路径 ====================
// 每个技能是一个 8 周计划；用户按周打卡
const SKILLS = [
  {id:'photography-basics', emoji:'📷', name:'摄影基础', weeks:8, desc:'用手机也能拍出好照片',
    plan:['光线的重要性','构图三分法','前景/中景/背景','人像拍摄','街拍练习','Golden Hour','黑白/风光','建立自己的风格']},
  {id:'guitar-beginner', emoji:'🎸', name:'吉他入门', weeks:12, desc:'从零弹一首完整的歌',
    plan:['认识吉他/调弦','C/G/Am/F四和弦','节奏和右手','第一首歌(简单版)','Barre和弦','切换练习','分解和弦','综合练习','弹唱第一首','练习第二首','复习巩固','录一个成品']},
  {id:'programming-basics', emoji:'💻', name:'编程入门', weeks:10, desc:'Python基础 + 做个小项目',
    plan:['装环境+Hello World','变量/if/循环','函数','列表/字典','文件读写','requests拉网页','做个命令行小工具','加点UI(tkinter)','Git+GitHub','发布你的第一个项目']},
  {id:'arabic-speaking', emoji:'🗣️', name:'阿拉伯语口语', weeks:12, desc:'日常生活能讲',
    plan:['字母表+发音','问候+自我介绍','数字1-100','在商场/餐厅','打车场景','工作场景','时间/日期','情绪表达','讲故事','和朋友聊天','孩子对话','录一段独白']},
  {id:'meditation-daily', emoji:'🧘', name:'冥想习惯', weeks:8, desc:'建立每日10分钟冥想',
    plan:['呼吸观察','身体扫描','慈心冥想','观情绪不评判','念头来去','走路冥想','晚间复盘','固定每天一个时段']},
  {id:'writing-daily', emoji:'✍️', name:'日更写作', weeks:12, desc:'每天写500字，练习表达',
    plan:['写我是谁','记录一天','描述一个人','描述一件事','讲一个童年故事','写给10年后的自己','观点+论据','写一次冲突','写家乡','写一顿饭','写一次旅行','整理成一个合集']},
  {id:'chess-basics', emoji:'♟️', name:'国际象棋入门', weeks:8, desc:'能和孩子一起下棋',
    plan:['棋子和基本规则','开局基本原则','基础战术(叉/钉)','将死练习','中局思路','残局基础','每天解5道棋题','下10局实战']},
  {id:'drawing-sketching', emoji:'✏️', name:'素描基础', weeks:10, desc:'从零到会画静物',
    plan:['直线/曲线练习','几何体','明暗关系','水果静物','布褶','复杂静物','人像五官','头像整体','风景速写','自选作品']},
  {id:'public-speaking', emoji:'🎤', name:'公开演讲', weeks:6, desc:'克服紧张 + 讲清楚',
    plan:['录自己讲1分钟','结构：开头/主体/结尾','用故事讲道理','停顿的力量','肢体语言','做一次正式演讲']},
  {id:'financial-basics', emoji:'💰', name:'理财入门', weeks:8, desc:'建立个人财务体系',
    plan:['记账1周','3大账户法','紧急备用金','了解指数基金','资产配置','被动收入思路','读一本理财书','做一个家庭预算']},
];

// ==================== 学习内容（书/播客/纪录片/课程） ====================
// 从 discover-data.js 的 learning_content 已有，本模块直接复用 VENUES.learning_content
// 为了解耦，也在这里镜像一份简化版 + 每日一学池
const LEARNING_POOL = [
  // 每日 15 分钟可做的事，Dashboard 会每天轮一个
  {id:'read-15min',    emoji:'📖', name:'读书 15 分钟',      desc:'打开任何一本你在读的书',  type:'reading',   minutes:15},
  {id:'podcast-commute',emoji:'🎙️',name:'播客通勤听 1 集',   desc:'The Daily / 日谈公园 / 得到', type:'podcast',  minutes:30},
  {id:'duolingo',      emoji:'🦉', name:'Duolingo 打卡',     desc:'15 分钟学语言，连续签到',   type:'app',        minutes:15},
  {id:'doc-night',     emoji:'🎬', name:'纪录片一集',        desc:'BBC Planet Earth / 舌尖上的中国', type:'documentary', minutes:50},
  {id:'ted-one',       emoji:'💡', name:'TED 一个演讲',      desc:'挑一个18分钟以内的',        type:'video',      minutes:18},
  {id:'write-journal', emoji:'📝', name:'日记 10 分钟',      desc:'今天3件感恩的事 + 1件学到的', type:'writing',   minutes:10},
  {id:'meditate-10',   emoji:'🧘', name:'冥想 10 分钟',      desc:'Calm / Headspace / 只是呼吸', type:'reflect',   minutes:10},
  {id:'coursera-class',emoji:'💻', name:'Coursera 一节课',   desc:'每周固定学 1 个课程',       type:'course',     minutes:60},
  {id:'arabic-word',   emoji:'🗣️', name:'学 3 个阿拉伯语词', desc:'在本地生活更融入',          type:'language',   minutes:10},
  {id:'write-letter',  emoji:'✉️', name:'写一封信',         desc:'给父母/朋友/10年后的自己',   type:'writing',    minutes:20},
];

// ==================== 默认每周节奏 ====================
const DEFAULT_PLANNER = [
  {day:'一', time:'19:30', act:'JLT湖边全家散步',    emoji:'🚶'},
  {day:'二', time:'19:30', act:'家庭阅读时间',      emoji:'📖'},
  {day:'三', time:'19:30', act:'JLT湖边跑步（自己）', emoji:'🏃'},
  {day:'四', time:'19:30', act:'家庭桌游之夜',      emoji:'🎲'},
  {day:'五', time:'20:00', act:'网球 + 夫妻晚餐',   emoji:'🎾'},
  {day:'六', time:'08:00', act:'周末出行活动',      emoji:'🎯'},
  {day:'六', time:'21:30', act:'两人深聊时间',      emoji:'💑'},
  {day:'日', time:'09:00', act:'全家出行活动',      emoji:'☀️'},
  {day:'日', time:'19:30', act:'家庭电影夜',        emoji:'🎬'},
];
const DAYS = ['一','二','三','四','五','六','日'];
const WEEKDAYS = ['一','二','三','四'];
function isWeekday(day){ return WEEKDAYS.includes(day); }

// 激励性问候语（Dashboard 每日变换）
// 三个方向：规划 / 灵感 / 意义
const QUOTES = [
  // —— 意义向 ——
  '真正的丰盛，不是塞满时间，而是把时间放在对的事上',
  '日复一日的小事，决定了你是谁',
  '记录，是给未来的自己留的信',
  '让今天比昨天多一点点意义',
  '把时间给爱的人和爱的事',
  '和孩子一起做的事，十年后还在记得',
  '有意义的人生，不是没有痛苦，而是值得为之痛苦',
  '人生不是要过得快，是要过得深',
  '你最珍贵的不是经历，是你在经历里成为的那个人',
  // —— 规划向 ——
  '方向比速度重要，不慌不忙的人，活得最快',
  '你不是没时间，是没排序',
  '提前一周想清楚周末，比临时刷手机找点子更踏实',
  '一个能被规划的生活，才有自由可言',
  '把未来想象一下，今天就会更清醒',
  '今天的安排，是对昨天思考的兑现',
  // —— 灵感向 ——
  '无聊是创造的母亲，给空白留点位置',
  '选不出来的时候，让运气替你做决定',
  '换条路走走，世界就大了一圈',
  '灵感不会等你，它只在你出门的时候出现',
  '今天试一件没做过的小事',
  // —— 行动向 ——
  '刻意练习，积少成多',
  '学一点新东西，哪怕只是一个词',
  '慢慢来，比较快',
  '完成胜过完美',
  '先做五分钟，再决定要不要继续',
];

// 把数据挂到全局以便其他脚本使用
Object.assign(window, {
  PILLARS, DIMENSIONS, CATEGORIES, CAT_BY_ID,
  ACTIVITIES, ACT_BY_ID, ACT_BY_NAME, actsFor,
  DEAL_CATEGORIES, DEALS, FEATURED_DEALS,
  RECIPES, RECIPE_CATS,
  SKILLS, LEARNING_POOL,
  DEFAULT_PLANNER, DAYS, WEEKDAYS, isWeekday, QUOTES, slugify
});
