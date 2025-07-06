// Vercel serverless function - Main search API
// Kaito Rank Tracker by @Over9725

class KaitoAPI {
  constructor() {
    this.baseURL = 'https://hub.kaito.ai/api/v1';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://kaito.ai/',
      'Origin': 'https://kaito.ai',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
    
    this.projects = [
      { id: 'PUMP', name: 'PUMP', percentage: 7.64, tier: 'top' },
      { id: 'ANOMA', name: 'ANOMA', percentage: 7.33, tier: 'top' },
      { id: 'OPENLEDGER', name: 'OPENLEDGER', percentage: 5.30, tier: 'top' },
      { id: 'MEMEX', name: 'MEMEX', percentage: 4.21, tier: 'top' },
      { id: 'HANA', name: 'HANA', percentage: 3.90, tier: 'top' },
      { id: 'M', name: 'M', percentage: 3.43, tier: 'top' },
      { id: 'INFINIT', name: 'INFINIT', percentage: 3.20, tier: 'top' },
      { id: 'WARD', name: 'WARD', percentage: 3.04, tier: 'top' },
      { id: 'INFINEX', name: 'INFINEX', percentage: 2.88, tier: 'high' },
      { id: 'CAMP', name: 'CAMP', percentage: 2.57, tier: 'high' },
      { id: 'MITOSIS', name: 'MITOSIS', percentage: 2.49, tier: 'high' },
      { id: 'SAPIEN', name: 'SAPIEN', percentage: 2.49, tier: 'high' },
      { id: 'POLYMARKET', name: 'POLYMARKET', percentage: 2.34, tier: 'high' },
      { id: 'KATANA', name: 'KATANA', percentage: 2.18, tier: 'high' },
      { id: 'MIRA', name: 'MIRA', percentage: 2.03, tier: 'high' },
      { id: 'BLESS', name: 'BLESS', percentage: 1.95, tier: 'high' },
      { id: 'BOUNDLESS', name: 'BOUNDLESS', percentage: 1.79, tier: 'high' },
      { id: 'HEMI', name: 'HEMI', percentage: 1.71, tier: 'high' },
      { id: 'CALDERA', name: 'CALDERA', percentage: 1.71, tier: 'high' },
      { id: 'MEGAETHERS', name: 'MEGAETHERS', percentage: 1.64, tier: 'mid' },
      { id: 'PORTAL', name: 'PORTAL', percentage: 1.56, tier: 'mid' },
      { id: 'SOMNIA', name: 'SOMNIA', percentage: 1.48, tier: 'mid' },
      { id: 'OPENSEA', name: 'OPENSEA', percentage: 1.40, tier: 'mid' },
      { id: 'VOOI', name: 'VOOI', percentage: 1.40, tier: 'mid' },
      { id: 'THEORIQ', name: 'THEORIQ', percentage: 1.40, tier: 'mid' },
      { id: 'NOVAS', name: 'NOVAS', percentage: 1.25, tier: 'mid' },
      { id: 'MONAD', name: 'MONAD', percentage: 1.17, tier: 'mid' },
      { id: 'ESPRESSO', name: 'ESPRESSO', percentage: 1.17, tier: 'mid' },
      { id: 'SATLAYER', name: 'SATLAYER', percentage: 1.17, tier: 'mid' },
      { id: 'TURTLES', name: 'TURTLES', percentage: 1.09, tier: 'mid' },
      { id: 'OG', name: 'OG', percentage: 1.09, tier: 'mid' },
      { id: 'SURF', name: 'SURF', percentage: 1.09, tier: 'mid' },
      { id: 'SUCCINCT', name: 'SUCCINCT', percentage: 1.09, tier: 'mid' },
      { id: 'LUMITERRA', name: 'LUMITERRA', percentage: 1.09, tier: 'mid' },
      { id: 'NOYA', name: 'NOYA', percentage: 1.09, tier: 'mid' },
      { id: 'GENOME', name: 'GENOME', percentage: 0.94, tier: 'emerging' },
      { id: 'LOMBARD', name: 'LOMBARD', percentage: 0.94, tier: 'emerging' },
      { id: 'ABSTRACT', name: 'ABSTRACT', percentage: 0.86, tier: 'emerging' },
      { id: 'SOUL', name: 'SOUL', percentage: 0.86, tier: 'emerging' },
      { id: 'OBJKT', name: 'OBJKT', percentage: 0.78, tier: 'emerging' },
      { id: 'IRYS', name: 'IRYS', percentage: 0.78, tier: 'emerging' },
      { id: 'PUFF', name: 'PUFF', percentage: 0.70, tier: 'emerging' },
      { id: 'UNION', name: 'UNION', percentage: 0.70, tier: 'emerging' },
      { id: 'BACKPACK', name: 'BACKPACK', percentage: 0.62, tier: 'emerging' },
      { id: 'LINEA', name: 'LINEA', percentage: 0.62, tier: 'emerging' },
      { id: 'GOAT', name: 'GOAT', percentage: 0.62, tier: 'emerging' },
      { id: 'ETHOS', name: 'ETHOS', percentage: 0.47, tier: 'emerging' },
      { id: 'RUJI', name: 'RUJI', percentage: 0.39, tier: 'emerging' },
      { id: 'FARC', name: 'FARC', percentage: 0.39, tier: 'emerging' },
      { id: 'SIDEKICK', name: 'SIDEKICK', percentage: 1.64, tier: 'emerging' }
    ];
  }

