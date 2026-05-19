const express = require('express');
const path = require('path');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const app = express();
const PORT = 9999;

const QURBAN_DIR = __dirname;
const FOTO_DIR = path.join(QURBAN_DIR, 'foto');
const DATA_DIR = path.join(QURBAN_DIR, 'data');

// ── Serve built frontend ──
app.use(express.static(path.join(QURBAN_DIR, 'web', 'dist')));

// ── API: list foto ──
app.get('/api/foto', (req, res) => {
  try {
    const files = fs.readdirSync(FOTO_DIR)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort()
      .map(f => `/api/foto-file/${encodeURIComponent(f)}`);
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: serve foto file ──
app.get('/api/foto-file/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const filePath = path.join(FOTO_DIR, name);

  // Prevent directory traversal
  if (!filePath.startsWith(FOTO_DIR)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

// ── API: data pengqurban ──
app.get('/api/pengqurban', (req, res) => {
  try {
    const csvPath = path.join(DATA_DIR, 'Data Pengqurban.csv');
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });
    res.json(records);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API: data realisasi ──
app.get('/api/realisasi', (req, res) => {
  try {
    const csvPath = path.join(DATA_DIR, 'Realisasi - Sheet1.csv');
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });
    res.json(records);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Fallback: SPA routing ──
app.use((req, res) => {
  res.sendFile(path.join(QURBAN_DIR, 'web', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🕌 Qurban Web — http://localhost:${PORT}`);
  console.log(`📂 Foto: ${FOTO_DIR}`);
  console.log(`📊 Data: ${DATA_DIR}`);
});
