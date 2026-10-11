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
    url: "https://ruixuandai.github.io/kid-math-game/",
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
    tags: ["数字启蒙", "加减闯关", "天平找规律"],
    description: "专为幼小衔接与启蒙打造！精选加减运算闯关、数字天平称重、算式找规律等精彩冒险，开启智慧大脑！",
    highlights: ["🎯 关卡进阶勋章", "⏱️ 趣味限时闯关", "🎵 欢快乐曲音效"],
    isRecommended: true
  },
  {
    id: "chinese-writing",
    title: "快乐小书法家",
    subtitle: "儿童趣味练字乐园",
    url: "https://ruixuandai.github.io/chinese-writing/",
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
    tags: ["笔画笔顺", "米字格描红", "自动打分"],
    description: "标准汉字动态笔顺演示，米字格精准描红跟写。支持 iPad 触控笔与手指书写，写对即刻绽放绚丽烟花！",
    highlights: ["🎆 胜利礼花特效", "📖 常用字分级表", "🔊 纯正发音跟读"],
    isRecommended: true
  },
  {
    id: "kid-tic-tac-toe",
    title: "益智三子棋乐园",
    subtitle: "Super Tic-Tac-Toe 儿童平板乐园",
    url: "https://ruixuandai.github.io/kid-tic-tac-toe/",
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
    tags: ["萌宠皮肤", "亲子双人", "趣味人机对战"],
    description: "超萌小猫、小狗与糖果星球主题棋盘！既能挑战呆萌又机智的 AI 机器人，也能和爸爸妈妈一起亲子同屏对弈！",
    highlights: ["🤖 3级智能对战", "👨‍👩‍👧 亲子分屏对决", "🎊 胜利彩带派对"],
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
