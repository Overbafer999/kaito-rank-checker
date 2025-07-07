// Vercel Cached API - Kaito Rank Tracker by @Over9725
// Новая архитектура с кешированием как у GOMTU

class CachedKaitoAPI {
  constructor() {
    this.baseURL = 'https://hub.kaito.ai/api/v1';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://kaito.ai/',
      'Origin': 'https://kaito.ai'
    };
    
    // ТОП 30 проектов для быстрого поиска (вместо 50)
    this.projects = [
      { id: 'PUMP', name: 'PUMP', tier: 'top' },
      { id: 'ANOMA', name: 'ANOMA', tier: 'top' },
      { id: 'NEWTON', name: 'Newton', tier: 'top' },
      { id: 'MITOSIS', name: 'Mitosis', tier: 'top' },
      { id: 'STORYPROTOCOL', name: 'Story', tier: 'top' },
      { id: 'CAMP', name: 'Camp Network', tier: 'top' },
      { id: 'CALDERA', name: 'Caldera', tier: 'high' },
      { id: 'UNION', name: 'Union', tier: 'high' },
      { id: 'INFINEX', name: 'Infinex', tier: 'high' },
      { id: 'MEGAETH', name: 'MegaETH', tier: 'high' },
      { id: 'BOUNDLESS', name: 'Boundless', tier: 'high' },
      { id: 'BLS', name: 'Bless', tier: 'high' },
      { id: 'MIRA', name: 'Mira Network', tier: 'high' },
      { id: 'SURF', name: 'Surf', tier: 'high' },
      { id: 'LUMITERRA', name: 'Lumiterra', tier: 'mid' },
      { id: 'NOYA', name: 'Noya.ai', tier: 'mid' },
      { id: 'SUCCINCT', name: 'Succinct', tier: 'mid' },
      { id: 'SATLAYER', name: 'SatLayer', tier: 'mid' },
      { id: 'IRYS', name: 'Irys', tier: 'mid' },
      { id: 'SOMNIA', name: 'Somnia', tier: 'mid' },
      { id: 'INFINIT', name: 'INFINIT', tier: 'mid' },
      { id: 'LOMBARD', name: 'Lombard', tier: 'mid' },
      { id: 'MONAD', name: 'Monad', tier: 'emerging' },
      { id: 'ECLIPSE', name: 'Eclipse', tier: 'emerging' },
      { id: 'HANAHANA', name: 'Hana', tier: 'emerging' },
      { id: 'OPENLEDGER', name: 'OpenLedger', tier: 'emerging' },
      { id: 'MEMEX', name: 'MemeX', tier: 'emerging' },
      { id: 'THEORIQ', name: 'Theoriq', tier: 'emerging' },
      { id: 'KAITO', name: 'Kaito', tier: 'emerging' },
      { id: 'PENGU', name: 'PENGU', tier: 'emerging' }
    ];

