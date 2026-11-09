/**
 * 🎮 儿童益智游戏乐园 - 游戏数据列表
 * 
 * 若要添加新游戏，只需在此数组中新增一个对象即可！
 */
const GAMES_DATA = [
  {
    id: "kid-math-game",
    title: "童趣数学小王国",
    subtitle: "6岁儿童进阶益智数学大冒险",
    url: "https://kid-math-game.pages.dev/",
    icon: "🧮",
    secondaryIcon: "🚀",
    category: "math",
    categoryLabel: "数学思维",
    badgeClass: "badge-math",
    age: "5 - 8 岁",
    stars: 5,
    playsCount: "9.9k+ 次畅玩",
    colorGradient: "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
    themeBg: "#e0f2fe",
    accentColor: "#0284c7",
    tags: ["22款思维题型", "自适应闯关", "AI晓晓语音"],
    description: "专为幼小衔接与启蒙打造！涵盖数字金字塔、水果代数、天平称重、排队谜题、钱币超市等 22 款高阶思维冒险，开启智慧大脑！",
    highlights: ["🎯 22款趣味题型", "🔊 AI自然真人语音", "🏅 智能进阶与勋章"],
    isRecommended: true
  },
  {
    id: "chinese-writing",
    title: "快乐小书法家",
    subtitle: "儿童趣味汉字描红与分级启蒙乐园",
    url: "https://chinese-writing.pages.dev/",
    icon: "✍️",
    secondaryIcon: "🎨",
    category: "chinese",
    categoryLabel: "汉字启蒙",
    badgeClass: "badge-chinese",
    age: "4 - 8 岁",
    stars: 5,
    playsCount: "8.6k+ 次畅玩",
    colorGradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    themeBg: "#ffe4e6",
    accentColor: "#e11d48",
    tags: ["400常用字", "手绘插画", "AI真人领读"],
    description: "精选 400 个常用汉字分级字库（K-1 至 G3+），配备全彩手绘释义插画与标准动态笔顺演示。支持 iPad 触控描红与三档难度切换！",
    highlights: ["📖 400字分级词库", "🎨 专属全彩插画", "🔊 晓晓真人语音"],
    isRecommended: true
  },
  {
    id: "kid-tic-tac-toe",
    title: "益智三子棋乐园",
    subtitle: "Super Tic-Tac-Toe 智慧平板版",
    url: "https://kid-tic-tac-toe.pages.dev/",
    icon: "🌟",
    secondaryIcon: "🐱",
    category: "logic",
    categoryLabel: "益智策略",
    badgeClass: "badge-logic",
    age: "全年龄畅玩",
    stars: 5,
    playsCount: "12.3k+ 次畅玩",
    colorGradient: "linear-gradient(135deg, #b354ff 0%, #d87dfb 100%)",
    themeBg: "#f3e8ff",
    accentColor: "#9333ea",
    tags: ["无限三子棋", "智能教练提示", "星星扭蛋屋"],
    description: "支持经典三子棋与灵动「满3消1」无限模式！内置动态 AI 难度进阶、松鼠教练策略提示与惊喜扭蛋收集，支持亲子同屏与人机对弈！",
    highlights: ["♾️ 满3消1新玩法", "🎁 星星扭蛋收集", "🔊 晓晓语音互动"],
    isRecommended: true
  }
];

// 分类筛选列表
const CATEGORIES = [
  { id: "all", label: "🌟 全部乐园", icon: "🎈" },
  { id: "math", label: "🧮 数学思维", icon: "🔢" },
  { id: "chinese", label: "✍️ 汉字书写", icon: "🎨" },
  { id: "logic", label: "🎮 益智对弈", icon: "🏆" }
];
