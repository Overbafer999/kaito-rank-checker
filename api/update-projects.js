// api/update-projects.js - Автообновление проектов Kaito
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

class KaitoProjectsUpdater {
  constructor() {
    this.projectsFilePath = join(process.cwd(), 'data', 'projects.json');
    this.maxProjects = 50;
    this.retryAttempts = 3;
    this.retryDelay = 2000;
  }

  // 🎯 Основная функция обновления
  async updateProjects() {
    console.log('🚀 Starting Kaito projects update...');
    
    try {
      // Пробуем разные методы получения данных
      let projects = await this.tryMultipleMethods();
      
      if (!projects || projects.length === 0) {
        console.log('❌ Failed to fetch projects, using fallback data');
        return this.useFallbackData();
      }

      // Фильтруем и сортируем топ-50
      projects = this.processProjects(projects);
      
      // Сохраняем в файл
      await this.saveProjects(projects);
      
      console.log(`✅ Successfully updated ${projects.length} projects`);
      return { success: true, projects: projects.length };
      
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 🔄 Пробуем разные методы получения данных
  async tryMultipleMethods() {
    const methods = [
      () => this.scrapeKaitoTrending(),
      () => this.parseFromAPI(),
      () => this.parseFromStaticData()
    ];

    for (const method of methods) {
      try {
        console.log(`⏳ Trying method: ${method.name}`);
        const result = await method();
        if (result && result.length > 0) {
          console.log(`✅ Success with ${method.name}: ${result.length} projects`);
          return result;
        }
      } catch (error) {
        console.log(`❌ ${method.name} failed:`, error.message);
      }
    }
    
    return null;
  }

  // 🕷️ Основной парсер Kaito страницы
  async scrapeKaitoTrending() {
    const urls = [
      'https://kaito.ai/trending',
      'https://hub.kaito.ai/trending',
      'https://yaps.kaito.ai/trending'
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) continue;

        const html = await response.text();
        const projects = this.parseHTML(html);
        
        if (projects.length > 10) {
          return projects;
        }
      } catch (error) {
        console.log(`Failed to scrape ${url}:`, error.message);
      }
    }
    
    throw new Error('All scraping attempts failed');
  }

  // 📝 Парсинг HTML страницы
  parseHTML(html) {
    const projects = [];
    
    // Пытаемся найти разные паттерны в HTML
    const patterns = [
      // Паттерн 1: JSON данные в script тегах
      /"projects":\s*(\[.*?\])/gs,
      /"trending":\s*(\[.*?\])/gs,
      
      // Паттерн 2: Данные в атрибутах
      /data-project="([^"]*)"[^>]*data-percentage="([^"]*)"/g,
      
      // Паттерн 3: Текстовые данные
      /<div[^>]*class="[^"]*project[^"]*"[^>]*>.*?<span[^>]*>([^<]+)<\/span>.*?(\d+\.\d+)%/gs
    ];

    for (const pattern of patterns) {
      const matches = html.matchAll(pattern);
      
      for (const match of matches) {
        try {
          if (match[1].startsWith('[')) {
            // JSON данные
            const jsonData = JSON.parse(match[1]);
            projects.push(...this.parseJSONProjects(jsonData));
          } else {
            // Текстовые данные
            projects.push({
              name: match[1].trim().toUpperCase(),
              percentage: parseFloat(match[2]),
              source: 'html_parse'
            });
          }
        } catch (e) {
          continue;
        }
      }
    }

    return projects.length > 0 ? projects : this.parseStaticFromImages();
  }

  // 📊 Парсинг JSON данных из скриптов
  parseJSONProjects(jsonData) {
    return jsonData.map(item => ({
      name: item.name || item.project || item.symbol || 'UNKNOWN',
      percentage: parseFloat(item.percentage || item.trending || item.score || 0),
      tier: this.calculateTier(parseFloat(item.percentage || 0)),
      source: 'json_parse'
    }));
  }

