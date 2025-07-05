// Vercel serverless function - Main page (full UI upgrade by @Over9725)
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kaito Rank Tracker - by OveR</title>
      <link href="https://fonts.googleapis.com/css?family=Montserrat:700,400&display=swap" rel="stylesheet">
      <style>
        html, body {
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
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
        .btn-shimmer:hover {
          box-shadow: 0 8px 32px #60e2ff38;
          background: linear-gradient(90deg, #85e7ff 0, #918cfc 100%);
          color: #0b1125;
        }
        .btn-shimmer:hover:after {
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
        .spinner {
          border: 3.5px solid #2f335c;
          border-radius: 50%;
          border-top: 3.5px solid #89dfff;
          width: 41px;
          height: 41px;
          animation: spin 1.13s linear infinite;
          margin: 0 auto 1.0rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .skeleton {
          background: linear-gradient(90deg, #222749 25%, #38406c 50%, #222749 75%);
          background-size: 400% 100%;
          animation: skeleton 1.3s infinite linear;
          border-radius: 10px;
          min-height: 35px;
        }
        @keyframes skeleton {
          0% { background-position: 100% 50% }
          100% { background-position: 0 50% }
        }
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
        .tooltip {
          position: relative;
          cursor: pointer;
        }
        .tooltip .tooltip-text {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          bottom: 110%; left: 50%; transform: translateX(-50%);
          background: #232456cc;
          color: #b4d2ff;
          padding: 0.43em 1em;
          border-radius: 7px;
          font-size: 0.97em;
          white-space: nowrap;
          z-index: 10;
          transition: all .19s;
          pointer-events: none;
        }
        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
          bottom: 130%;
        }
        .footer {
          margin-top: 2.1rem;
          opacity: 0.74;
          font-size: 0.97rem;
          text-align: center;
          color: #cedcff;
        }
        .footer a {
          color: #c6eaff;
          text-decoration: underline;
          transition: color .13s;
        }
        .footer a:hover {
          color: #8cf6ff;
        }
        @media (max-width: 600px) {
          .container {
            padding: 2.1rem 0.5rem 1.1rem 0.5rem;
            max-width: 98vw;
            border-radius: 19px;
            margin-top: 26px;
          }
          h1 { font-size: 2.1rem; }
          .modes-list { gap: 0.7rem; }
          .results { padding: 1.1rem 0.35rem;}
          .by-over { right: 14px; top: 15px; font-size: 1.05rem;}
        }
      </style>
    </head>
    <body>
      <div class="bg-net"></div>
      <div class="bg-glow"></div>
      <div class="by-over">By OveR</div>

      <div class="container fade-in-up">
        <h1>☁️ Kaito Rank <span style="color:#43d5ff;">Tracker</span></h1>
        <div class="kaito-subtitle">Find your rankings across 60+ trending crypto projects.</div>
        <div class="kaito-sub2">More projects. <span style="color:#53e3fe;">Better insights.</span></div>
        
        <div class="modes-list" id="modeList">
          <button class="mode-btn selected tooltip" data-mode="lightning">
            <span>⚡ Lightning</span>
            <span class="tooltip-text">Fastest scan<br>15 projects, 1-2 min</span>
          </button>
          <button class="mode-btn tooltip" data-mode="standard">
            <span>🚀 Standard</span>
            <span class="tooltip-text">Balanced<br>35 projects, 3-5 min</span>
          </button>
          <button class="mode-btn tooltip" data-mode="complete">
            <span>🔥 Complete</span>
            <span class="tooltip-text">Most projects<br>60+ projects, 8-12 min</span>
          </button>
          <button class="mode-btn tooltip" data-mode="ultimate">
            <span>💎 Ultimate</span>
            <span class="tooltip-text">All available<br>80 projects, 12-20 min</span>
          </button>
        </div>
        <form class="search-form" id="searchForm" autocomplete="off">
          <input
            type="text"
            id="username"
            placeholder="Twitter username (@handle)"
            required
            maxlength="32"
            autocapitalize="off"
            spellcheck="false"
          >
          <select id="modeSelect">
            <option value="lightning">⚡ Lightning (15 projects)</option>
            <option value="standard" selected>🚀 Standard (35 projects)</option>
            <option value="complete">🔥 Complete (60+ projects)</option>
            <option value="ultimate">💎 Ultimate (80 projects)</option>
          </select>
          <button type="submit" id="searchBtn" class="btn-shimmer fade-in-up">START SEARCH</button>
        </form>
        <div id="results" class="results" style="display:none"></div>
        <div class="footer">Made by @Over9725 | <a href="/health">Health Check</a></div>
      </div>
      
      <script>
        // Easter egg пасхалка для By OveR
        let overClicks = 0;
        document.querySelector('.by-over').addEventListener('click', () => {
          overClicks++;
          if (overClicks === 5) {
            alert('👀 Hidden “Kaito Pro Mode” soon...');
            overClicks = 0;
          }
        });

        // Выбор режима кликом по карточке
        const modeList = document.getElementById('modeList');
        const modeSelect = document.getElementById('modeSelect');
        modeList.querySelectorAll('.mode-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            modeList.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            modeSelect.value = btn.dataset.mode;
          });
        });
        modeSelect.addEventListener('change', e => {
          modeList.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
          const selBtn = modeList.querySelector('.mode-btn[data-mode="'+modeSelect.value+'"]');
          if (selBtn) selBtn.classList.add('selected');
        });

        // Поиск
        document.getElementById('searchForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value.trim();
          const mode = document.getElementById('modeSelect').value;
          const resultsDiv = document.getElementById('results');
          const searchBtn = document.getElementById('searchBtn');
          if (!username) {
            alert('Please enter a username');
            return;
          }
          // Скелетон загрузка
          searchBtn.disabled = true;
          searchBtn.innerHTML = 'Searching...';
          resultsDiv.style.display = 'block';
          resultsDiv.innerHTML = \`
            <div class="loading">
              <div class="spinner"></div>
              <div style="margin-top:0.8rem">
                <div class="skeleton" style="width:240px; height:32px; margin:8px auto;"></div>
                <div class="skeleton" style="width:180px; height:28px; margin:8px auto;"></div>
                <div class="skeleton" style="width:160px; height:26px; margin:10px auto;"></div>
              </div>
              <p style="margin-top:20px; color:#b3eaff; opacity:0.87">Searching <b>\${username}</b> in <b>\${mode}</b> mode...</p>
              <p style="font-size:0.97rem; opacity:0.68; margin:0.4em 0 0 0;"><small>This may take several minutes depending on the mode</small></p>
            </div>
          \`;
          try {
            const response = await fetch('/api/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, mode })
            });
            const data = await response.json();
            if (data.success && data.data) {
              displayResults(data.data);
            } else {
              throw new Error(data.error || 'Search failed');
            }
          } catch (error) {
            resultsDiv.innerHTML = \`
              <div class="error">
                <h3>❌ Error</h3>
                <p>\${error.message}</p>
                <p><small>Please try again or contact support</small></p>
              </div>
            \`;
          } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = 'START SEARCH';
          }
        });
        function displayResults(data) {
          const resultsDiv = document.getElementById('results');
          const { user, stats, rankings, analysis } = data;
          let html = \`
            <h3 style="font-size:1.24rem; color:#71eaff; margin-bottom:1.1em;">📊 Results for <b>\${user.username}</b></h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;">
              <div class="rank-card">
                <div>
                  <strong>Projects Found</strong><br>
                  <span style="font-size:1.5rem;">\${stats.found_in}/\${stats.total_projects}</span>
                </div>
              </div>
              <div class="rank-card">
                <div>
                  <strong>Processing Time</strong><br>
                  <span style="font-size:1.5rem;">\${stats.processing_time}s</span>
                </div>
              </div>
          \`;
          if (analysis && analysis.best_rank) {
            html += \`
              <div class="rank-card">
                <div>
                  <strong>Best Rank</strong><br>
                  <span style="font-size:1.5rem; color:#ffd700;">#\${analysis.best_rank}</span>
                </div>
              </div>
              <div class="rank-card">
                <div>
                  <strong>Performance</strong><br>
                  <span style="font-size:1.2rem; text-transform:capitalize;">\${analysis.performance_level}</span>
                </div>
              </div>
            \`;
          }
          html += '</div>';
          if (rankings && rankings.length > 0) {
            html += '<h4 style="margin-top:1.3em; color:#7ee2ff;">🎯 Rankings Found:</h4>';
            rankings.forEach((rank, index) => {
              const emoji = ['🥇','🥈','🥉','4️⃣','5️⃣'][index] || '📊';
              const tierIcon = rank.tier==='top'?'🔥':rank.tier==='high'?'⚡':rank.tier==='mid'?'🚀':'💎';
              html += \`
                <div class="rank-card">
                  <div>
                    <strong>\${emoji} \${rank.project}</strong><br>
                    <small>\${rank.tier.toUpperCase()} tier • \${rank.trending_percentage}%</small>
                  </div>
                  <div style="text-align:right;">
                    <strong>#\${rank.rank}</strong> \${tierIcon}<br>
                    <small>\${rank.total_users_checked} users</small>
                  </div>
                </div>
              \`;
            });
            if (analysis && analysis.recommendations && analysis.recommendations.length > 0) {
              html += '<h4 style="color:#ffe877;margin:1.3em 0 0.2em 0;">💡 Recommendations:</h4><ul>';
              analysis.recommendations.forEach(rec => {
                html += \`<li style="margin:0.5rem 0; opacity:0.95;">\${rec}</li>\`;
              });
              html += '</ul>';
            }
          } else {
            html += \`
              <div class="error" style="color:#ffe8e8">
                <h4 style="margin:0 0 0.2em 0;">🔍 No Rankings Found</h4>
                <p style="margin:0.2em 0;">\${user.username} was not found in the TOP 100 of any checked projects.</p>
                <p style="font-size:0.96em; opacity:0.7;">💡 This doesn't mean they're not ranked - they might be in positions 101+ (API limitation)</p>
              </div>
            \`;
          }
          resultsDiv.innerHTML = html;
        }
      </script>
    </body>
    </html>
  `);
}
