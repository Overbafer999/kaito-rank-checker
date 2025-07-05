// Vercel serverless function - Health check
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.0.0-vercel',
    features: [
      '60+ projects',
      '4 search modes', 
      'Vercel optimized',
      'Serverless functions'
    ],
    endpoints: {
      health: '/health',
      search: '/api/search',
      modes: '/api/modes',
      projects: '/api/projects'
    },
    modes: {
      lightning: '15 projects - 1-2 min',
      standard: '35 projects - 3-5 min',
      complete: '60+ projects - 8-12 min',
      ultimate: '80 projects - 12-20 min'
    }
  });
}
