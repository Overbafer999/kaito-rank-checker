// Kaito Rank Tracker - RAILWAY PRODUCTION VERSION
// Made by @Over9725 - Full 60+ projects with multiple modes

const express = require('express');
const cors = require('cors');
const path = require('path');

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

  // Get leaderboard with Railway-optimized retry logic
  async getProjectLeaderboard(topicId, duration = '30d', retries = 2) {
    console.log(`📊 Fetching ${topicId}...`);
    
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
            signal: AbortSignal.timeout(10000)
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
            const parsedData = this.parseLeaderboard(data);
            if (parsedData) {
              parsedData._metadata = {
                requestedTopN: currentTopN,
                actualLength: data.length,
                timestamp: new Date().toISOString()
              };
            }
            return parsedData;
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

  // Parse leaderboard data
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

  // Parse user input
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

  // 🔥 FULL PROJECT LIST - 60+ Projects (Your original list)
  getTrendingProjects() {
    return {
      // TOP TIER (>2%) - Highest trending
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
      
      // HIGH TIER (1-2%) - Strong trending
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
      
      // MID TIER (0.5-1%) - Growing trending
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
      
      // EMERGING TIER (0.1-0.5%) - New trending
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

  // 🚀 Get search modes
  getSearchModes() {
    return {
      lightning: {
        name: 'Lightning',
        description: 'Top 15 projects - 1-2 minutes',
        projects: 15,
        icon: '⚡',
        estimatedTime: '1-2 min'
      },
      standard: {
        name: 'Standard', 
        description: 'Top 35 projects - 3-5 minutes',
        projects: 35,
        icon: '🚀',
        estimatedTime: '3-5 min'
      },
      complete: {
        name: 'Complete',
        description: 'All 60+ projects - 6-10 minutes',
        projects: 65,
        icon: '🔥',
        estimatedTime: '6-10 min'
      },
      ultimate: {
        name: 'Ultimate',
        description: 'Every project + deep search - 10-15 minutes',
        projects: 80,
        icon: '💎',
        estimatedTime: '10-15 min'
      }
    };
  }
}

// Dashboard Class - Railway Optimized
class KaitoDashboard {
  constructor() {
    this.api = new KaitoAPI();
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes for Railway
  }

  // 🔥 Main function with mode support
  async getUserRankingsAcrossProjects(userInput, mode = 'standard', options = {}) {
    try {
      console.log(`🔍 Processing: ${userInput} (${mode} mode)`);
      
      const modes = this.api.getSearchModes();
      const selectedMode = modes[mode] || modes.standard;
      const maxProjects = selectedMode.projects;
      
      // Parse user input
      const parsedUser = await this.api.parseUserInput(userInput);
      const searchValue = parsedUser.value;
      const searchBy = parsedUser.search_by;
      
      console.log(`📊 ${selectedMode.name} mode: checking ${maxProjects} projects`);
      
      const trendingData = this.api.getTrendingProjects();
      
      // Smart project selection based on mode
      let projectsToCheck = [];
      const topCount = Math.floor(maxProjects * 0.4);     // 40% from top
      const highCount = Math.floor(maxProjects * 0.35);   // 35% from high  
      const midCount = Math.floor(maxProjects * 0.2);     // 20% from mid
      const emergingCount = maxProjects - topCount - highCount - midCount; // Rest from emerging
      
      const allProjects = [
        ...(trendingData.top_tier || []).slice(0, topCount),
        ...(trendingData.high_tier || []).slice(0, highCount),
        ...(trendingData.mid_tier || []).slice(0, midCount),
        ...(trendingData.emerging_tier || []).slice(0, emergingCount)
      ];
      
      projectsToCheck = allProjects.filter(project => {
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
        metadata: {
          processing_time: Date.now()
        }
      };

      console.log(`📊 Checking ${projectsToCheck.length} projects in ${selectedMode.name} mode...`);

      // Process each project
      let processed = 0;
      for (const project of projectsToCheck) {
        processed++;
        console.log(`📊 [${processed}/${projectsToCheck.length}] ${project.name}...`);
        
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
          
          // Rate limiting based on mode
          const delay = mode === 'lightning' ? 600 : mode === 'standard' ? 800 : 1000;
          await this.sleep(delay);
          
        } catch (error) {
          console.error(`❌ Error for ${project.name}:`, error.message);
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

      // Calculate processing time
      results.metadata.processing_time = Date.now() - results.metadata.processing_time;
      results.metadata.processing_time_seconds = Math.round(results.metadata.processing_time / 1000);

      return results;
      
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      return {
        user_input: userInput,
        projects: [],
        error: error.message
      };
    }
  }

  // Find user in leaderboard
  findUserInLeaderboard(leaderboard, searchValue, searchBy = 'user_id') {
    if (!leaderboard || !Array.isArray(leaderboard)) {
      return null;
    }

    let foundUser = null;

    if (searchBy === 'username') {
      foundUser = leaderboard.find(user => {
        if (!user.username) return false;
        return user.username.toLowerCase() === searchValue.toLowerCase();
      });
    } else {
      foundUser = leaderboard.find(user => user.user_id === searchValue);
    }

    return foundUser;
  }

  // Generate analysis
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 🌐 Express App for Railway
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize dashboard
const dashboard = new KaitoDashboard();
const api = new KaitoAPI();

// 🔥 API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.0.0-railway',
    features: ['60+ projects', 'Multiple modes', 'Railway optimized']
  });
});

// Get available modes
app.get('/api/modes', (req, res) => {
  try {
    const modes = api.getSearchModes();
    res.json({
      success: true,
      modes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get project list
app.get('/api/projects', (req, res) => {
  try {
    const projects = api.getTrendingProjects();
    const totalCount = Object.values(projects).reduce((sum, tier) => sum + tier.length, 0);
    
    res.json({
      success: true,
      total_projects: totalCount,
      projects: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🚀 Main search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { username, mode = 'standard' } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    console.log(`🔍 API Search: ${username} (${mode} mode)`);

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

    res.json(response);

  } catch (error) {
    console.error('❌ Search API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 📱 Serve frontend
app.get('/', (req, res) => {
  res.send(`
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
            }
            .container {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 3rem;
                max-width: 600px;
                width: 90%;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.2);
            }
            h1 { font-size: 2.5rem; margin-bottom: 1rem; }
            .subtitle { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            .feature {
                background: rgba(255,255,255,0.1);
                padding: 1rem;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .feature h3 { margin-bottom: 0.5rem; }
            .api-info {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 10px;
                margin: 2rem 0;
                text-align: left;
            }
            .endpoints { margin-top: 1rem; }
            .endpoint {
                background: rgba(0,0,0,0.2);
                padding: 0.5rem;
                margin: 0.5rem 0;
                border-radius: 5px;
                font-family: monospace;
                font-size: 0.9rem;
            }
            .mode-badge {
                display: inline-block;
                padding: 0.3rem 0.8rem;
                margin: 0.2rem;
                border-radius: 20px;
                background: rgba(255,255,255,0.2);
                font-size: 0.9rem;
            }
            .btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                text-decoration: none;
                display: inline-block;
                margin: 0.5rem;
                transition: all 0.3s ease;
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 Kaito Rank Tracker</h1>
            <p class="subtitle">Find your rankings across 60+ trending crypto projects</p>
            
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
                    <p>60+ projects, 6-10 minutes</p>
                </div>
                <div class="feature">
                    <h3>💎 Ultimate Mode</h3>
                    <p>80 projects, 10-15 minutes</p>
                </div>
            </div>

            <div class="api-info">
                <h3>🌐 API Endpoints</h3>
                <div class="endpoints">
                    <div class="endpoint">GET /health - Health check</div>
                    <div class="endpoint">GET /api/modes - Available search modes</div>
                    <div class="endpoint">GET /api/projects - Project list</div>
                    <div class="endpoint">POST /api/search - Main search endpoint</div>
                </div>
                
                <h4 style="margin-top: 1rem;">Search Example:</h4>
                <div class="endpoint">
                    POST /api/search<br>
                    { "username": "@teddi_speaks", "mode": "standard" }
                </div>
            </div>

            <div style="margin-top: 2rem;">
                <h3>🎨 Features</h3>
                <div class="mode-badge">60+ Projects</div>
                <div class="mode-badge">4 Search Modes</div>
                <div class="mode-badge">Elite Analysis</div>
                <div class="mode-badge">Railway Optimized</div>
                <div class="mode-badge">Real-time API</div>
            </div>

            <div style="margin-top: 2rem;">
                <a href="/api/modes" class="btn">View Modes</a>
                <a href="/api/projects" class="btn">View Projects</a>
                <a href="/health" class="btn">Health Check</a>
            </div>
            
            <p style="margin-top: 2rem; opacity: 0.7;">
                Made by @Over9725 | Powered by Railway
            </p>
        </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kaito Rank Tracker running on port ${PORT}`);
  console.log(`🌐 Railway deployment ready!`);
  console.log(`📊 Supporting 60+ projects with 4 search modes`);
});

module.exports = app;
