/**
 * Test script to debug GitHub trending scraping
 * Run with: node scripts/test-scraping.js
 */

async function testTrendingScraping() {
  console.log('🔍 Testing GitHub trending page scraping...');
  
  try {
    const response = await fetch('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`✅ Successfully fetched trending page (${html.length} characters)`);
    
    // Save HTML for inspection
    const fs = require('fs');
    fs.writeFileSync('trending-page.html', html);
    console.log('📄 Saved HTML to trending-page.html for inspection');
    
    // Try to extract repositories
    const repositories = parseTrendingHtml(html);
    console.log(`🎯 Found ${repositories.length} repositories:`);
    
    repositories.slice(0, 5).forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.full_name}`);
      console.log(`   Description: ${repo.description || 'N/A'}`);
      console.log(`   Language: ${repo.language || 'N/A'}`);
      console.log(`   Stars: ${repo.stargazers_count}`);
      console.log('');
    });
    
    if (repositories.length === 0) {
      console.log('❌ No repositories found. Check the HTML structure in trending-page.html');
      
      // Show some sample HTML to help debug
      const sampleMatch = html.match(/<article[^>]*>(.*?)<\/article>/s);
      if (sampleMatch) {
        console.log('📝 Sample article HTML:');
        console.log(sampleMatch[0].substring(0, 500) + '...');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing scraping:', error.message);
  }
}

function parseTrendingHtml(html) {
  const repositories = [];
  
  // Try multiple patterns
  const patterns = [
    /<article[^>]*class="[^"]*Box-row[^"]*"[^>]*>(.*?)<\/article>/gs,
    /<div[^>]*class="[^"]*Box-row[^"]*"[^>]*>(.*?)<\/div>/gs,
    /<li[^>]*class="[^"]*repo-list-item[^"]*"[^>]*>(.*?)<\/li>/gs,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    let matchCount = 0;
    
    for (const match of matches) {
      const articleHtml = match[1];
      
      try {
        const repo = parseRepositoryFromArticle(articleHtml);
        if (repo) {
          repositories.push(repo);
          matchCount++;
        }
      } catch (error) {
        console.warn('Failed to parse repository:', error.message);
      }
    }
    
    if (matchCount > 0) {
      console.log(`✅ Found ${matchCount} repositories using pattern ${patterns.indexOf(pattern) + 1}`);
      break;
    }
  }
  
  return repositories;
}

function parseRepositoryFromArticle(articleHtml) {
  // Extract repository name and owner
  const namePatterns = [
    /<h2[^>]*>.*?<a[^>]*href="\/([^"]+)"[^>]*>/s,
    /<h1[^>]*>.*?<a[^>]*href="\/([^"]+)"[^>]*>/s,
    /<a[^>]*href="\/([^\/]+\/[^\/\?"]+)"[^>]*>/s,
  ];
  
  let fullName = '';
  for (const pattern of namePatterns) {
    const match = articleHtml.match(pattern);
    if (match && match[1] && match[1].includes('/')) {
      fullName = match[1];
      break;
    }
  }
  
  if (!fullName || !fullName.includes('/')) {
    return null;
  }
  
  const [owner, name] = fullName.split('/');
  if (!owner || !name) {
    return null;
  }
  
  // Extract description
  const descPatterns = [
    /<p[^>]*class="[^"]*color-fg-muted[^"]*"[^>]*>(.*?)<\/p>/s,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/p>/s,
  ];
  
  let description = null;
  for (const pattern of descPatterns) {
    const match = articleHtml.match(pattern);
    if (match && match[1]) {
      description = match[1].replace(/<[^>]*>/g, '').trim();
      if (description) break;
    }
  }
  
  // Extract language
  const langPatterns = [
    /<span[^>]*itemprop="programmingLanguage"[^>]*>(.*?)<\/span>/s,
    /<span[^>]*class="[^"]*language[^"]*"[^>]*>(.*?)<\/span>/s,
  ];
  
  let language = null;
  for (const pattern of langPatterns) {
    const match = articleHtml.match(pattern);
    if (match && match[1]) {
      language = match[1].trim();
      if (language) break;
    }
  }
  
  // Extract stars
  const starsPatterns = [
    /(\d+(?:,\d+)*)\s*stars?\s*today/i,
    /(\d+(?:,\d+)*)\s*stars?/i,
  ];
  
  let starsCount = 0;
  for (const pattern of starsPatterns) {
    const match = articleHtml.match(pattern);
    if (match && match[1]) {
      starsCount = parseInt(match[1].replace(/,/g, ''));
      if (!isNaN(starsCount)) break;
    }
  }

  return {
    id: Math.abs(fullName.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)),
    name,
    full_name: fullName,
    description: description || null,
    html_url: `https://github.com/${fullName}`,
    stargazers_count: starsCount,
    language: language || null,
    owner: {
      login: owner,
      avatar_url: `https://github.com/${owner}.png`,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Run the test
testTrendingScraping();