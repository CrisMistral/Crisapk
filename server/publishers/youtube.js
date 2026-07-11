const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );
}

// Generate the Google OAuth URL for a user to authorize
function getAuthUrl(state) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
    state
  });
}

// Exchange auth code for tokens
async function exchangeCode(code) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

// Get channel info for a connected account
async function getChannelInfo(accessToken, refreshToken) {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  const yt = google.youtube({ version: 'v3', auth: client });
  const res = await yt.channels.list({ part: ['snippet'], mine: true });
  const ch = res.data.items?.[0];
  return ch ? { id: ch.id, name: ch.snippet.title, thumbnail: ch.snippet.thumbnails?.default?.url } : null;
}

// Upload video to YouTube
async function publish({ file, description, hashtags, accessToken, refreshToken }) {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  // Auto-refresh tokens
  client.on('tokens', (tokens) => {
    if (tokens.refresh_token) refreshToken = tokens.refresh_token;
  });

  const yt = google.youtube({ version: 'v3', auth: client });

  const tags = (hashtags || '')
    .split(/\s+/)
    .filter(t => t.startsWith('#'))
    .map(t => t.slice(1))
    .filter(Boolean);

  const title = (description || 'Video').substring(0, 100);
  const descFull = [description, hashtags].filter(Boolean).join('\n\n').substring(0, 5000);

  const res = await yt.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description: descFull,
        tags,
        categoryId: '22',
        defaultLanguage: 'es'
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false
      }
    },
    media: { body: fs.createReadStream(file) }
  });

  const videoId = res.data.id;
  return { videoId, url: `https://youtu.be/${videoId}` };
}

module.exports = { getAuthUrl, exchangeCode, getChannelInfo, publish };
