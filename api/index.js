// Kaito Rank Checker - by OveR | index.js
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kaito Rank Tracker - by OveR</title>
  <!-- SEO & OpenGraph -->
  <meta name="description" content="Kaito Rank Checker — Find your Twitter account in 80+ trending crypto project leaderboards. Made by OveR.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Kaito Rank Tracker — by OveR">
  <meta property="og:description" content="Find your Twitter account in 80+ trending crypto project leaderboards.">
  <meta property="og:url" content="https://kaito-rank-checker.vercel.app/">
  <meta property="og:image" content="/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Kaito Rank Tracker — by OveR">
  <meta name="twitter:description" content="Check your crypto influence: Are you in the TOP across 80+ projects?">
  <meta name="twitter:image" content="/og-image.png">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:700,400&display=swap" rel="stylesheet">
  <style>
    html, body { min-height: 100vh; margin: 0; padding: 0;}
    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(120deg, #191b2c 0%, #4a40c7 70%, #5ad0ff 100%);
      color: #e6eaf7;
      min-height: 100vh;
      box-sizing: border-box;
      position: relative;
      overflow-x: hidden;
    }
    .bg-net {
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 0;
      opacity: 0.09;
      background-image:
        repeating-linear-gradient(120deg, #fff 0 1px, transparent 1px 60px),
        repeating-linear-gradient(60deg, #fff 0 1px, transparent 1px 60px);
    }
    .bg-glow {
      position: fixed;
      right: 12vw; top: 10vh;
      width: 330px; height: 330px;
      pointer-events: none;
      border-radius: 50%;
      background: radial-gradient(circle, #8ed0fc55 0%, #694aff00 70%);
      filter: blur(24px);
      z-index: 0;
      opacity: 0.20;
    }
    .by-over {
      position: fixed;
      top: 28px; right: 38px;
      z-index: 20;
      font-family: 'Montserrat', Arial, sans-serif;
      font-weight: 700;
      font-size: 1.24rem;
      letter-spacing: 0.13em;
      color: #fff;
      text-shadow: 0 0 18px #8bd6ff, 0 0 4px #698aff;
      opacity: 0.91;
      user-select: none;
      transition: text-shadow 0.2s, color 0.15s;
    }
    .by-over:hover {
      text-shadow: 0 0 36px #8bf, 0 0 8px #69f;
      color: #7ffcff;
      cursor: pointer;
    }
    .container {
      position: relative;
      z-index: 2;
      background: rgba(24,28,54,0.82);
      border-radius: 28px;
      padding: 3.2rem 2.4rem 2.1rem 2.4rem;
      max-width: 420px;
      margin: 56px auto 0 auto;
      box-shadow: 0 8px 36px 0 #1b254d4d, 0 2px 16px #2f387710;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeInUp 1.0s cubic-bezier(.22,.68,.48,1.01) 0.13s both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px);}
      to { opacity: 1; transform: none;}
    }
    h1 {
      font-weight: 700;
      font-size: 2.6rem;
      margin-bottom: 1.0rem;
      background: linear-gradient(90deg, #e8eefb 75%, #43d5ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      letter-spacing: 0.03em;
      display: flex;
      align-items: center;
    }
    .kaito-subtitle {
      font-size: 1.17rem;
      margin-bottom: 0.23rem;
      opacity: 0.88;
      text-align: center;
    }
    .kaito-sub2 {
      margin-top: 0.14rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: #d6f6ff;
      opacity: 0.97;
    }
    .lang-switch {
      position: absolute;
      right: 24px; top: 28px;
      font-size: 1.03rem;
      z-index: 25;
      user-select: none;
    }
    .lang-btn {
      background: none;
      border: none;
      color: #88e6ff;
      font-weight: 700;
      font-size: 1.1rem;
      margin-left: 0.17em;
      cursor: pointer;
      padding: 2px 7px;
      border-radius: 7px;
      transition: background .16s, color .12s;
    }
    .lang-btn.selected,
    .lang-btn:hover {
      background: #262e56;
      color: #fff;
    }
    .faq-btn {
      position: absolute;
      left: 20px; top: 28px;
      width: 36px; height: 36px;
      border: none;
      background: linear-gradient(135deg, #313a5c 50%, #5274da 100%);
      color: #93d5ff;
      font-weight: 900;
      border-radius: 50%;
      box-shadow: 0 2px 12px #2eb8ff13;
      cursor: pointer;
      font-size: 1.25em;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 25;
      transition: background .18s;
    }
    .faq-btn:hover {
      background: linear-gradient(135deg, #5274da 50%, #313a5c 100%);
      color: #fff;
    }
    .faq-popup {
      position: absolute;
      left: 24px; top: 74px;
      z-index: 99;
      background: rgba(25,28,54,0.99);
      border-radius: 17px;
      box-shadow: 0 4px 32px #217bff26;
      padding: 1.25em 1.25em 1.2em 1.35em;
      width: 95vw;
      max-width: 340px;
      min-height: 80px;
      animation: fadeInUp .36s cubic-bezier(.18,.7,.52,1.1);
      display: none;
    }
    .faq-popup.active { display: block; }
    .faq-title {
      font-size: 1.15em;
      color: #4be3ff;
      font-weight: 700;
      margin-bottom: 0.8em;
      letter-spacing: 0.03em;
    }
    .faq-desc {
      font-size: 1.09em;
      color: #eaf6ff;
      opacity: 0.92;
    }
    .modes-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.95rem;
      margin: 1.2rem 0 1.7rem 0;
    }
    .mode-btn {
      background: rgba(55,62,113,0.70);
      border: 2px solid #353866;
      border-radius: 14px;
      color: #b9f7ff;
      font-weight: 700;
      font-size: 1.13rem;
      padding: 1.1rem 1.4rem;
      box-shadow: 0 2px 18px #35b0ff12;
      display: flex;
      align-items: center;
      gap: 0.66em;
      cursor: pointer;
      transition: background 0.2s, border 0.2s, box-shadow 0.23s, color 0.17s;
      outline: none;
      margin-bottom: 0;
    }
    .mode-btn.selected,
    .mode-btn:hover {
      background: linear-gradient(90deg, #1a375c 0%, #6c3af5 100%);
      border-color: #6ec2fa;
      color: #fff;
      box-shadow: 0 4px 26px #51eaff29, 0 2px 14px #4e4cff12;
    }
    .mode-btn span {
      font-size: 1.08em;
    }
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
      background: rgba(40,44,64,0.89);
      color: #f3fcff;
      border: 1.5px solid #334b85;
      font-size: 1.04rem;
      margin-bottom: 0;
      transition: border 0.17s, background 0.13s;
      font-family: inherit;
      font-weight: 500;
    }
    .search-form input:focus, .search-form select:focus {
      outline: none;
      border-color: #7ee8ff;
      background: rgba(40,44,94,0.97);
    }
    .btn-shimmer {
      background: linear-gradient(90deg, #5cc8fa 0, #838cf7 100%);
      position: relative;
      overflow: hidden;
      color: #222243;
      font-weight: 700;
      border-radius: 13px;
      font-size: 1.25rem;
      padding: 1.06rem 0;
      width: 100%;
      letter-spacing: 0.03em;
      border: none;
      box-shadow: 0 6px 22px #0002;
      cursor: pointer;
      margin-top: 0.6rem;
      margin-bottom: 0.1rem;
      transition: box-shadow .18s, background .28s, color .18s;
    }
    .btn-shimmer:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #333;
      color: #999;
    }
    .btn-shimmer:after {
      content: '';
      display: block;
      position: absolute;
      left: -120px; top: 0; bottom: 0;
      width: 70px;
      background: linear-gradient(120deg, #fff9 30%, #fff3 70%, transparent 100%);
      transform: skewX(-22deg);
      opacity: 0;
      pointer-events: none;
    }
    .btn-shimmer:hover:not(:disabled) {
      box-shadow: 0 8px 32px #60e2ff38;
      background: linear-gradient(90deg, #85e7ff 0, #918cfc 100%);
      color: #0b1125;
    }
    .btn-shimmer:hover:not(:disabled):after {
      left: 140px;
      opacity: 1;
      transition: left .7s cubic-bezier(.5,.05,.1,1), opacity .13s;
    }
    .results {
      margin-top: 2.3rem;
      width: 100%;
      background: rgba(34,41,66,0.84);
      border-radius: 19px;
      padding: 1.5rem 1.3rem 1.4rem 1.3rem;
      box-shadow: 0 2px 14px #50ccff15;
      text-align: left;
      animation: fadeInUp 1s cubic-bezier(.23,.6,.5,1) 0.08s both;
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
      background: linear-gradient(90deg, #5cc8fa 0%, #838cf7 100%);
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
      border: 3.5px solid #2f335c;
      border-radius: 50%;
      border-top: 3.5px solid #89dfff;
      width: 41px;
      height: 41px;
      animation: spin 1.13s linear infinite;
      margin: 0 auto 1.0rem;
    }
    @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
    .rank-card {
      background: rgba(36,46,76,0.69);
      padding: 1rem 0.95rem;
      margin: 0.46rem 0;
      border-radius: 12px;
      border: 1px solid rgba(91,161,255,0.09);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 6px #34eaff08;
      animation: slideInLeft 0.5s ease;
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
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
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      border: 1px solid #4caf50;
    }
    .export-btn {
      margin-top: 1rem;
      padding: 0.8rem 1.5rem;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .export-btn:hover {
      transform: translateY(-2px);
    }
    .footer {
      margin-top: 2.1rem;
      opacity: 0.74;
      font-size: 0.97rem;
      text-align: center;
      color: #cedcff;
    }
    @media (max-width: 600px) {
      .container { padding: 2.1rem 0.5rem 1.1rem 0.5rem; max-width: 98vw; border-radius: 19px; margin-top: 26px;}
      h1 { font-size: 2.1rem; }
      .modes-list { gap: 0.7rem; }
      .results { padding: 1.1rem 0.35rem;}
      .by-over { right: 14px; top: 15px; font-size: 1.05rem;}
      .faq-btn { left: 11px; top: 11px; width:32px;height:32px;}
      .faq-popup { left: 10px; top: 51px; padding: 0.8em 0.85em 0.9em 0.95em; }
      .lang-switch { right: 8px; top: 10px; font-size:1.01rem;}
    }
  </style>
</head>
<body>
  <div class="bg-net"></div>
  <div class="bg-glow"></div>
  <div class="by-over">By OveR</div>
  <div class="container fade-in-up">
    <button class="faq-btn" id="faqBtn" title="How it works? / Как это работает?">?</button>
    <div class="lang-switch">
      <button id="langEn" class="lang-btn selected">EN</button> | <button id="langRu" class="lang-btn">RU</button>
    </div>
    <div id="faqPopup" class="faq-popup">
      <div class="faq-title" id="faqTitle">How it works?</div>
      <div class="faq-desc" id="faqDesc">
        Enter your Twitter username, select the search mode and start search. The service will show your TOP positions across 80+ trending crypto projects. Results are cached for better performance.
      </div>
    </div>
    <h1 id="mainTitle">🎯 Kaito Rank Tracker</h1>
    <div class="kaito-subtitle" id="mainSubtitle">
      Find your rankings across 80+ trending crypto projects
    </div>
    <div class="kaito-sub2" id="mainSub2">
      More projects. Better insights. Real analytics.
    </div>
    <form class="search-form" id="searchForm" autocomplete="off">
      <input 
        type="text" 
        id="username" 
        placeholder="Enter Twitter username (@teddi_speaks)" 
        required
        maxlength="18"
        style="margin-top:1.8em;"
      >
      <div class="modes-list" id="modesList">
        <button class="mode-btn selected" data-mode="lightning" type="button">⚡ Lightning <span>(15)</span></button>
        <button class="mode-btn" data-mode="standard" type="button">🚀 Standard <span>(35)</span></button>
        <button class="mode-btn" data-mode="complete" type="button">🔥 Complete <span>(65)</span></button>
        <button class="mode-btn" data-mode="ultimate" type="button">💎 Ultimate <span>(80)</span></button>
      </div>
      <button type="submit" class="btn-shimmer" id="searchBtn">START SEARCH</button>
    </form>
    <div id="results"></div>
    <div class="footer" id="footerTxt">
      Made by OveR // Kaito Community
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/tsparticles@3.3.0/tsparticles.bundle.min.js"></script>
  <script>
    class KaitoRankTrackerApp {
      constructor() {
        this.currentLang = "EN";
        this.selectedMode = "lightning";
        this.cache = new Map();
        this.searchInProgress = false;
        this.init();
      }

      init() {
        this.initParticles();
        this.initEventListeners();
        this.setLang(this.currentLang);
      }

      initParticles() {
        window.addEventListener('DOMContentLoaded', () => {
          if (window.tsParticles) {
            tsParticles.load("bg-particles", {
              fullScreen: { enable: false },
              particles: {
                number: { value: 34 },
                color: { value: ["#65d8fc","#b3bfff","#6272ff","#55f6e6"] },
                shape: { type: "circle" },
                opacity: { value: 0.19, random: true },
                size: { value: { min: 1, max: 3.3 } },
                move: { enable: true, speed: 0.25, direction: "none", outModes: "out" }
              },
              interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
              detectRetina: true
            });
          }
        });
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
      }

      validateUsername(username) {
        const cleanUsername = username.replace('@', '').trim();
        const isValid = /^[a-zA-Z0-9_]{1,15}$/.test(cleanUsername);
        
        const input = document.getElementById('username');
        if (cleanUsername && !isValid) {
          input.style.borderColor = '#ff6b6b';
        } else {
          input.style.borderColor = '#334b85';
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
            subtitle: "Find your rankings across 80+ trending crypto projects",
            sub2: "More projects. Better insights. Real analytics.",
            btn: "START SEARCH",
            username: "Enter Twitter username (@teddi_speaks)",
            faqTitle: "How it works?",
            faqDesc: "Enter your Twitter username, select the search mode and start search. The service will show your TOP positions across 80+ trending crypto projects. Results are cached for better performance.",
            modes: [
              {icon:"⚡",name:"Lightning",desc:"15 projects"},
              {icon:"🚀",name:"Standard",desc:"35 projects"},
              {icon:"🔥",name:"Complete",desc:"65 projects"},
              {icon:"💎",name:"Ultimate",desc:"80 projects"},
            ],
            footer: "Made by OveR // Kaito Community"
          },
          RU: {
            title: "🎯 Kaito Rank Tracker",
            subtitle: "Проверь свой рейтинг в 80+ топовых крипто проектах",
            sub2: "Больше проектов. Больше инсайтов. Настоящая аналитика.",
            btn: "ПОИСК",
            username: "Введи ник в Twitter (@teddi_speaks)",
            faqTitle: "Как это работает?",
            faqDesc: "Введи свой Twitter username, выбери режим поиска и начни поиск. Сервис покажет твои TOP-позиции по 80+ трендовым крипто-проектам. Результаты кешируются для лучшей производительности.",
            modes: [
              {icon:"⚡",name:"Быстрый",desc:"15 проектов"},
              {icon:"🚀",name:"Стандарт",desc:"35 проектов"},
              {icon:"🔥",name:"Полный",desc:"65 проектов"},
              {icon:"💎",name:"Ultimate",desc:"80 проектов"},
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
          lightning: { projects: 15, time: 8 },
          standard: { projects: 35, time: 20 },
          complete: { projects: 65, time: 45 },
          ultimate: { projects: 80, time: 60 }
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
        
        let html = '<div style="position: relative;">' + (fromCache ? '<div class="cache-indicator">📦 Cached</div>' : '') + '<h3 style="font-size:1.24rem; color:#71eaff; margin-bottom:1.1em;">' + (this.currentLang === "EN" ? "📊 Results for" : "📊 Результаты для") + ' <b>' + user.username + '</b></h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;"><div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Projects Found" : "Проектов найдено") + '</strong><br><span style="font-size:1.5rem; color:#4caf50;">' + stats.found_in + '</span><span style="color:#999;">/' + stats.total_projects + '</span></div></div><div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Processing Time" : "Время обработки") + '</strong><br><span style="font-size:1.5rem;">' + stats.processing_time + 's</span></div></div>';

        if (analysis && analysis.best_rank) {
          html += '<div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Best Rank" : "Лучший ранг") + '</strong><br><span style="font-size:1.5rem; color:#ffd700;">#' + analysis.best_rank + '</span></div></div><div class="rank-card"><div><strong>' + (this.currentLang === "EN" ? "Performance" : "Перформанс") + '</strong><br><span style="font-size:1.2rem; text-transform:capitalize; color:#4ecdc4;">' + analysis.performance_level + '</span></div></div>';
        }

        html += '</div>';

        if (rankings && rankings.length > 0) {
          html += '<h4 style="margin-top:1.3em; color:#7ee2ff;">' + (this.currentLang === "EN" ? "🎯 Rankings Found:" : "🎯 Найденные ранги:") + '</h4>';
          
          rankings.forEach((rank, index) => {
            const emoji = ['🥇','🥈','🥉','4️⃣','5️⃣'][index] || '📊';
            const tierIcon = rank.tier === 'top' ? '🔥' : rank.tier === 'high' ? '⚡' : rank.tier === 'mid' ? '🚀' : '💎';
            
            html += '<div class="rank-card" style="animation-delay: ' + (index * 0.1) + 's;"><div><strong>' + emoji + ' ' + rank.project + '</strong><br><small style="color:#88e6ff;">' + rank.tier.toUpperCase() + ' tier • ' + rank.trending_percentage + '% trending</small></div><div style="text-align:right;"><strong style="color:#ffd700;">#' + rank.rank + '</strong> ' + tierIcon + '<br><small style="color:#999;">' + rank.total_users_checked + ' users</small></div></div>';
          });

          if (analysis && analysis.recommendations && analysis.recommendations.length > 0) {
            html += '<h4 style="color:#ffe877;margin:1.3em 0 0.2em 0;">' + (this.currentLang === "EN" ? "💡 Recommendations:" : "💡 Рекомендации:") + '</h4><ul style="color:#c8e6ff; opacity:0.9;">';
            analysis.recommendations.forEach(rec => {
              html += '<li style="margin:0.5rem 0;">' + rec + '</li>';
            });
            html += '</ul>';
          }

          html += '<button class="export-btn" onclick="app.exportResults(\'' + user.username + '\')">📄 ' + (this.currentLang === "EN" ? "Export Results" : "Экспорт результатов") + '</button>';
        } else {
          html += '<div class="error" style="color:#ffe8e8"><h4 style="margin:0 0 0.2em 0;">' + (this.currentLang === "EN" ? "🔍 No Rankings Found" : "🔍 Ранги не найдены") + '</h4><p style="margin:0.2em 0;">' + user.username + ' ' + (this.currentLang === "EN" ? "was not found in the TOP 100 of any checked projects." : "не найден в ТОП-100 ни в одном из проверенных проектов.") + '</p><p style="font-size:0.96em; opacity:0.7;">💡 ' + (this.currentLang === "EN" ? "This doesn't mean they're not ranked - they might be in positions 101+ (API limitation)" : "Это не значит, что его нет в рейтинге — возможно, он ниже 100 места (ограничение API)") + '</p></div>';
        }

        html += '</div>';
        resultsDiv.innerHTML = html;
      }

      exportResults(username) {
        const resultsDiv = document.getElementById('results');
        const rankCards = resultsDiv.querySelectorAll('.rank-card');
        
        let csvContent = "Project,Rank,Tier,Trending%,Users\\n";
        
        rankCards.forEach(card => {
          const cardText = card.textContent;
          if (cardText.includes('#')) {
            const lines = cardText.split('\\n').filter(line => line.trim());
            if (lines.length >= 2) {
              csvContent += '"' + lines[0] + '","' + lines[1] + '","","",""\\n';
            }
          }
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kaito-rankings-' + username + '-' + new Date().toISOString().split('T')[0] + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    }

    const app = new KaitoRankTrackerApp();
  </script>
  <div id="bg-particles" style="position:fixed; inset:0; z-index:0;"></div>
</body>
</html>
  `);
}