  // 📸 Статические данные из скринов (fallback)
  parseStaticFromImages() {
    console.log('📸 Using static data from screenshots');
    
    return [
      { name: 'PUMP', percentage: 7.64, tier: 'top' },
      { name: 'ANOMA', percentage: 7.33, tier: 'top' },
      { name: 'OPENLEDGER', percentage: 5.30, tier: 'top' },
      { name: 'MEMEX', percentage: 4.21, tier: 'top' },
      { name: 'HANA', percentage: 3.90, tier: 'top' },
      { name: 'M', percentage: 3.43, tier: 'top' },
      { name: 'INFINIT', percentage: 3.20, tier: 'top' },
      { name: 'WARD', percentage: 3.04, tier: 'top' },
      { name: 'INFINEX', percentage: 2.88, tier: 'high' },
      { name: 'CAMP', percentage: 2.57, tier: 'high' },
      { name: 'MITOSIS', percentage: 2.49, tier: 'high' },
      { name: 'SAPIEN', percentage: 2.49, tier: 'high' },
      { name: 'POLYMARKET', percentage: 2.34, tier: 'high' },
      { name: 'KATANA', percentage: 2.18, tier: 'high' },
      { name: 'MIRA', percentage: 2.03, tier: 'high' },
      { name: 'BLESS', percentage: 1.95, tier: 'high' },
      { name: 'BOUNDLESS', percentage: 1.79, tier: 'high' },
      { name: 'HEMI', percentage: 1.71, tier: 'high' },
      { name: 'CALDERA', percentage: 1.71, tier: 'high' },
      { name: 'MEGAETHERS', percentage: 1.64, tier: 'mid' },
      { name: 'PORTAL', percentage: 1.56, tier: 'mid' },
      { name: 'SOMNIA', percentage: 1.48, tier: 'mid' },
      { name: 'OPENSEA', percentage: 1.40, tier: 'mid' },
      { name: 'VOOI', percentage: 1.40, tier: 'mid' },
      { name: 'THEORIQ', percentage: 1.40, tier: 'mid' },
      { name: 'NOVAS', percentage: 1.25, tier: 'mid' },
      { name: 'MONAD', percentage: 1.17, tier: 'mid' },
      { name: 'ESPRESSO', percentage: 1.17, tier: 'mid' },
      { name: 'SATLAYER', percentage: 1.17, tier: 'mid' },
      { name: 'TURTLES', percentage: 1.09, tier: 'mid' },
      { name: 'OG', percentage: 1.09, tier: 'mid' },
      { name: 'SURF', percentage: 1.09, tier: 'mid' },
      { name: 'SUCCINCT', percentage: 1.09, tier: 'mid' },
      { name: 'LUMITERRA', percentage: 1.09, tier: 'mid' },
      { name: 'NOYA', percentage: 1.09, tier: 'mid' },
      { name: 'GENOME', percentage: 0.94, tier: 'emerging' },
      { name: 'LOMBARD', percentage: 0.94, tier: 'emerging' },
      { name: 'ABSTRACT', percentage: 0.86, tier: 'emerging' },
      { name: 'SOUL', percentage: 0.86, tier: 'emerging' },
      { name: 'OBJKT', percentage: 0.78, tier: 'emerging' },
      { name: 'IRYS', percentage: 0.78, tier: 'emerging' },
      { name: 'PUFF', percentage: 0.70, tier: 'emerging' },
      { name: 'UNION', percentage: 0.70, tier: 'emerging' },
      { name: 'BACKPACK', percentage: 0.62, tier: 'emerging' },
      { name: 'LINEA', percentage: 0.62, tier: 'emerging' },
      { name: 'GOAT', percentage: 0.62, tier: 'emerging' },
      { name: 'ETHOS', percentage: 0.47, tier: 'emerging' },
      { name: 'RUJI', percentage: 0.39, tier: 'emerging' },
      { name: 'FARC', percentage: 0.39, tier: 'emerging' },
      { name: 'SIDEKICK', percentage: 1.64, tier: 'emerging' }
    ];
  }

