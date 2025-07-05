export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Kaito Rank Tracker</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
      <style>
        html, body {
          height: 100%;
        }
        body {
          min-height: 100vh;
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(120deg, #232547 0%, #594bff 70%, #4fd1ff 100%);
          color: #f5f6fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .by-over {
          position: fixed;
          top: 32px;
          right: 40px;
          z-index: 100;
          font-family: 'Montserrat', 'Inter', sans-serif;
          letter-spacing: 1.7px;
          background: linear-gradient(90deg,#b7ffea 0%,#e8b6ff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-fill-color: transparent;
          font-weight: 900;
          font-size: 1.18rem;
          filter: drop-shadow(0 1px 6px #4fd1ff44);
          animation: pulse 2.2s infinite alternate;
          user-select: none;
          opacity: .98;
        }
        @keyframes pulse {
          0% { letter-spacing: 1.7px; filter: drop-shadow(0 2px 8px #4fd1ff44);}
          100% { letter-spacing: 3.8px; filter: drop-shadow(0 6px 20px #b07aff44);}
        }
        .container {
          background: rgba(31,36,66, 0.85);
          border-radius: 22px;
          padding: 44px 32px;
          box-shadow: 0 8px 36px 0 rgba(36,48,102,0.14), 0 1.5px 14px 0 rgba(127,233,255,0.09);
          max-width: 430px;
          width: 100%;
          text-align: center;
          position: relative;
        }
        h1 {
          font-size: 2.4rem;
          margin-bottom: 0.6rem;
          background: linear-gradient(90deg,#fff,#d9dfff 40%,#50c9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          opacity: 0.93;
          font-size: 1.14rem;
          margin-bottom: 1.9rem;
        }
        .features {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2.2rem;
          flex-wrap: wrap;
        }
        .feature {
          background: rgba(49,56,99, 0.68);
          padding: 0.92rem 1.2rem;
          border-radius: 14px;
          font-size: 1.03rem;
          color: #9da9fa;
          font-weight: 600;
          border: 1px solid #22264b;
          box-shadow: 0 1.5px 8px 0 rgba(127,233,255,0.05);
        }
        .search-section {
          margin-bottom: 1.3rem;
        }
        .search-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        input, select {
          padding: 0.95rem 1.1rem;
          border: none;
          border-radius: 10px;
          background: rgba(44,51,87,0.82);
          color: #fafbff;
          font-size: 1rem;
          outline: none;
          transition: box-shadow .19s;
        }
        input:focus, select:focus {
          box-shadow: 0 0 0 2px #7e6bff77;
        }
        input::placeholder {
          color: #b9c1fd;
        }
        button {
          padding: 1.02rem 0;
          border: none;
          border-radius: 13px;
          background: linear-gradient(90deg,#50c9ff,#a18fff 100%);
          color: #232547;
          font-weight: 700;
          font-size: 1.18rem;
          cursor: pointer;
          box-shadow: 0 2px 10px 0 rgba(98,121,255,0.10);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.22s;
          outline: none;
        }
        button:hover {
          transform: scale(1.045);
          box-shadow: 0 6px 28px 0 rgba(80,201,255,0.23);
        }
        .results {
          margin-top: 2.2rem;
          background: rgba(36,43,89, 0.97);
          padding: 1.9rem 1.2rem;
          border-radius: 17px;
          border: 1px solid #232a55;
          text-align: left;
          display: none;
        }
        .loading {
          text-align: center;
          padding: 2.1rem 0;
        }
        .spinner {
          border: 3px solid rgba(255,255,255,0.16);
          border-radius: 50%;
          border-top: 3px solid #a18fff;
          width: 38px;
          height: 38px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% {transform: rotate(360deg);}
        }
        .rank-card {
          background: rgba(49,56,99,0.75);
          padding: 1.15rem;
          margin: 0.5rem 0;
          border-radius: 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #353d6b;
          box-shadow: 0 1.5px 10px 0 rgba(79,209,255,0.07);
        }
        .error {
          background: rgba(255,98,98,0.12);
          color: #ffb6b6;
          padding: 1.18rem;
          border-radius: 12px;
          border: 1px solid rgba(255,100,100,0.19);
          margin: 1.1rem 0;
        }
        a { color: #9da9fa; text-decoration: underline;}
        @media (max-width: 650px) {
          .container {padding: 18px 3px;}
          h1 {font-size: 1.38rem;}
          .features {flex-direction: column; gap: 0.6rem;}
          .by-over { right: 18px; top: 16px; font-size: 0.99rem;}
        }
      </style>
    </head>
    <body>
      <div class="by-over">By OveR</div>
      <div class="container">
        <h1>🪐 Kaito Rank Tracker</h1>
        <div class="subtitle">Find your rankings across 60+ trending crypto projects.<br>
        <strong>More projects. Better insights.</strong></div>

        <div class="features">
          <div class="feature">⚡ Lightning</div>
          <div class="feature">🚀 Standard</div>
          <div class="feature">🔥 Complete</div>
          <div class="feature">💎 Ultimate</div>
        </div>

        <div class="search-section">
          <form class="search-form" id="searchForm">
            <input type="text" id="username" placeholder="Twitter username (@handle)" required>
            <select id="mode">
              <option value="lightning">⚡ Lightning (15 projects)</option>
              <option value="standard" selected>🚀 Standard (35 projects)</option>
              <option value="complete">🔥 Complete (60+ projects)</option>
              <option value="ultimate">💎 Ultimate (80 projects)</option>
            </select>
            <button type="submit" id="searchBtn">Start Search</button>
          </form>
        </div>

        <div id="results" class="results"></div>
        <p style="margin-top:2rem;font-size:0.97rem;opacity:.78">
          Made by <a href="https://twitter.com/Over9725" target="_blank">@Over9725</a> | <a href="/health">Health Check</a>
        </p>
      </div>
      <script>
        document.getElementById('searchForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value.trim();
          const mode = document.getElementById('mode').value;
          const resultsDiv = document.getElementById('results');
          const searchBtn = document.getElementById('searchBtn');

          if (!username) {alert('Enter username'); return;}

          // Show loading
          searchBtn.disabled = true;
          searchBtn.innerHTML = 'Searching...';
          resultsDiv.style.display = 'block';
          resultsDiv.innerHTML = \`
            <div class="loading">
              <div class="spinner"></div>
              <p>Searching <strong>\${username}</strong> in <strong>\${mode}</strong> mode...</p>
              <p><small>May take 1-2 min depending on mode</small></p>
            </div>
          \`;

          try {
            const response = await fetch('/api/search', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
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
            searchBtn.innerHTML = 'Start Search';
          }
        });

        function displayResults(data) {
          const resultsDiv = document.getElementById('results');
          const { user, stats, rankings, analysis } = data;

          let html = \`
            <h3 style="font-size:1.28rem;margin-bottom:1.1rem">📊 Results for <b>\${user.username}</b></h3>
            <div style="display: flex;gap:1.5rem;margin-bottom:1.5rem;">
              <div class="rank-card"><div><b>Projects Found</b><br><span style="font-size:1.5rem">\${stats.found_in}/\${stats.total_projects}</span></div></div>
              <div class="rank-card"><div><b>Processing Time</b><br><span style="font-size:1.5rem">\${stats.processing_time}s</span></div></div>
            </div>
          \`;

          if (analysis.best_rank) {
            html += \`
              <div class="rank-card"><div><b>Best Rank</b><br><span style="font-size:1.5rem;color:#ffeb3b">#\${analysis.best_rank}</span></div></div>
              <div class="rank-card"><div><b>Performance</b><br><span style="font-size:1.2rem;text-transform:capitalize">\${analysis.performance_level}</span></div></div>
            \`;
          }

          if (rankings.length > 0) {
            html += '<h4 style="margin:1.3rem 0 .5rem">🎯 Rankings Found:</h4>';
            rankings.forEach((rank, index) => {
              const emoji = ['🥇','🥈','🥉','4️⃣','5️⃣'][index] || '📊';
              const tierIcon = rank.tier === 'top' ? '🔥' : rank.tier === 'high' ? '⚡' : rank.tier === 'mid' ? '🚀' : '💎';
              html += \`
                <div class="rank-card">
                  <div><b>\${emoji} \${rank.project}</b><br><small>\${rank.tier.toUpperCase()} tier • \${rank.trending_percentage}%</small></div>
                  <div style="text-align:right"><b>#\${rank.rank}</b> \${tierIcon}<br><small>\${rank.total_users_checked} users</small></div>
                </div>
              \`;
            });
            if (analysis.recommendations.length > 0) {
              html += '<h4>💡 Recommendations:</h4><ul>';
              analysis.recommendations.forEach(rec => {
                html += \`<li style="margin:.45rem 0;opacity:.92">\${rec}</li>\`;
              });
              html += '</ul>';
            }
          } else {
            html += \`
              <div class="error">
                <h4>🔍 No Rankings Found</h4>
                <p>\${user.username} was not found in the TOP 100 of any checked projects.</p>
                <p><small>💡 They might be in positions 101+ (API limitation)</small></p>
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
