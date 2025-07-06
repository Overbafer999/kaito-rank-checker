// Vercel serverless function - Main search API
// Kaito Rank Tracker by @Over9725

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    // Просто возвращаем тестовые данные
    const response = {
      success: true,
      data: {
        user: {
          input: username,
          username: username.replace('@', ''),
          type: 'username'
        },
        mode: { name: mode, projects: 15 },
        stats: {
          total_projects: 15,
          found_in: 0,
          not_found: 15,
          errors: 0,
          processing_time: 2
        },
        rankings: [],
        analysis: {
          performance_level: 'not_found',
          description: 'Test mode - API is being fixed',
          best_rank: null,
          recommendations: ['Service is in test mode'],
          tier_distribution: { top: 0, high: 0, mid: 0, emerging: 0 }
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
