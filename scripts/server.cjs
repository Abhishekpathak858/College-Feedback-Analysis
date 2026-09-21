const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// In-memory IP Rate Limiter (Anti-DDoS / Bot Flood)
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300; // max 300 requests/minute per IP

// Clean up old IP counts every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW) {
      ipRequestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

const server = http.createServer((req, res) => {
  // 1. Client IP Extraction
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // 2. Server Rate Limiting Check
  const now = Date.now();
  let ipData = ipRequestCounts.get(clientIp);
  if (!ipData || (now - ipData.startTime > RATE_LIMIT_WINDOW)) {
    ipData = { count: 1, startTime: now };
    ipRequestCounts.set(clientIp, ipData);
  } else {
    ipData.count++;
    if (ipData.count > MAX_REQUESTS_PER_WINDOW) {
      res.writeHead(429, { 
        'Content-Type': 'text/plain',
        'Retry-After': '60'
      });
      res.end('429 Too Many Requests - CampusHub Anti-DDoS Security Active');
      return;
    }
  }

  // 3. Prevent Path Traversal Attacks (e.g. ../../etc/passwd)
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath.includes('..') || reqPath.includes('\0')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden - Malicious path traversal blocked.');
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(DIST_DIR, reqPath);

  // 4. Ensure resolved path is strictly inside DIST_DIR
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback to index.html
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      // 5. Industry Standard Military-Grade Security Headers
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000, immutable',
        // Anti-Clickjacking compatible with Android TWA WebView
        'X-Frame-Options': 'SAMEORIGIN',
        // Anti-MIME-sniffing
        'X-Content-Type-Options': 'nosniff',
        // Anti-XSS Protection Filter
        'X-XSS-Protection': '1; mode=block',
        // Strict Referrer Policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // Permissions Policy
        'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()',
        // Content Security Policy
        'Content-Security-Policy': "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: wss:; img-src 'self' https: data: blob:; media-src 'self' https: data: blob:;"
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🛡️ Hardened Secure Production Server running on http://0.0.0.0:${PORT}`);
});
