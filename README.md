# 🌈 儿童益智游戏乐园 · Kid Web Games Portal

> 专为儿童与家庭打造的高品质网页益智游戏聚合乐园。无广告、纯净沉浸，支持 iPad 平板触屏满屏畅玩！

🌐 **在线乐园地址**: [https://ruixuandai.github.io/](https://ruixuandai.github.io/)

---

## 🎮 当前收录游戏列表

| 游戏名称 | 学科领域 | 适合年龄 | 在线体验链接 |
| :--- | :--- | :--- | :--- |
| **🧮 童趣数学小王国** | 数学启蒙 / 进阶思维 | 5 - 8 岁 | [立即游玩](https://ruixuandai.github.io/kid-math-game/) |
| **✍️ 快乐小书法家** | 汉字描红 / 笔顺动画 | 4 - 8 岁 | [立即游玩](https://ruixuandai.github.io/chinese-writing/) |
| **🌟 益智三子棋乐园** | 策略对弈 / 亲子双人 | 全年龄 | [立即游玩](https://ruixuandai.github.io/kid-tic-tac-toe/) |

---

## ✨ 核心特色

1. **双重游玩模式 (Dual Play Modes)**:
   - **大厅内嵌满屏沉浸玩**: 点击「🎮 立即畅玩」即可在当前页面直接开启全屏畅玩，附带顶部「返回大厅」、「重新开始」、「全屏切换」等便捷控制。
   - **新标签页独立玩**: 点击「🚀」在新标签页全屏独立打开。
2. **iPad 扫码即玩 (QR Code Sharing)**:
   - 每款游戏与游戏大厅均支持一键生成二维码，用 iPad / 手机相机扫码即可秒进游戏。
3. **iPad 主屏幕原生体验 (PWA Optimized)**:
   - 在 iPad Safari 中点击「分享」->「添加到主屏幕」，即可生成桌面图标，享受无地址栏干扰的独立 App 体验。
4. **轻量纯原生**:
   - 采用 Web Audio API 合成音效，无需外部繁重音频资源；纯 HTML5/CSS3/Vanilla JS，秒速加载。
5. **轻松扩展 (Zero-Config Extensible)**:
   - 以后开发了新游戏，只需在 `js/games-data.js` 中添加几行配置，即可自动生成游戏卡片与筛选标签！

---

## 🚀 如何添加新游戏？

只需打开 [`js/games-data.js`](js/games-data.js)，在 `GAMES_DATA` 数组中增加一个对象即可：

```javascript
{
  id: "my-new-game",
  title: "新游戏名字",
  subtitle: "副标题与简述",
  url: "https://ruixuandai.github.io/my-new-game/",
  icon: "🎯",
  category: "math", // 可选: math, chinese, logic
  categoryLabel: "学科标签",
  badgeClass: "badge-math",
  age: "4 - 7 岁",
  colorGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  tags: ["趣味标签1", "趣味标签2"],
  description: "一段生动的游戏玩法介绍...",
  highlights: ["🌟 特色亮点1", "🏆 特色亮点2"]
}
```

---

## 🛠️ 本地运行

无需安装额外依赖，任意静态服务器即可运行：

```bash
# 使用 Python 启动本地测试
python -m http.server 8080

# 打开浏览器访问
http://localhost:8080/
```

---

## 📜 许可

Designed with ❤️ for Curious Kids & Happy Families.
