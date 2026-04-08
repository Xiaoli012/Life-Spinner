// ============================================================
// 发现页数据库 — 最后更新: 2026-04-08
// 修改此文件即可更新推荐内容，无需改动主程序
// 每个条目: emoji, name, desc, addr, phone, hours, cost,
//           rating(1-5), tags[], outdoor, mapQ, bookUrl, tip,
//           fazaa(可选): 'XX% off' 或 '特价XX AED' — Fazaa卡优惠
//           dist(可选): 0=JLT内, 1=10分钟内, 2=20分钟内, 3=30分钟+, 4=短途1h+
// ============================================================
const DISCOVER_UPDATED = '2026-04-09';

// 距离分区（从JLT Cluster S出发驾车估算）
// 0: JLT内步行可达
// 1: 10分钟车程（Marina/JBR/Ibn Battuta/Al Barsha）
// 2: 20分钟车程（Downtown/DIFC/Jumeirah/Al Quoz/City Walk）
// 3: 30分钟+（Deira/Mirdif/Al Warqa/Motor City/Festival City）
// 4: 1小时+短途（Hatta/Abu Dhabi/Sharjah/Fujairah/RAK）

const VENUES = {

// ==================== 🏠 JLT本地美食 ====================
// ⚠️ 所有数据已于2026-04-09网搜核实，无法确认的字段留空
jlt_food: {
  label: '🏠 JLT美食', color: 'var(--accent)',
  items: [
    {emoji:'🍜',name:'San Wan手工拉面',desc:'Cluster F西安面馆，现场手拉面，地道实惠',addr:'Cluster F, JLT',phone:'',hours:'11am-11pm',cost:'25-50 AED/人',rating:4.5,tags:['中餐','面食','平价','已核实✓'],outdoor:false,mapQ:'San+Wan+Hand+Pulled+Noodles+JLT',bookUrl:'',tip:'必点油泼面、肉夹馍，看师傅拉面'},
    {emoji:'🍛',name:'Cafe Isan泰餐',desc:'TimeOut获奖泰餐，正宗伊桑风味，冬季露台很棒',addr:'Armada Avenue Hotel, Cluster P, JLT',phone:'+971 4 399 8761',hours:'12pm-12am',cost:'60-100 AED/人',rating:4.4,tags:['泰餐','获奖','露台','已核实✓'],outdoor:true,mapQ:'Cafe+Isan+JLT+Dubai',bookUrl:'',tip:'Green Curry必点，提前订位'},
    {emoji:'🥗',name:'Splendour Fields',desc:'JLT Park旁亲子餐厅，有儿童游乐区，健康餐+咖啡',addr:'The Park, JLT',phone:'',hours:'8am-10pm',cost:'50-80 AED/人',rating:4.3,tags:['亲子','健康','咖啡','已核实✓'],outdoor:true,mapQ:'Splendour+Fields+JLT',bookUrl:'',tip:'孩子玩大人吃，周末早午餐好'},
    {emoji:'🇬🇷',name:'Mythos希腊餐厅',desc:'JLT最佳希腊餐厅，烤肉拼盘和Moussaka必点',addr:'Cluster E, JLT',phone:'',hours:'12pm-12am',cost:'80-120 AED/人',rating:4.5,tags:['希腊','约会','高性价比','已核实✓'],outdoor:true,mapQ:'Mythos+Kouzina+and+Bar+JLT+Dubai',bookUrl:'',tip:'Souvlaki和Mixed Grill Platter'},
    {emoji:'🇫🇷',name:'CQ French Brasserie',desc:'Mövenpick酒店法式小酒馆，Steak Frites是招牌',addr:'Mövenpick Hotel, Cluster A, JLT',phone:'+971 4 438 0000',hours:'12pm-1am',cost:'100-180 AED/人',rating:4.2,tags:['法餐','牛排','酒店','已核实✓'],outdoor:false,mapQ:'CQ+French+Brasserie+JLT',bookUrl:'',tip:'Happy Hour有优惠'},
    {emoji:'☕',name:'Common Grounds',desc:'JLT人气咖啡馆，露台超美，植物基菜单丰富',addr:'Cluster D, JLT',phone:'',hours:'7am-10pm',cost:'30-60 AED/人',rating:4.4,tags:['咖啡','素食','露台','已核实✓'],outdoor:true,mapQ:'Common+Grounds+JLT+Dubai',bookUrl:'',tip:'Flat White和Avocado Toast经典'},
    {emoji:'🇯🇵',name:'KIMA Izakaya',desc:'日式居酒屋，新鲜食材+烧烤，价格合理',addr:'MAG 214, Cluster R, JLT',phone:'+971 4 420 6555',hours:'12pm-11pm',cost:'80-130 AED/人',rating:4.3,tags:['日料','居酒屋','已核实✓'],outdoor:false,mapQ:'KIMA+Izakaya+JLT+Dubai',bookUrl:'',tip:'烤鸡串和味噌汤'},
    {emoji:'🇱🇧',name:'Bait Maryam黎巴嫩',desc:'米其林Bib Gourmand获奖！家庭式黎巴嫩菜',addr:'Cluster D, JLT',phone:'+971 54 704 4774',hours:'10am-12am',cost:'40-70 AED/人',rating:4.4,tags:['黎巴嫩','米其林','平价','已核实✓'],outdoor:false,mapQ:'Bait+Maryam+JLT+Dubai',bookUrl:'',tip:'Dish of the Day超值，米其林认证'},
    {emoji:'🇵🇪',name:'Fusion Ceviche秘鲁',desc:'JLT正宗秘鲁菜，新鲜Ceviche做得极好',addr:'Saba 3, Cluster Q, JLT',phone:'',hours:'12pm-11pm',cost:'80-120 AED/人',rating:4.3,tags:['秘鲁','Ceviche','已核实✓'],outdoor:false,mapQ:'Fusion+Ceviche+JLT+Dubai',bookUrl:'',tip:'Ceviche Mixto必点'},
    {emoji:'🍕',name:'PizzaExpress Live',desc:'全球连锁意式披萨JLT店，亲子友好有儿童菜单',addr:'Cluster A, JLT',phone:'+971 4 441 6342',hours:'11am-11pm',cost:'60-100 AED/人',rating:4.0,tags:['披萨','亲子','已核实✓'],outdoor:false,mapQ:'PizzaExpress+Live+JLT+Dubai',bookUrl:'',tip:'儿童套餐很划算'},
    {emoji:'🍱',name:'Sushi Library',desc:'JLT寿司外卖/堂食，新鲜实惠',addr:'Cluster R, JLT',phone:'+971 55 863 5802',hours:'11am-11pm',cost:'50-100 AED/人',rating:4.2,tags:['寿司','外卖','已核实✓'],outdoor:false,mapQ:'Sushi+Library+JLT+Dubai',bookUrl:'',tip:'Salmon Set最划算'},
    {emoji:'🥙',name:'Operation:Falafel',desc:'中东快餐连锁JLT店，Shawarma和Falafel超实惠',addr:'Cluster E, JLT',phone:'+971 600 530 006',hours:'10am-12am',cost:'20-40 AED/人',rating:4.1,tags:['中东','快餐','超平价','已核实✓'],outdoor:false,mapQ:'Operation+Falafel+JLT+Dubai',bookUrl:'',tip:'全家吃饱不到100 AED'},
    {emoji:'🍜',name:'Hawkerboi亚洲街食',desc:'米其林指南上榜！亚洲街头美食，咖喱/饺子/沙嗲',addr:'The Park, JLT',phone:'+971 50 427 5217',hours:'12pm-11pm',cost:'50-80 AED/人',rating:4.2,tags:['亚洲','米其林','街食','已核实✓'],outdoor:false,mapQ:'Hawkerboi+JLT+Dubai',bookUrl:'',tip:'Laksa和Satay很正宗'},
    {emoji:'🍲',name:'海底捞火锅',desc:'正宗川味火锅，拉面表演孩子爱看，等位有免费零食美甲',addr:'Dubai Mall Chinatown / Festival City',phone:'+971 4 221 7445',hours:'10am-2am',cost:'100-180 AED/人',rating:4.3,tags:['火锅','中餐','亲子','已核实✓'],outdoor:false,mapQ:'Haidilao+Hot+Pot+Dubai+Mall',bookUrl:'',tip:'提前App订位，4岁以下免费（非JLT，最近分店）'},
  ]
},

// ==================== 🌊 Marina/JBR美食 (15) ====================
marina_food: {
  label: '🌊 Marina/JBR', color: '#3b82f6',
  items: [
    {emoji:'🦞',name:'Aprons & Hammers',desc:'JBR海鲜神店，用锤子敲龙虾蟹腿，孩子超爱',addr:'The Beach Mall, JBR',phone:'+971 4 456 7888',hours:'12pm-1am',cost:'120-200 AED/人',rating:4.5,tags:['海鲜','亲子','海景'],outdoor:true,mapQ:'Aprons+Hammers+JBR',bookUrl:'https://www.apronsandhammers.com',tip:'Lobster Set最划算'},
    {emoji:'🍕',name:'Luigia意大利',desc:'Rixos JBR内，有儿童电影室！大人吃饭小孩看电影',addr:'Rixos Premium JBR',phone:'+971 4 520 0088',hours:'12pm-12am',cost:'100-160 AED/人',rating:4.3,tags:['意大利','亲子神器','披萨'],outdoor:true,mapQ:'Luigia+Rixos+JBR',bookUrl:'',tip:'儿童电影室免费'},
    {emoji:'🍣',name:'Toko Pan-Asian',desc:'Marina经典日式亚洲融合，Wagyu滑块招牌',addr:'Dubai Marina',phone:'+971 4 442 8383',hours:'12pm-12am',cost:'150-250 AED/人',rating:4.4,tags:['日料','约会','露台'],outdoor:true,mapQ:'Downtown+Toko+Dubai',bookUrl:'',tip:'露台位夜景一流'},
    {emoji:'🥩',name:'The Maine龙虾',desc:'新英格兰龙虾餐厅，Lobster Roll全迪拜最好吃之一',addr:'DoubleTree, JBR',phone:'+971 4 457 6776',hours:'12pm-1am',cost:'180-300 AED/人',rating:4.6,tags:['龙虾','海景','约会'],outdoor:true,mapQ:'The+Maine+JBR',bookUrl:'',tip:'Lobster Roll必点'},
    {emoji:'🍔',name:'Five Guys',desc:'美式汉堡量大实惠，薯条无限，全家都爱',addr:'Dubai Marina Walk',phone:'+971 4 361 8755',hours:'10am-12am',cost:'50-80 AED/人',rating:4.2,tags:['汉堡','快餐','亲子'],outdoor:false,mapQ:'Five+Guys+Marina',bookUrl:'',tip:'薯条超多，可选花生酱奶昔'},
    {emoji:'🧁',name:'Jones the Grocer',desc:'家庭早午餐，芝士拼盘出名，周五Brunch很划算',addr:'Delta Hotel, JBR',phone:'+971 4 318 1777',hours:'7am-11pm',cost:'80-140 AED/人',rating:4.3,tags:['早午餐','家庭','芝士'],outdoor:true,mapQ:'Jones+the+Grocer+JBR',bookUrl:'',tip:'周五Family Brunch'},
    {emoji:'🇱🇧',name:'Ibn AlBahr黎巴嫩鱼',desc:'JBR海滩正宗黎巴嫩海鲜，炸银鱼和蒜虾招牌',addr:'JBR Beach, The Walk',phone:'+971 4 426 3535',hours:'12pm-12am',cost:'150-300 AED/人',rating:4.4,tags:['黎巴嫩','海鲜','海景'],outdoor:true,mapQ:'Ibn+AlBahr+JBR',bookUrl:'',tip:'户外海景位需预约'},
    {emoji:'🍝',name:'Carluccio\'s',desc:'Marina Mall意大利餐，新鲜意面和披萨，家庭友好',addr:'Dubai Marina Mall, Level P',phone:'+971 4 399 7958',hours:'9am-11pm',cost:'70-120 AED/人',rating:4.1,tags:['意大利','家庭','Mall','已核实✓'],outdoor:false,mapQ:'Carluccios+Marina+Mall+Dubai',bookUrl:'',tip:'意面现做，儿童菜单有'},
    {emoji:'🍜',name:'Massimo\'s意大利',desc:'Park Island附近正宗意大利，氛围轻松',addr:'Park Island, Dubai Marina',phone:'+971 4 432 4284',hours:'12pm-12am',cost:'100-160 AED/人',rating:4.2,tags:['意大利','Marina','已核实✓'],outdoor:true,mapQ:'Massimos+Italian+Dubai+Marina',bookUrl:'',tip:'靠水位最好'},
    {emoji:'🥘',name:'Asia Asia',desc:'Marina全景亚洲融合，露台看全Marina，夜景超赞',addr:'Pier 7, Marina',phone:'+971 4 276 5900',hours:'12pm-1am',cost:'150-250 AED/人',rating:4.3,tags:['亚洲','夜景','露台'],outdoor:true,mapQ:'Asia+Asia+Marina+Dubai',bookUrl:'',tip:'日落时段露台必订'},
    {emoji:'🥟',name:'PF Chang\'s',desc:'美式中餐连锁，Lettuce Wrap和Orange Chicken经典',addr:'JBR The Walk',phone:'+971 4 426 2988',hours:'12pm-12am',cost:'80-140 AED/人',rating:4.0,tags:['中餐','连锁','亲子'],outdoor:true,mapQ:'PF+Changs+JBR',bookUrl:'',tip:'分量大可以分享'},
    {emoji:'🍗',name:'Chili\'s',desc:'美式休闲餐厅，份量大价格好，孩子爱',addr:'JBR The Beach',phone:'+971 4 423 8668',hours:'11am-12am',cost:'60-100 AED/人',rating:4.0,tags:['美式','亲子','实惠'],outdoor:true,mapQ:'Chilis+JBR+Dubai',bookUrl:'',tip:'Fajitas和Baby Back Ribs'},
    {emoji:'🇰🇷',name:'Mukbang Shows韩国BBQ',desc:'无限烤肉自助99 AED起，性价比之王',addr:'Deira (Al Ittihad Rd) / 扩展中',phone:'+971 4 555 0018',hours:'12pm-12am',cost:'99-150 AED/人',rating:4.2,tags:['韩餐','自助','超值'],outdoor:false,mapQ:'Mukbang+Shows+Dubai',bookUrl:'',tip:'无限烤肉99 AED，饿着去'},
    {emoji:'🐟',name:'Bu Qtair海鲜',desc:'迪拜传奇路边海鲜摊位级餐厅，新鲜便宜超地道',addr:'Jumeirah Fishing Harbour',phone:'',hours:'11:30am-11pm',cost:'40-80 AED/人',rating:4.6,tags:['传奇','海鲜','超平价'],outdoor:true,mapQ:'Bu+Qtair+Dubai',bookUrl:'',tip:'炸鱼+虾+面包，迪拜必吃'},
    {emoji:'☕',name:'Urth Caffe',desc:'有机咖啡+健康餐，环境美，适合周末brunch',addr:'City Walk, Al Safa Rd',phone:'',hours:'7am-11pm',cost:'60-100 AED/人',rating:4.3,tags:['咖啡','健康','City Walk','已核实✓'],outdoor:true,mapQ:'Urth+Caffe+City+Walk+Dubai',bookUrl:'',tip:'有机咖啡和Acai Bowl（仅City Walk有店）'},
  ]
},

// ==================== ☕ 网红咖啡甜品 (15) ====================
cafes: {
  label: '☕ 网红咖啡', color: '#ec4899',
  items: [
    {emoji:'🌹',name:'Forever Rose Cafe',desc:'黑白手绘世界里的彩色甜品，拍照打卡第一名',addr:'City Walk, Al Safa St',phone:'+971 4 357 0505',hours:'9am-12am',cost:'60-100 AED/人',rating:4.5,tags:['打卡','甜品','独特'],outdoor:false,mapQ:'Forever+Rose+Cafe+Dubai',bookUrl:'',tip:'全店黑白只有食物有色彩'},
    {emoji:'🌸',name:'Saya Brasserie',desc:'粉色花园Barbie风，Lotus Pancakes和Rose Latte',addr:'Bluewaters Island',phone:'+971 4 399 8970',hours:'8am-12am',cost:'80-150 AED/人',rating:4.4,tags:['粉色','少女心','甜品'],outdoor:true,mapQ:'Saya+Brasserie+Bluewaters',bookUrl:'',tip:'在Ain Dubai旁边可以一起逛'},
    {emoji:'🌿',name:'Secret Garden L\'ETO',desc:'天花板花朵仙境，甜品都是花香系',addr:'DIFC Gate Village',phone:'+971 4 350 3210',hours:'8am-11pm',cost:'70-120 AED/人',rating:4.3,tags:['仙境','花朵','DIFC'],outdoor:false,mapQ:'Secret+Garden+LETO+DIFC',bookUrl:'',tip:'下午茶套餐最划算'},
    {emoji:'💜',name:'Somewhere Cafe',desc:'薰衣草牛奶蛋糕全网爆款，中东甜品创新',addr:'Dubai Mall / City Walk',phone:'+971 4 325 3888',hours:'10am-12am',cost:'50-80 AED/人',rating:4.6,tags:['爆款','薰衣草','排队'],outdoor:false,mapQ:'Somewhere+Cafe+Dubai+Mall',bookUrl:'',tip:'Lavender Milk Cake必点'},
    {emoji:'🥐',name:'Nightjar Coffee',desc:'迪拜精品咖啡天花板，自家烘焙，Alserkal Avenue旗舰',addr:'Warehouse G62, Alserkal Avenue, Al Quoz 1 / City Walk 2',phone:'+971 4 330 6635',hours:'7am-8pm',cost:'25-50 AED',rating:4.7,tags:['精品咖啡','专业','Al Quoz','已核实✓'],outdoor:false,mapQ:'Nightjar+Coffee+Alserkal+Dubai',bookUrl:'https://www.nightjar.coffee',tip:'Filter和Flat White都是顶级'},
    {emoji:'🍰',name:'Brunch & Cake',desc:'超上镜甜品塔和彩色拼盘，Pancake Tower镇店',addr:'City Walk / La Mer',phone:'+971 4 355 5055',hours:'8am-11pm',cost:'80-140 AED/人',rating:4.3,tags:['网红','甜品塔','拍照'],outdoor:true,mapQ:'Brunch+and+Cake+Dubai',bookUrl:'',tip:'Pancake Tower必拍'},
    {emoji:'🌺',name:'EL&N粉色咖啡馆',desc:'伦敦来的粉色花墙咖啡馆，LED灯+鲜花墙',addr:'DIFC Gate Village / Dubai Hills Mall / Festival City',phone:'+971 4 552 4453',hours:'8am-11pm',cost:'50-90 AED/人',rating:4.2,tags:['粉色','拍照','伦敦','已核实✓'],outdoor:false,mapQ:'ELN+Cafe+Dubai',bookUrl:'',tip:'花墙拍照最出片（无City Walk店）'},
    {emoji:'🥖',name:'Knot Bakehouse',desc:'手工酸面包和创意甜品，2024新开迅速走红',addr:'Jumeirah, near Water Canal',phone:'',hours:'7am-8pm',cost:'40-70 AED/人',rating:4.5,tags:['面包','手工','新开🔥','已核实✓'],outdoor:true,mapQ:'Knot+Bakehouse+Jumeirah+Dubai',bookUrl:'',tip:'可颂和酸面包必买'},
    {emoji:'🧁',name:'Rascals Bakehouse',desc:'手工烘焙+特色甜品+精品咖啡',addr:'Shop 32, Wasl Square, Al Safa',phone:'+971 50 634 5538',hours:'7am-10pm',cost:'40-70 AED/人',rating:4.3,tags:['烘焙','手工','咖啡','已核实✓'],outdoor:true,mapQ:'Rascals+Bakehouse+Wasl+Square+Dubai',bookUrl:'',tip:'Babka和Cookie超赞'},
    {emoji:'🍫',name:'Fix Dessert Chocolatier',desc:'全球爆红迪拜巧克力！开心果Kunafa巧克力棒',addr:'线上Deliveroo配送 / DXB机场T1&T3',phone:'+971 58 503 0349',hours:'配送制',cost:'25-60 AED',rating:4.7,tags:['爆款🔥','巧克力','配送','已核实✓'],outdoor:false,mapQ:'Fix+Dessert+Chocolatier+Dubai',bookUrl:'https://officialfixdessertchocolatier.com',tip:'无实体店！Deliveroo下单或机场买'},
    {emoji:'☕',name:'% Arabica',desc:'日本京都来的精品咖啡，极简风，拿铁拉花完美',addr:'DIFC / City Walk / 多地点',phone:'',hours:'7am-10pm',cost:'20-40 AED',rating:4.4,tags:['日式','极简','精品','已核实✓'],outdoor:true,mapQ:'Arabica+Coffee+Dubai',bookUrl:'',tip:'Iced Latte经典之选'},
    {emoji:'🍦',name:'Lady M千层蛋糕',desc:'纽约千层蛋糕品牌（⚠️迪拜店未确认，可能不存在）',addr:'待确认',phone:'',hours:'待确认',cost:'45-60 AED/片',rating:0,tags:['千层','⚠️待确认'],outdoor:false,mapQ:'Lady+M+Dubai',bookUrl:'https://www.ladym.com/boutiques/',tip:'请先查官网确认迪拜是否有店'},
    {emoji:'🍩',name:'Project Chaiwala',desc:'印度Karak奶茶+Samosa，超实惠超地道',addr:'Alserkal Avenue / Ibn Battuta / Media City / DXB机场',phone:'+971 4 223 1139',hours:'7am-12am',cost:'15-30 AED',rating:4.3,tags:['奶茶','平价','地道','已核实✓'],outdoor:false,mapQ:'Project+Chaiwala+Dubai',bookUrl:'',tip:'Karak Chai + Samosa只要15块（无JLT店）'},
    {emoji:'🫖',name:'RAW Coffee Company',desc:'迪拜自家烘焙精品咖啡先驱，Al Quoz工业区',addr:'Al Quoz Industrial',phone:'+971 4 333 0122',hours:'7am-6pm',cost:'20-40 AED',rating:4.5,tags:['精品','烘焙','先驱'],outdoor:false,mapQ:'RAW+Coffee+Company+Dubai',bookUrl:'',tip:'周末咖啡品鉴课很好'},
    {emoji:'☕',name:'Risen Cafe',desc:'Marina手工烘焙咖啡馆，4月限时10 AED咖啡(7-10am)，多家分店',addr:'Millennium Place Marina Hotel, Al Marsa St, Dubai Marina',phone:'+971 4 550 8112',hours:'7am-10pm',cost:'10-60 AED',rating:4.3,tags:['咖啡','烘焙','Marina','限时优惠🔥','已核实✓'],outdoor:true,mapQ:'Risen+Cafe+Dubai+Marina',bookUrl:'https://risendubai.com',tip:'4月限时：7-10am咖啡10 AED，1-4pm热巧10 AED',dist:1},
  ]
},

// ==================== ⚽ 运动培训 (15) ====================
sports: {
  label: '⚽ 运动培训', color: 'var(--success)',
  items: [
    {emoji:'⚽',name:'SPORTSMANIA JLT',desc:'JLT本地！Juventus青训+Padel+网球+足球',addr:'Exit 29, JLT',phone:'+971 52 242 4789',hours:'7am-11pm',cost:'119-200 AED/次',rating:4.4,tags:['JLT','足球','网球','Padel'],outdoor:true,mapQ:'SPORTSMANIA+JLT',bookUrl:'http://sportsmania.ae',tip:'离家最近！4-17岁青训'},
    {emoji:'🏊',name:'Elite Sports游泳',desc:'专业游泳+足球培训，Baby班到竞技队都有',addr:'Al Barsha / JVC',phone:'+971 50 785 0440',hours:'需预约',cost:'250-400 AED/月',rating:4.5,tags:['游泳','专业','长期'],outdoor:true,mapQ:'Elite+Sports+Academy+Dubai',bookUrl:'https://elitesports.ae',tip:'试课免费'},
    {emoji:'🎾',name:'JAM Sports综合',desc:'900+学员综合体育学院，足球/网球/游泳/田径',addr:'Al Barsha / DWTC',phone:'+971 50 654 5478',hours:'需预约',cost:'200-350 AED/月',rating:4.3,tags:['综合','足球','网球'],outdoor:true,mapQ:'JAM+Sports+Academy+Dubai',bookUrl:'https://jamsportsacademy.com',tip:'Multi-Sport Camp暑假必报'},
    {emoji:'🥋',name:'Ace Sports武术',desc:'足球/篮球/空手道/体操/MMA',addr:'Mirdif',phone:'+971 55 452 2066',hours:'需预约',cost:'150-300 AED/月',rating:4.2,tags:['格斗','多运动'],outdoor:false,mapQ:'Ace+Sports+Academy',bookUrl:'https://acesportsacademy.com',tip:'空手道和体操课特别好'},
    {emoji:'🤸',name:'BOUNCE蹦床',desc:'巨大蹦床公园，Freestyle/Dodgeball/Slam Dunk',addr:'Al Quoz Industrial 4',phone:'+971 4 321 1400',hours:'10am-10pm',cost:'80-120 AED/人',rating:4.4,tags:['蹦床','刺激','亲子','已核实✓'],outdoor:false,mapQ:'BOUNCE+Dubai+Al+Quoz',bookUrl:'https://bounceinc.ae',tip:'Party套餐适合生日'},
    {emoji:'🏋️',name:'LionHeart Sports',desc:'足球/篮球/体操/游泳/网球专业教练',addr:'多个地点',phone:'+971 52 917 5340',hours:'需预约',cost:'200-350 AED/月',rating:4.4,tags:['专业','多运动','教练好'],outdoor:true,mapQ:'LionHeart+Sports+Dubai',bookUrl:'https://lionheartsports.academy',tip:'Holiday Camp假期首选'},
    {emoji:'🏸',name:'Al Nasr羽毛球',desc:'迪拜华人羽毛球群很活跃，这里场地最好',addr:'Al Nasr Leisureland, Oud Metha',phone:'+971 4 337 1234',hours:'7am-11pm',cost:'50-80 AED/时',rating:4.1,tags:['羽毛球','华人','社交'],outdoor:false,mapQ:'Al+Nasr+Leisureland+badminton',bookUrl:'',tip:'加入华人羽毛球群认识朋友'},
    {emoji:'🏌️',name:'Topgolf Dubai',desc:'高科技打球+吃饭+社交，不会打也好玩',addr:'Emirates Golf Club',phone:'+971 4 390 7777',hours:'10am-12am',cost:'150 AED/时+餐',rating:4.5,tags:['高尔夫','社交','夜间'],outdoor:true,mapQ:'Topgolf+Dubai',bookUrl:'https://topgolf.com/ae/dubai',tip:'Happy Hour有优惠'},
    {emoji:'🧘',name:'免费户外瑜伽',desc:'Kite Beach和JLT湖边经常有社区免费瑜伽',addr:'JLT Lakes / Kite Beach',phone:'',hours:'早上7-8am',cost:'免费',rating:4.0,tags:['免费','健康','社交'],outdoor:true,mapQ:'free+outdoor+yoga+Dubai',bookUrl:'',tip:'关注Instagram社群获取时间'},
    {emoji:'🏊',name:'Hamdan Sports Complex',desc:'奥运级游泳馆，两个50米泳池（注意：公共泳池需18+）',addr:'Al Nasr, Oud Metha',phone:'+971 4 306 2666',hours:'6am-10pm',cost:'约60 AED/次',rating:4.2,tags:['游泳','奥运级','18+公共池','已核实✓'],outdoor:false,mapQ:'Hamdan+Sports+Complex+Dubai',bookUrl:'',tip:'公共池需18+，儿童需报培训班'},
    {emoji:'🚴',name:'Al Qudra骑行道',desc:'专用自行车道+湖泊+火烈鸟，迪拜骑行圣地',addr:'Al Qudra, Exit D63',phone:'',hours:'全天',cost:'免费/租车100',rating:4.6,tags:['免费','骑行','自然'],outdoor:true,mapQ:'Al+Qudra+Cycle+Track',bookUrl:'',tip:'带足水，湖边看火烈鸟'},
    {emoji:'🏄',name:'Surf House',desc:'室内冲浪体验，初学者友好，教练全程指导',addr:'Villa 110, Al Soon St, Umm Suqeim 2',phone:'+971 50 504 3020',hours:'需预约',cost:'160-275 AED',rating:4.3,tags:['冲浪','刺激','Umm Suqeim','已核实✓'],outdoor:false,mapQ:'Surf+House+Dubai+Umm+Suqeim',bookUrl:'',tip:'不在JBR，在Umm Suqeim'},
    {emoji:'⛸️',name:'Dubai Ice Rink',desc:'Dubai Mall奥运级冰场，租鞋即可',addr:'Dubai Mall Ground Floor',phone:'+971 800 382 246 255',hours:'10am-12am',cost:'80 AED/人',rating:4.3,tags:['溜冰','室内','随时'],outdoor:false,mapQ:'Dubai+Ice+Rink+Mall',bookUrl:'',tip:'穿厚袜子'},
    {emoji:'🏊',name:'Aqua Fun充气水上乐园',desc:'JBR海面上的巨型充气水上障碍赛，超好玩',addr:'The Beach, JBR',phone:'+971 54 522 6663',hours:'10am-6pm',cost:'100 AED/人',rating:4.3,tags:['水上','刺激','JBR','已核实✓'],outdoor:true,mapQ:'Aqua+Fun+JBR+Dubai',bookUrl:'',tip:'穿水鞋，防晒必备'},
    {emoji:'🪂',name:'iFLY室内跳伞',desc:'模拟自由落体体验，3岁以上都能玩',addr:'3F Play Nation, City Centre Mirdif',phone:'+971 4 231 6292',hours:'10am-10pm',cost:'149 AED起',rating:4.4,tags:['跳伞','刺激','室内','已核实✓'],outdoor:false,mapQ:'iFLY+Dubai',bookUrl:'https://www.iflyworld.ae',tip:'基础票149，高级套餐更贵'},
    {emoji:'⛳',name:'Five Iron Golf迷你高尔夫',desc:'4月底前免费无限迷你高尔夫！9洞户外球场俯瞰Marina',addr:'Westin Dubai Mina Seyahi Beach Resort & Marina',phone:'+971 4 396 6867',hours:'需预约',cost:'免费(至4/30)',rating:4.3,tags:['免费🔥','高尔夫','亲子','限时','已核实✓'],outdoor:true,mapQ:'Five+Iron+Golf+Dubai',bookUrl:'https://www.fiveirongolf.ae',tip:'免费到4月30日！餐饮套餐可选，全家适合',dist:1},
  ]
},

// ==================== 📚 学习成长 (14) ====================
learning: {
  label: '📚 学习成长', color: 'var(--accent3)',
  items: [
    {emoji:'📖',name:'MBR图书馆',desc:'全球最美图书馆之一，免费儿童区+故事时间',addr:'Al Jaddaf, Culture Village',phone:'+971 4 282 0202',hours:'周六-周四 8am-9pm',cost:'免费',rating:4.8,tags:['免费','图书馆','儿童区'],outdoor:false,mapQ:'Mohammed+Bin+Rashid+Library',bookUrl:'https://www.mbrl.ae',tip:'每周免费故事会和手工'},
    {emoji:'🔬',name:'OliOli儿童博物馆',desc:'8个互动画廊专为2-11岁设计',addr:'Al Quoz 1',phone:'+971 4 702 7300',hours:'9am-7pm',cost:'120 AED',rating:4.6,tags:['互动','教育','2-11岁'],outdoor:false,mapQ:'OliOli+museum+Dubai',bookUrl:'https://olioli.ae',tip:'Water Gallery带换洗衣服'},
    {emoji:'🎭',name:'KidZania职业体验',desc:'40+职业体验，赚KidZania货币',addr:'Dubai Mall Level 2',phone:'+971 4 448 5222',hours:'10am-10pm',cost:'150 AED',rating:4.5,tags:['职业','角色扮演','教育'],outdoor:false,mapQ:'KidZania+Dubai+Mall',bookUrl:'https://dubai.kidzania.com',tip:'消防员和飞行员最抢手'},
    {emoji:'💻',name:'Logics编程',desc:'Scratch/Python少儿编程，7-16岁',addr:'JVC / 线上',phone:'+971 4 247 8887',hours:'需预约',cost:'200-300 AED/课',rating:4.3,tags:['编程','STEM','线上可'],outdoor:false,mapQ:'Logics+Academy+Dubai',bookUrl:'https://logicsacademy.com',tip:'Scratch适合7-9岁入门'},
    {emoji:'🎹',name:'Dubai Music School',desc:'钢琴/吉他/尤克里里/小提琴，可上门教',addr:'JLT/Marina可上门',phone:'+971 4 360 5508',hours:'需预约',cost:'150-200 AED/课',rating:4.2,tags:['音乐','上门','一对一'],outdoor:false,mapQ:'Dubai+Music+School',bookUrl:'',tip:'尤克里里入门推荐'},
    {emoji:'🎨',name:'The Jam Jar画画',desc:'Al Quoz自助画室，无需基础，全家自由创作带回家',addr:'Alserkal Avenue, Al Quoz 1',phone:'+971 4 341 7303',hours:'10am-8pm',cost:'120-180 AED/人',rating:4.3,tags:['绘画','自助','亲子','已核实✓'],outdoor:false,mapQ:'The+Jam+Jar+Alserkal+Avenue+Dubai',bookUrl:'',tip:'自己选画布和颜料，享受过程'},
    {emoji:'♟️',name:'Dubai Chess Club',desc:'国际象棋俱乐部，提升逻辑思维',addr:'多个地点',phone:'+971 50 555 4040',hours:'需预约',cost:'50 AED/次',rating:4.1,tags:['象棋','智力','社交'],outdoor:false,mapQ:'chess+club+Dubai+kids',bookUrl:'',tip:'每月有比赛'},
    {emoji:'🧁',name:'亲子烘焙课',desc:'和孩子一起学做蛋糕饼干，多家有周末班',addr:'多个地点',phone:'',hours:'周末',cost:'150-250 AED/课',rating:4.2,tags:['烘焙','亲子','美食'],outdoor:false,mapQ:'kids+baking+class+Dubai',bookUrl:'',tip:'Sugar Moo和SCAFA都不错'},
    {emoji:'📸',name:'亲子摄影课',desc:'学习手机拍照技巧，一起记录家庭生活',addr:'多个地点',phone:'',hours:'周末',cost:'200 AED/课',rating:4.0,tags:['摄影','技能','亲子'],outdoor:true,mapQ:'photography+class+Dubai+family',bookUrl:'',tip:'金色时段练习最好'},
    {emoji:'🌍',name:'阿拉伯语体验课',desc:'在迪拜学阿拉伯语基础，孩子学得超快',addr:'多个地点 / 线上',phone:'',hours:'需预约',cost:'150 AED/课',rating:4.0,tags:['语言','文化','技能'],outdoor:false,mapQ:'Arabic+class+kids+Dubai',bookUrl:'',tip:'日常用语3个月就能对话'},
    {emoji:'🎨',name:'Art Jamming画画',desc:'无需基础，全家自由创作油画带回家',addr:'Al Quoz / JBR',phone:'',hours:'10am-8pm',cost:'150 AED/人',rating:4.2,tags:['创意','亲子','轻松'],outdoor:false,mapQ:'art+jamming+Dubai+family',bookUrl:'',tip:'不需要画功，享受过程'},
    {emoji:'🎬',name:'Leo & Loona',desc:'20+互动景点+10+创意工坊，2-10岁',addr:'Dubai Festival City Mall, 2nd Floor, South Entrance',phone:'+971 4 237 5454',hours:'10am-9pm',cost:'100-150 AED',rating:4.3,tags:['互动','创意','Festival City','已核实✓'],outdoor:false,mapQ:'Leo+Loona+Dubai+Festival+City',bookUrl:'',tip:'蹦床+球池+攀岩+手工一站式'},
  ]
},

// ==================== 🎢 亲子乐园 (14) ====================
kids_venues: {
  label: '🎢 亲子乐园', color: '#a855f7',
  items: [
    {emoji:'🎢',name:'IMG冒险世界',desc:'全球最大室内主题公园，漫威+恐龙+CN',addr:'City of Arabia, E311',phone:'+971 4 403 8888',hours:'12pm-10pm',cost:'365 AED/人',rating:4.5,tags:['主题公园','室内','全天'],outdoor:false,mapQ:'IMG+Worlds+Adventure',bookUrl:'https://www.imgworlds.com',tip:'在线买票便宜30%',fazaa:'Fazaa特价129 AED（省236）'},
    {emoji:'🏊',name:'Wild Wadi水上乐园',desc:'帆船酒店旁30+滑道，有专门儿童池',addr:'Umm Suqeim 3',phone:'+971 4 348 4444',hours:'10am-6pm',cost:'250-300 AED/人',rating:4.6,tags:['水上乐园','必去'],outdoor:true,mapQ:'Wild+Wadi+Waterpark',bookUrl:'https://www.wildwadi.com',tip:'开园就去人少',fazaa:'Fazaa 50% off'},
    {emoji:'🏋️',name:'House of Hype',desc:'100+体验！50种游戏+18沉浸区，Dubai Mall新开',addr:'Dubai Mall Chinatown',phone:'+971 4 325 6000',hours:'10am-12am',cost:'150 AED/人',rating:4.3,tags:['新开🔥','游戏','沉浸'],outdoor:false,mapQ:'House+of+Hype+Dubai+Mall',bookUrl:'',tip:'2024底新开，还不算太挤'},
    {emoji:'🐻',name:'Loco Bear乐园',desc:'6500平米巨型室内：蹦床+激光+保龄+VR',addr:'Al Warqa / Mirdif',phone:'+971 4 284 4488',hours:'10am-10pm',cost:'100-180 AED',rating:4.2,tags:['室内','综合','大'],outdoor:false,mapQ:'Loco+Bear+Dubai',bookUrl:'',tip:'可以玩3-4小时'},
    {emoji:'🎠',name:'Motiongate Dubai',desc:'蓝精灵/怪物史莱克/功夫熊猫',addr:'Dubai Parks, Jebel Ali',phone:'+971 4 820 0000',hours:'11am-8pm',cost:'250 AED/人',rating:4.4,tags:['好莱坞','全天'],outdoor:true,mapQ:'Motiongate+Dubai',bookUrl:'https://www.motiongatedubai.com',tip:'经常有买一赠一',fazaa:'Fazaa特价179 AED（省151）'},
    {emoji:'⛸️',name:'Ski Dubai',desc:'Mall of Emirates里的室内滑雪场，企鹅互动',addr:'Mall of the Emirates',phone:'+971 800 386 386',hours:'10am-11pm',cost:'200-350 AED',rating:4.5,tags:['滑雪','企鹅','室内','已核实✓'],outdoor:false,mapQ:'Ski+Dubai',bookUrl:'https://www.skidxb.com',tip:'企鹅互动体验孩子超爱'},
    {emoji:'🐠',name:'Dubai Aquarium',desc:'Dubai Mall巨型水族馆，可以喂鲨鱼',addr:'Ground Floor, Dubai Mall',phone:'+971 4 448 5200',hours:'10am-12am',cost:'140 AED起',rating:4.5,tags:['水族馆','震撼','已核实✓'],outdoor:false,mapQ:'Dubai+Aquarium',bookUrl:'https://www.thedubaiaquarium.com',tip:'Tunnel+Zoo联票140起'},
    {emoji:'🎈',name:'Ribambelle',desc:'Bluewaters岛丛林主题乐园+家庭餐厅，1000平米滑梯球池',addr:'The Wharf, Bluewaters Island',phone:'+971 4 581 5555',hours:'10am-10pm',cost:'100-150 AED',rating:4.3,tags:['球池','Bluewaters','已核实✓'],outdoor:false,mapQ:'Ribambelle+Bluewaters+Dubai',bookUrl:'',tip:'家长可以喝鸡尾酒看孩子玩'},
    {emoji:'🎪',name:'Air Maniax充气公园',desc:'迪拜最大充气乐园，障碍赛+蹦跳',addr:'Arabian Centre / Al Quoz',phone:'+971 4 348 8981',hours:'10am-10pm',cost:'80-120 AED',rating:4.2,tags:['充气','刺激','多地点','已核实✓'],outdoor:false,mapQ:'Air+Maniax+Dubai',bookUrl:'',tip:'穿袜子，周中人少（Al Quoz: 04 348 8981）'},
    {emoji:'🌊',name:'Atlantis Aquaventure',desc:'超大水上乐园+水族馆，滑道最刺激',addr:'Palm Jumeirah',phone:'+971 4 426 2000',hours:'10am-6pm',cost:'300-400 AED',rating:4.7,tags:['水上乐园','顶级','已核实✓'],outdoor:true,mapQ:'Aquaventure+Waterpark+Dubai',bookUrl:'https://www.atlantis.com/aquaventure',tip:'全天玩不完，带防晒',fazaa:'Fazaa有折扣'},
    {emoji:'🎡',name:'Ain Dubai摩天轮',desc:'全球最大摩天轮，Bluewaters Island夜景震撼',addr:'Bluewaters Island',phone:'+971 800 362 4246',hours:'12pm-10pm',cost:'130 AED/人',rating:4.4,tags:['地标','夜景','家庭'],outdoor:true,mapQ:'Ain+Dubai',bookUrl:'https://www.aindubai.com',tip:'傍晚最佳'},
    {emoji:'🎮',name:'Play DXB (原VR Park)',desc:'已改名Play DXB，免费入场，单项15-45 AED/次',addr:'Level 2, Dubai Mall',phone:'+971 800 382246255',hours:'10am-12am',cost:'免费入场/单项15-45 AED',rating:4.1,tags:['VR','科技','室内','已核实✓'],outdoor:false,mapQ:'Play+DXB+Dubai+Mall',bookUrl:'',tip:'已从VR Park改名为Play DXB'},
    {emoji:'🏎️',name:'Dubai Autodrome卡丁车',desc:'室外赛道，9岁以上可独立驾驶，多种体验可选',addr:'Motor City, Sheikh Mohammed Bin Zayed Rd',phone:'+971 4 367 8700',hours:'8am-11pm',cost:'60-250 AED(视项目)',rating:4.4,tags:['卡丁车','刺激','9+','已核实✓'],outdoor:true,mapQ:'Dubai+Autodrome',bookUrl:'https://www.dubaiautodrome.ae',tip:'激光枪60起，卡丁车和赛车体验更贵'},
    {emoji:'🧗',name:'Clip\'n Climb攀岩',desc:'彩色攀岩墙，4岁以上OK（⚠️无法确认是否仍营业，请先电话确认）',addr:'Al Quoz (待确认)',phone:'',hours:'待确认',cost:'80-100 AED',rating:0,tags:['攀岩','室内','⚠️待确认'],outdoor:false,mapQ:'Clip+n+Climb+Dubai',bookUrl:'https://www.clipnclimbdubai.com',tip:'去之前请先通过官网确认是否营业'},
  ]
},

// ==================== 🌿 自然户外 (14) ====================
nature: {
  label: '🌿 自然户外', color: '#22c55e',
  items: [
    {emoji:'🌺',name:'Miracle Garden',desc:'1.5亿朵花，巨型飞机花雕+迪士尼花园',addr:'Al Barsha South 3',phone:'+971 4 422 8902',hours:'9am-9pm',cost:'55 AED',rating:4.5,tags:['拍照','11-5月','地标'],outdoor:true,mapQ:'Dubai+Miracle+Garden',bookUrl:'https://www.dubaimiraclegarden.com',tip:'下午4点后不晒',fazaa:'Fazaa有折扣'},
    {emoji:'🦎',name:'Dubai Safari Park',desc:'2500+动物，Safari巴士穿非洲区',addr:'Al Warqa 5',phone:'+971 800 900',hours:'9am-5pm',cost:'50 AED',rating:4.3,tags:['动物','Safari'],outdoor:true,mapQ:'Dubai+Safari+Park',bookUrl:'https://www.dubaisafari.ae',tip:'买Explorer套票',fazaa:'Fazaa有折扣'},
    {emoji:'🏔️',name:'Hatta山区',desc:'皮划艇+徒步+蜜蜂花园+溜索',addr:'Hatta, Dubai',phone:'+971 800 637 227',hours:'全天',cost:'免费-100 AED',rating:4.6,tags:['徒步','皮划艇','全天'],outdoor:true,mapQ:'Hatta+Dubai',bookUrl:'https://visithatta.com',tip:'带午餐野餐'},
    {emoji:'🦩',name:'Ras Al Khor火烈鸟',desc:'免费！成百上千只粉色火烈鸟',addr:'Ras Al Khor Rd',phone:'+971 4 606 6822',hours:'7:30am-4pm',cost:'免费',rating:4.4,tags:['免费','自然','拍照'],outdoor:true,mapQ:'Ras+Al+Khor+flamingo',bookUrl:'',tip:'带望远镜，上午最好'},
    {emoji:'🦋',name:'蝴蝶园',desc:'1.5万只蝴蝶，紧邻Miracle Garden',addr:'Al Barsha South 3',phone:'+971 4 422 8902',hours:'9am-6pm',cost:'55 AED',rating:4.2,tags:['蝴蝶','室内','亲子'],outdoor:false,mapQ:'Dubai+Butterfly+Garden',bookUrl:'',tip:'联票80 AED省25%'},
    {emoji:'🐪',name:'骆驼骑行体验',desc:'日落骆驼骑行，孩子最兴奋的体验',addr:'Al Marmoom, Al Ain Rd',phone:'+971 4 832 6826',hours:'需预约',cost:'150 AED/人',rating:4.5,tags:['沙漠','体验','日落'],outdoor:true,mapQ:'camel+riding+Dubai',bookUrl:'',tip:'日落前1小时到'},
    {emoji:'🏖️',name:'Kite Beach',desc:'免费海滩，有滑板公园+蹦床+餐车',addr:'Umm Suqeim, Jumeirah',phone:'',hours:'全天',cost:'免费',rating:4.5,tags:['免费','海滩','亲子','已核实✓'],outdoor:true,mapQ:'Kite+Beach+Dubai',bookUrl:'',tip:'下午4点后最佳'},
    {emoji:'🌴',name:'Al Barsha Pond Park',desc:'免费！50英亩有池塘+跑道+儿童区',addr:'Al Barsha',phone:'',hours:'8am-11pm',cost:'免费',rating:4.2,tags:['免费','公园','跑步','已核实✓'],outdoor:true,mapQ:'Al+Barsha+Pond+Park',bookUrl:'',tip:'1.5英里环湖道很适合跑步'},
    {emoji:'🏖️',name:'Al Mamzar Beach Park',desc:'超大海滩公园，可以BBQ，泳池+沙滩+草地',addr:'Al Mamzar',phone:'+971 4 296 6201',hours:'8am-10pm',cost:'5 AED',rating:4.3,tags:['海滩','BBQ','超值','已核实✓'],outdoor:true,mapQ:'Al+Mamzar+Beach+Park',bookUrl:'',tip:'有4个海滩+2个泳池'},
    {emoji:'🌳',name:'Mushrif Park',desc:'骑马+小动物农场+游乐场+BBQ',addr:'Al Khawaneej',phone:'+971 4 288 3624',hours:'8am-10pm',cost:'3 AED/人（NOL卡付）',rating:4.3,tags:['公园','骑马','BBQ','已核实✓'],outdoor:true,mapQ:'Mushrif+Park+Dubai',bookUrl:'',tip:'3 AED入场，需NOL卡'},
    {emoji:'🌴',name:'Zabeel Park',desc:'市中心大公园，小火车+恐龙乐园+BBQ区',addr:'Zabeel, near DIFC',phone:'+971 4 398 6888',hours:'8am-10pm',cost:'5 AED',rating:4.2,tags:['公园','恐龙','市中心','已核实✓'],outdoor:true,mapQ:'Zabeel+Park+Dubai',bookUrl:'',tip:'小火车孩子很爱'},
    {emoji:'🌊',name:'La Mer海滨区',desc:'文艺海滩区，涂鸦墙+餐厅+水上乐园',addr:'Jumeirah 1',phone:'',hours:'10am-12am',cost:'免费',rating:4.3,tags:['免费','拍照','海滩'],outdoor:true,mapQ:'La+Mer+Dubai',bookUrl:'',tip:'涂鸦墙拍照超出片'},
    {emoji:'🦎',name:'Green Planet热带雨林',desc:'室内热带雨林Bio-dome，3000+动植物，4层楼高',addr:'City Walk, Al Wasl',phone:'+971 800 7699',hours:'10am-7pm',cost:'120 AED',rating:4.3,tags:['室内','热带','动物','已核实✓'],outdoor:false,mapQ:'Green+Planet+City+Walk+Dubai',bookUrl:'https://www.thegreenplanetdubai.com',tip:'可以摸树懒和蛇'},
    {emoji:'🏖️',name:'Safa Park',desc:'JLT最近的大公园之一，湖+瀑布+儿童区',addr:'Al Wasl, Jumeirah',phone:'+971 4 349 2111',hours:'8am-10pm',cost:'3 AED',rating:4.2,tags:['公园','近','散步','已核实✓'],outdoor:true,mapQ:'Safa+Park+Dubai',bookUrl:'',tip:'3 AED入场超值'},
  ]
},

// ==================== 🚗 周边短途 (10) ====================
daytrips: {
  label: '🚗 周边短途', color: '#14b8a6',
  items: [
    {emoji:'🕌',name:'阿布扎比大清真寺',desc:'全球最美清真寺之一+卢浮宫分馆',addr:'Abu Dhabi',phone:'+971 2 419 1919',hours:'9am-10pm',cost:'免费+卢浮宫63',rating:4.9,tags:['必去','文化','壮观'],outdoor:true,mapQ:'Sheikh+Zayed+Grand+Mosque',bookUrl:'',tip:'女性需长袖长裤头巾'},
    {emoji:'🏔️',name:'Jebel Jais滑索',desc:'世界最长高空滑索！2.8公里飞越山谷',addr:'Jebel Jais, RAK',phone:'+971 7 203 0300',hours:'需预约',cost:'400 AED/人',rating:4.7,tags:['刺激','世界之最'],outdoor:true,mapQ:'Jebel+Jais+zipline',bookUrl:'https://www.visitjebeljais.com',tip:'12岁+，32kg以上'},
    {emoji:'🌊',name:'Fujairah浮潜',desc:'印度洋清澈海水，Snoopy Island能看海龟',addr:'Sandy Beach, Fujairah',phone:'',hours:'全天',cost:'油费+150 AED',rating:4.5,tags:['浮潜','海滩','全天'],outdoor:true,mapQ:'Snoopy+Island+Fujairah',bookUrl:'',tip:'游到小岛只要15分钟'},
    {emoji:'⛵',name:'Musandam峡湾',desc:'阿曼飞地，挪威式峡湾+海豚+浮潜',addr:'Musandam, Oman',phone:'',hours:'全天团',cost:'300-500 AED/人',rating:4.6,tags:['壮观','海豚','需护照'],outdoor:true,mapQ:'Musandam+dhow+cruise',bookUrl:'',tip:'带护照，晕船提前吃药'},
    {emoji:'🏜️',name:'Mleiha考古探险',desc:'远古遗址，沙漠探索+星空观测',addr:'Mleiha, Sharjah',phone:'+971 6 510 2250',hours:'9am-7pm',cost:'100 AED/人',rating:4.3,tags:['考古','沙漠','星空'],outdoor:true,mapQ:'Mleiha+Sharjah',bookUrl:'',tip:'下午去留到天黑看星空'},
    {emoji:'🏖️',name:'Ajman安静海滩',desc:'30分钟车程，人少水清比迪拜安静',addr:'Ajman Corniche',phone:'',hours:'全天',cost:'油费',rating:4.1,tags:['海滩','近','人少'],outdoor:true,mapQ:'Ajman+beach',bookUrl:'',tip:'周末早上去带帐篷'},
    {emoji:'🦈',name:'Sharjah水族馆',desc:'比Dubai Aquarium便宜很多，也很精彩',addr:'Al Meena, Sharjah',phone:'+971 6 528 5288',hours:'8am-8pm',cost:'25 AED',rating:4.2,tags:['水族馆','便宜','Sharjah'],outdoor:false,mapQ:'Sharjah+Aquarium',bookUrl:'',tip:'旁边有海洋博物馆联票'},
    {emoji:'🏰',name:'Louvre Abu Dhabi',desc:'世界级艺术博物馆，建筑本身就是艺术品',addr:'Saadiyat Island, Abu Dhabi',phone:'+971 600 565 566',hours:'10am-6:30pm',cost:'63 AED',rating:4.7,tags:['艺术','建筑','世界级'],outdoor:false,mapQ:'Louvre+Abu+Dhabi',bookUrl:'https://www.louvreabudhabi.ae',tip:'预留3小时，雨穹顶必看'},
    {emoji:'🦁',name:'Al Ain Zoo',desc:'4000+动物，Safari穿越非洲区，比迪拜Safari更大',addr:'Al Ain, Abu Dhabi',phone:'+971 3 799 2000',hours:'9am-8pm',cost:'成人30 AED / 儿童10 AED',rating:4.4,tags:['动物园','大','Al Ain','已核实✓'],outdoor:true,mapQ:'Al+Ain+Zoo',bookUrl:'https://www.alainzoo.ae',tip:'Sheikh Zayed Desert Experience'},
    {emoji:'⛺',name:'Big Red沙漠',desc:'自驾就能到的沙丘，玩沙+日落+烧烤',addr:'Hatta-Sharjah Rd',phone:'',hours:'全天',cost:'免费',rating:4.3,tags:['沙漠','免费','日落'],outdoor:true,mapQ:'Big+Red+Desert+Dubai',bookUrl:'',tip:'下午4点出发看日落'},
  ]
},

// ==================== 🌙 约会夜生活 (12) ====================
nightlife: {
  label: '🌙 约会夜生活', color: '#f97316',
  items: [
    {emoji:'🌃',name:'哈利法塔夜景',desc:'124层看全城夜景',addr:'Downtown Dubai',phone:'+971 4 888 8888',hours:'8:30am-11pm',cost:'150-400 AED',rating:4.7,tags:['地标','夜景','约会'],outdoor:false,mapQ:'Burj+Khalifa+At+The+Top',bookUrl:'https://www.burjkhalifa.ae',tip:'日落时段最值'},
    {emoji:'🎭',name:'Dubai Opera',desc:'歌剧/芭蕾/演唱会',addr:'Downtown Dubai',phone:'+971 4 440 8888',hours:'视演出',cost:'200-600 AED',rating:4.8,tags:['表演','高雅'],outdoor:false,mapQ:'Dubai+Opera',bookUrl:'https://www.dubaiopera.com',tip:'提前1个月买票'},
    {emoji:'🎤',name:'Lucky Voice KTV',desc:'包房KTV，有中英文歌库',addr:'Grand Millennium, DIFC',phone:'+971 4 321 7798',hours:'6pm-2am',cost:'100-200 AED/人',rating:4.1,tags:['KTV','中文歌','社交'],outdoor:false,mapQ:'Lucky+Voice+Dubai',bookUrl:'',tip:'周二Ladies Night半价'},
    {emoji:'🍿',name:'露天电影',desc:'Rooftop Cinema+Bean Bag，浪漫约会',addr:'Galleria Mall',phone:'+971 4 346 9000',hours:'季节性晚场',cost:'100 AED/人',rating:4.3,tags:['浪漫','季节性'],outdoor:true,mapQ:'rooftop+cinema+Dubai',bookUrl:'',tip:'冬季最佳'},
    {emoji:'🛥️',name:'Marina Dinner Cruise',desc:'2小时游船+晚餐，看Marina全部夜景',addr:'Marina Walk Pier 7',phone:'+971 50 744 2800',hours:'晚8:30',cost:'200-400 AED',rating:4.4,tags:['浪漫','游船','夜景'],outdoor:true,mapQ:'Dubai+Marina+dinner+cruise',bookUrl:'',tip:'提前订靠窗位'},
    {emoji:'🍷',name:'Barasti Beach Bar',desc:'Le Meridien旁海滩酒吧，现场音乐+海风',addr:'Le Meridien Mina Seyahi',phone:'+971 4 318 1313',hours:'11am-3am',cost:'100-300 AED',rating:4.2,tags:['海滩','音乐','氛围'],outdoor:true,mapQ:'Barasti+Beach+Bar',bookUrl:'',tip:'周四周五最热闹'},
    {emoji:'🖼️',name:'Alserkal Avenue',desc:'画廊+咖啡+独立书店，文艺约会',addr:'Al Quoz Industrial 1',phone:'',hours:'10am-7pm',cost:'免费',rating:4.4,tags:['艺术','咖啡','免费'],outdoor:false,mapQ:'Alserkal+Avenue+Dubai',bookUrl:'https://alserkal.online',tip:'白天去，配杯咖啡慢慢逛'},
    {emoji:'🍽️',name:'随机菜系晚餐',desc:'每次选不同国家：日/意/黎/印/泰/格鲁吉亚',addr:'全迪拜',phone:'',hours:'晚上',cost:'200-400 AED/两人',rating:0,tags:['冒险','约会','惊喜'],outdoor:false,mapQ:'best+restaurants+Dubai',bookUrl:'',tip:'转盘选菜系！'},
    {emoji:'💆',name:'Spa双人套餐',desc:'JLT/Marina附近多家Spa有双人套餐',addr:'JLT / Marina区域',phone:'',hours:'需预约',cost:'300-500 AED/两人',rating:4.1,tags:['放松','Spa','双人'],outdoor:false,mapQ:'couple+spa+JLT+Marina',bookUrl:'',tip:'找双人套餐更划算'},
    {emoji:'🚶',name:'JLT湖边夜散步',desc:'下楼即到，买杯外带咖啡聊聊天',addr:'JLT Lakes',phone:'',hours:'全天',cost:'免费',rating:4.0,tags:['免费','浪漫','近'],outdoor:true,mapQ:'JLT+Lakes+Dubai',bookUrl:'',tip:'最简单最浪漫'},
    {emoji:'☕',name:'精品咖啡探店',desc:'每次去一家新的：Nightjar/RAW/%Arabica',addr:'多个地点',phone:'',hours:'白天',cost:'50-100 AED',rating:4.3,tags:['咖啡','探店','约会'],outdoor:false,mapQ:'specialty+coffee+Dubai',bookUrl:'',tip:'做一张咖啡地图打卡'},
    {emoji:'🎲',name:'桌游咖啡馆',desc:'约朋友或两人一起玩桌游',addr:'多个地点',phone:'',hours:'下午/晚上',cost:'50-100 AED',rating:4.0,tags:['社交','室内','放松'],outdoor:false,mapQ:'board+game+cafe+Dubai',bookUrl:'',tip:'先选好想玩的游戏'},
  ]
},

// ==================== 🔥 最新热门 (10) ====================
trending: {
  label: '🔥 最新热门', color: 'var(--danger)',
  items: [
    {emoji:'🎪',name:'Harvest Festival',desc:'Al Wasl Dome复活节集市，猎蛋+弹跳堡+手工',addr:'Expo City Dubai',phone:'',hours:'活动期间',cost:'视活动',rating:0,tags:['2026春🔥','限时','亲子'],outdoor:true,mapQ:'Harvest+Festival+Dubai+2026',bookUrl:'',tip:'关注@expocitydubai'},
    {emoji:'🎶',name:'In the Park音乐节',desc:'世界级音乐节！Hills Family Zone有儿童活动',addr:'Dubai Hills Park',phone:'',hours:'活动期间',cost:'300+ AED',rating:0,tags:['2026🔥','音乐节','家庭区'],outdoor:true,mapQ:'In+the+Park+Dubai+2026',bookUrl:'',tip:'带孩子去Family Zone'},
    {emoji:'🏨',name:'Ciel全球最高酒店',desc:'82层377米，全球最高无边泳池+61层Spa',addr:'Dubai Marina',phone:'+971 4 407 8888',hours:'全天',cost:'下午茶200+',rating:0,tags:['2026新🔥','地标','Marina'],outdoor:false,mapQ:'Ciel+Dubai+Marina',bookUrl:'',tip:'不住也可以去喝下午茶'},
    {emoji:'🍫',name:'Fix巧克力全球爆红',desc:'开心果Kunafa巧克力棒全球排队疯抢',addr:'多个地点',phone:'+971 50 524 5924',hours:'10am-10pm',cost:'25-60 AED',rating:4.7,tags:['爆款🔥','巧克力','伴手礼'],outdoor:false,mapQ:'Fix+Dessert+Chocolatier',bookUrl:'',tip:'Can\'t Get Knafeh Of It'},
    {emoji:'🥐',name:'Knot Bakehouse走红',desc:'2024新开的手工烘焙，酸面包+创意甜品',addr:'Jumeirah Water Canal',phone:'+971 4 344 0222',hours:'7am-8pm',cost:'40-70 AED',rating:4.5,tags:['新开🔥','面包','手工'],outdoor:true,mapQ:'Knot+Bakehouse+Dubai',bookUrl:'',tip:'可颂和酸面包必买'},
    {emoji:'🏊',name:'AURA Skypool免费票',desc:'Palm Tower 50层360度无边泳池！送10000张免费票(需最低消费)',addr:'Palm Tower, Palm Jumeirah',phone:'',hours:'每日开放',cost:'免费入场(最低消费100-200 AED)',rating:4.4,tags:['免费🔥','泳池','景色','限时','已核实✓'],outdoor:true,mapQ:'AURA+Skypool+Palm+Jumeirah',bookUrl:'https://auraskypool.com',tip:'免费至5月31日！早场/晚场最低消费100 AED，下午200 AED',dist:2},
    {emoji:'🧴',name:'Lush免费儿童手工',desc:'4月底前Lush门店免费儿童手工活动！做香皂/种植/手工',addr:'Mall of Emirates / Dubai Mall / Ibn Battuta等',phone:'',hours:'放学后时段',cost:'免费',rating:0,tags:['免费🔥','亲子','手工','限时','已核实✓'],outdoor:false,mapQ:'Lush+Mall+of+Emirates+Dubai',bookUrl:'https://www.lush.com/mena/en_ae/shops',tip:'无需预约直接Walk-in，活动因店而异，4月30日截止',dist:1},
  ]
},

// ==================== 🥢 米其林必比登 + 中餐 (新增验证) ====================
michelin_chinese: {
  label: '⭐ 米其林/中餐', color: '#c41200',
  items: [
    {emoji:'🐟',name:'Goldfish',desc:'米其林必比登！现代日料，Uni和Wagyu出色',addr:'Galleria Mall, 403 Al Wasl Rd, Jumeirah 1',phone:'+971 4 886 4966',hours:'12pm-11pm',cost:'150-250 AED/人',rating:4.5,tags:['米其林Bib','日料','已核实✓'],outdoor:false,mapQ:'Goldfish+Galleria+Mall+Dubai',bookUrl:'',tip:'Bib Gourmand 2022-2025连续获奖'},
    {emoji:'🍜',name:'Kinoya',desc:'米其林必比登！MENA 50佳第2名！日式居酒屋+拉面',addr:'P2, Onyx Tower 2, The Greens',phone:'+971 4 220 2920',hours:'12pm-11pm',cost:'100-200 AED/人',rating:4.7,tags:['米其林Bib','MENA第2🔥','拉面','已核实✓'],outdoor:false,mapQ:'Kinoya+The+Greens+Dubai',bookUrl:'',tip:'8种拉面可选，座位不多早去'},
    {emoji:'🍢',name:'REIF Kushiyaki',desc:'米其林必比登！非传统日式串烧，Wagyu蒸包必点',addr:'Dar Wasl Mall, Al Wasl Rd',phone:'+971 4 255 5142',hours:'12pm-11pm',cost:'120-200 AED/人',rating:4.5,tags:['米其林Bib','日料','Walk-in','已核实✓'],outdoor:false,mapQ:'REIF+Kushiyaki+Dar+Wasl+Dubai',bookUrl:'https://www.reifkushiyaki.com/dar-wasl',tip:'只接受Walk-in不预约，Dubai Hills也有店'},
    {emoji:'🇰🇷',name:'Hoe Lee Kow',desc:'米其林必比登！现代韩式BBQ，同REIF主厨出品',addr:'Building 4, Dubai Hills Business Park',phone:'+971 4 255 5142',hours:'12pm-11pm',cost:'120-200 AED/人',rating:4.4,tags:['米其林Bib','韩式','BBQ','已核实✓'],outdoor:false,mapQ:'Hoe+Lee+Kow+Dubai+Hills',bookUrl:'',tip:'Wagyu beef和gochujang salmon'},
    {emoji:'🇮🇷',name:'Berenjak',desc:'米其林必比登！伦敦来的波斯烤肉+mezze',addr:'Dar Wasl Mall, Shop 01, Al Wasl Rd',phone:'+971 4 295 3644',hours:'12pm-11pm',cost:'100-180 AED/人',rating:4.4,tags:['米其林Bib','波斯','伦敦品牌','已核实✓'],outdoor:false,mapQ:'Berenjak+Dar+Wasl+Dubai',bookUrl:'https://berenjak.com/locations/dubai/',tip:'炭烤Kebab和热/冷Mezze'},
    {emoji:'🇱🇧',name:'Bait Maryam',desc:'米其林必比登！JLT家庭式黎巴嫩菜，性价比极高',addr:'Cluster D, JLT',phone:'+971 54 704 4774',hours:'10am-12am',cost:'40-70 AED/人',rating:4.4,tags:['米其林Bib','JLT','黎巴嫩','已核实✓'],outdoor:false,mapQ:'Bait+Maryam+JLT+Dubai',bookUrl:'',tip:'就在JLT！Dish of the Day超值'},
    {emoji:'🍜',name:'Hawkerboi',desc:'米其林指南上榜！JLT亚洲街头美食',addr:'The Park, JLT',phone:'+971 50 427 5217',hours:'12pm-11pm',cost:'50-80 AED/人',rating:4.2,tags:['米其林','JLT','亚洲街食','已核实✓'],outdoor:false,mapQ:'Hawkerboi+JLT+Dubai',bookUrl:'',tip:'Laksa和Satay，就在JLT Park'},
    {emoji:'🇨🇳',name:'Maiden Shanghai',desc:'1920年代上海主题，粤川京沪四大菜系，MSG-free有机',addr:'Level 1, FIVE Palm Jumeirah',phone:'+971 4 455 9989',hours:'7pm-1am',cost:'300-500 AED/人',rating:4.5,tags:['中餐','高端','Palm','已核实✓'],outdoor:true,mapQ:'Maiden+Shanghai+FIVE+Palm+Dubai',bookUrl:'https://maiden-shanghai.com/dubai/',tip:'露台看Marina夜景，迪拜最好中餐之一'},
    {emoji:'🇨🇳',name:'MEI (原郑和)',desc:'2025年新开取代郑和，中日融合，Robata+点心+烤鸭',addr:'Jumeirah Mina A\'Salam, Madinat Jumeirah',phone:'+971 4 432 3232',hours:'6pm-11:30pm',cost:'250-400 AED/人',rating:4.3,tags:['中日','新开🔥','Madinat','已核实✓'],outdoor:true,mapQ:'MEI+restaurant+Madinat+Jumeirah+Dubai',bookUrl:'',tip:'2025年9月替代郑和，水景位超美'},
    {emoji:'🇨🇳',name:'Hakkasan',desc:'全球知名粤菜品牌，Atlantis The Palm内',addr:'Atlantis, The Palm',phone:'+971 4 426 2626',hours:'6pm-12am',cost:'300-500 AED/人',rating:4.5,tags:['粤菜','高端','Atlantis','已核实✓'],outdoor:false,mapQ:'Hakkasan+Atlantis+Dubai',bookUrl:'',tip:'取代了Yuan成为Atlantis主打中餐'},
  ]
},

// ==================== 🐱 特色体验 (新增验证) ====================
unique: {
  label: '🎯 特色体验', color: '#8b5cf6',
  items: [
    {emoji:'🐱',name:'Vibrissae猫咖啡',desc:'65+只猫！边喝咖啡边撸猫，3家分店',addr:'Al Safa Park / Mirdif 35 Mall / Creek Harbour',phone:'+971 4 456 9609',hours:'10am-10pm',cost:'39-79 AED/30-90min',rating:4.4,tags:['猫咖','亲子','独特','已核实✓'],outdoor:false,mapQ:'Vibrissae+Cat+Cafe+Dubai',bookUrl:'https://www.vibrissaecafe.com',tip:'30min=39, 60min=59, 90min=79 AED'},
    {emoji:'🧱',name:'Legoland Dubai',desc:'乐高主题公园！骑乘+互动+乐高工厂参观',addr:'Dubai Parks & Resorts, Jebel Ali',phone:'+971 4 820 0000',hours:'10am-6pm',cost:'295 AED/人',rating:4.4,tags:['乐高','亲子','全天','已核实✓'],outdoor:true,mapQ:'Legoland+Dubai',bookUrl:'https://www.legoland.com/dubai/',tip:'在线买票比现场便宜'},
    {emoji:'🌊',name:'Jungle Bay水上乐园',desc:'Le Meridien内家庭水上乐园，适合小朋友的滑梯+泳池',addr:'Le Meridien Mina Seyahi, Al Sufouh Rd',phone:'',hours:'10am-6pm',cost:'工作日109/周末159 AED',rating:4.2,tags:['水上乐园','亲子','Marina区','已核实✓'],outdoor:true,mapQ:'Jungle+Bay+Waterpark+Le+Meridien+Dubai',bookUrl:'',tip:'比Wild Wadi便宜，更适合小孩'},
    {emoji:'🤿',name:'Deep Dive Dubai',desc:'全球最深室内泳池(60米)！4月买一赠一，水下城市探索+潜水+浮潜',addr:'Wadi Al Safa, Nad Al Sheba 1',phone:'+971 4 501 9444',hours:'9am-6pm',cost:'400-1800 AED(4月BOGO)',rating:4.5,tags:['潜水','刺激','限时BOGO🔥','已核实✓'],outdoor:false,mapQ:'Deep+Dive+Dubai',bookUrl:'https://www.deepdivedubai.com',tip:'4月Bring a Friend免费！两人同时段同体验，不含自由潜课程',dist:2},
  ]
},

// ==================== 🍜 全城平价美食 ====================
budget_food: {
  label: '💰 平价美食', color: '#84cc16',
  items: [
    {emoji:'🇵🇰',name:'Ravi Restaurant',desc:'迪拜传奇！1978年开业的巴基斯坦餐厅，便宜到哭',addr:'Al Satwa, Al Dhiyafa Rd',phone:'+971 4 331 5353',hours:'5am-3am',cost:'20-40 AED/人',rating:4.5,tags:['传奇','巴基斯坦','超平价','已核实✓'],outdoor:true,mapQ:'Ravi+Restaurant+Satwa+Dubai',bookUrl:'',tip:'Butter Chicken和Naan必点'},
    {emoji:'🇮🇷',name:'Al Ustad Special Kabab',desc:'1978年开业伊朗烤肉，Al Musalla Rd，本地人最爱',addr:'Al Musalla Rd, Bur Dubai (Al Fahidi Metro附近)',phone:'+971 4 397 1933',hours:'12pm-12am',cost:'25-50 AED/人',rating:4.6,tags:['伊朗','烤肉','隐藏宝石','已核实✓'],outdoor:false,mapQ:'Al+Ustad+Special+Kabab+Dubai',bookUrl:'',tip:'Lamb Kebab和Tahdig必点'},
    {emoji:'🇱🇧',name:'Al Mallah Shawarma',desc:'1979年传奇黎巴嫩Shawarma，Satwa地标',addr:'Al Dhiyafa Rd, Al Satwa',phone:'+971 600 522 521',hours:'8am-3am',cost:'10-25 AED/人',rating:4.4,tags:['黎巴嫩','Shawarma','传奇','已核实✓'],outdoor:true,mapQ:'Al+Mallah+Shawarma+Dubai',bookUrl:'',tip:'Chicken Shawarma + 鲜榨果汁'},
    {emoji:'🇮🇳',name:'Pak Liyari印度餐',desc:'最地道巴基斯坦菜，Biryani一绝，多家分店',addr:'Naif / Al Muteena, Deira (Melody Queen Hotel)',phone:'',hours:'6am-1am',cost:'15-35 AED/人',rating:4.3,tags:['巴基斯坦','Biryani','超平价','已核实✓'],outdoor:false,mapQ:'Pak+Liyari+Deira+Dubai',bookUrl:'',tip:'Mutton Biryani和Seekh Kebab'},
    {emoji:'🐟',name:'Bu Qtair海鲜',desc:'迪拜传奇路边海鲜！新鲜便宜超地道，排队也值',addr:'Jumeirah Fishing Harbour',phone:'',hours:'11:30am-11pm',cost:'40-80 AED/人',rating:4.6,tags:['传奇','海鲜','排队','已核实✓'],outdoor:true,mapQ:'Bu+Qtair+Dubai',bookUrl:'',tip:'炸鱼+虾+面包，迪拜必吃'},
    {emoji:'🥙',name:'Firas Sweets黎巴嫩',desc:'40年老店！Shawarma+甜品+果汁，超过150种菜',addr:'Al Satwa / Al Barsha / Al Warqa / 多分店',phone:'+971 4 341 3123',hours:'长时间营业',cost:'15-30 AED/人',rating:4.3,tags:['黎巴嫩','老店','多分店','已核实✓'],outdoor:false,mapQ:'Firas+Sweets+Dubai',bookUrl:'',tip:'Shawarma和鲜榨果汁必点'},
    {emoji:'🍗',name:'Al Baik炸鸡',desc:'沙特国民炸鸡！Dubai Mall/MOE有店，Hills是ADNOC免下车店',addr:'Dubai Mall / Mall of Emirates / Dubai Hills ADNOC',phone:'',hours:'10am-12am',cost:'15-30 AED/人',rating:4.5,tags:['炸鸡','排队🔥','沙特','已核实✓'],outdoor:false,mapQ:'Al+Baik+Dubai',bookUrl:'',tip:'Broasted Chicken Set最经典'},
    {emoji:'🍜',name:'Long Teng海鲜中餐',desc:'Business Bay中式海鲜酒楼，点心和海鲜一流',addr:'Business Bay, Marasi Dr',phone:'+971 4 584 6665',hours:'11am-11pm',cost:'80-150 AED/人',rating:4.4,tags:['中餐','海鲜','点心'],outdoor:false,mapQ:'Long+Teng+Seafood+Dubai',bookUrl:'',tip:'周末Dim Sum早茶超赞'},
    {emoji:'🇰🇷',name:'Mukbang Shows韩国BBQ',desc:'无限烤肉自助99 AED起，性价比之王',addr:'JBR / Al Barsha / 多地点',phone:'+971 4 555 0018',hours:'12pm-12am',cost:'99-150 AED/人',rating:4.2,tags:['韩餐','自助','超值'],outdoor:false,mapQ:'Mukbang+Shows+Dubai',bookUrl:'',tip:'饿着去吃回本'},
    {emoji:'🍱',name:'Hawkerboi亚洲街食',desc:'JLT的亚洲街头美食，咖喱/饺子/沙嗲/炒饭',addr:'Cluster V, JLT',phone:'+971 4 399 8010',hours:'12pm-11pm',cost:'50-80 AED/人',rating:4.2,tags:['亚洲','街食','JLT'],outdoor:false,mapQ:'Hawkerboi+JLT+Dubai',bookUrl:'',tip:'Laksa和Satay很正宗'},
    {emoji:'🥘',name:'Arabian Tea House',desc:'Al Fahidi老城最美的传统阿拉伯餐厅，蓝白色超美',addr:'Al Fahidi Historical District',phone:'+971 4 353 5071',hours:'7am-10pm',cost:'40-80 AED/人',rating:4.5,tags:['阿拉伯','拍照','文化区','已核实✓'],outdoor:true,mapQ:'Arabian+Tea+House+Dubai',bookUrl:'',tip:'露天庭院拍照绝了'},
    {emoji:'🇹🇭',name:'Tom & Serg',desc:'Al Quoz工业风Brunch神店，墨尔本风格早午餐',addr:'Al Joud Center, 15A St, Al Quoz Industrial 1',phone:'+971 56 474 6812',hours:'7am-5pm',cost:'50-90 AED/人',rating:4.4,tags:['Brunch','墨尔本','工业风','已核实✓'],outdoor:true,mapQ:'Tom+and+Serg+Al+Quoz+Dubai',bookUrl:'',tip:'Big Breakfast和Flat White'},
    {emoji:'🇰🇷',name:'BB Social Dining',desc:'韩式炸鸡+亚洲fusion，DIFC人气店',addr:'DIFC Gate Village 08',phone:'+971 4 407 4444',hours:'12pm-12am',cost:'60-100 AED/人',rating:4.4,tags:['韩式','炸鸡','DIFC','已核实✓'],outdoor:false,mapQ:'BB+Social+Dining+DIFC+Dubai',bookUrl:'',tip:'Fried Chicken必点'},
    {emoji:'🍕',name:'Pinza Pizza',desc:'意式Pinza（罗马方披萨），轻脆底料足超好吃',addr:'多地点',phone:'',hours:'11am-11pm',cost:'30-50 AED/人',rating:4.2,tags:['披萨','罗马','实惠'],outdoor:false,mapQ:'Pinza+Dubai',bookUrl:'',tip:'比普通披萨轻很多'},
    {emoji:'🫔',name:'Deira Creekside扫街',desc:'沿Dubai Creek步行，香料市场+黄金市场+各国小吃',addr:'Deira Waterfront / Gold Souk',phone:'',hours:'全天（晚上最热闹）',cost:'20-50 AED',rating:4.3,tags:['扫街','文化','Deira'],outdoor:true,mapQ:'Deira+Gold+Souk+Dubai',bookUrl:'',tip:'坐1 AED水上的士过Creek'},
    {emoji:'🍗',name:'Kew\'s牛脂炸鸡',desc:'Sticky Rice团队新品牌！牛脂炸鸡+泰式风味，酥脆到爆',addr:'Sobha Daffodil, Shop 06, JVC',phone:'',hours:'11am-11pm',cost:'40-70 AED/人',rating:4.3,tags:['炸鸡','泰式','新开🔥','已核实✓'],outdoor:false,mapQ:'Kews+Fried+Chicken+JVC+Dubai',bookUrl:'https://www.kewsfriedchicken.ae',tip:'牛脂炸鸡更酥脆，Sticky Rice同团队出品',dist:1},
  ]
},

// ==================== 🥢 亚洲美食专区 (12) ====================
asian_food: {
  label: '🥢 亚洲美食', color: '#f472b6',
  items: [
    {emoji:'🍜',name:'San Wan手工拉面',desc:'JLT正宗西安面食，手拉面+肉夹馍+油泼面',addr:'Cluster F, JLT',phone:'+971 4 565 6636',hours:'11am-11pm',cost:'25-50 AED/人',rating:4.5,tags:['中餐','面食','JLT'],outdoor:false,mapQ:'San+Wan+JLT',bookUrl:'',tip:'看师傅拉面也是体验'},
    {emoji:'🥟',name:'Din Tai Fung鼎泰丰',desc:'台湾小笼包连锁，Dubai Mall/MOE/Hills/Palm多家',addr:'Dubai Mall / MOE / Dubai Hills / Palm Mall',phone:'+971 4 320 0477',hours:'10am-12am',cost:'80-130 AED/人',rating:4.5,tags:['小笼包','台湾','连锁','已核实✓'],outdoor:false,mapQ:'Din+Tai+Fung+Dubai',bookUrl:'https://www.dintaifungae.com/locations',tip:'小笼包和炒饭必点（Dubai Mall: 04 320 0477）'},
    {emoji:'🍲',name:'海底捞火锅',desc:'正宗川味火锅，拉面表演孩子爱看，等位有免费零食美甲',addr:'Dubai Mall Chinatown / Festival City',phone:'+971 4 221 7445',hours:'10am-2am',cost:'100-180 AED/人',rating:4.3,tags:['火锅','服务','亲子'],outdoor:false,mapQ:'Haidilao+Hot+Pot+Dubai+Mall',bookUrl:'',tip:'提前App订位，4岁以下免费'},
    {emoji:'🍜',name:'Long Teng海鲜酒楼',desc:'Business Bay正宗粤菜海鲜+Dim Sum早茶',addr:'Business Bay, Marasi Dr',phone:'+971 4 584 6665',hours:'11am-11pm',cost:'80-150 AED/人',rating:4.4,tags:['粤菜','点心','海鲜'],outdoor:false,mapQ:'Long+Teng+Seafood+Dubai',bookUrl:'',tip:'周末早茶必去'},
    {emoji:'🇯🇵',name:'Kumo日式小馆',desc:'Al Wasl别墅里的日式料理，SALT团队出品，有抹茶Bar',addr:'Al Wasl Rd, Jumeirah',phone:'',hours:'12pm-11pm',cost:'80-140 AED/人',rating:4.4,tags:['日料','别墅','SALT团队','已核实✓'],outdoor:false,mapQ:'Kumo+Japanese+Al+Wasl+Dubai',bookUrl:'',tip:'Matcha Bar很特别'},
    {emoji:'🇰🇷',name:'Hanu韩式高端',desc:'Palm Jumeirah屋顶韩式BBQ+刺身，景色+味道双绝',addr:'Palm Jumeirah',phone:'+971 4 666 1888',hours:'6pm-1am',cost:'200-400 AED/人',rating:4.5,tags:['韩餐','高端','景色'],outdoor:true,mapQ:'Hanu+Korean+Palm+Dubai',bookUrl:'',tip:'Wagyu BBQ必点'},
    {emoji:'🍛',name:'Tresind Studio印度Fine Dining',desc:'DIFC印度高端料理，米其林推荐级别',addr:'DIFC',phone:'+971 4 377 5575',hours:'7pm-11pm',cost:'400-600 AED/人',rating:4.7,tags:['印度','高端','DIFC'],outdoor:false,mapQ:'Tresind+Studio+Dubai',bookUrl:'',tip:'Tasting Menu必选'},
    {emoji:'🥡',name:'Hutong中式高端',desc:'DIFC高空中餐，环境震撼，北京烤鸭招牌',addr:'DIFC Gate Village',phone:'+971 4 220 0868',hours:'12pm-3am',cost:'200-350 AED/人',rating:4.4,tags:['中餐','高端','DIFC','已核实✓'],outdoor:false,mapQ:'Hutong+DIFC+Dubai',bookUrl:'',tip:'Friday Brunch很出名'},
    {emoji:'🍜',name:'MiMi Mei Fair中式',desc:'米其林上榜精致中餐，Dim Sum和Peking Duck好评',addr:'Address Residences, Opera District, Downtown Dubai',phone:'+971 4 570 0825',hours:'12pm-1am',cost:'150-250 AED/人',rating:4.3,tags:['中餐','米其林','Downtown','已核实✓'],outdoor:false,mapQ:'MiMi+Mei+Fair+Downtown+Dubai',bookUrl:'',tip:'Duck Pancake必点（在Downtown非DIFC）'},
    {emoji:'🍣',name:'3 Fils日料',desc:'迪拜No.1日料（中东50佳餐厅），排队也值',addr:'Jumeirah Fishing Harbour',phone:'+971 4 333 4003',hours:'12:30pm-11:30pm',cost:'150-250 AED/人',rating:4.8,tags:['日料','No.1🔥','排队','已核实✓'],outdoor:true,mapQ:'3+Fils+Dubai',bookUrl:'',tip:'不接受预约只排队，Sashimi Tacos必吃'},
    {emoji:'🍜',name:'Pai Thai泰餐',desc:'帆船酒店旁Madinat Jumeirah内，坐船去吃泰餐',addr:'Madinat Jumeirah',phone:'+971 4 432 3232',hours:'6pm-11:30pm',cost:'200-350 AED/人',rating:4.5,tags:['泰餐','浪漫','帆船酒店','已核实✓'],outdoor:true,mapQ:'Pai+Thai+Madinat+Jumeirah',bookUrl:'',tip:'坐Abra小船到达，超浪漫'},
    {emoji:'🍱',name:'Sumo Sushi & Bento',desc:'迪拜本地日料连锁，性价比好，家庭友好',addr:'Marina / JBR / 多地点',phone:'+971 4 362 7744',hours:'11am-11pm',cost:'60-100 AED/人',rating:4.1,tags:['日料','连锁','实惠'],outdoor:false,mapQ:'Sumo+Sushi+Bento+Dubai',bookUrl:'',tip:'Bento Box午餐套餐划算'},
  ]
},

// ==================== 🍽️ 高端/特色餐厅 (12) ====================
fine_dining: {
  label: '🍽️ 特色/高端', color: '#d946ef',
  items: [
    {emoji:'🇫🇷',name:'La Petite Maison',desc:'DIFC法式餐厅，精致优雅，商务约会首选',addr:'DIFC Gate Village',phone:'+971 4 439 0505',hours:'12pm-12am',cost:'250-400 AED/人',rating:4.6,tags:['法餐','DIFC','高端','已核实✓'],outdoor:true,mapQ:'La+Petite+Maison+DIFC',bookUrl:'',tip:'Truffle Pasta和Fish经典'},
    {emoji:'🇮🇹',name:'Gloria Osteria',desc:'Big Mamma集团！Ritz-Carlton DIFC，颜值和味道都在线',addr:'Al Sukook St, Ritz-Carlton, DIFC',phone:'+971 4 577 8546',hours:'12pm-12am',cost:'200-350 AED/人',rating:4.4,tags:['意大利','新开🔥','DIFC','已核实✓'],outdoor:true,mapQ:'Gloria+Osteria+DIFC+Dubai',bookUrl:'https://gloria-osteria.com/gloria-osteria-dubai',tip:'Big Mamma出品必属精品'},
    {emoji:'🏔️',name:'At.Mosphere',desc:'哈利法塔122层餐厅，全球最高餐厅，景色无敌',addr:'Burj Khalifa Level 122',phone:'+971 4 888 3828',hours:'12pm-3pm, 7pm-11pm',cost:'500-800 AED/人',rating:4.5,tags:['全球最高','景色','打卡','已核实✓'],outdoor:false,mapQ:'Atmosphere+Burj+Khalifa',bookUrl:'',tip:'下午茶套餐350 AED更划算'},
    {emoji:'🥩',name:'Nusr-Et牛排',desc:'Salt Bae的店！撒盐表演+顶级牛排',addr:'Four Seasons Resort, Jumeirah 2',phone:'+971 4 407 4100',hours:'12pm-12am',cost:'400-800 AED/人',rating:4.2,tags:['牛排','网红','Jumeirah','已核实✓'],outdoor:false,mapQ:'Nusr+Et+Steakhouse+Dubai+Jumeirah',bookUrl:'https://www.nusr-et.com.tr/en/restaurants/dubai',tip:'在Jumeirah非DIFC，Golden Tomahawk打卡'},
    {emoji:'🌊',name:'Pierchic海上餐厅',desc:'Madinat Jumeirah栈桥尽头，海上用餐体验独特',addr:'Al Qasr, Madinat Jumeirah',phone:'+971 4 432 3232',hours:'12pm-11:30pm',cost:'300-500 AED/人',rating:4.5,tags:['海鲜','海上','浪漫','已核实✓'],outdoor:true,mapQ:'Pierchic+Dubai',bookUrl:'',tip:'日落时分海景绝了'},
    {emoji:'🇯🇵',name:'Nobu Dubai',desc:'Atlantis的Nobu，日秘融合料理，全球名店',addr:'Atlantis, The Palm',phone:'+971 4 426 0760',hours:'6pm-11:30pm',cost:'300-500 AED/人',rating:4.5,tags:['日秘','全球名店','Palm','已核实✓'],outdoor:true,mapQ:'Nobu+Dubai+Atlantis',bookUrl:'https://noburestaurants.com/dubai',tip:'Black Cod Miso必点（直线电话非酒店总机）'},
    {emoji:'🇬🇧',name:'Nathan Outlaw at Al Mahara',desc:'帆船酒店内水族馆餐厅，边看鱼边吃海鲜',addr:'Burj Al Arab',phone:'+971 4 301 7600',hours:'12:30pm-3pm, 7pm-11pm',cost:'800-1500 AED/人',rating:4.6,tags:['帆船酒店','水族馆','体验'],outdoor:false,mapQ:'Al+Mahara+Burj+Al+Arab',bookUrl:'',tip:'一生一次的体验'},
    {emoji:'🇦🇪',name:'Al Hadheerah沙漠晚餐',desc:'Bab Al Shams沙漠酒店，星空下BBQ+骆驼+表演',addr:'Bab Al Shams Desert Resort',phone:'+971 4 809 6194',hours:'7pm-11pm',cost:'400-600 AED/人',rating:4.5,tags:['沙漠','体验','表演'],outdoor:true,mapQ:'Al+Hadheerah+Bab+Al+Shams',bookUrl:'',tip:'有肚皮舞+旋转舞+骆驼骑行'},
    {emoji:'🥘',name:'BOCA DIFC',desc:'TimeOut年度最佳餐厅常客，地中海创意料理',addr:'DIFC',phone:'+971 4 323 1833',hours:'12pm-1am',cost:'200-350 AED/人',rating:4.6,tags:['获奖','地中海','DIFC','已核实✓'],outdoor:true,mapQ:'BOCA+DIFC+Dubai',bookUrl:'',tip:'Tasting Menu最能体验'},
    {emoji:'🍔',name:'SALT',desc:'迪拜最火本地汉堡品牌，Kite Beach小卡车起家',addr:'Street 2C, Kite Beach, Umm Suqeim / 多地点',phone:'+971 55 996 5802',hours:'10am-12am',cost:'40-60 AED/人',rating:4.4,tags:['汉堡','本地品牌','海滩','已核实✓'],outdoor:true,mapQ:'SALT+Kite+Beach+Dubai',bookUrl:'',tip:'Smashy Burger + Fries + Softie'},
    {emoji:'🌮',name:'Mama Zonia',desc:'热带雨林主题餐厅，环境像进了亚马逊丛林',addr:'Pier 7, 2nd Floor, Dubai Marina',phone:'+971 4 240 4747',hours:'12pm-2am',cost:'150-250 AED/人',rating:4.3,tags:['主题','Marina','拍照','已核实✓'],outdoor:false,mapQ:'Mama+Zonia+Pier+7+Dubai+Marina',bookUrl:'',tip:'环境比食物更值得去（在Marina Pier 7非DIFC）'},
    {emoji:'🥂',name:'Ossiano水下餐厅',desc:'米其林星级！Atlantis水下Fine Dining，被水族馆包围',addr:'Atlantis, The Palm',phone:'+971 4 426 2000',hours:'6pm-11pm',cost:'600-1000 AED/人',rating:4.6,tags:['水下','米其林','体验','已核实✓'],outdoor:false,mapQ:'Ossiano+Atlantis+Dubai',bookUrl:'https://www.atlantis.com/dubai/dining/ossiano',tip:'全迪拜最独特体验（电话为酒店总机转接）'},
    {emoji:'🇪🇸',name:'Barrafina西班牙Tapas',desc:'伦敦米其林星级Tapas Bar首家海外店！吧台用餐，主厨现做小盘菜',addr:'DIFC Podium Level, Gate Village 01, Al Mustaqbal St',phone:'+971 4 234 1543',hours:'12pm-12am',cost:'150-250 AED/人',rating:4.5,tags:['米其林','西班牙','新开🔥','DIFC','已核实✓'],outdoor:false,mapQ:'Barrafina+DIFC+Dubai',bookUrl:'https://www.barrafina.com/locations/barrafina-dubai/',tip:'Croquetas和烤虾必点，吧台位看主厨现做',dist:2},
    {emoji:'🇮🇹',name:'Siena意大利',desc:'巴黎Siena首家海外分店！4月7日新开，托斯卡纳风格意餐+晚间DJ',addr:'Gate Village 7, DIFC',phone:'+971 4 317 6000',hours:'周日/周二-四 7pm-1am, 周五六 7pm-2am',cost:'200-350 AED/人',rating:0,tags:['意大利','巴黎品牌','新开🔥','DIFC','已核实✓'],outdoor:false,mapQ:'Siena+DIFC+Dubai',bookUrl:'https://www.sienadubai.com',tip:'Linguine all\'astice和Tiramisu招牌，大理石+水晶灯内饰超美',dist:2},
  ]
},

};
// ============ END OF DATA ============
