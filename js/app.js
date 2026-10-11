/**
 * 🌈 儿童益智小游戏乐园 · 核心交互引擎 (app.js)
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. 状态管理
  // -------------------------------------------------------------------------
  let currentFilter = 'all';
  let searchQuery = '';
  let isSoundEnabled = localStorage.getItem('kid_arcade_sound') !== 'muted';
  let qrCodeInstance = null;
  let activeGameUrl = '';

  // DOM 元素缓存
  const gamesGrid = document.getElementById('gamesGrid');
  const gameCountBadge = document.getElementById('gameCountBadge');
  const categoryFilters = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const noResultsState = document.getElementById('noResultsState');

  // 音效与指南按钮
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const ipadGuideBtn = document.getElementById('ipadGuideBtn');

  // 播放器模态框
  const gamePlayerModal = document.getElementById('gamePlayerModal');
  const gameIframe = document.getElementById('gameIframe');
  const iframeSpinner = document.getElementById('iframeSpinner');
  const closePlayerBtn = document.getElementById('closePlayerBtn');
  const reloadPlayerBtn = document.getElementById('reloadPlayerBtn');
  const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');
  const openExternalBtn = document.getElementById('openExternalBtn');
  const activeGameTitle = document.getElementById('activeGameTitle');
  const activeGameIcon = document.getElementById('activeGameIcon');

  // 扫码弹窗
  const qrModalOverlay = document.getElementById('qrModalOverlay');
  const qrcodeCanvas = document.getElementById('qrcodeCanvas');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const copyUrlBtn = document.getElementById('copyUrlBtn');
  const qrModalTitle = document.getElementById('qrModalTitle');
  const qrModalDesc = document.getElementById('qrModalDesc');

  // iPad 指南弹窗
  const ipadGuideModal = document.getElementById('ipadGuideModal');

  // -------------------------------------------------------------------------
  // 2. 纯前端 Web Audio API 合成音效 (无需额外 mp3 资源)
  // -------------------------------------------------------------------------
  const AudioEngine = {
    ctx: null,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },

    playPop() {
      if (!isSoundEnabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {
        // 音频上下文受限时静默容错
      }
    },

    playFanfare() {
      if (!isSoundEnabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      try {
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 和弦琶音
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + idx * 0.06;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.25);
        });
      } catch (e) {
        // 静默容错
      }
    }
  };

  // -------------------------------------------------------------------------
  // 3. 渲染分类标签与游戏卡片
  // -------------------------------------------------------------------------
  function renderCategories() {
    if (!categoryFilters || typeof CATEGORIES === 'undefined') return;
    categoryFilters.innerHTML = CATEGORIES.map(cat => `
      <button 
        class="category-pill ${cat.id === currentFilter ? 'active' : ''}" 
        data-category="${cat.id}"
      >
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
      </button>
    `).join('');

    categoryFilters.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playPop();
        currentFilter = btn.dataset.category;
        renderCategories();
        filterAndRenderGames();
      });
    });
  }

  function filterAndRenderGames() {
    if (!gamesGrid || typeof GAMES_DATA === 'undefined') return;

    const filtered = GAMES_DATA.filter(game => {
      const matchCat = currentFilter === 'all' || game.category === currentFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        game.title.toLowerCase().includes(q) || 
        game.subtitle.toLowerCase().includes(q) || 
        game.description.toLowerCase().includes(q) ||
        game.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    // 更新数量徽章
    if (gameCountBadge) {
      gameCountBadge.textContent = `共 ${filtered.length} 款游戏`;
    }

    if (filtered.length === 0) {
      gamesGrid.style.display = 'none';
      if (noResultsState) noResultsState.style.display = 'block';
      return;
    }

    gamesGrid.style.display = 'grid';
    if (noResultsState) noResultsState.style.display = 'none';

    gamesGrid.innerHTML = filtered.map(game => `
      <div class="game-card" data-id="${game.id}">
        <div class="card-header-bar">
          <div class="game-icon-bubble" style="background: ${game.colorGradient};">
            <span>${game.icon}</span>
          </div>
          <div class="card-badges">
            <span class="category-tag ${game.badgeClass}">${game.categoryLabel}</span>
            <span class="age-badge">👶 ${game.age}</span>
          </div>
        </div>

        <div class="card-body">
          <h4 class="game-title">${game.title}</h4>
          <span class="game-subtitle">${game.subtitle}</span>
          <p class="game-desc">${game.description}</p>
          
          <div class="game-tags">
            ${game.tags.map(tag => `<span class="tag-item">#${tag}</span>`).join('')}
          </div>

          <div class="game-highlights">
            ${game.highlights.map(h => `<span class="highlight-item">${h}</span>`).join('')}
          </div>
        </div>

        <div class="card-actions">
          <button class="candy-btn btn-play-primary" onclick="launchGamePlayer('${game.id}')">
            <span>🎮 立即畅玩</span>
          </button>
          <a href="${game.url}" target="_blank" rel="noopener" class="candy-btn btn-icon-square" title="新标签页打开">
            <span>🚀</span>
          </a>
          <button class="candy-btn btn-icon-square share-btn" onclick="openShareModal('${game.id}')" title="在 iPad 扫码玩">
            <span>📱</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------------------
  // 4. 沉浸式内嵌游戏播放器 (Iframe Player)
  // -------------------------------------------------------------------------
  window.launchGamePlayer = function (gameId) {
    const game = GAMES_DATA.find(g => g.id === gameId);
    if (!game) return;

    AudioEngine.playFanfare();
    activeGameUrl = game.url;

    // 更新顶部信息
    if (activeGameTitle) activeGameTitle.textContent = game.title;
    if (activeGameIcon) activeGameIcon.textContent = game.icon;

    // 显示模态框与加载指示器
    if (gamePlayerModal) gamePlayerModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (iframeSpinner) iframeSpinner.style.opacity = '1';
    if (gameIframe) {
      gameIframe.src = game.url;
      gameIframe.onload = () => {
        if (iframeSpinner) iframeSpinner.style.opacity = '0';
      };
    }
  };

  function closeGamePlayer() {
    AudioEngine.playPop();
    if (gamePlayerModal) gamePlayerModal.style.display = 'none';
    if (gameIframe) gameIframe.src = '';
    document.body.style.overflow = '';
  }

  function reloadGamePlayer() {
    AudioEngine.playPop();
    if (gameIframe && activeGameUrl) {
      if (iframeSpinner) iframeSpinner.style.opacity = '1';
      gameIframe.src = activeGameUrl;
    }
  }

  function toggleFullscreen() {
    AudioEngine.playPop();
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (gamePlayerModal.requestFullscreen) {
        gamePlayerModal.requestFullscreen();
      } else if (gamePlayerModal.webkitRequestFullscreen) {
        gamePlayerModal.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  // -------------------------------------------------------------------------
  // 5. 二维码生成与 iPad 分享模态框
  // -------------------------------------------------------------------------
  window.openShareModal = function (targetId) {
    AudioEngine.playPop();
    let url = window.location.href;
    let title = "儿童益智游戏乐园";
    let desc = "用 iPad 或手机相机扫码，随时随地开启游戏冒险！";

    if (targetId !== 'portal') {
      const game = GAMES_DATA.find(g => g.id === targetId);
      if (game) {
        url = game.url;
        title = `📱 iPad 扫码玩《${game.title}》`;
        desc = game.subtitle;
      }
    } else {
      title = "📱 iPad 扫码收藏益智大厅";
      desc = "在 iPad 上扫描下方二维码，收藏整个游戏大厅到主屏幕！";
    }

    if (qrModalTitle) qrModalTitle.textContent = title;
    if (qrModalDesc) qrModalDesc.textContent = desc;
    if (shareUrlInput) shareUrlInput.value = url;

    // 生成二维码
    if (qrcodeCanvas) {
      qrcodeCanvas.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        qrCodeInstance = new QRCode(qrcodeCanvas, {
          text: url,
          width: 180,
          height: 180,
          colorDark: "#2f3542",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }

    if (qrModalOverlay) qrModalOverlay.style.display = 'flex';
  };

  window.closeShareModal = function () {
    AudioEngine.playPop();
    if (qrModalOverlay) qrModalOverlay.style.display = 'none';
  };

  window.copyShareUrl = function () {
    if (!shareUrlInput) return;
    shareUrlInput.select();
    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
      AudioEngine.playPop();
      if (copyUrlBtn) {
        const originalText = copyUrlBtn.textContent;
        copyUrlBtn.textContent = '已复制! ✓';
        copyUrlBtn.style.background = '#2ed573';
        setTimeout(() => {
          copyUrlBtn.textContent = originalText;
          copyUrlBtn.style.background = '';
        }, 2000);
      }
    });
  };

  // -------------------------------------------------------------------------
  // 6. iPad 主屏幕添加指南模态框
  // -------------------------------------------------------------------------
  function openIpadGuide() {
    AudioEngine.playPop();
    if (ipadGuideModal) ipadGuideModal.style.display = 'flex';
  }

  window.closeIpadGuide = function () {
    AudioEngine.playPop();
    if (ipadGuideModal) ipadGuideModal.style.display = 'none';
  };

  window.closeModalsOnBackdrop = function (e) {
    if (e.target.classList.contains('modal-overlay')) {
      if (qrModalOverlay) qrModalOverlay.style.display = 'none';
      if (ipadGuideModal) ipadGuideModal.style.display = 'none';
    }
  };

  window.resetFilters = function () {
    currentFilter = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    renderCategories();
    filterAndRenderGames();
  };

  // -------------------------------------------------------------------------
  // 7. 事件监听绑定
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    // 搜索输入
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        }
        filterAndRenderGames();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchQuery = '';
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        filterAndRenderGames();
      });
    }

    // 音效开关
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('kid_arcade_sound', isSoundEnabled ? 'active' : 'muted');
        updateSoundUI();
        if (isSoundEnabled) AudioEngine.playPop();
      });
    }

    // iPad 指南
    if (ipadGuideBtn) {
      ipadGuideBtn.addEventListener('click', openIpadGuide);
    }

    // 播放器操作
    if (closePlayerBtn) closePlayerBtn.addEventListener('click', closeGamePlayer);
    if (reloadPlayerBtn) reloadPlayerBtn.addEventListener('click', reloadGamePlayer);
    if (fullscreenToggleBtn) fullscreenToggleBtn.addEventListener('click', toggleFullscreen);
    if (openExternalBtn) {
      openExternalBtn.addEventListener('click', () => {
        if (activeGameUrl) window.open(activeGameUrl, '_blank');
      });
    }

    // 键盘快捷键 (ESC 退出模态框或全屏)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (qrModalOverlay && qrModalOverlay.style.display === 'flex') {
          closeShareModal();
        } else if (ipadGuideModal && ipadGuideModal.style.display === 'flex') {
          closeIpadGuide();
        } else if (gamePlayerModal && gamePlayerModal.style.display === 'flex') {
          closeGamePlayer();
        }
      }
    });
  }

  function updateSoundUI() {
    if (!soundIcon || !soundToggleBtn) return;
    if (isSoundEnabled) {
      soundIcon.textContent = '🔊';
      soundToggleBtn.querySelector('.btn-text').textContent = '音效: 开';
      soundToggleBtn.classList.remove('muted');
    } else {
      soundIcon.textContent = '🔇';
      soundToggleBtn.querySelector('.btn-text').textContent = '音效: 关';
      soundToggleBtn.classList.add('muted');
    }
  }

  // -------------------------------------------------------------------------
  // 8. 启动初始化
  // -------------------------------------------------------------------------
  function init() {
    updateSoundUI();
    renderCategories();
    filterAndRenderGames();
    setupEventListeners();
  }

  // DOM 准备完成后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
