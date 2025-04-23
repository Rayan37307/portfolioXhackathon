import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'

interface LastUpdatedTimeData {
  lastUpdatedTime: string
  latestCommitUrl: string
}

const getLastUpdatedTimeByFile = async (
  filePath: string
): Promise<LastUpdatedTimeData> => {
  try {
    const API_URL = `https://api.github.com/repos/jestsee/jestsee.com/commits?`

    const params = new URLSearchParams({
      path: `src/content/${filePath}`,
      per_page: '1'
    }).toString()

    const response = await fetch(API_URL + params, {
      headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` }
    })

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No commit data returned from GitHub API')
    }

    return {
      lastUpdatedTime: data[0].commit.committer.date,
      latestCommitUrl: data[0].html_url
    }
  } catch (error) {
    console.error('Error fetching last updated time:', error)
    // Return fallback data
    return {
      lastUpdatedTime: new Date().toISOString(),
      latestCommitUrl: ''
    }
  }
}

export default getLastUpdatedTimeByFile
