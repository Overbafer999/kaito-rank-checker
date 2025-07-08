// Kaito Rank Checker - ULTIMATE DARK WAVE DESIGN by OveR

module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kaito Rank Tracker - by OveR</title>
  <meta name="description" content="Kaito Rank Checker — Find your Twitter account in 50+ TOP trending crypto project leaderboards. Updated daily with real Kaito data.">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:800,700,400&display=swap" rel="stylesheet">
  <style>
    html, body { min-height: 100vh; margin: 0; padding: 0;}
    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: #151a2b;
      color: #ecf5ff;
      min-height: 100vh;
      box-sizing: border-box;
      overflow-x: hidden;
      position: relative;
    }
    .wave-bg {
      position: fixed; z-index: 0; inset: 0; width: 100vw; height: 100vh;
      background: linear-gradient(120deg, #151a2b 0%, #232a4e 60%, #49c6fc 130%);
      pointer-events: none;
      overflow: hidden;
    }
    .waves {
      position: absolute;
      width: 100vw; height: 100%;
      min-height: 400px;
      left: 0; top: 0;
      z-index: 1;
      opacity: 0.47;
    }
    .wave-glow {
      position: absolute;
      width: 900px; height: 340px;
      left: 44vw; top: 9vh;
      pointer-events: none;
      background: radial-gradient(circle, #54efff44 0%, #151a2b00 70%);
      filter: blur(60px);
      opacity: 0.24; z-index: 2;
    }
    .container {
      position: relative; z-index: 5;
      background: rgba(30,36,63,0.93);
      border-radius: 30px;
      padding: 3.4rem 2.6rem 2.2rem 2.6rem;
      max-width: 440px;
      margin: 65px auto 0 auto;
      box-shadow: 0 8px 48px 0 #2c49a988, 0 2px 16px #1ef9ff30;
      display: flex; flex-direction: column; align-items: center;
      animation: fadeInUp 1.0s cubic-bezier(.22,.68,.48,1.01) 0.13s both;
      backdrop-filter: blur(3px);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px);}
      to { opacity: 1; transform: none;}
    }
    .by-over {
      position: fixed;
      top: 28px; right: 38px;
      z-index: 20;
      font-family: 'Montserrat', Arial, sans-serif;
      font-weight: 800;
      font-size: 1.21rem;
      letter-spacing: 0.13em;
      color: #fff;
      text-shadow: 0 0 18px #0ff6, 0 0 4px #49f, 0 0 30px #15fffc88;
      opacity: 0.93;
      user-select: none;
      cursor: pointer;
      transition: text-shadow 0.18s, color 0.12s;
    }
    .by-over:hover {
      text-shadow: 0 0 38px #1ef9ff, 0 0 8px #18ffe7;
      color: #18ffe7;
    }
    .kaito-gradient {
      font-weight: 800;
      font-size: 2.8rem;
      line-height: 1.13;
      background: linear-gradient(90deg,#6dc6ff 5%, #b683ff 50%, #55fff8 95%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      animation: shimmerText 4s linear infinite;
      letter-spacing: 0.03em;
      margin-bottom: 0.7em;
      margin-top: 0.18em;
      display: block;
      text-align: left;
      filter: drop-shadow(0 2px 32px #4bf9ff40);
      user-select: none;
    }
    @keyframes shimmerText {
      0% {background-position: 0%;}
      100% {background-position: 200%;}
    }
    .desc-light {
      color: #e6f4ff !important;
      text-shadow: 0 0 8px #122c, 0 0 1px #7fdcffc0;
      opacity: 0.94;
    }
    .lang-switch {
      position: absolute;
      right: 24px; top: 28px;
      font-size: 1.03rem; z-index: 25;
      user-select: none;
    }
    .lang-btn {
      background: none; border: none; color: #88e6ff;
      font-weight: 700; font-size: 1.1rem; margin-left: 0.17em;
      cursor: pointer; padding: 2px 7px; border-radius: 7px;
      transition: background .16s, color .12s;
    }
    .lang-btn.selected,
    .lang-btn:hover {
      background: #232e4e;
      color: #fff;
    }
    .faq-btn {
      position: absolute; left: 20px; top: 28px;
      width: 36px; height: 36px; border: none;
      background: linear-gradient(135deg, #23325c 50%, #1ef9ff 100%);
      color: #93d5ff; font-weight: 900; border-radius: 50%;
      box-shadow: 0 2px 12px #2eb8ff13;
      cursor: pointer; font-size: 1.25em;
      display: flex; align-items: center; justify-content: center; z-index: 25;
      transition: background .18s;
    }
    .faq-btn:hover {
      background: linear-gradient(135deg, #1ef9ff 50%, #23325c 100%);
      color: #fff;
    }
    .faq-popup {
      position: absolute; left: 24px; top: 74px; z-index: 99;
      background: rgba(30,36,63,0.99);
      border-radius: 17px;
      box-shadow: 0 4px 32px #1ef9ff33;
      padding: 1.25em 1.25em 1.2em 1.35em;
      width: 95vw; max-width: 340px; min-height: 80px;
      animation: fadeInUp .36s cubic-bezier(.18,.7,.52,1.1);
      display: none;
    }
    .faq-popup.active { display: block; }
    .faq-title {
      font-size: 1.15em; color: #1ef9ff; font-weight: 700;
      margin-bottom: 0.8em; letter-spacing: 0.03em;
    }
    .faq-desc {
      font-size: 1.09em; color: #eaf6ff; opacity: 0.92;
    }
    .modes-list {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 1.15rem; margin: 1.2rem 0 1.7rem 0;
    }
    .mode-btn {
      background: rgba(55,62,113,0.70);
      border: 2px solid #353866;
      border-radius: 14px;
      color: #b9f7ff;
      font-weight: 700;
      font-size: 1.13rem;
      padding: 1.13rem 1.35rem;
      box-shadow: 0 2px 18px #1ef9ff11;
      display: flex;
      align-items: center;
      gap: 0.66em;
      cursor: pointer;
      transition: background 0.18s, border 0.18s, box-shadow 0.22s, color 0.13s;
      outline: none;
      margin-bottom: 0;
    }
    .mode-btn.selected,
    .mode-btn:hover {
      background: linear-gradient(90deg, #1a375c 0%, #1ef9ff 100%);
      border-color: #1ef9ff;
      color: #fff;
      box-shadow: 0 4px 32px #1ef9ff29, 0 2px 14px #49f8;
    }
    .mode-btn span { font-size: 1.08em; }
    .search-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.05rem;
      margin-top: 1.0rem;
      margin-bottom: 0.2rem;
      align-items: center;
    }
    .search-form input,
    .search-form select {
      width: 100%;
      border-radius: 10px;
      padding: 1.04rem 1.1rem;
      background: rgba(40,44,64,0.91);
      color: #f3fcff;
      border: 1.7px solid #232e4e;
      font-size: 1.04rem;
      margin-bottom: 0;
      transition: border 0.17s, background 0.13s;
      font-family: inherit;
      font-weight: 500;
    }
    .search-form input:focus, .search-form select:focus {
      outline: none;
      border-color: #1ef9ff;
      background: rgba(40,44,94,0.98);
    }
    .btn-shimmer {
      background: linear-gradient(90deg, #4bf9ff 0, #7c6ffc 100%);
      position: relative;
      overflow: hidden;
      color: #151a2b;
      font-weight: 800;
      border-radius: 13px;
      font-size: 1.25rem;
      padding: 1.06rem 0;
      width: 100%;
      letter-spacing: 0.03em;
      border: none;
      box-shadow: 0 6px 22px #0ff2;
      cursor: pointer;
      margin-top: 0.6rem;
      margin-bottom: 0.1rem;
      transition: box-shadow .18s, background .28s, color .18s;
    }
    .btn-shimmer:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background: #444;
      color: #999;
    }
    .btn-shimmer:after {
      content: '';
      display: block;
      position: absolute;
      left: -120px; top: 0; bottom: 0;
      width: 70px;
      background: linear-gradient(120deg, #fff7 30%, #fff3 70%, transparent 100%);
      transform: skewX(-22deg);
      opacity: 0;
      pointer-events: none;
    }
    .btn-shimmer:hover:not(:disabled) {
      box-shadow: 0 8px 32px #3af9ff48;
      background: linear-gradient(90deg, #69faff 0, #a79cfc 100%);
      color: #191e33;
    }
    .btn-shimmer:hover:not(:disabled):after {
      left: 140px;
      opacity: 1;
      transition: left .7s cubic-bezier(.5,.05,.1,1), opacity .13s;
    }
    .results {
      margin-top: 2.3rem;
      width: 100%;
      background: rgba(34,41,66,0.86);
      border-radius: 22px;
      padding: 1.7rem 1.35rem 1.4rem 1.35rem;
      box-shadow: 0 2px 22px #1ef9ff1c;
      text-align: left;
      animation: fadeInUp 1s cubic-bezier(.23,.6,.5,1) 0.08s both;
      backdrop-filter: blur(1.5px);
    }
    .loading {
      text-align: center;
      padding: 2rem 1rem;
    }
    .progress-container {
      width: 100%;
      height: 8px;
      background: rgba(40,44,94,0.7);
      border-radius: 10px;
      margin: 1.5rem 0;
      overflow: hidden;
      position: relative;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #1ef9ff 0%, #b2a6ff 100%);
      border-radius: 10px;
      transition: width 0.3s ease;
      position: relative;
    }
    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .spinner {
      border: 3.5px solid #232e4e;
      border-radius: 50%;
      border-top: 3.5px solid #1ef9ff;
      width: 41px;
      height: 41px;
      animation: spin 1.13s linear infinite;
      margin: 0 auto 1.0rem;
    }
    @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
    .rank-card {
      background: rgba(36,46,76,0.76);
      padding: 1rem 0.95rem;
      margin: 0.55rem 0;
      border-radius: 15px;
      border: 1.6px solid rgba(91,161,255,0.13);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 8px #1ef9ff14;
      animation: slideInLeft 0.6s cubic-bezier(.23,.6,.5,1) both;
      backdrop-filter: blur(0.5px);
    }
    .rank-card.gold {
      border: 2.5px solid #ffd700cc !important;
      box-shadow: 0 0 14px #ffd70044;
    }
    .rank-card.silver {
      border: 2.5px solid #e0e5ebcc !important;
      box-shadow: 0 0 12px #e0e5eb55;
    }
    .rank-card.bronze {
      border: 2.5px solid #df964ecc !important;
      box-shadow: 0 0 10px #df964e44;
    }
    .project-icon {
      width: 35px; height: 35px;
      border-radius: 50%;
      margin-right: 1.0em;
      box-shadow: 0 1px 6px #00fff21a;
      object-fit: cover;
      border: 1.4px solid #232e4e;
      background: #18213b;
      display: inline-block;
      vertical-align: middle;
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .error {
      background: rgba(255,100,100,0.19);
      color: #ffcccc;
      padding: 1.2rem;
      border-radius: 12px;
      border: 1px solid rgba(255,100,100,0.21);
      margin: 1rem 0 0.4rem 0;
      font-size: 1.13rem;
    }
    .cache-indicator {
      position: absolute;
      top: 10px; left: 10px;
      background: rgba(76, 175, 80, 0.18);
      color: #1ef9ff;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      border: 1px solid #1ef9ff;
    }
    .footer {
      margin-top: 2.1rem;
      opacity: 0.74;
      font-size: 0.97rem;
      text-align: center;
      color: #b9eaff;
    }
    .share-btn {
      margin: 0.5em 0 0 0; background: linear-gradient(90deg,#1ef9ff,#b683ff 90%);
      color: #232e4e; font-weight: 700; border-radius: 11px;
      border: none; padding: 0.53em 1.3em; font-size:1.13em;
      cursor: pointer; box-shadow: 0 2px 12px #1ef9ff26;
      transition: background 0.15s, color 0.12s;
    }
    .share-btn:hover { background: linear-gradient(90deg,#b683ff,#1ef9ff 90%); color:#1a2b45;}
    @media (max-width: 600px) {
      .container { padding: 2.1rem 0.5rem 1.1rem 0.5rem; max-width: 99vw; border-radius: 17px; margin-top: 26px;}
      .kaito-gradient { font-size: 1.38rem; }
      .modes-list { gap: 0.7rem; }
      .results { padding: 1.1rem 0.35rem;}
      .by-over { right: 12px; top: 13px; font-size: 0.98rem;}
      .faq-btn { left: 8px; top: 9px; width:31px;height:31px;}
      .faq-popup { left: 5px; top: 48px; padding: 0.7em 0.65em 0.8em 0.85em; }
      .lang-switch { right: 3px; top: 7px; font-size:0.99rem;}
      .project-icon { width: 28px; height: 28px;}
    }
  </style>
</head>
<body>
  <div class="wave-bg">
    <div class="wave-glow"></div>
    <svg class="waves" viewBox="0 0 1440 500" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#1ef9ff" stop-opacity="0.19"/>
          <stop offset="100%" stop-color="#002045" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,350 Q360,290 720,350 T1440,350 V500 H0 Z" fill="url(#gradient)">
        <animate attributeName="d" dur="11s" repeatCount="indefinite"
          values="M0,350 Q360,290 720,350 T1440,350 V500 H0 Z;
                  M0,370 Q360,330 720,320 T1440,340 V500 H0 Z;
                  M0,340 Q360,380 720,320 T1440,370 V500 H0 Z;
                  M0,350 Q360,290 720,350 T1440,350 V500 H0 Z" />
      </path>
    </svg>
  </div>
  <div class="by-over" onclick="window.open('https://twitter.com/Over9725','_blank')">By OveR</div>
  <div class="container fade-in-up">
    <button class="faq-btn" id="faqBtn" title="How it works? / Как это работает?">?</button>
    <div class="lang-switch">
      <button id="langEn" class="lang-btn selected">EN</button> | <button id="langRu" class="lang-btn">RU</button>
    </div>
    <div id="faqPopup" class="faq-popup">
      <div class="faq-title" id="faqTitle">How it works?</div>
      <div class="faq-desc" id="faqDesc">
        Enter your Twitter username, select the search mode and start search. The service will show your TOP positions across 50+ trending crypto projects. Results are cached for better performance.
      </div>
    </div>
    <span class="kaito-gradient" id="mainTitle">Kaito Rank Tracker</span>
    <div class="kaito-subtitle desc-light" id="mainSubtitle">
      Find your rankings across 50+ TOP trending crypto projects
    </div>
    <div class="kaito-sub2 desc-light" id="mainSub2">
      Updated daily. Real Kaito data. Better insights.
    </div>
    <form class="search-form" id="searchForm" autocomplete="off">
      <input 
        type="text" 
        id="username" 
        placeholder="Enter Twitter username (@teddi_speaks)" 
        required
        maxlength="18"
        style="margin-top:1.7em;"
      >
      <div class="modes-list" id="modesList">
        <button class="mode-btn selected" data-mode="lightning" type="button">⚡ Lightning <span>(15)</span></button>
        <button class="mode-btn" data-mode="standard" type="button">🚀 Standard <span>(30)</span></button>
        <button class="mode-btn" data-mode="complete" type="button">🔥 Complete <span>(45)</span></button>
        <button class="mode-btn" data-mode="ultimate" type="button">💎 Ultimate <span>(50)</span></button>
      </div>
      <button type="submit" class="btn-shimmer" id="searchBtn">START SEARCH</button>
    </form>
    <button class="share-btn" id="shareBtn" style="display:none;">Share</button>
    <div id="results"></div>
    <div class="footer" id="footerTxt">
      Made by OveR // Kaito Community
    </div>
  </div>
  <script>
    // JS (оставил весь твой функционал, добавил цветные рамки + social share)
    class KaitoRankTrackerApp {
      constructor() {
        this.currentLang = "EN";
        this.selectedMode = "lightning";
        this.cache = new Map();
        this.searchInProgress = false;
        this.init();
      }
      init() {
        this.initEventListeners();
        this.setLang(this.currentLang);
      }
      initEventListeners() {
        document.getElementById('langEn').onclick = () => this.switchLang("EN");
        document.getElementById('langRu').onclick = () => this.switchLang("RU");
        const faqBtn = document.getElementById('faqBtn');
        const faqPopup = document.getElementById('faqPopup');
        let faqOpen = false;
        faqBtn.onclick = () => {
          faqOpen = !faqOpen;
          faqPopup.classList.toggle('active', faqOpen);
        };
        window.onclick = (e) => {
          if(faqOpen && !faqPopup.contains(e.target) && !faqBtn.contains(e.target)) {
            faqPopup.classList.remove('active'); 
            faqOpen = false;
          }
        };
        document.querySelectorAll('.mode-btn').forEach(btn => {
          btn.onclick = () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            this.selectedMode = btn.dataset.mode;
          };
        });
        document.getElementById('searchForm').onsubmit = (e) => {
          e.preventDefault();
          this.performSearch();
        };
        let debounceTimer;
        document.getElementById('username').oninput = (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.validateUsername(e.target.value);
          }, 500);
        };
        document.getElementById('shareBtn').onclick = () => {
          if (navigator.share) {
            navigator.share({
              title: "Kaito Rank Tracker",
              text: "Check out my crypto rankings!",
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            document.getElementById('shareBtn').textContent = "Copied!";
            setTimeout(()=>{document.getElementById('shareBtn').textContent="Share"},1200)
          }
        }
      }
      validateUsername(username) {
        const cleanUsername = username.replace('@', '').trim();
        const isValid = /^[a-zA-Z0-9_]{1,15}$/.test(cleanUsername);
        const input = document.getElementById('username');
        if (cleanUsername && !isValid) {
          input.style.borderColor = '#ff6b6b';
        } else {
          input.style.borderColor = '#232e4e';
        }
      }
      switchLang(lang) {
        document.getElementById('langEn').classList.toggle('selected', lang === "EN");
        document.getElementById('langRu').classList.toggle('selected', lang === "RU");
        this.currentLang = lang;
        this.setLang(lang);
      }
      setLang(lang) {
        const langPack = this.getLangPack();
        document.getElementById('mainTitle').textContent = langPack[lang].title;
        document.getElementById('mainSubtitle').textContent = langPack[lang].subtitle;
        document.getElementById('mainSub2').textContent = langPack[lang].sub2;
        document.getElementById('searchBtn').textContent = langPack[lang].btn;
        document.getElementById('username').placeholder = langPack[lang].username;
        document.getElementById('faqTitle').textContent = langPack[lang].faqTitle;
        document.getElementById('faqDesc').textContent = langPack[lang].faqDesc;
        document.getElementById('footerTxt').textContent = langPack[lang].footer;
        const modesBtns = document.querySelectorAll('.mode-btn');
        modesBtns.forEach((btn, i) => {
          btn.innerHTML = langPack[lang].modes[i].icon + ' ' + langPack[lang].modes[i].name + ' <span>(' + langPack[lang].modes[i].desc + ')</span>';
        });
      }
      getLangPack() {
        return {
          EN: {
            title: "🎯 Kaito Rank Tracker",
            subtitle: "Find your rankings across 50+ TOP trending crypto projects",
            sub2: "Updated daily. Real Kaito data. Better insights.",
            btn: "START SEARCH",
            username: "Enter Twitter username (@teddi_speaks)",
            faqTitle: "How it works?",
            faqDesc: "Enter your Twitter username, select the search mode and start search. The service will show your TOP positions across 50+ trending crypto projects. Results are cached for better performance.",
            modes: [
              {icon:"⚡",name:"Lightning",desc:"15 projects"},
              {icon:"🚀",name:"Standard",desc:"30 projects"},
              {icon:"🔥",name:"Complete",desc:"45 projects"},
              {icon:"💎",name:"Ultimate",desc:"50 projects"},
            ],
            footer: "Made by OveR // Kaito Community"
          },
          RU: {
            title: "🎯 Kaito Rank Tracker",
            subtitle: "Проверь свой рейтинг в 50+ ТОП трендовых крипто проектах",
            sub2: "Обновляется ежедневно. Реальные данные Kaito. Больше инсайтов.",
            btn: "ПОИСК",
            username: "Введи ник в Twitter (@teddi_speaks)",
            faqTitle: "Как это работает?",
            faqDesc: "Введи свой Twitter username, выбери режим поиска и начни поиск. Сервис покажет твои TOP-позиции по 50+ трендовым крипто-проектам. Результаты кешируются для лучшей производительности.",
            modes: [
              {icon:"⚡",name:"Быстрый",desc:"15 проектов"},
              {icon:"🚀",name:"Стандарт",desc:"30 проектов"},
              {icon:"🔥",name:"Полный",desc:"45 проектов"},
              {icon:"💎",name:"Ultimate",desc:"50 проектов"},
            ],
            footer: "Сделано OveR // Kaito Community"
          }
        };
      }
      async performSearch() {
        if (this.searchInProgress) return;
        const username = document.getElementById('username').value.trim();
        if (!username) {
          alert(this.currentLang === "EN" ? "Enter username!" : "Введите ник!");
          return;
        }
        const cacheKey = username + '_' + this.selectedMode;
        const cachedResult = this.cache.get(cacheKey);
        if (cachedResult && (Date.now() - cachedResult.timestamp) < 30 * 60 * 1000) {
          this.displayResults(cachedResult.data, true);
          document.getElementById('shareBtn').style.display = "inline-block";
          return;
        }
        this.searchInProgress = true;
        const searchBtn = document.getElementById('searchBtn');
        const resultsDiv = document.getElementById('results');
        searchBtn.disabled = true;
        searchBtn.textContent = this.currentLang === "EN" ? "SEARCHING..." : "ПОИСК...";
        this.showLoadingWithProgress();
        try {
          const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, mode: this.selectedMode })
          });
          const data = await response.json();
          if (data.success && data.data) {
            this.cache.set(cacheKey, {
              data: data.data,
              timestamp: Date.now()
            });
            this.displayResults(data.data, false);
            document.getElementById('shareBtn').style.display = "inline-block";
          } else {
            throw new Error(data.error || (this.currentLang === "EN" ? "Search failed" : "Поиск не удался"));
          }
        } catch (error) {
          resultsDiv.innerHTML = '<div class="error"><h3>❌ Error</h3><p>' + error.message + '</p></div>';
        } finally {
          this.searchInProgress = false;
          searchBtn.disabled = false;
          searchBtn.textContent = this.getLangPack()[this.currentLang].btn;
        }
      }
      showLoadingWithProgress() {
        const resultsDiv = document.getElementById('results');
        const modeData = {
          lightning: { projects: 15, time: 5 },
          standard: { projects: 30, time: 8 },
          complete: { projects: 45, time: 12 },
          ultimate: { projects: 50, time: 15 }
        };
        const currentMode = modeData[this.selectedMode];
        let progress = 0;
        const interval = (currentMode.time * 1000) / 100;
        resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><div class="progress-container"><div class="progress-bar" id="progressBar" style="width: 0%"></div></div><p style="color:#b3eaff; opacity:0.87">' + (this.currentLang === "EN" ? "Searching" : "Поиск") + ' <b>' + document.getElementById('username').value + '</b> ' + (this.currentLang === "EN" ? "in" : "в") + ' <b>' + this.selectedMode + '</b> mode...</p><p style="font-size:0.97rem; opacity:0.68; margin:0.4em 0 0 0;"><small><span id="progressText">0/' + currentMode.projects + ' projects checked</span><br>' + (this.currentLang === "EN" ? "Estimated time" : "Примерное время") + ': ' + currentMode.time + 's</small></p></div>';
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const progressInterval = setInterval(() => {
          progress += 1;
          const projectsChecked = Math.floor((progress / 100) * currentMode.projects);
          progressBar.style.width = progress + '%';
          progressText.textContent = projectsChecked + '/' + currentMode.projects + ' projects checked';
          if (progress >= 100) {
            clearInterval(progressInterval);
          }
        }, interval);
        this.progressInterval = progressInterval;
      }
      displayResults(data, fromCache = false) {
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }
        const { user, stats, rankings, analysis } = data;
        const resultsDiv = document.getElementById('results');
        let html = '<div style="position: relative;">' + (fromCache ? '<div class="cache-indicator">📦 Cached</div>' : '') + '<h3 style="font-size:1.24rem; color:#1ef9ff; margin-bottom:1.1em;">' + (this.currentLang === "EN" ? "📊 Results for" : "📊 Результаты для") + ' <b>' + user.username + '</b></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;"><div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Projects Found" : "Проектов найдено") + '</strong><br><span style="font-size:1.5rem; color:#18ffe7;">' + stats.found_in + '</span><span style="color:#999;">/' + stats.total_projects + '</span></div></div><div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Processing Time" : "Время обработки") + '</strong><br><span style="font-size:1.5rem;">' + stats.processing_time + 's</span></div></div>';
        if (analysis && analysis.best_rank) {
          html += '<div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Best Rank" : "Лучший ранг") + '</strong><br><span style="font-size:1.5rem; color:#ffd700;">#' + analysis.best_rank + '</span></div></div><div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Performance" : "Перформанс") + '</strong><br><span style="font-size:1.2rem; text-transform:capitalize; color:#18ffe7;">' + analysis.performance_level + '</span></div></div>';
        }
        html += '</div>';
        if (rankings && rankings.length > 0) {
          html += '<h4 style="margin-top:1.3em; color:#b8faff;">' + (this.currentLang === "EN" ? "🎯 Rankings Found:" : "🎯 Найденные ранги:") + '</h4>';
          rankings.forEach((rank, index) => {
            let cardClass = '';
            if (index === 0) cardClass = 'gold';
            else if (index === 1) cardClass = 'silver';
            else if (index === 2) cardClass = 'bronze';
            const emoji = ['🥇','🥈','🥉','4️⃣','5️⃣'][index] || '📊';
            const tierIcon = rank.tier === 'top' ? '🔥' : rank.tier === 'high' ? '⚡' : rank.tier === 'mid' ? '🚀' : '💎';
            html += '<div class="rank-card '+cardClass+'" style="animation-delay: ' + (index * 0.11) + 's;"><img class="project-icon" src="https://cryptologos.cc/logos/'+encodeURIComponent(rank.project.toLowerCase().replace(/ /g,'-'))+'-logo.png?v=031" alt="'+rank.project+' logo"/><div><strong>' + emoji + ' ' + rank.project + '</strong><br><small style="color:#88e6ff;">' + rank.tier.toUpperCase() + ' tier • ' + rank.trending_percentage + '% trending</small></div><div style="text-align:right;"><strong style="color:#ffd700;">#' + rank.rank + '</strong> ' + tierIcon + '<br><small style="color:#999;">' + rank.total_users_checked + ' users</small></div></div>';
          });
          if (analysis && analysis.recommendations && analysis.recommendations.length > 0) {
            html += '<h4 style="color:#ffe877;margin:1.3em 0 0.2em 0;">' + (this.currentLang === "EN" ? "💡 Recommendations:" : "💡 Рекомендации:") + '</h4><ul style="color:#c8e6ff; opacity:0.9;">';
            analysis.recommendations.forEach(rec => {
              html += '<li style="margin:0.5rem 0;">' + rec + '</li>';
            });
            html += '</ul>';
          }
        } else {
          html += '<div class="error" style="color:#ffe8e8"><h4 style="margin:0 0 0.2em 0;">' + (this.currentLang === "EN" ? "🔍 No Rankings Found" : "🔍 Ранги не найдены") + '</h4><p style="margin:0.2em 0;">' + user.username + ' ' + (this.currentLang === "EN" ? "was not found in the TOP 100 of any checked projects." : "не найден в ТОП-100 ни в одном из проверенных проектов.") + '</p><p style="font-size:0.96em; opacity:0.7;">💡 ' + (this.currentLang === "EN" ? "This doesn't mean they're not ranked - they might be in positions 101+ (API limitation)" : "Это не значит, что его нет в рейтинге — возможно, он ниже 100 места (ограничение API)") + '</p></div>';
        }
        html += '</div>';
        resultsDiv.innerHTML = html;
      }
    }
    new KaitoRankTrackerApp();
  </script>
</body>
</html>
  `);
}