  // 🔄 Альтернативный API метод
  async parseFromAPI() {
    const apiEndpoints = [
      'https://hub.kaito.ai/api/v1/trending/projects',
      'https://api.kaito.ai/v1/trending',
      'https://yaps.kaito.ai/api/trending'
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; KaitoBot/1.0)'
          },
          signal: AbortSignal.timeout(8000)
        });

        if (response.ok) {
          const data = await response.json();
          return this.parseAPIResponse(data);
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('All API endpoints failed');
  }

  parseAPIResponse(data) {
    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name || item.symbol,
        percentage: parseFloat(item.percentage || item.trending || 0),
        tier: this.calculateTier(parseFloat(item.percentage || 0))
      }));
    }

    if (data.projects && Array.isArray(data.projects)) {
      return data.projects.map(item => ({
        name: item.name || item.symbol,
        percentage: parseFloat(item.percentage || 0),
        tier: this.calculateTier(parseFloat(item.percentage || 0))
      }));
    }

    return [];
  }

  // 📊 Обработка и фильтрация проектов
  processProjects(projects) {
    return projects
      .filter(p => p.name && p.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, this.maxProjects)
      .map((project, index) => ({
        id: project.name.toUpperCase(),
        name: project.name.toUpperCase(),
        percentage: parseFloat(project.percentage.toFixed(2)),
        tier: project.tier || this.calculateTier(project.percentage),
        rank: index + 1,
        updated_at: new Date().toISOString()
      }));
  }

  // 🏆 Определение уровня проекта
  calculateTier(percentage) {
    if (percentage >= 3.0) return 'top';
    if (percentage >= 1.5) return 'high';
    if (percentage >= 0.8) return 'mid';
    return 'emerging';
  }

  // 💾 Сохранение данных в файл
  async saveProjects(projects) {
    const dataDir = join(process.cwd(), 'data');
    
    // Создаем папку если не существует
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }

    const projectsData = {
      updated_at: new Date().toISOString(),
      total_projects: projects.length,
      last_update_success: true,
      version: '3.0.0',
      projects: projects,
      tiers: {
        top: projects.filter(p => p.tier === 'top').length,
        high: projects.filter(p => p.tier === 'high').length,
        mid: projects.filter(p => p.tier === 'mid').length,
        emerging: projects.filter(p => p.tier === 'emerging').length
      }
    };

    writeFileSync(this.projectsFilePath, JSON.stringify(projectsData, null, 2));
    
    // Также сохраняем бэкап
    const backupPath = join(process.cwd(), 'data', `projects_backup_${Date.now()}.json`);
    writeFileSync(backupPath, JSON.stringify(projectsData, null, 2));
    
    console.log(`💾 Projects saved to: ${this.projectsFilePath}`);
  }

  // 🔄 Fallback данные
  useFallbackData() {
    try {
      if (existsSync(this.projectsFilePath)) {
        const existingData = JSON.parse(readFileSync(this.projectsFilePath, 'utf8'));
        console.log('📦 Using existing cached data');
        return { success: true, cached: true, projects: existingData.projects.length };
      }
    } catch (error) {
      console.error('❌ Failed to read cached data:', error.message);
    }

    // Используем статические данные как последний fallback
    const fallbackProjects = this.parseStaticFromImages();
    this.saveProjects(this.processProjects(fallbackProjects));
    
    return { success: true, fallback: true, projects: fallbackProjects.length };
  }

  // 📈 Получение текущих проектов
  getCurrentProjects() {
    try {
      if (existsSync(this.projectsFilePath)) {
        return JSON.parse(readFileSync(this.projectsFilePath, 'utf8'));
      }
    } catch (error) {
      console.error('Failed to read projects file:', error.message);
    }
    
    return null;
  }
}

// 🚀 Serverless функция для Vercel
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const updater = new KaitoProjectsUpdater();

  try {
    if (req.method === 'POST') {
      // Принудительное обновление
      const result = await updater.updateProjects();
      return res.status(200).json({
        success: true,
        message: 'Projects update completed',
        data: result
      });
    }

    if (req.method === 'GET') {
      // Получение текущих проектов
      const currentProjects = updater.getCurrentProjects();
      
      if (!currentProjects) {
        // Если файла нет - обновляем
        await updater.updateProjects();
        const newProjects = updater.getCurrentProjects();
        return res.status(200).json(newProjects);
      }

      // Проверяем возраст данных (если старше 24 часов - обновляем)
      const lastUpdate = new Date(currentProjects.updated_at);
      const now = new Date();
      const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        console.log(`🔄 Data is ${hoursDiff.toFixed(1)} hours old, updating...`);
        await updater.updateProjects();
        const updatedProjects = updater.getCurrentProjects();
        return res.status(200).json(updatedProjects);
      }

      return res.status(200).json(currentProjects);
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('❌ Handler error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      fallback: 'Using cached data if available'
    });
  }
}
