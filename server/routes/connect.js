const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const { connections } = require('../db');
const youtube = require('../publishers/youtube');

// GET /api/connect/youtube — redirect user to Google OAuth
router.get('/youtube', requireAuth, (req, res) => {
  const url = youtube.getAuthUrl(req.user.id);
  res.json({ url });
});

// GET /api/connect/youtube/callback — Google redirects here after auth
router.get('/youtube/callback', async (req, res) => {
  const { code, state: userId, error } = req.query;

  if (error) return res.redirect(`/?error=youtube_denied`);
  if (!code || !userId) return res.redirect(`/?error=youtube_missing`);

  try {
    const tokens = await youtube.exchangeCode(code);
    const channel = await youtube.getChannelInfo(tokens.access_token, tokens.refresh_token);

    connections.save({
      user_id: userId,
      platform: 'youtube',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      channel_id: channel?.id || null,
      channel_name: channel?.name || null,
      channel_thumbnail: channel?.thumbnail || null
    });

    res.redirect(`/?connected=youtube`);
  } catch (err) {
    console.error('YouTube callback error:', err.message);
    res.redirect(`/?error=youtube_failed`);
  }
});

// GET /api/connect/status — list connected platforms for current user
router.get('/status', requireAuth, (req, res) => {
  const conns = connections.listForUser(req.user.id);
  const status = {};
  for (const c of conns) {
    status[c.platform] = {
      connected: true,
      channel_name: c.channel_name,
      channel_thumbnail: c.channel_thumbnail
    };
  }
  res.json(status);
});

// DELETE /api/connect/:platform — disconnect a platform
router.delete('/:platform', requireAuth, (req, res) => {
  connections.remove(req.user.id, req.params.platform);
  res.json({ success: true });
});

module.exports = router;
