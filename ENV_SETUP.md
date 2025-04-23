# Environment Variables Setup Guide

This guide will help you set up the required environment variables for this project.

## Required Environment Variables

The project requires the following environment variables to be set in the `.env` file:

### GitHub Access Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "jestsee.com local development"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token and add it to your `.env` file:
   ```
   GITHUB_ACCESS_TOKEN=your_token_here
   ```

### Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set the Redirect URI to `http://localhost:8888/callback`
4. Copy the Client ID and Client Secret to your `.env` file:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```
5. Get a refresh token by running the provided script:
   ```
   npm install axios open dotenv
   node get-spotify-token.js
   ```
6. Follow the instructions in the console and add the refresh token to your `.env` file:
   ```
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

### MapTiler API Key

1. Go to [MapTiler Cloud](https://cloud.maptiler.com/account/keys/)
2. Create an account if you don't have one
3. Create a new API key
4. Add it to your `.env` file:
   ```
   MAPTILER_API_KEY=your_api_key
   ```

### MonkeyType API Key (Optional)

If you want to display typing speed data:

1. Go to [MonkeyType](https://monkeytype.com/)
2. Create an account and log in
3. Go to Settings > Account > API
4. Generate a new API key
5. Add it to your `.env` file:
   ```
   MONKEYTYPE_API_KEY=your_api_key
   ```

### Cloudinary API Credentials (Optional)

If you want to use Cloudinary for image hosting:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Create an account if you don't have one
3. Go to Dashboard to find your credentials
4. Add them to your `.env` file:
   ```
   PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   PUBLIC_CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Troubleshooting

If you encounter issues with API calls:

1. Check that your environment variables are correctly set in the `.env` file
2. Make sure your API keys and tokens have the correct permissions
3. Check the browser console and server logs for error messages
4. Verify that your tokens haven't expired (especially GitHub tokens)

For GitHub token issues, you might see errors like "Bad credentials" or "Not Found". This usually means your token is invalid or has expired.

For Spotify token issues, you might need to generate a new refresh token using the provided script.