    // Кеш для данных (в памяти)
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 минут
  }

  // Получить кешированные данные или сделать запрос
  async getCachedProjectData(topicId) {
    const cacheKey = `project_${topicId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      console.log(`[Cache] Hit for ${topicId}`);
      return cached.data;
    }

    console.log(`[Cache] Miss for ${topicId}, fetching...`);
    const data = await this.fetchProjectLeaderboard(topicId);
    
    if (data) {
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });
    }
    
    return data;
  }

  // Запрос к Kaito API (с улучшенной обработкой)
  async fetchProjectLeaderboard(topicId) {
    const urls = [
      `${this.baseURL}/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100&customized_community=customized&community_yaps=true`,
      `${this.baseURL}/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100`,
      `https://kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100`
    ];
    
    for (const url of urls) {
      try {
        console.log(`[API] Trying: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: this.headers,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.log(`[API] ${topicId}: ${response.status} ${response.statusText}`);
          continue;
        }
        
        const text = await response.text();
        if (!text) continue;
        
        const data = JSON.parse(text);
        
        if (Array.isArray(data)) {
          console.log(`[API] ✅ ${topicId}: got ${data.length} items`);
          return data;
        }
        
        if (data && Array.isArray(data.data)) {
          console.log(`[API] ✅ ${topicId}: got ${data.data.length} items from .data`);
          return data.data;
        }
        
      } catch (error) {
        console.log(`[API] ${topicId} error: ${error.message}`);
        continue;
      }
    }
    
    console.log(`[API] ❌ ${topicId}: all attempts failed`);
    return null;
  }

  // Найти пользователя в leaderboard
  findUserInLeaderboard(leaderboard, username) {
    if (!leaderboard || !Array.isArray(leaderboard)) return null;
    
    const cleanUsername = username.replace('@', '').toLowerCase();
    
    return leaderboard.find(user => {
      if (!user || !user.username) return false;
      return user.username.toLowerCase() === cleanUsername;
    });
  }

  // BATCH поиск пользователя по всем проектам (оптимизировано)
  async searchUserInAllProjects(username, mode = 'standard') {
    const projectCount = mode === 'lightning' ? 15 : 30;
    const projectsToCheck = this.projects.slice(0, projectCount);
    
    console.log(`[Search] Starting search for ${username} in ${projectsToCheck.length} projects`);
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Обрабатываем по 3 проекта параллельно (чтобы не перегрузить)
    for (let i = 0; i < projectsToCheck.length; i += 3) {
      const batch = projectsToCheck.slice(i, i + 3);
      
      const batchPromises = batch.map(async (project) => {
        try {
          const leaderboard = await this.getCachedProjectData(project.id);
          
          if (!leaderboard) {
            errorCount++;
            return null;
          }
          
          successCount++;
          const userRank = this.findUserInLeaderboard(leaderboard, username);
          
          if (userRank) {
            const rank = parseInt(userRank.rank) || (leaderboard.findIndex(u => 
              u.username && u.username.toLowerCase() === username.replace('@', '').toLowerCase()) + 1);
            
            if (rank > 0 && rank <= 100) {
              return {
                project: project.name,
                rank: rank,
                tier: project.tier,
                mindshare: parseFloat(userRank.mindshare) || 0,
                change_7d: parseFloat(userRank.change_7d_ratio) || 0,
                total_users_checked: leaderboard.length
              };
            }
          }
          
          return null;
        } catch (error) {
          errorCount++;
          console.error(`[Search] Error for ${project.name}:`, error.message);
          return null;
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        }
      });
      
      // Небольшая задержка между батчами
      if (i + 3 < projectsToCheck.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log(`[Search] Completed: ${results.length} found, ${errorCount} errors, ${successCount} successful`);
    
    return {
      rankings: results.sort((a, b) => a.rank - b.rank),
      stats: {
        total_projects: projectsToCheck.length,
        found_in: results.length,
        not_found: successCount - results.length,
        errors: errorCount,
        success_rate: Math.round((successCount / projectsToCheck.length) * 100)
      }
    };
  }

  // Генерация анализа
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
    const bestRank = Math.min(...ranks);
    let performance_level = 'good';
    const recommendations = [];
    
    if (bestRank <= 10) {
      performance_level = 'elite';
      recommendations.push('Maintain your top 10 positions');
      recommendations.push('Consider expanding to more projects');
    } else if (bestRank <= 25) {
      performance_level = 'strong';  
      recommendations.push('Push for top 10 positions');
      recommendations.push('Increase engagement quality');
    } else if (bestRank <= 50) {
      performance_level = 'good';
      recommendations.push('Focus on climbing to top 25');
      recommendations.push('Maintain consistent activity');
    } else {
      performance_level = 'emerging';
      recommendations.push('Build stronger community engagement');
      recommendations.push('Focus on quality over quantity');
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

// MAIN HANDLER
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  // Cache headers для оптимизации
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600'); // 30 минут кеш
  
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
    
    // Валидация
    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username cannot be empty'
      });
    }

    if (!['lightning', 'standard'].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: 'Mode must be lightning or standard'
      });
    }

    const startTime = Date.now();
    const api = new CachedKaitoAPI();
    
    console.log(`[Handler] Starting cached search for ${cleanUsername} in ${mode} mode`);
    
    // НОВЫЙ ПОДХОД: кешированный поиск
    const searchResult = await api.searchUserInAllProjects(cleanUsername, mode);
    const analysis = api.generateAnalysis(searchResult.rankings);
    
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    const response = {
      success: true,
      cached: true,
      data: {
        user: {
          input: username,
          username: cleanUsername,
          type: 'username'
        },
        mode: { 
          name: mode, 
          projects: searchResult.stats.total_projects
        },
        stats: {
          ...searchResult.stats,
          processing_time: processingTime
        },
        rankings: searchResult.rankings,
        analysis
      }
    };

    console.log(`[Handler] ✅ Search completed: ${searchResult.rankings.length} found, ${searchResult.stats.success_rate}% success rate`);

    res.status(200).json(response);

  } catch (error) {
    console.error('[Handler] FATAL ERROR:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
}
