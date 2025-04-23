/**
 * This script helps you get a Spotify refresh token
 * 
 * Instructions:
 * 1. Go to https://developer.spotify.com/dashboard and create an app
 * 2. Set the redirect URI to http://localhost:8888/callback
 * 3. Copy your Client ID and Client Secret to your .env file
 * 4. Run this script with: node get-spotify-token.js
 * 5. Follow the instructions in the console
 */

const http = require('http');
const url = require('url');
const open = require('open');
const axios = require('axios');

// Load environment variables from .env file
require('dotenv').config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'http://localhost:8888/callback';
const scope = 'user-read-currently-playing user-read-recently-played';

if (!clientId || !clientSecret) {
  console.error('Error: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env file');
  process.exit(1);
}

// Step 1: Get authorization code
const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.searchParams.append('client_id', clientId);
authUrl.searchParams.append('response_type', 'code');
authUrl.searchParams.append('redirect_uri', redirectUri);
authUrl.searchParams.append('scope', scope);

console.log('Opening browser to authorize Spotify access...');
open(authUrl.toString());

// Step 2: Create server to handle callback
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/callback') {
    const code = parsedUrl.query.code;
    
    if (!code) {
      res.writeHead(400);
      res.end('Authorization failed: No code received');
      server.close();
      return;
    }
    
    try {
      // Step 3: Exchange code for tokens
      const tokenResponse = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        }
      });
      
      const { access_token, refresh_token } = tokenResponse.data;
      
      // Display success message and tokens
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>Authorization Successful!</h1>
        <p>Add this to your .env file:</p>
        <pre>SPOTIFY_REFRESH_TOKEN=${refresh_token}</pre>
        <p>You can close this window now.</p>
      `);
      
      console.log('\nAuthorization successful!');
      console.log('\nAdd this to your .env file:');
      console.log(`SPOTIFY_REFRESH_TOKEN=${refresh_token}`);
      
      // Close the server after a delay
      setTimeout(() => server.close(), 1000);
      
    } catch (error) {
      console.error('Error exchanging code for tokens:', error.response?.data || error.message);
      res.writeHead(500);
      res.end('Error exchanging code for tokens. Check console for details.');
      server.close();
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start the server
server.listen(8888, () => {
  console.log('Waiting for Spotify authorization...');
});
