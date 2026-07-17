import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temp folder for downloaded audio
const TEMP_DIR = path.join(__dirname, '../../tmp/audio');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Supported platforms
const SUPPORTED = ['youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'reel', 'shorts', 'twitter.com', 'x.com', 'facebook.com'];

function isSupported(url) {
  try {
    const u = new URL(url);
    return SUPPORTED.some(p => u.hostname.includes(p) || url.includes(p));
  } catch {
    return false;
  }
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\.]/gi, '_').slice(0, 60);
}

// GET /api/audio/info?url=...
export async function getVideoInfo(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  if (!isSupported(url)) return res.status(400).json({ error: 'Unsupported platform. Supported: YouTube, TikTok, Instagram, Twitter/X, Facebook.' });

  try {
    const { stdout } = await execAsync(
      `yt-dlp --ffmpeg-location "${ffmpegPath}" --dump-json --no-playlist "${url}"`,
      { timeout: 20000 }
    );
    const info = JSON.parse(stdout);
    return res.json({
      title: info.title || 'Unknown Title',
      uploader: info.uploader || info.channel || 'Unknown',
      duration: info.duration || 0,
      thumbnail: info.thumbnail || null,
      platform: info.extractor_key || 'Unknown',
      viewCount: info.view_count || 0,
      likeCount: info.like_count || 0,
    });
  } catch (err) {
    console.error('[AudioInfo Error]', err.message);
    return res.status(500).json({ error: 'Could not fetch video info. The video may be private, age-restricted, or unsupported.' });
  }
}

// POST /api/audio/download  { url }
export async function downloadAudio(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required in request body' });
  if (!isSupported(url)) return res.status(400).json({ error: 'Unsupported platform. Supported: YouTube, TikTok, Instagram, Twitter/X.' });

  const fileId = `audio_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const outputTemplate = path.join(TEMP_DIR, `${fileId}.%(ext)s`);

  try {
    // Download best audio as mp3
    const { stdout } = await execAsync(
      `yt-dlp --ffmpeg-location "${ffmpegPath}" -x --audio-format mp3 --audio-quality 5 --no-playlist ` +
      `--output "${outputTemplate}" ` +
      `--print after_move:filepath "${url}"`,
      { timeout: 120000 }
    );

    // Find the downloaded file
    const filePath = stdout.trim().split('\n').pop();
    const resolvedPath = filePath && fs.existsSync(filePath)
      ? filePath
      : fs.readdirSync(TEMP_DIR).map(f => path.join(TEMP_DIR, f)).find(f => f.includes(fileId));

    if (!resolvedPath || !fs.existsSync(resolvedPath)) {
      return res.status(500).json({ error: 'Audio file not found after download.' });
    }

    const filename = path.basename(resolvedPath);

    // Stream file to client
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const stream = fs.createReadStream(resolvedPath);
    stream.pipe(res);

    // Cleanup after 5 min
    setTimeout(() => {
      try { fs.unlinkSync(resolvedPath); } catch {}
    }, 5 * 60 * 1000);

  } catch (err) {
    console.error('[AudioDownload Error]', err.message);
    // Cleanup any partial files
    try {
      fs.readdirSync(TEMP_DIR)
        .filter(f => f.includes(fileId))
        .forEach(f => fs.unlinkSync(path.join(TEMP_DIR, f)));
    } catch {}

    return res.status(500).json({
      error: 'Download failed. The video may be private, DRM-protected, or region-restricted.',
      detail: err.message?.slice(0, 200)
    });
  }
}