  getProjects(mode) {
    const limits = {
      lightning: 15,
      standard: 30, 
      complete: 45,
      ultimate: 50
    };
    return this.projects.slice(0, limits[mode] || 15);
  }

  // ИСПРАВЛЕНО: добавлена отладка и альтернативные URL
  async getProjectLeaderboard(topicId) {
    // Попробуем разные варианты URL
    const urls = [
      `${this.baseURL}/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100&customized_community=customized&community_yaps=true`,
      `${this.baseURL}/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100`,
      `https://hub.kaito.ai/api/v1/kol/mindshare/leaderboard?topic_id=${topicId}&duration=30d&limit=100`,
      `https://kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100`
    ];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[KaitoAPI] [${topicId}] Trying URL ${i + 1}/${urls.length}: ${url}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`[KaitoAPI] [${topicId}] Request timeout after 5s`);
          controller.abort();
        }, 5000);
        
        // Попробуем разные наборы headers
        const headerSets = [
          this.headers,
          {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          },
          {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        ];
        
        for (let h = 0; h < headerSets.length; h++) {
          try {
            console.log(`[KaitoAPI] [${topicId}] Trying headers set ${h + 1}`);
            
            const response = await fetch(url, {
              method: 'GET',
              headers: headerSets[h],
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log(`[KaitoAPI] [${topicId}] Response status: ${response.status} ${response.statusText}`);
            console.log(`[KaitoAPI] [${topicId}] Response headers:`, Object.fromEntries(response.headers.entries()));
            
            if (response.status === 500) {
              const errorText = await response.text();
              console.log(`[KaitoAPI] [${topicId}] 500 Error body:`, errorText.slice(0, 500));
              continue; // Попробуем следующий набор headers или URL
            }
            
            if (!response.ok) {
              console.error(`[KaitoAPI] [${topicId}] HTTP ERROR ${response.status}: ${response.statusText}`);
              
              if (response.status === 429) {
                console.log(`[KaitoAPI] [${topicId}] Rate limited, waiting 2s...`);
                await this.delay(2000);
                continue;
              }
              
              if (response.status === 403) {
                console.log(`[KaitoAPI] [${topicId}] Forbidden - trying next headers set`);
                continue;
              }
              
              continue;
            }
            
            const text = await response.text();
            if (!text || text.length === 0) {
              console.log(`[KaitoAPI] [${topicId}] Empty response received`);
              continue;
            }
            
            console.log(`[KaitoAPI] [${topicId}] Response length: ${text.length} chars`);
            console.log(`[KaitoAPI] [${topicId}] Response preview:`, text.slice(0, 200));
            
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              console.log(`[KaitoAPI] [${topicId}] ✅ SUCCESS! Got array, ${data.length} items`);
              return data;
            }
            if (data && Array.isArray(data.data)) {
              console.log(`[KaitoAPI] [${topicId}] ✅ SUCCESS! Got object with .data array, ${data.data.length} items`);
              return data.data;
            }
            console.log(`[KaitoAPI] [${topicId}] Response not array nor .data array:`, typeof data, Object.keys(data || {}));
            
          } catch (headerError) {
            console.log(`[KaitoAPI] [${topicId}] Headers set ${h + 1} failed:`, headerError.message);
            continue;
          }
        }
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error(`[KaitoAPI] [${topicId}] Request aborted (timeout)`);
        } else {
          console.error(`[KaitoAPI] [${topicId}] Network error:`, error.message);
        }
        continue;
      }
    }
    
    console.log(`[KaitoAPI] [${topicId}] ❌ All attempts failed`);
    return null;
  }

  // Добавляем функцию задержки
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  findUserInLeaderboard(leaderboard, username) {
    if (!leaderboard || !Array.isArray(leaderboard)) {
      console.log(`[FindUser] Invalid leaderboard:`, typeof leaderboard);
      return null;
    }
    
    const cleanUsername = username.replace('@', '').toLowerCase();
    console.log(`[FindUser] Searching for "${cleanUsername}" in ${leaderboard.length} users`);
    
    // Логируем первые 3 пользователя для отладки
    if (leaderboard.length > 0) {
      console.log(`[FindUser] Sample users:`, leaderboard.slice(0, 3).map(u => u?.username || 'no_username'));
    }
    
    const found = leaderboard.find(user => {
      if (!user || !user.username) return false;
      const userLower = user.username.toLowerCase();
      return userLower === cleanUsername;
    });
    
    if (found) {
      console.log(`[FindUser] ✅ FOUND: ${found.username} at rank ${found.rank}`);
    } else {
      console.log(`[FindUser] ❌ NOT FOUND: ${cleanUsername}`);
    }
    
    return found;
  }

  generateAnalysis(rankings) {
    if (rankings.length === 0) {
      return {
        performance_level: 'not_found',
        description: 'Not found in any trending projects',
        best_rank: null,
        recommendations: ['Try different timeframe', 'Check if user is active on Kaito'],
        tier_distribution: { top: 0, high: 0, mid: 0, emerging: 0 }
      };
    }

    const ranks = rankings.map(r => parseInt(r.rank)).filter(r => !isNaN(r));
    if (ranks.length === 0) return this.generateAnalysis([]);
    
    const bestRank = Math.min(...ranks);
    let performance_level = 'good';
    const recommendations = [];
    
    if (bestRank <= 20) {
      performance_level = 'elite';
      recommendations.push('Focus on maintaining top positions');
      recommendations.push('Consider expanding to similar tier projects');
    } else if (bestRank <= 50) {
      performance_level = 'strong';  
      recommendations.push('Work towards breaking into top 20');
      recommendations.push('Increase engagement in current projects');
    } else if (bestRank <= 100) {
      performance_level = 'good';
      recommendations.push('Focus on climbing higher in current projects');
      recommendations.push('Maintain consistent activity');
    } else {
      performance_level = 'emerging';
      recommendations.push('Continue building engagement');
      recommendations.push('Focus on increasing activity');
    }

    return {
      performance_level,
      description: `Best rank: #${bestRank}`,
      best_rank: bestRank,
      recommendations,
      tier_distribution: {
        top: rankings.filter(r => r.tier === 'top').length,
        high: rankings.filter(r => r.tier === 'high').length,
        mid: rankings.filter(r => r.tier === 'mid').length,
        emerging: rankings.filter(r => r.tier === 'emerging').length
      }
    };
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }
  
  try {
    const { username, mode = 'standard' } = req.body;
    
    // Валидация username
    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Username is required and must be a string'
      });
    }

    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername || cleanUsername.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username cannot be empty'
      });
    }

    // Валидация режима
    const validModes = ['lightning', 'standard', 'complete', 'ultimate'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        error: `Invalid mode. Must be one of: ${validModes.join(', ')}`
      });
    }

    const startTime = Date.now();
    const api = new KaitoAPI();
    const projects = api.getProjects(mode);
    
    console.log(`[Handler] Starting search for ${cleanUsername} in ${projects.length} projects (${mode} mode)`);
    
    // Ищем ПОСЛЕДОВАТЕЛЬНО с большими задержками
    const rankings = [];
    let errorCount = 0;
    let successCount = 0;

    console.log(`[Handler] Starting search for ${cleanUsername} in ${projects.length} projects`);

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      try {
        console.log(`[Handler] [${i + 1}/${projects.length}] Checking project: ${project.name} (${project.id})`);
        
        // Задержка ПЕРЕД каждым запросом (кроме первого)
        if (i > 0) {
          console.log(`[Handler] Waiting 800ms before next request...`);
          await api.delay(800);
        }
        
        const leaderboard = await api.getProjectLeaderboard(project.id);
        
        if (!leaderboard || !Array.isArray(leaderboard)) {
          errorCount++;
          console.log(`[Handler] [${project.name}] No valid data received`);
          continue;
        }
        
        successCount++;
        console.log(`[Handler] [${project.name}] Got ${leaderboard.length} users, searching for ${cleanUsername}...`);
        
        const userRank = api.findUserInLeaderboard(leaderboard, cleanUsername);
        
        if (userRank) {
          const rankNumber = parseInt(userRank.rank) || 
            (leaderboard.findIndex(u => u.username && 
              u.username.toLowerCase() === cleanUsername.toLowerCase()) + 1);
          
          if (rankNumber > 0 && rankNumber <= 100) {
            rankings.push({
              project: project.name,
              rank: rankNumber,
              tier: project.tier,
              trending_percentage: project.percentage,
              mindshare: parseFloat(userRank.mindshare) || 0,
              change_7d: parseFloat(userRank.change_7d_ratio) || 0,
              total_users_checked: leaderboard.length
            });
            
            console.log(`[Handler] ✅ FOUND! ${cleanUsername} in ${project.name} at rank #${rankNumber}`);
          } else {
            console.log(`[Handler] [${project.name}] ${cleanUsername} found but rank invalid: ${rankNumber}`);
          }
        } else {
          console.log(`[Handler] [${project.name}] ${cleanUsername} not found in top ${leaderboard.length}`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`[Handler] [${project.name}] ERROR:`, error.message);
        
        // Если ошибка сети, ждем дольше
        if (error.message.includes('fetch') || error.message.includes('timeout')) {
          console.log(`[Handler] Network error, waiting 2s before continuing...`);
          await api.delay(2000);
        }
      }
    }

    console.log(`[Handler] Search completed! Checked ${projects.length} projects, found in ${rankings.length}, errors: ${errorCount}`);

    const processingTime = Math.round((Date.now() - startTime) / 1000);
    const analysis = api.generateAnalysis(rankings);

    console.log(`[Handler] Search complete: ${rankings.length} found, ${errorCount} errors, ${successCount} successful`);

    const response = {
      success: true,
      data: {
        user: {
          input: username,
          username: cleanUsername,
          type: 'username'
        },
        mode: { 
          name: mode, 
          projects: projects.length 
        },
        stats: {
          total_projects: projects.length,
          found_in: rankings.length,
          not_found: successCount - rankings.length,
          errors: errorCount,
          processing_time: processingTime
        },
        rankings: rankings.sort((a, b) => a.rank - b.rank),
        analysis
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('[Handler] FATAL ERROR:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
