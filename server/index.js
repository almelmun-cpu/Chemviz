const express = require('express');
const cors = require('cors');
const path = require('path');
const { searchMoleculeRobust, getSuggestions, translateChemicalName } = require('./services/pubchem');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API: Buscar molécula por nombre (búsqueda robusta multi-estrategia)
app.get('/api/molecule/:name', async (req, res) => {
  try {
    const name = req.params.name.trim();
    if (!name) {
      return res.status(400).json({ error: 'Por favor proporciona un nombre de molécula.' });
    }
    console.log(`\n🔬 Buscando molécula: "${name}"`);
    const data = await searchMoleculeRobust(name);
    console.log(`✅ Encontrada: ${data.commonName} (CID ${data.cid})`);
    res.json(data);
  } catch (error) {
    console.error(`❌ Error buscando "${req.params.name}":`, error.message);
    res.status(404).json({ error: error.message });
  }
});

// API: Sugerencias de autocompletado
app.get('/api/suggest/:query', async (req, res) => {
  try {
    const query = req.params.query.trim();
    if (!query || query.length < 1) {
      return res.json([]);
    }
    const suggestions = await getSuggestions(query);
    res.json(suggestions);
  } catch (error) {
    console.error(`Error en sugerencias:`, error.message);
    res.json([]);
  }
});

// API: Traducir nombre químico
app.get('/api/translate/:name', (req, res) => {
  const name = req.params.name.trim();
  const translated = translateChemicalName(name);
  res.json({ original: name, translated });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🧪 ChemViz API Server running on http://localhost:${PORT}`);
  console.log(`  📡 Endpoints:`);
  console.log(`     GET /api/molecule/:name  → Buscar molécula`);
  console.log(`     GET /api/suggest/:query  → Autocompletado`);
  console.log(`     GET /api/translate/:name → Traducción nombre`);
  console.log(`     GET /api/health          → Health check\n`);
});
