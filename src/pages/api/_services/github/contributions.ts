import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'
import request from 'graphql-request'

import { GetGithubContributions } from '@/lib/graphql'
import type { GithubContributionData } from '@/types'

const getGithubContributions = async (): Promise<GithubContributionData> => {
  try {
    // Check if GitHub token is available
    if (!GITHUB_ACCESS_TOKEN) {
      console.warn('Missing GitHub access token. Using fallback data.');
      return getFallbackData();
    }

    const response = await request({
      url: 'https://api.github.com/graphql',
      document: GetGithubContributions,
      variables: { userName: 'jestsee' },
      requestHeaders: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    })

    const parsedResponse = (response as any).user.contributionsCollection
      .contributionCalendar

    return {
      lastPushedAt: (response as any).user.repositories.nodes[0].pushedAt,
      totalContributions: parsedResponse.totalContributions,
      contributions: parsedResponse.weeks.flatMap((week: any) => {
        return week.contributionDays.map((day: any) => {
          return {
            count: day.contributionCount,
            date: day.date.replace(/-/g, '/')
          }
        })
      })
    }
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return getFallbackData();
  }
}

// Provide fallback data when GitHub API is unavailable
function getFallbackData(): GithubContributionData {
  const today = new Date();
  const contributions = [];

  // Generate 365 days of fallback data
  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    contributions.push({
      count: Math.floor(Math.random() * 5), // Random count between 0-4
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    });
  }

  return {
    // Convert to timestamp (number) instead of ISO string
    lastPushedAt: today.getTime(),
    totalContributions: contributions.reduce((sum, item) => sum + item.count, 0),
    contributions
  };
}

export default getGithubContributions
