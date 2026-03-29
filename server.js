const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API: Get all designs (stub — wire to a DB in production)
app.use(express.json());

let designs = [
  { id:1, name:'Obsidian Gown',   category:'dress', fabric:'Velvet',  color:'#1A3A4A', season:'AW 2026' },
  { id:2, name:'Ivory Reverie',   category:'dress', fabric:'Silk',    color:'#F5E6D0', season:'SS 2026' },
  { id:3, name:'Sand Minimalist', category:'coat',  fabric:'Linen',   color:'#D4C5A9', season:'SS 2026' },
];

app.get('/api/designs', (req, res) => res.json(designs));

app.post('/api/designs', (req, res) => {
  const design = { id: Date.now(), ...req.body };
  designs.push(design);
  res.status(201).json(design);
});

app.delete('/api/designs/:id', (req, res) => {
  designs = designs.filter(d => d.id != req.params.id);
  res.json({ ok: true });
});

// Fallback → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ✦ MAISON Fashion Studio\n  → http://localhost:${PORT}\n`);
});
