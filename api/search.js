// Enhanced Kaito API with Auto-Updating Project List
// Kaito Rank Tracker by @Over9725 - Auto Project Discovery

class EnhancedKaitoAPI {
  constructor() {
    // Multiple data sources for better reliability  
    this.dataSources = [
      {
        name: 'primary',
        baseURL: 'https://api.kaito.ai/v1',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://kaito.ai/'
        }

  // НОВАЯ ФУНКЦИЯ: Получение списка всех доступных проектов
  async getAllProjects() {
    // Убеждаемся что проекты инициализированы
    if (this.projects.length === 0) {
      await this.initializeProjects();
    }

    return {
      projects: this.projects.map(project => ({
        id: project.id,
        name: project.name,
        tier: project.tier,
        ticker: this.tickerMapping[project.id] || project.id
      })),
      total: this.projects.length,
      tiers: {
        top: this.projects.filter(p => p.tier === 'top').length,
        high: this.projects.filter(p => p.tier === 'high').length,
        mid: this.projects.filter(p => p.tier === 'mid').length,
        emerging: this.projects.filter(p => p.tier === 'emerging').length
      },
      source: this.projects.length > 30 ? 'dynamic' : 'fallback'
    };
  }
      },
      {
        name: 'alternative',
        baseURL: 'https://hub.kaito.ai/api/v1',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://kaito.ai/'
        }
      },
      {
        name: 'aggregator',
        baseURL: 'https://gomtu.xyz/api/kaito',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ru',
          'Referer': 'https://gomtu.xyz/',
          'DNT': '1',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin'
        }
      }
    ];
    
    // Fallback проекты (если автообновление не работает) - 50 ПРОЕКТОВ
    this.fallbackProjects = [
      // TOP TIER (8 проектов)
      { id: 'PUMP', name: 'PUMP', tier: 'top' },
      { id: 'NEWTON', name: 'Newton', tier: 'top' },
      { id: 'MITOSIS', name: 'Mitosis', tier: 'top' },
      { id: 'STORYPROTOCOL', name: 'Story', tier: 'top' },
      { id: 'CAMP', name: 'Camp Network', tier: 'top' },
      { id: 'ANOMA', name: 'ANOMA', tier: 'top' },
      { id: 'HYPERLIQUID', name: 'Hyperliquid', tier: 'top' },
      { id: 'VIRTUALS', name: 'Virtuals Protocol', tier: 'top' },
      
      // HIGH TIER (12 проектов)
      { id: 'CALDERA', name: 'Caldera', tier: 'high' },
      { id: 'UNION', name: 'Union', tier: 'high' },
      { id: 'INFINEX', name: 'Infinex', tier: 'high' },
      { id: 'MEGAETH', name: 'MegaETH', tier: 'high' },
      { id: 'BOUNDLESS', name: 'Boundless', tier: 'high' },
      { id: 'BLS', name: 'Bless', tier: 'high' },
      { id: 'MIRA', name: 'Mira Network', tier: 'high' },
      { id: 'BERACHAIN', name: 'Berachain', tier: 'high' },
      { id: 'PARALLEL', name: 'Parallel', tier: 'high' },
      { id: 'AETHIR', name: 'Aethir', tier: 'high' },
      { id: 'GRASS', name: 'Grass', tier: 'high' },
      { id: 'PUDGYPENGUINS', name: 'Pudgy Penguins', tier: 'high' },
      
      // MID TIER (15 проектов)
      { id: 'LUMITERRA', name: 'Lumiterra', tier: 'mid' },
      { id: 'NOYA', name: 'Noya.ai', tier: 'mid' },
      { id: 'SUCCINCT', name: 'Succinct', tier: 'mid' },
      { id: 'SATLAYER', name: 'SatLayer', tier: 'mid' },
      { id: 'IRYS', name: 'Irys', tier: 'mid' },
      { id: 'SOMNIA', name: 'Somnia', tier: 'mid' },
      { id: 'INFINIT', name: 'INFINIT', tier: 'mid' },
      { id: 'LOMBARD', name: 'Lombard', tier: 'mid' },
      { id: 'THEORIQ', name: 'Theoriq', tier: 'mid' },
      { id: 'ZIRCUIT', name: 'Zircuit', tier: 'mid' },
      { id: 'MORPHO', name: 'Morpho', tier: 'mid' },
      { id: 'ORDERLY', name: 'Orderly Network', tier: 'mid' },
      { id: 'LIDO', name: 'Lido Finance', tier: 'mid' },
      { id: 'SHARDEUM', name: 'Shardeum', tier: 'mid' },
      { id: 'FHENIX', name: 'Fhenix', tier: 'mid' },
      
      // EMERGING TIER (15 проектов)
      { id: 'MONAD', name: 'Monad', tier: 'emerging' },
      { id: 'ECLIPSE', name: 'Eclipse', tier: 'emerging' },
      { id: 'KAITO', name: 'Kaito', tier: 'emerging' },
      { id: 'PENGU', name: 'PENGU', tier: 'emerging' },
      { id: 'FUEL', name: 'FUEL', tier: 'emerging' },
      { id: 'MOVEMENT', name: 'Movement', tier: 'emerging' },
      { id: 'SONIC', name: 'Sonic', tier: 'emerging' },
      { id: 'ALLORA', name: 'Allora', tier: 'emerging' },
      { id: 'POLYHEDRA', name: 'Polyhedra Network', tier: 'emerging' },
      { id: 'AVAIL', name: 'Avail', tier: 'emerging' },
      { id: 'SCROLL', name: 'Scroll', tier: 'emerging' },
      { id: 'LINEA', name: 'Linea', tier: 'emerging' },
      { id: 'BASE', name: 'Base', tier: 'emerging' },
      { id: 'BLAST', name: 'Blast', tier: 'emerging' },
      { id: 'MANTLE', name: 'Mantle', tier: 'emerging' }
    ];

    // Динамически обновляемые проекты
    this.projects = [];
    this.tickerMapping = {};
    
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 минут
    this.projectsCacheExpiry = 6 * 60 * 60 * 1000; // 6 часов для списка проектов
  }

  // НОВАЯ ФУНКЦИЯ: Автоматическое получение списка популярных проектов
  async discoverPopularProjects() {
    const cacheKey = 'popular_projects';
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.projectsCacheExpiry) {
      console.log(`[ProjectDiscovery] Using cached projects list (${cached.data.length} projects)`);
      return cached.data;
    }

    console.log(`[ProjectDiscovery] Starting project discovery...`);
    
    try {
      // Способ 1: Получаем топ проекты через общий endpoint
      const topProjectsUrl = `${this.dataSources[2].baseURL}/leaderboard-projects-list`;
      
      const response = await fetch(topProjectsUrl, {
        method: 'GET',
        headers: this.dataSources[2].headers,
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[ProjectDiscovery] Got projects data:`, data);
        
        if (data.data && Array.isArray(data.data)) {
          const discoveredProjects = this.processDiscoveredProjects(data.data);
          console.log(`[ProjectDiscovery] ✅ Discovered ${discoveredProjects.length} projects`);
          
          this.cache.set(cacheKey, {
            data: discoveredProjects,
            timestamp: Date.now()
          });
          
          return discoveredProjects;
        }
      }
      
      // Способ 2: Анализируем существующие данные пользователей
      console.log(`[ProjectDiscovery] Fallback: Analyzing user data for popular projects...`);
      const projectsFromUserData = await this.discoverFromUserData();
      
      if (projectsFromUserData.length > 0) {
        console.log(`[ProjectDiscovery] ✅ Discovered ${projectsFromUserData.length} projects from user data`);
        
        this.cache.set(cacheKey, {
          data: projectsFromUserData,
          timestamp: Date.now()
        });
        
        return projectsFromUserData;
      }
      
    } catch (error) {
      console.error(`[ProjectDiscovery] Error:`, error.message);
    }
    
    // Способ 3: Используем fallback список
    console.log(`[ProjectDiscovery] Using fallback projects list`);
    return this.fallbackProjects;
  }

  // Обработка найденных проектов
  processDiscoveredProjects(projectsData) {
    const projectCounts = new Map();
    const projectNames = new Map();
    
    // Подсчитываем популярность проектов
    projectsData.forEach(item => {
      if (item.topic_id) {
        const count = projectCounts.get(item.topic_id) || 0;
        projectCounts.set(item.topic_id, count + 1);
        
        // Сохраняем название проекта
        if (!projectNames.has(item.topic_id)) {
          projectNames.set(item.topic_id, this.formatProjectName(item.topic_id));
        }
      }
    });
    
    // Сортируем по популярности и создаем список
    const sortedProjects = Array.from(projectCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50) // Топ 50 проектов
      .map(([id, count], index) => ({
        id: id,
        name: projectNames.get(id),
        tier: this.assignTier(index, count),
        popularity: count
      }));
    
    console.log(`[ProjectDiscovery] Top 10 projects by popularity:`, 
      sortedProjects.slice(0, 10).map(p => `${p.name} (${p.popularity})`));
    
    return sortedProjects;
  }

  // Альтернативный способ: анализ данных пользователей
  async discoverFromUserData() {
    try {
      // Получаем данные нескольких популярных пользователей
      const testUsers = ['AnonVee_', 'gm365', 'cryptobanter', 'DefiIgnas', 'TheBitcoinConf'];
      const allProjects = new Map();
      
      for (const username of testUsers) {
        try {
          const userData = await this.getUserData(username);
          if (userData && userData.rankings) {
            userData.rankings.forEach(item => {
              if (item.topic_id) {
                const count = allProjects.get(item.topic_id) || 0;
                allProjects.set(item.topic_id, count + 1);
              }
            });
          }
          
          // Задержка между запросами
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.log(`[ProjectDiscovery] Error with user ${username}:`, error.message);
        }
      }
      
      // Преобразуем в список проектов
      return Array.from(allProjects.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([id, count], index) => ({
          id: id,
          name: this.formatProjectName(id),
          tier: this.assignTier(index, count),
          popularity: count
        }));
        
    } catch (error) {
      console.error(`[ProjectDiscovery] Error in user data analysis:`, error.message);
      return [];
    }
  }

  // Форматирование названий проектов
  formatProjectName(ticker) {
    const nameMap = {
      'STORYPROTOCOL': 'Story Protocol',
      'CAMP': 'Camp Network',
      'MEGAETH': 'MegaETH',
      'BLS': 'Bless',
      'MIRA': 'Mira Network',
      'NOYA': 'Noya.ai',
      'SATLAYER': 'SatLayer',
      'INFINIT': 'INFINIT',
      'THEORIQ': 'Theoriq',
      'PENGU': 'PENGU',
      'FUEL': 'FUEL',
      'HYPERLIQUID': 'Hyperliquid',
      'VIRTUALS': 'Virtuals Protocol',
      'BERACHAIN': 'Berachain',
      'PARALLEL': 'Parallel',
      'AETHIR': 'Aethir',
      'GRASS': 'Grass',
      'PUDGYPENGUINS': 'Pudgy Penguins',
      'ZIRCUIT': 'Zircuit',
      'MORPHO': 'Morpho',
      'ORDERLY': 'Orderly Network',
      'LIDO': 'Lido Finance',
      'SHARDEUM': 'Shardeum',
      'FHENIX': 'Fhenix',
      'POLYHEDRA': 'Polyhedra Network',
      'AVAIL': 'Avail',
      'SCROLL': 'Scroll',
      'LINEA': 'Linea',
      'BASE': 'Base',
      'BLAST': 'Blast',
      'MANTLE': 'Mantle'
    };
    
    return nameMap[ticker] || ticker.charAt(0).toUpperCase() + ticker.slice(1).toLowerCase();
  }

  // Автоматическое определение tier на основе популярности (для 50 проектов)
  assignTier(index, popularity) {
    if (index < 8) return 'top';        // Топ 8 - top tier
    if (index < 20) return 'high';      // Топ 20 - high tier  
    if (index < 35) return 'mid';       // Топ 35 - mid tier
    return 'emerging';                  // Остальные - emerging
  }

  // Обновление ticker mapping
  updateTickerMapping(projects) {
    this.tickerMapping = {};
    projects.forEach(project => {
      this.tickerMapping[project.id] = project.id;
    });
    console.log(`[ProjectDiscovery] Updated ticker mapping for ${projects.length} projects`);
  }

  // Инициализация проектов (вызывается при старте)
  async initializeProjects() {
    console.log(`[ProjectDiscovery] Initializing projects...`);
    
    try {
      this.projects = await this.discoverPopularProjects();
      this.updateTickerMapping(this.projects);
      
      console.log(`[ProjectDiscovery] ✅ Initialized with ${this.projects.length} projects`);
      console.log(`[ProjectDiscovery] Tier distribution:`, {
        top: this.projects.filter(p => p.tier === 'top').length,
        high: this.projects.filter(p => p.tier === 'high').length,
        mid: this.projects.filter(p => p.tier === 'mid').length,
        emerging: this.projects.filter(p => p.tier === 'emerging').length
      });
      
    } catch (error) {
      console.error(`[ProjectDiscovery] Initialization failed, using fallback:`, error.message);
      this.projects = this.fallbackProjects;
      this.updateTickerMapping(this.projects);
    }
  }

  // Остальные методы остаются без изменений...
  async getUserData(username) {
    try {
      const url = `${this.dataSources[2].baseURL}/leaderboard-search?username=${encodeURIComponent(username)}`;
      console.log(`[DataSource] Querying analytics endpoint for user: ${username}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.dataSources[2].headers,
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        console.log(`[DataSource] Analytics query failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log(`[DataSource] Analytics response received`);
      
      const userData = data.data || data || null;
      
      if (userData && Array.isArray(userData)) {
        const processedData = {
          rankings: userData,
          projectMap: {}
        };
        
        userData.forEach(item => {
          if (!processedData.projectMap[item.topic_id]) {
            processedData.projectMap[item.topic_id] = {};
          }
          processedData.projectMap[item.topic_id][item.duration] = {
            rank: item.rank,
            mindshare: item.mindshare,
            updatedAt: item.updatedAt
          };
        });
        
        console.log(`[DataSource] User analytics data processed successfully for ${userData.length} entries`);
        return processedData;
      } else {
        console.log(`[DataSource] No analytics data available for user`);
        return null;
      }
      
    } catch (error) {
      console.error(`[DataSource] User lookup error:`, error.message);
      return null;
    }
  }

  async getProjectRankingData(ticker) {
    const cacheKey = `ranking_${ticker}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      console.log(`[Cache] Hit for ${ticker}`);
      return cached.data;
    }

    try {
      const url = `${this.dataSources[2].baseURL}/leaderboard-rank-mindshare?ticker=${ticker}`;
      console.log(`[DataSource] Querying metrics API for: ${ticker}`);
      
      const response = await fetch(url, {
        method: 'GET', 
        headers: this.dataSources[2].headers,
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        console.log(`[DataSource] Metrics query ${ticker} failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log(`[DataSource] Metrics ${ticker} data received`);
      
      if (data.data && Array.isArray(data.data)) {
        this.cache.set(cacheKey, {
          data: data.data,
          timestamp: Date.now()
        });
        return data.data;
      }
      
      return null;
      
    } catch (error) {
      console.error(`[DataSource] Project ${ticker} error:`, error.message);
      return null;
    }
  }

  calculateUserRanking(rankingData, userStats, projectTicker) {
    if (!rankingData || !Array.isArray(rankingData) || !userStats) {
      console.log(`[Ranking] Invalid data: rankingData=${!!rankingData}, userStats=${!!userStats}`);
      return null;
    }

    if (!userStats.projectMap || !userStats.projectMap[projectTicker]) {
      console.log(`[Ranking] No user data found for project ${projectTicker}`);
      return null;
    }

    const userProjectData = userStats.projectMap[projectTicker];
    console.log(`[Ranking] User project data for ${projectTicker}:`, userProjectData);

    let userRankData = userProjectData['30D'] || 
                      userProjectData['7D'] || 
                      userProjectData['3M'] || 
                      userProjectData['6M'] || 
                      userProjectData['12M'];

    if (!userRankData) {
      console.log(`[Ranking] No ranking data found for user in project ${projectTicker}`);
      return null;
    }

    console.log(`[Ranking] ✅ Found user ranking for ${projectTicker}: rank ${userRankData.rank}, mindshare ${userRankData.mindshare}`);

    return {
      rank: userRankData.rank,
      mindshare: userRankData.mindshare,
      change_7d_ratio: 0
    };
  }

  async searchUserInAllProjects(username, mode = 'standard') {
    // Убеждаемся что проекты инициализированы
    if (this.projects.length === 0) {
      await this.initializeProjects();
    }
    
    const limits = {
      lightning: 15,
      standard: 30, 
      complete: 45,
      ultimate: 50
    };
    
    const projectCount = limits[mode] || 25;
    const projectsToCheck = this.projects.slice(0, projectCount);
    
    console.log(`[Search] Starting enhanced search for ${username} in ${projectsToCheck.length} projects`);
    console.log(`[Search] Using ${this.projects.length > 30 ? 'DYNAMIC' : 'FALLBACK'} project list`);
    
    const userStats = await this.getUserData(username);
    if (!userStats) {
      console.log(`[Search] User ${username} not found in data sources`);
      return {
        rankings: [],
        stats: {
          total_projects: projectsToCheck.length,
          found_in: 0,
          not_found: projectsToCheck.length,
          errors: 0,
          success_rate: 0,
          project_source: this.projects.length > 30 ? 'dynamic' : 'fallback'
        }
      };
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    console.log(`[Search] User found with data for ${Object.keys(userStats.projectMap).length} projects`);

    for (const project of projectsToCheck) {
      try {
        const ticker = this.tickerMapping[project.id];
        if (!ticker) {
          console.log(`[Search] No ticker mapping for ${project.id}`);
          errorCount++;
          continue;
        }

        if (!userStats.projectMap[ticker]) {
          console.log(`[Search] User has no data for project ${ticker}`);
          successCount++;
          continue;
        }

        const rankingData = await this.getProjectRankingData(ticker);
        if (!rankingData) {
          errorCount++;
          continue;
        }

        successCount++;
        const userPosition = this.calculateUserRanking(rankingData, userStats, ticker);
        
        if (userPosition && userPosition.rank <= 100) {
          results.push({
            project: project.name,
            rank: userPosition.rank,
            tier: project.tier,
            mindshare: userPosition.mindshare,
            change_7d: userPosition.change_7d_ratio,
            total_users_checked: 100
          });
          
          console.log(`[Search] ✅ Found ${username} in ${project.name} at rank #${userPosition.rank}`);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        console.error(`[Search] Error for ${project.name}:`, error.message);
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
        success_rate: Math.round((successCount / projectsToCheck.length) * 100),
        project_source: this.projects.length > 30 ? 'dynamic' : 'fallback'
      }
    };
  }

  generateAnalysis(rankings) {
    if (rankings.length === 0) {
      return {
        performance_level: 'not_found',
        description: 'Not found in any trending projects',
        best_rank: null,
        recommendations: ['User may not be active in tracked projects', 'Try checking manually on kaito.ai'],
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // НОВОЕ: GET запрос для получения списка проектов
  if (req.method === 'GET') {
    try {
      const api = new EnhancedKaitoAPI();
      const projectsData = await api.getAllProjects();
      
      return res.status(200).json({
        success: true,
        method: 'get_projects',
        data: projectsData
      });
    } catch (error) {
      console.error('[Handler] GET Projects Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get projects list'
      });
    }
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST for search or GET for projects list.'
    });
  }
  
  try {
    const { username, mode = 'standard', selectedProjects = [] } = req.body;
    
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

    if (!['lightning', 'standard', 'complete', 'ultimate'].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: 'Mode must be lightning, standard, complete, or ultimate'
      });
    }

    // Валидация selectedProjects
    if (selectedProjects && !Array.isArray(selectedProjects)) {
      return res.status(400).json({
        success: false,
        error: 'selectedProjects must be an array'
      });
    }

    // Логирование для отладки
    if (selectedProjects.length > 0) {
      console.log(`[Handler] Custom search requested: ${selectedProjects.length} projects selected`);
      console.log(`[Handler] Selected projects: ${selectedProjects.join(', ')}`);
    }

    const startTime = Date.now();
    const api = new EnhancedKaitoAPI();
    
    console.log(`[Handler] Starting enhanced search for ${cleanUsername} in ${mode} mode`);
    
    // ОБНОВЛЕННЫЙ ВЫЗОВ с поддержкой selectedProjects
    const searchResult = await api.searchUserInAllProjects(cleanUsername, mode, selectedProjects);
    const analysis = api.generateAnalysis(searchResult.rankings);
    
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    const response = {
      success: true,
      method: 'enhanced_aggregation_v3', // Обновили версию
      data: {
        user: {
          input: username,
          username: cleanUsername,
          type: 'username'
        },
        mode: { 
          name: mode, 
          projects: searchResult.stats.total_projects,
          search_type: searchResult.stats.search_type // Новое поле
        },
        stats: {
          ...searchResult.stats,
          processing_time: processingTime
        },
        rankings: searchResult.rankings,
        analysis
      }
    };

    const searchType = selectedProjects.length > 0 ? 'custom' : mode;
    console.log(`[Handler] ✅ Enhanced search completed: ${searchResult.rankings.length} found, ${searchResult.stats.success_rate}% success rate (${searchType} search)`);

    res.status(200).json(response);

  } catch (error) {
    console.error('[Handler] FATAL ERROR:', error);
    res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
}
