// Vercel serverless function - Main page
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kaito Rank Tracker - by @Over9725</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .container {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 3rem;
                max-width: 600px;
                width: 100%;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.2);
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            h1 { 
                font-size: 2.5rem; 
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, #f0f0f0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .subtitle { 
                font-size: 1.2rem; 
                opacity: 0.9; 
                margin-bottom: 2rem; 
                line-height: 1.6;
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            .feature {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.1);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            .feature:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .feature h3 { 
                margin-bottom: 0.5rem; 
                font-size: 1.1rem;
            }
            .feature p {
                opacity: 0.8;
                font-size: 0.9rem;
            }
            .search-section {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 15px;
                margin: 2rem 0;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .search-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }
            input, select, button {
                padding: 0.8rem 1rem;
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 10px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 1rem;
                width: 100%;
                max-width: 300px;
            }
            input::placeholder {
                color: rgba(255,255,255,0.7);
            }
            button {
                background: linear-gradient(45deg, #667eea, #764ba2);
                border: none;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            .results {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 15px;
                margin-top: 2rem;
                text-align: left;
                border: 1px solid rgba(255,255,255,0.2);
                display: none;
            }
            .loading {
                text-align: center;
                padding: 2rem;
            }
            .spinner {
                border: 3px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top: 3px solid white;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .rank-card {
                background: rgba(255,255,255,0.1);
                padding: 1rem;
                margin: 0.5rem 0;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .error {
                background: rgba(255,100,100,0.2);
                color: #ffcccc;
                padding: 1rem;
                border-radius: 10px;
                border: 1px solid rgba(255,100,100,0.3);
                margin: 1rem 0;
            }
            
            @media (max-width: 768px) {
                .container { padding: 2rem 1rem; }
                h1 { font-size: 2rem; }
                .features { grid-template-columns: 1fr; }
                .search-form { flex-direction: column; }
                input, select, button { max-width: 100%; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 Kaito Rank Tracker</h1>
            <p class="subtitle">
                Find your rankings across 60+ trending crypto projects<br>
                <strong>More projects. Better insights. Real analytics.</strong>
            </p>
            
            <div class="features">
                <div class="feature">
                    <h3>⚡ Lightning Mode</h3>
                    <p>15 projects, 1-2 minutes</p>
                </div>
                <div class="feature">
                    <h3>🚀 Standard Mode</h3>
                    <p>35 projects, 3-5 minutes</p>
                </div>
                <div class="feature">
                    <h3>🔥 Complete Mode</h3>
                    <p>60+ projects, 8-12 minutes</p>
                </div>
                <div class="feature">
                    <h3>💎 Ultimate Mode</h3>
                    <p>80 projects, 12-20 minutes</p>
                </div>
            </div>

            <div class="search-section">
                <h3 style="margin-bottom: 1rem;">🔍 Search Your Rankings</h3>
                <form class="search-form" id="searchForm">
                    <input 
                        type="text" 
                        id="username" 
                        placeholder="Enter Twitter username (@teddi_speaks)" 
                        required
                    >
                    <select id="mode">
                        <option value="lightning">⚡ Lightning (15 projects)</option>
                        <option value="standard" selected>🚀 Standard (35 projects)</option>
                        <option value="complete">🔥 Complete (60+ projects)</option>
                        <option value="ultimate">💎 Ultimate (80 projects)</option>
                    </select>
                    <button type="submit" id="searchBtn">
                        Start Search
                    </button>
                </form>
            </div>

            <div id="results" class="results"></div>
            
            <p style="margin-top: 2rem; opacity: 0.7; font-size: 0.9rem;">
                Made by @Over9725 | Powered by Vercel | 
                <a href="/health" style="color: #fff; text-decoration: underline;">Health Check</a>
            </p>
        </div>

        <script>
            document.getElementById('searchForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value.trim();
                const mode = document.getElementById('mode').value;
                const resultsDiv = document.getElementById('results');
                const searchBtn = document.getElementById('searchBtn');
                
                if (!username) {
                    alert('Please enter a username');
                    return;
                }
                
                // Show loading
                searchBtn.disabled = true;
                searchBtn.innerHTML = 'Searching...';
                resultsDiv.style.display = 'block';
                resultsDiv.innerHTML = \`
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Searching \${username} in \${mode} mode...</p>
                        <p><small>This may take several minutes depending on the mode</small></p>
                    </div>
                \`;
                
                try {
                    const response = await fetch('/api/search', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
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
                    <h3>📊 Results for \${user.username}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                        <div class="rank-card">
                            <div>
                                <strong>Projects Found</strong><br>
                                <span style="font-size: 1.5rem;">\${stats.found_in}/\${stats.total_projects}</span>
                            </div>
                        </div>
                        <div class="rank-card">
                            <div>
                                <strong>Processing Time</strong><br>
                                <span style="font-size: 1.5rem;">\${stats.processing_time}s</span>
                            </div>
                        </div>
                \`;
                
                if (analysis.best_rank) {
                    html += \`
                        <div class="rank-card">
                            <div>
                                <strong>Best Rank</strong><br>
                                <span style="font-size: 1.5rem; color: #ffd700;">#\${analysis.best_rank}</span>
                            </div>
                        </div>
                        <div class="rank-card">
                            <div>
                                <strong>Performance</strong><br>
                                <span style="font-size: 1.2rem; text-transform: capitalize;">\${analysis.performance_level}</span>
                            </div>
                        </div>
                    \`;
                }
                
                html += '</div>';
                
                if (rankings.length > 0) {
                    html += '<h4>🎯 Rankings Found:</h4>';
                    rankings.forEach((rank, index) => {
                        const emoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index] || '📊';
                        const tierIcon = rank.tier === 'top' ? '🔥' : 
                                       rank.tier === 'high' ? '⚡' : 
                                       rank.tier === 'mid' ? '🚀' : '💎';
                        html += \`
                            <div class="rank-card">
                                <div>
                                    <strong>\${emoji} \${rank.project}</strong><br>
                                    <small>\${rank.tier.toUpperCase()} tier • \${rank.trending_percentage}%</small>
                                </div>
                                <div style="text-align: right;">
                                    <strong>#\${rank.rank}</strong> \${tierIcon}<br>
                                    <small>\${rank.total_users_checked} users</small>
                                </div>
                            </div>
                        \`;
                    });
                    
                    if (analysis.recommendations.length > 0) {
                        html += '<h4>💡 Recommendations:</h4><ul>';
                        analysis.recommendations.forEach(rec => {
                            html += \`<li style="margin: 0.5rem 0; opacity: 0.9;">\${rec}</li>\`;
                        });
                        html += '</ul>';
                    }
                } else {
                    html += \`
                        <div class="error">
                            <h4>🔍 No Rankings Found</h4>
                            <p>\${user.username} was not found in the TOP 100 of any checked projects.</p>
                            <p><small>💡 This doesn't mean they're not ranked - they might be in positions 101+ (API limitation)</small></p>
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
