// api/projects-status.js - Проверка статуса автообновления
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const projectsFilePath = join(process.cwd(), 'data', 'projects.json');
    
    if (!existsSync(projectsFilePath)) {
      return res.status(200).json({
        success: true,
        status: 'no_data',
        message: 'Projects file not found - using fallback data',
        last_update: null,
        projects_count: 0,
        auto_update_working: false
      });
    }

    const projectsData = JSON.parse(readFileSync(projectsFilePath, 'utf8'));
    const lastUpdate = new Date(projectsData.updated_at);
    const now = new Date();
    const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);

    return res.status(200).json({
      success: true,
      status: hoursDiff < 48 ? 'fresh' : 'stale',
      message: `Projects data is ${hoursDiff.toFixed(1)} hours old`,
      last_update: projectsData.updated_at,
      projects_count: projectsData.total_projects || 0,
      auto_update_working: hoursDiff < 48,
      version: projectsData.version || 'unknown',
      tiers: projectsData.tiers || {},
      next_update: 'Every day at 06:00 UTC'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      status: 'error'
    });
  }
}
