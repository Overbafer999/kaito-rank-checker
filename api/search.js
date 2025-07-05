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
  }

  async getProjectLeaderboard(topicId, duration = '30d', retries = 2) {
    if (!topicId || topicId === 'undefined') {
      throw new Error(`Invalid topicId: ${topicId}`);
    }
    
    const topNValues = [1000, 500, 100];
    
    for (let topNIndex = 0; topNIndex < topNValues.length; topNIndex++) {
      const currentTopN = topNValues[topNIndex];
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const url = `${this.baseURL}/gateway/ai/kol/mindshare/top-leaderboard` +
            `?duration=${duration}&topic_id=${topicId}&top_n=${currentTopN}` +
            `&customized_community=customized&community_yaps=true`;
          
          const response = await fetch(url, {
            headers: this.headers,
            signal: AbortSignal.timeout(8000)
          });
          
          if (!response.ok) {
            if (response.status === 500 && attempt < retries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
              continue;
            }
            if (topNIndex < topNValues.length - 1) break;
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          
          if (Array.isArray(data) && data.length > 0) {
            return this.parseLeaderboard(data);
          } else {
            if (topNIndex < topNValues.length - 1) break;
          }
          
        } catch (error) {
          if (attempt === retries) {
            if (topNIndex < topNValues.length - 1) break;
            return null;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    return null;
  }

  parseLeaderboard(data) {
    if (Array.isArray(data)) {
      return data.map((user, index) => ({
        rank: user.rank || (index + 1).toString(),
        username: user.username || 'Unknown',
        name: user.name || user.username || 'Unknown',
        mindshare: parseFloat(user.mindshare) || 0,
        change_7d: parseFloat(user.change_7d_ratio) || 0,
        followers: parseInt(user.follower_count) || 0,
        smart_followers: parseInt(user.smart_follower_count) || 0,
        profile_image: user.icon || '',
        user_id: user.user_id
      }));
    }
    
    if (data && data.resultWithKol && Array.isArray(data.resultWithKol)) {
      return data.resultWithKol.map((user, index) => ({
        rank: parseInt(user.rank) || (index + 1),
        username: user.username || 'Unknown',
        name: user.name || user.username || 'Unknown',
        mindshare: parseFloat(user.mindshare) || 0,
        change_7d: parseFloat(user.change_7d_ratio) || 0,
        followers: parseInt(user.follower_count) || 0,
        smart_followers: parseInt(user.smart_follower_count) || 0,
        profile_image: user.icon || '',
        user_id: user.user_id
      }));
    }
    
    return null;
  }

  async parseUserInput(input) {
    const trimmed = input.trim();
    
    if (/^\d{15,}$/.test(trimmed)) {
      return {
        type: 'user_id',
        search_by: 'user_id',
        value: trimmed,
        username: 'Unknown'
      };
    }
    
    if (trimmed.startsWith('@') || /^[a-zA-Z0-9_]{1,15}$/.test(trimmed)) {
      const cleanUsername = trimmed.replace('@', '');
      return {
        type: 'username',
        search_by: 'username',
        value: cleanUsername,
        username: cleanUsername
      };
    }
    
    throw new Error('Invalid input format. Use: @username or Twitter User ID');
  }

  // 🔥 FULL PROJECT LIST - 60+ Projects
  getTrendingProjects() {
    return {
      top_tier: [
        { id: 'ANOMA', name: 'ANOMA', percentage: 8.72, tier: 'top' },
        { id: 'OPENLEDGER', name: 'OPENLEDGER', percentage: 6.31, tier: 'top' },
        { id: 'INFINIT', name: 'INFINIT', percentage: 5.18, tier: 'top' },
        { id: 'MEMEX', name: 'MEMEX', percentage: 4.73, tier: 'top' },
        { id: 'INFINEX', name: 'INFINEX', percentage: 4.60, tier: 'top' },
        { id: 'M', name: 'M', percentage: 3.68, tier: 'top' },
        { id: 'HANA', name: 'HANA', percentage: 3.20, tier: 'top' },
        { id: 'MITOSIS', name: 'MITOSIS', percentage: 3.09, tier: 'top' },
        { id: 'LOMBARD', name: 'LOMBARD', percentage: 2.76, tier: 'top' },
        { id: 'THEORIQ', name: 'THEORIQ', percentage: 2.56, tier: 'top' },
        { id: 'BOUNDLESS', name: 'BOUNDLESS', percentage: 2.37, tier: 'top' },
        { id: 'SOM', name: 'SOM', percentage: 2.23, tier: 'top' },
        { id: 'ES', name: 'ES', percentage: 2.10, tier: 'top' },
        { id: 'WARD', name: 'WARD', percentage: 2.04, tier: 'top' }
      ],
      
      high_tier: [
        { id: 'CAMP', name: 'CAMP', percentage: 1.84, tier: 'high' },
        { id: 'VOOI', name: 'VOOI', percentage: 1.84, tier: 'high' },
        { id: 'LUMI', name: 'LUMI', percentage: 1.77, tier: 'high' },
        { id: 'NOVAS', name: 'NOVAS', percentage: 1.77, tier: 'high' },
        { id: 'MIRA', name: 'MIRA', percentage: 1.77, tier: 'high' },
        { id: 'PORTALT', name: 'PORTALT', percentage: 1.77, tier: 'high' },
        { id: 'BLESS', name: 'BLESS', percentage: 1.71, tier: 'high' },
        { id: 'KATANA', name: 'KATANA', percentage: 1.71, tier: 'high' },
        { id: 'CALDERA', name: 'CALDERA', percentage: 1.71, tier: 'high' },
        { id: 'OG', name: 'OG', percentage: 1.71, tier: 'high' },
        { id: 'OPENSEA', name: 'OPENSEA', percentage: 1.38, tier: 'high' },
        { id: 'SURF', name: 'SURF', percentage: 1.38, tier: 'high' },
        { id: 'NOYA', name: 'NOYA', percentage: 1.31, tier: 'high' },
        { id: 'MONAD', name: 'MONAD', percentage: 1.18, tier: 'high' },
        { id: 'ABSTRACT', name: 'ABSTRACT', percentage: 1.18, tier: 'high' },
        { id: 'SAPIEN', name: 'SAPIEN', percentage: 1.12, tier: 'high' },
        { id: 'SOUL', name: 'SOUL', percentage: 1.05, tier: 'high' }
      ],
      
      mid_tier: [
        { id: 'OBJKT', name: 'OBJKT', percentage: 0.99, tier: 'mid' },
        { id: 'PUMP', name: 'PUMP', percentage: 0.85, tier: 'mid' },
        { id: 'ESPRESSO', name: 'ESPRESSO', percentage: 0.85, tier: 'mid' },
        { id: 'SUCCINCT', name: 'SUCCINCT', percentage: 0.79, tier: 'mid' },
        { id: 'ETHOSN', name: 'ETHOSN', percentage: 0.72, tier: 'mid' },
        { id: 'SATLAYER', name: 'SATLAYER', percentage: 0.72, tier: 'mid' },
        { id: 'IRYS', name: 'IRYS', percentage: 0.72, tier: 'mid' },
        { id: 'TURT', name: 'TURT', percentage: 0.66, tier: 'mid' },
        { id: 'HEMI', name: 'HEMI', percentage: 0.66, tier: 'mid' },
        { id: 'FXHASH', name: 'FXHASH', percentage: 0.66, tier: 'mid' },
        { id: 'GENO', name: 'GENO', percentage: 0.66, tier: 'mid' },
        { id: 'POLY', name: 'POLY', percentage: 0.59, tier: 'mid' },
        { id: 'MET', name: 'MET', percentage: 0.59, tier: 'mid' },
        { id: 'MEG', name: 'MEG', percentage: 0.59, tier: 'mid' },
        { id: 'SIDE', name: 'SIDE', percentage: 0.59, tier: 'mid' },
        { id: 'RISC', name: 'RISC', percentage: 0.53, tier: 'mid' }
      ],
      
      emerging_tier: [
        { id: 'YEIFI', name: 'YEIFI', percentage: 0.46, tier: 'emerging' },
        { id: 'AVAN', name: 'AVAN', percentage: 0.39, tier: 'emerging' },
        { id: 'UNION', name: 'UNION', percentage: 0.39, tier: 'emerging' },
        { id: 'LINEA', name: 'LINEA', percentage: 0.39, tier: 'emerging' },
        { id: 'TIMEFUN', name: 'TIMEFUN', percentage: 0.33, tier: 'emerging' },
        { id: 'OVERTAKE', name: 'OVERTAKE', percentage: 0.26, tier: 'emerging' },
        { id: 'BACKPACK', name: 'BACKPACK', percentage: 0.26, tier: 'emerging' },
        { id: 'RUJI', name: 'RUJI', percentage: 0.26, tier: 'emerging' },
        { id: 'GAIB', name: 'GAIB', percentage: 0.26, tier: 'emerging' },
        { id: 'ALLORA', name: 'ALLORA', percentage: 0.26, tier: 'emerging' },
        { id: 'GOAT', name: 'GOAT', percentage: 0.20, tier: 'emerging' },
        { id: 'NANSEN', name: 'NANSEN', percentage: 0.20, tier: 'emerging' },
        { id: 'FOGO', name: 'FOGO', percentage: 0.20, tier: 'emerging' },
        { id: 'SYMP', name: 'SYMP', percentage: 0.20, tier: 'emerging' },
        { id: 'PUFFP', name: 'PUFFP', percentage: 0.20, tier: 'emerging' },
        { id: 'GTE', name: 'GTE', percentage: 0.13, tier: 'emerging' },
        { id: 'BLACKMI', name: 'BLACKMI', percentage: 0.13, tier: 'emerging' },
        { id: 'TOWNS', name: 'TOWNS', percentage: 0.13, tier: 'emerging' },
        { id: 'MYR', name: 'MYR', percentage: 0.13, tier: 'emerging' },
        { id: 'THRIVE', name: 'THRIVE', percentage: 0.13, tier: 'emerging' },
        { id: 'AEGIS', name: 'AEGIS', percentage: 0.13, tier: 'emerging' },
        { id: 'NUBIT', name: 'NUBIT', percentage: 0.13, tier: 'emerging' },
        { id: 'BOB', name: 'BOB', percentage: 0.13, tier: 'emerging' },
        { id: 'NOISE', name: 'NOISE', percentage: 0.13, tier: 'emerging' },
        { id: 'SPHE', name: 'SPHE', percentage: 0.13, tier: 'emerging' },
        { id: 'BUNGEE', name: 'BUNGEE', percentage: 0.13, tier: 'emerging' },
        { id: 'MULTIPLI', name: 'MULTIPLI', percentage: 0.13, tier: 'emerging' },
        { id: 'ASTER', name: 'ASTER', percentage: 0.13, tier: 'emerging' }
      ]
    };
  }

  getSearchModes() {
    return {
      lightning: { name: 'Lightning', projects: 15, icon: '⚡' },
      standard: { name: 'Standard', projects: 35, icon: '🚀' },
      complete: { name: 'Complete', projects: 65, icon: '🔥' },
      ultimate: { name: 'Ultimate', projects: 80, icon: '💎' }
    };
  }
}

class KaitoDashboard {
  constructor() {
    this.api = new KaitoAPI();
  }

  async getUserRankingsAcrossProjects(userInput, mode = 'standard') {
    try {
      const modes = this.api.getSearchModes();
      const selectedMode = modes[mode] || modes.standard;
      const maxProjects = selectedMode.projects;
      
      const parsedUser = await this.api.parseUserInput(userInput);
      const searchValue = parsedUser.value;
      const searchBy = parsedUser.search_by;
      
      const trendingData = this.api.getTrendingProjects();
      
      const topCount = Math.floor(maxProjects * 0.4);
      const highCount = Math.floor(maxProjects * 0.35);
      const midCount = Math.floor(maxProjects * 0.2);
      const emergingCount = maxProjects - topCount - highCount - midCount;
      
      const allProjects = [
        ...(trendingData.top_tier || []).slice(0, topCount),
        ...(trendingData.high_tier || []).slice(0, highCount),
        ...(trendingData.mid_tier || []).slice(0, midCount),
        ...(trendingData.emerging_tier || []).slice(0, emergingCount)
      ];
      
      const projectsToCheck = allProjects.filter(project => {
        return project && project.id && project.name && typeof project.percentage === 'number';
      });

      const results = {
        user_input: userInput,
        user_type: parsedUser.type,
        username: parsedUser.username || 'Unknown',
        search_by: searchBy,
        search_value: searchValue,
        mode: selectedMode,
        total_projects_checked: projectsToCheck.length,
        timestamp: new Date().toISOString(),
        projects: [],
        metadata: { processing_time: Date.now() }
      };

      for (const project of projectsToCheck) {
        try {
          const leaderboard = await this.api.getProjectLeaderboard(project.id, '30d');
          const userRank = this.findUserInLeaderboard(leaderboard, searchValue, searchBy);
          
          const projectResult = {
            project_id: project.id,
            project_name: project.name,
            trending_percentage: project.percentage,
            tier: project.tier,
            rank: userRank ? userRank.rank : 'Not Found',
            mindshare: userRank ? userRank.mindshare : 0,
            change_7d: userRank ? userRank.change_7d : 0,
            total_users: leaderboard ? leaderboard.length : 0,
            status: userRank ? 'found' : 'not_found'
          };
          
          results.projects.push(projectResult);
          
          const delay = mode === 'lightning' ? 400 : mode === 'standard' ? 600 : 800;
          await new Promise(resolve => setTimeout(resolve, delay));
          
        } catch (error) {
          results.projects.push({
            project_id: project.id,
            project_name: project.name,
            trending_percentage: project.percentage,
            tier: project.tier,
            rank: 'Error',
            status: 'error',
            error: error.message.substring(0, 100)
          });
        }
      }

      results.metadata.processing_time = Date.now() - results.metadata.processing_time;
      results.metadata.processing_time_seconds = Math.round(results.metadata.processing_time / 1000);

      return results;
      
    } catch (error) {
      throw new Error(`Dashboard error: ${error.message}`);
    }
  }

  findUserInLeaderboard(leaderboard, searchValue, searchBy = 'user_id') {
    if (!leaderboard || !Array.isArray(leaderboard)) {
      return null;
    }

    if (searchBy === 'username') {
      return leaderboard.find(user => {
        if (!user.username) return false;
        return user.username.toLowerCase() === searchValue.toLowerCase();
      });
    } else {
      return leaderboard.find(user => user.user_id === searchValue);
    }
  }

  generateAnalysis(results) {
    const foundProjects = results.projects.filter(p => p.status === 'found');
    
    if (foundProjects.length === 0) {
      return {
        performance_level: 'not_found',
        description: 'Not found in any trending projects',
        best_rank: null,
        average_rank: null,
        total_projects: 0,
        recommendations: ['Try different timeframe', 'Check if user is active on Kaito'],
        tier_distribution: { top: 0, high: 0, mid: 0, emerging: 0 }
      };
    }

    const ranks = foundProjects.map(p => parseInt(p.rank));
    const bestRank = Math.min(...ranks);
    const avgRank = Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length);
    
    let performance_level = 'good';
    let description = '';
    const recommendations = [];

    if (bestRank <= 20) {
      performance_level = 'elite';
      description = `Elite performer with best rank #${bestRank}`;
      recommendations.push('Focus on maintaining top positions');
      recommendations.push('Consider expanding to similar tier projects');
    } else if (bestRank <= 50) {
      performance_level = 'strong';
      description = `Strong performer with best rank #${bestRank}`;
      recommendations.push('Work towards breaking into top 20');
      recommendations.push('Increase engagement in current projects');
    } else if (bestRank <= 100) {
      performance_level = 'good';
      description = `Good visibility with best rank #${bestRank}`;
      recommendations.push('Focus on climbing higher in current projects');
      recommendations.push('Maintain consistent activity');
    } else {
      performance_level = 'emerging';
      description = `Emerging presence with best rank #${bestRank}`;
      recommendations.push('Continue building engagement');
      recommendations.push('Focus on increasing activity');
    }

    return {
      performance_level,
      description,
      best_rank: bestRank,
      average_rank: avgRank,
      total_projects: foundProjects.length,
      recommendations,
      tier_distribution: {
        top: foundProjects.filter(p => p.tier === 'top').length,
        high: foundProjects.filter(p => p.tier === 'high').length,
        mid: foundProjects.filter(p => p.tier === 'mid').length,
        emerging: foundProjects.filter(p => p.tier === 'emerging').length
      }
    };
  }
}

// Main serverless function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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

    const dashboard = new KaitoDashboard();
    const results = await dashboard.getUserRankingsAcrossProjects(username, mode);
    
    if (!results || !results.projects) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch data'
      });
    }

    const foundProjects = results.projects.filter(p => p.status === 'found');
    const analysis = dashboard.generateAnalysis(results);

    const response = {
      success: true,
      data: {
        user: {
          input: results.user_input,
          username: results.username,
          type: results.user_type
        },
        mode: results.mode,
        stats: {
          total_projects: results.total_projects_checked,
          found_in: foundProjects.length,
          not_found: results.projects.filter(p => p.status === 'not_found').length,
          errors: results.projects.filter(p => p.status === 'error').length,
          processing_time: results.metadata?.processing_time_seconds || 0
        },
        rankings: foundProjects.map(project => ({
          project: project.project_name,
          rank: parseInt(project.rank),
          tier: project.tier,
          trending_percentage: project.trending_percentage,
          mindshare: project.mindshare,
          change_7d: project.change_7d,
          total_users_checked: project.total_users
        })).sort((a, b) => a.rank - b.rank),
        analysis
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
