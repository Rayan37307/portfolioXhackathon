import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'

interface LastUpdatedTimeData {
  lastUpdatedTime: string
  latestCommitUrl: string
}

const getLastUpdatedTimeByFile = async (
  filePath: string
): Promise<LastUpdatedTimeData> => {
  try {
    // Check if GitHub token is available
    if (!GITHUB_ACCESS_TOKEN) {
      console.warn('Missing GitHub access token. Using fallback data.');
      return getFallbackData();
    }

    // Use a more generic repository path for the demo
    const API_URL = `https://api.github.com/repos/Rayan37307/portfolioXhackathon/commits?`

    const params = new URLSearchParams({
      path: `src/content/${filePath}`,
      per_page: '1'
    }).toString()

    const response = await fetch(API_URL + params, {
      headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` }
    })

    if (!response.ok) {
      console.warn(`GitHub API responded with status: ${response.status}`);
      return getFallbackData();
    }

    // Safely parse the response
    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing GitHub API response:', parseError, 'Response text:', text.substring(0, 100));
      return getFallbackData();
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No commit data returned from GitHub API');
      return getFallbackData();
    }

    return {
      lastUpdatedTime: data[0].commit.committer.date,
      latestCommitUrl: data[0].html_url
    }
  } catch (error) {
    console.error('Error fetching last updated time:', error)
    return getFallbackData();
  }
}

// Provide fallback data when GitHub API is unavailable
function getFallbackData(): LastUpdatedTimeData {
  return {
    lastUpdatedTime: new Date().toISOString(),
    latestCommitUrl: ''
  };
}

export default getLastUpdatedTimeByFile
