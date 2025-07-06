// Vercel serverless function - Main search API
// Kaito Rank Tracker by @Over9725

class KaitoAPI {
  constructor() {
    this.baseURL = 'https://hub.kaito.ai/api/v1';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Referer': 'https://kaito.ai/',
      'Origin': 'https://kaito.ai'
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

  // БЫСТРЫЙ запрос к Kaito API
  async getProjectLeaderboard(topicId) {
    try {
      const url = `${this.baseURL}/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=${topicId}&top_n=100&customized_community=customized&community_yaps=true`;
      
      const response = await fetch(url, {
        headers: this.headers,
        signal: AbortSignal.timeout(2000) // 2 секунды таймаут
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return Array.isArray(data) ? data : null;
      
    } catch (error) {
      console.error(`Error fetching ${topicId}:`, error.message);
      return null; // Если ошибка - просто пропускаем проект
    }
  }

  findUserInLeaderboard(leaderboard, username) {
    if (!leaderboard || !Array.isArray(leaderboard)) return null;
    
    const cleanUsername = username.replace('@', '').toLowerCase();
    
    return leaderboard.find(user => {
      if (!user.username) return false;
      return user.username.toLowerCase() === cleanUsername;
    });
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

    const ranks = rankings.map(r => parseInt(r.rank));
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
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    const startTime = Date.now();
    const api = new KaitoAPI();
    const projects = api.getProjects(mode);
    
    // === ПАРАЛЛЕЛЬНО ИЩЕМ ВО ВСЕХ ПРОЕКТАХ ===
    const leaderboardPromises = projects.map(async (project) => {
      try {
        const leaderboard = await api.getProjectLeaderboard(project.id);
        if (!leaderboard) return { project, error: 'No data' };
        
        const userRank = api.findUserInLeaderboard(leaderboard, username);
        if (userRank) {
          return {
            project,
            userRank: {
              project: project.name,
              rank: parseInt(userRank.rank) || (leaderboard.findIndex(u => u.username && u.username.toLowerCase() === username.replace('@', '').toLowerCase()) + 1),
              tier: project.tier,
              trending_percentage: project.percentage,
              mindshare: parseFloat(userRank.mindshare) || 0,
              change_7d: parseFloat(userRank.change_7d_ratio) || 0,
              total_users_checked: leaderboard.length
            }
          };
        }
        return { project, userRank: null };
      } catch (error) {
        // Логируем ошибку для отладки, возвращаем инфу об ошибке
        console.error(`Error for project ${project.name}:`, error);
        return { project, error: error.message };
      }
    });

    const leaderboardResults = await Promise.allSettled(leaderboardPromises);
    const rankings = [];
    let errorCount = 0;

    leaderboardResults.forEach(result => {
      if (result.status === 'fulfilled') {
        const { userRank, error } = result.value;
        if (userRank) rankings.push(userRank);
        if (error) errorCount++;
      } else {
        errorCount++;
        console.error('Unhandled promise error:', result.reason);
      }
    });

    const processingTime = Math.round((Date.now() - startTime) / 1000);
    const analysis = api.generateAnalysis(rankings);

    const response = {
      success: true,
      data: {
        user: {
          input: username,
          username: username.replace('@', ''),
          type: 'username'
        },
        mode: { name: mode, projects: projects.length },
        stats: {
          total_projects: projects.length,
          found_in: rankings.length,
          not_found: projects.length - rankings.length - errorCount,
          errors: errorCount,
          processing_time: processingTime
        },
        rankings: rankings.sort((a, b) => a.rank - b.rank),
        analysis
      }
    };

    res.status(200).json(response);

  } catch (error) {
    // Лог для продакшена, чтобы понять где рушится
    console.error('FATAL API ERROR:', error, req.body);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
