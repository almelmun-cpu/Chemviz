const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const PUBCHEM_AUTO = 'https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete';
const NCI_CACTUS = 'https://cactus.nci.nih.gov/chemical/structure';

// Element colors for CPK convention
const ELEMENT_COLORS = {
  H: '#FFFFFF',
  C: '#555555',
  N: '#3050F8',
  O: '#FF0D0D',
  S: '#FFFF30',
  P: '#FF8000',
  F: '#90E050',
  Cl: '#1FF01F',
  Br: '#A62929',
  I: '#940094',
  Si: '#F0C8A0',
  Na: '#AB5CF2',
  Fe: '#C8A0A0',
  Ca: '#808090',
  Mg: '#8AFF00',
  Al: '#BFA6A6',
  Zn: '#80A0A0',
  Cu: '#C88040',
  Mn: '#A0A0C0',
  K: '#8F40D4',
  Li: '#B02AB0',
  Be: '#C7FF00',
  B: '#FFB5B5',
  Ne: '#B3E3F5',
  Ar: '#80D1E3',
  He: '#D9FFFF',
  default: '#FFB0B0',
};

// Atomic radii (Van der Waals in Angstroms, scaled for visualization)
const ELEMENT_RADII = {
  H: 0.3,
  C: 0.7,
  N: 0.65,
  O: 0.6,
  S: 1.0,
  P: 1.0,
  F: 0.5,
  Cl: 1.0,
  Br: 1.15,
  I: 1.4,
  Si: 0.9,
  default: 0.7,
};

// Spanish → English chemical name dictionary
const SPANISH_TO_ENGLISH = {
  // Compuestos comunes
  'acetato de sodio': 'sodium acetate',
  'acetato de aluminio': 'aluminum acetate',
  'acetato de calcio': 'calcium acetate',
  'acetato de potasio': 'potassium acetate',
  'acetato de magnesio': 'magnesium acetate',
  'acetato de zinc': 'zinc acetate',
  'acetato de cobre': 'copper acetate',
  'acetato de plomo': 'lead acetate',
  'acetato de hierro': 'iron acetate',
  'nitrato de aluminio': 'aluminum nitrate',
  'nitrato de calcio': 'calcium nitrate',
  'nitrato de magnesio': 'magnesium nitrate',
  'nitrato de cobre': 'copper nitrate',
  'nitrato de plata': 'silver nitrate',
  'sulfato de aluminio': 'aluminum sulfate',
  'sulfato de magnesio': 'magnesium sulfate',
  'sulfato de zinc': 'zinc sulfate',
  'sulfato de hierro': 'iron sulfate',
  'sulfato de potasio': 'potassium sulfate',
  'cloruro de aluminio': 'aluminum chloride',
  'cloruro de magnesio': 'magnesium chloride',
  'cloruro de hierro': 'iron chloride',
  'cloruro de zinc': 'zinc chloride',
  'cloruro de cobre': 'copper chloride',
  'cloruro de amonio': 'ammonium chloride',
  'cloruro de bario': 'barium chloride',
  'carbonato de potasio': 'potassium carbonate',
  'carbonato de magnesio': 'magnesium carbonate',
  'carbonato de hierro': 'iron carbonate',
  'hidróxido de calcio': 'calcium hydroxide',
  'hidróxido de potasio': 'potassium hydroxide',
  'hidróxido de magnesio': 'magnesium hydroxide',
  'hidróxido de aluminio': 'aluminum hydroxide',
  'óxido de aluminio': 'aluminum oxide',
  'óxido de calcio': 'calcium oxide',
  'óxido de magnesio': 'magnesium oxide',
  'óxido de zinc': 'zinc oxide',
  'óxido de cobre': 'copper oxide',
  'óxido de potasio': 'potassium oxide',
  'óxido de hierro ii': 'iron ii oxide',
  'óxido de hierro iii': 'iron iii oxide',
  'bicarbonato de sodio': 'sodium bicarbonate',
  'bicarbonato': 'sodium bicarbonate',
  'carbonato de sodio': 'sodium carbonate',
  'hidróxido de sodio': 'sodium hydroxide',
  'cloruro de sodio': 'sodium chloride',
  'nitrato de sodio': 'sodium nitrate',
  'sulfato de sodio': 'sodium sulfate',
  'cloruro de potasio': 'potassium chloride',
  'nitrato de potasio': 'potassium nitrate',
  'permanganato de potasio': 'potassium permanganate',
  'cloruro de calcio': 'calcium chloride',
  'carbonato de calcio': 'calcium carbonate',
  'sulfato de cobre': 'copper sulfate',
  'óxido de hierro': 'iron oxide',
  'ácido sulfúrico': 'sulfuric acid',
  'ácido clorhídrico': 'hydrochloric acid',
  'ácido nítrico': 'nitric acid',
  'ácido acético': 'acetic acid',
  'ácido cítrico': 'citric acid',
  'ácido benzoico': 'benzoic acid',
  'ácido láctico': 'lactic acid',
  'ácido salicílico': 'salicylic acid',
  'ácido fosfórico': 'phosphoric acid',
  'ácido carbónico': 'carbonic acid',
  'amoníaco': 'ammonia',
  'hidróxido de amonio': 'ammonium hydroxide',
  'peróxido de hidrógeno': 'hydrogen peroxide',
  'agua oxigenada': 'hydrogen peroxide',
  // Disolventes
  'alcohol': 'ethanol',
  'alcohol etílico': 'ethanol',
  'alcohol metílico': 'methanol',
  'aguarrás': 'turpentine',
  // Moléculas orgánicas
  'benceno': 'benzene',
  'tolueno': 'toluene',
  'acetona': 'acetone',
  'formaldehído': 'formaldehyde',
  'cloroformo': 'chloroform',
  'metano': 'methane',
  'etano': 'ethane',
  'propano': 'propane',
  'butano': 'butane',
  'pentano': 'pentane',
  'hexano': 'hexane',
  'heptano': 'heptane',
  'octano': 'octane',
  'etileno': 'ethylene',
  'propileno': 'propylene',
  'acetileno': 'acetylene',
  // Biomoléculas
  'glucosa': 'glucose',
  'fructosa': 'fructose',
  'sacarosa': 'sucrose',
  'lactosa': 'lactose',
  'maltosa': 'maltose',
  'almidón': 'starch',
  'celulosa': 'cellulose',
  'glicerina': 'glycerol',
  'glicerol': 'glycerol',
  'urea': 'urea',
  'colesterol': 'cholesterol',
  'testosterona': 'testosterone',
  'estrógeno': 'estrogen',
  'progesterona': 'progesterone',
  'adrenalina': 'epinephrine',
  'dopamina': 'dopamine',
  'serotonina': 'serotonin',
  'morfina': 'morphine',
  'codeína': 'codeine',
  'nicotina': 'nicotine',
  'cafeína': 'caffeine',
  'aspirina': 'aspirin',
  'ibuprofeno': 'ibuprofen',
  'paracetamol': 'acetaminophen',
  'penicilina': 'penicillin',
  'vitamina a': 'retinol',
  'vitamina c': 'ascorbic acid',
  'vitamina d': 'cholecalciferol',
  'vitamina e': 'tocopherol',
  // Elementos químicos
  'hidrógeno': 'hydrogen',
  'helio': 'helium',
  'litio': 'lithium',
  'berilio': 'beryllium',
  'boro': 'boron',
  'carbono': 'carbon',
  'nitrógeno': 'nitrogen',
  'oxígeno': 'oxygen',
  'flúor': 'fluorine',
  'neón': 'neon',
  'sodio': 'sodium',
  'magnesio': 'magnesium',
  'aluminio': 'aluminum',
  'silicio': 'silicon',
  'fósforo': 'phosphorus',
  'azufre': 'sulfur',
  'cloro': 'chlorine',
  'argón': 'argon',
  'potasio': 'potassium',
  'calcio': 'calcium',
  'hierro': 'iron',
  'cobre': 'copper',
  'zinc': 'zinc',
  'plata': 'silver',
  'oro': 'gold',
  'mercurio': 'mercury',
  'plomo': 'lead',
  'estaño': 'tin',
  'níquel': 'nickel',
  'manganeso': 'manganese',
  'cobalto': 'cobalt',
  'cromo': 'chromium',
  'molibdeno': 'molybdenum',
  'yodo': 'iodine',
  'bromo': 'bromine',
  // Otros
  'sal': 'sodium chloride',
  'sal común': 'sodium chloride',
  'azúcar': 'sucrose',
  'agua': 'water',
  'metanol': 'methanol',
  'etanol': 'ethanol',
};

/**
 * Translate a Spanish chemical name to English using the dictionary.
 * Returns null if no translation is found and no heuristics were applied.
 */
export function translateChemicalName(name) {
  const lower = name.toLowerCase().trim();

  // 1. Direct dictionary match
  if (SPANISH_TO_ENGLISH[lower]) {
    return SPANISH_TO_ENGLISH[lower];
  }

  // 2. Heuristic replacements for systematic IUPAC names
  let heuristic = lower;

  // Sufijos comunes
  heuristic = heuristic.replace(/tetrateno$/g, 'tetraene');
  heuristic = heuristic.replace(/tetraeno$/g, 'tetraene');
  heuristic = heuristic.replace(/trieno$/g, 'triene');
  heuristic = heuristic.replace(/dieno$/g, 'diene');
  heuristic = heuristic.replace(/ano$/g, 'ane');
  heuristic = heuristic.replace(/eno$/g, 'ene');
  heuristic = heuristic.replace(/ino$/g, 'yne');
  heuristic = heuristic.replace(/ilo$/g, 'yl');

  // Grupos alquilo / sustituyentes
  heuristic = heuristic.replace(/metil/g, 'methyl');
  heuristic = heuristic.replace(/etil/g, 'ethyl');
  heuristic = heuristic.replace(/propil/g, 'propyl');
  heuristic = heuristic.replace(/butil/g, 'butyl');
  heuristic = heuristic.replace(/pentil/g, 'pentyl');
  heuristic = heuristic.replace(/hexil/g, 'hexyl');

  // Ácidos
  if (heuristic.startsWith('acido ') || heuristic.startsWith('ácido ')) {
    heuristic = heuristic.replace(/^(acido|ácido)\s+/, '');
    heuristic = heuristic.replace(/ico$/g, 'ic acid');
    heuristic = heuristic.replace(/oso$/g, 'ous acid');
  }

  // Otros afijos
  heuristic = heuristic.replace(/cloro/g, 'chloro');
  heuristic = heuristic.replace(/bromo/g, 'bromo');
  heuristic = heuristic.replace(/fluoro/g, 'fluoro');
  heuristic = heuristic.replace(/yodo/g, 'iodo');
  heuristic = heuristic.replace(/ciano/g, 'cyano');
  heuristic = heuristic.replace(/hidroxi/g, 'hydroxy');
  heuristic = heuristic.replace(/oxi/g, 'oxy');

  // Si cambió algo por heurística, retornarlo
  if (heuristic !== lower) {
    return heuristic;
  }

  return null;
}

/**
 * Autocomplete a chemical name query via PubChem.
 * Returns an array of suggestion objects: [{ name, cid, formula }]
 */
async function autocompletePubChem(query) {
  try {
    const url = `${PUBCHEM_AUTO}/compound/${encodeURIComponent(query)}/JSON?limit=8`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const terms = data?.dictionary_terms?.compound;
    if (terms && terms.length > 0) {
      return terms.map((name) => ({ name }));
    }
    return [];
  } catch (err) {
    console.warn(`Autocomplete failed for "${query}": ${err.message}`);
    return [];
  }
}

/**
 * Find CIDs for a compound by name (more flexible matching than direct lookup).
 * Returns an array of CID numbers.
 */
async function findCIDsByName(name) {
  try {
    const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.IdentifierList?.CID || [];
  } catch (err) {
    return [];
  }
}

/**
 * Parse a molecular formula string into element/count pairs.
 * E.g., "C9H8O4" => [{symbol: "C", count: 9}, ...]
 */
function parseElements(formula) {
  if (!formula) return [];
  const regex = /([A-Z][a-z]*)(\d*)/g;
  const elements = [];
  let match;
  while ((match = regex.exec(formula)) !== null) {
    const symbol = match[1];
    const count = match[2] ? parseInt(match[2], 10) : 1;
    elements.push({ symbol, count });
  }
  return elements;
}

/**
 * Parse an SDF string to extract atom positions and bonds.
 */
function parseSDF(sdfContent) {
  const lines = sdfContent.split('\n');
  const atoms = [];
  const bonds = [];

  if (lines.length < 4) {
    return { atoms, bonds };
  }

  const countsLine = lines[3];
  if (!countsLine || countsLine.length < 6) {
    return { atoms, bonds };
  }

  const atomCount = parseInt(countsLine.substring(0, 3).trim(), 10);
  const bondCount = parseInt(countsLine.substring(3, 6).trim(), 10);

  if (isNaN(atomCount) || isNaN(bondCount)) {
    return { atoms, bonds };
  }

  for (let i = 0; i < atomCount; i++) {
    const line = lines[4 + i];
    if (!line || line.length < 34) continue;

    const x = parseFloat(line.substring(0, 10).trim());
    const y = parseFloat(line.substring(10, 20).trim());
    const z = parseFloat(line.substring(20, 30).trim());
    const element = line.substring(31, 34).trim();

    if (!isNaN(x) && !isNaN(y) && !isNaN(z) && element) {
      atoms.push({ x, y, z, element });
    }
  }

  const bondStart = 4 + atomCount;
  for (let i = 0; i < bondCount; i++) {
    const line = lines[bondStart + i];
    if (!line || line.length < 9) continue;

    const atom1 = parseInt(line.substring(0, 3).trim(), 10);
    const atom2 = parseInt(line.substring(3, 6).trim(), 10);
    const bondType = parseInt(line.substring(6, 9).trim(), 10);

    if (!isNaN(atom1) && !isNaN(atom2) && !isNaN(bondType)) {
      bonds.push({
        atom1: atom1 - 1,
        atom2: atom2 - 1,
        type: bondType,
      });
    }
  }

  return { atoms, bonds };
}

/**
 * Apply colors and radii to parsed atom data.
 */
function decorateAtoms(atoms) {
  return atoms.map((atom) => ({
    ...atom,
    color: ELEMENT_COLORS[atom.element] || ELEMENT_COLORS.default,
    radius: ELEMENT_RADII[atom.element] || ELEMENT_RADII.default,
  }));
}

/**
 * Fetch compound JSON data from PubChem by CID.
 */
async function fetchCompoundByCID(cid) {
  const url = `${PUBCHEM_BASE}/compound/cid/${cid}/JSON`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PubChem CID request failed (${res.status})`);
  const data = await res.json();
  return data.PC_Compounds[0];
}

/**
 * Build a structured molecule result from raw PubChem compound data.
 */
function buildMoleculeData(compound, requestedName) {
  const cid = compound.id.id.cid;
  const props = compound.props;

  const getProp = (label, key = 'sval') => {
    const prop = props.find(
      (p) => p.urn.label === label || p.urn.name === label
    );
    if (!prop) return null;
    return prop.value[key] !== undefined ? prop.value[key] : null;
  };

  const iupacName =
    getProp('IUPAC Name') ||
    getProp('IUPAC Name (Systematic)') ||
    getProp('IUPAC Name (Preferred)');
  const molecularFormula =
    getProp('Molecular Formula') || getProp('Formula');
  const molecularWeight =
    getProp('Molecular Weight') ||
    (getProp('Molecular Weight', 'fval') !== null
      ? getProp('Molecular Weight', 'fval')
      : null);
  const smiles = getProp('SMILES') || getProp('Canonical SMILES');
  const inChI = getProp('InChI');
  const inChIKey = getProp('InChIKey');

  // Get synonyms for display
  let synonyms = [];
  try {
    const synProp = props.find((p) => p.urn.label === 'Synonym');
    if (synProp?.value?.sval) {
      synonyms = synProp.value.sval.split('\n').filter(Boolean);
    }
  } catch (e) {
    // ignore
  }

  return {
    cid,
    iupacName: iupacName || null,
    commonName: requestedName,
    molecularFormula: molecularFormula || null,
    molecularWeight: molecularWeight
      ? Math.round(parseFloat(molecularWeight) * 100) / 100
      : null,
    smiles: smiles || null,
    inChI: inChI || null,
    inChIKey: inChIKey || null,
    elements: molecularFormula ? parseElements(molecularFormula) : [],
    synonyms: synonyms.slice(0, 20),
    atoms: [],
    bonds: [],
  };
}

/**
 * Resolve a molecule from its IUPAC name (or any systematic name) using
 * NCI CACTUS Chemical Identifier Resolver. Returns a molecule result object
 * compatible with the rest of the system (cid: null, source: 'cactus').
 */
async function searchMoleculeFromIUPAC(name) {
  const encoded = encodeURIComponent(name);

  // 1. Fetch SMILES
  const smilesRes = await fetch(`${NCI_CACTUS}/${encoded}/smiles`);
  if (!smilesRes.ok) throw new Error('CACTUS: no SMILES returned');
  const smilesText = await smilesRes.text();
  const smiles = smilesText.trim().split('\n')[0].trim();
  if (!smiles) throw new Error('CACTUS: no SMILES returned');

  // 2. Fetch molecular formula
  let molecularFormula = null;
  try {
    const formulaRes = await fetch(`${NCI_CACTUS}/${encoded}/formula`);
    if (formulaRes.ok) {
      molecularFormula = (await formulaRes.text()).trim().split('\n')[0].trim() || null;
    }
  } catch { /* non-critical */ }

  // 3. Fetch molecular weight
  let molecularWeight = null;
  try {
    const mwRes = await fetch(`${NCI_CACTUS}/${encoded}/mw`);
    if (mwRes.ok) {
      const mwRaw = parseFloat((await mwRes.text()).trim().split('\n')[0].trim());
      if (!isNaN(mwRaw)) molecularWeight = Math.round(mwRaw * 100) / 100;
    }
  } catch { /* non-critical */ }

  // 4. Fetch IUPAC name (canonical)
  let iupacName = null;
  try {
    const iupacRes = await fetch(`${NCI_CACTUS}/${encoded}/iupac_name`);
    if (iupacRes.ok) {
      iupacName = (await iupacRes.text()).trim().split('\n')[0].trim() || null;
    }
  } catch { /* non-critical */ }

  // 5. Fetch InChIKey
  let inChIKey = null;
  try {
    const inchikeyRes = await fetch(`${NCI_CACTUS}/${encoded}/stdinchikey`);
    if (inchikeyRes.ok) {
      inChIKey = (await inchikeyRes.text()).trim().split('\n')[0].replace('InChIKey=', '').trim() || null;
    }
  } catch { /* non-critical */ }

  // 6. Fetch 3D coordinates (SDF)
  let atoms = [];
  let bonds = [];
  try {
    const sdfRes = await fetch(`${NCI_CACTUS}/${encoded}/sdf`);
    if (sdfRes.ok) {
      const parsed = parseSDF(await sdfRes.text());
      if (parsed.atoms.length > 0) {
        atoms = decorateAtoms(parsed.atoms);
        bonds = parsed.bonds;
      }
    }
  } catch (err) {
    // Try via SMILES
    try {
      const sdfRes = await fetch(`${NCI_CACTUS}/${encodeURIComponent(smiles)}/sdf`);
      if (sdfRes.ok) {
        const parsed = parseSDF(await sdfRes.text());
        if (parsed.atoms.length > 0) {
          atoms = decorateAtoms(parsed.atoms);
          bonds = parsed.bonds;
        }
      }
    } catch { /* no 3D available */ }
  }

  return {
    cid: null,
    source: 'cactus',
    iupacName: iupacName || name,
    commonName: name,
    molecularFormula,
    molecularWeight,
    smiles,
    inChI: null,
    inChIKey,
    elements: molecularFormula ? parseElements(molecularFormula) : [],
    synonyms: [],
    atoms,
    bonds,
  };
}

/**
 * Fetch 3D conformer data from multiple sources (cascade).
 * Returns { atoms, bonds } or throws if all sources fail.
 */
async function fetch3DCoordinates(cid, smiles, name) {
  const errors = [];

  // Source 1: PubChem 3D SDF (record_type=3d)
  try {
    const sdfUrl = `${PUBCHEM_BASE}/compound/cid/${cid}/SDF?record_type=3d`;
    const res = await fetch(sdfUrl);
    if (res.ok) {
      const parsed = parseSDF(await res.text());
      if (parsed.atoms.length > 0 && parsed.atoms.some((a) => a.z !== 0)) {
        return parsed;
      }
    }
    errors.push('PubChem 3D: flat or empty');
  } catch (err) {
    errors.push(`PubChem 3D: ${err.message}`);
  }

  // Source 2: NCI CACTUS — generates 3D from SMILES
  if (smiles) {
    try {
      const url = `${NCI_CACTUS}/${encodeURIComponent(smiles)}/sdf`;
      const res = await fetch(url);
      if (res.ok) {
        const parsed = parseSDF(await res.text());
        if (parsed.atoms.length > 0 && parsed.atoms.some((a) => a.z !== 0)) {
          return parsed;
        }
      }
      errors.push('NCI CACTUS: flat or empty');
    } catch (err) {
      errors.push(`NCI CACTUS: ${err.message}`);
    }
  }

  // Source 3: NCI CACTUS by compound name
  if (name) {
    try {
      const url = `${NCI_CACTUS}/${encodeURIComponent(name)}/sdf`;
      const res = await fetch(url);
      if (res.ok) {
        const parsed = parseSDF(await res.text());
        if (parsed.atoms.length > 0 && parsed.atoms.some((a) => a.z !== 0)) {
          return parsed;
        }
      }
      errors.push('NCI CACTUS by name: flat or empty');
    } catch (err) {
      errors.push(`NCI CACTUS by name: ${err.message}`);
    }
  }

  // Source 4: PubChem 2D SDF (flat) — better than nothing
  try {
    const sdfUrl = `${PUBCHEM_BASE}/compound/cid/${cid}/SDF`;
    const res = await fetch(sdfUrl);
    if (res.ok) {
      const parsed = parseSDF(await res.text());
      if (parsed.atoms.length > 0) {
        return parsed; // all z = 0, but structure is there
      }
    }
    errors.push('PubChem 2D: empty');
  } catch (err) {
    errors.push(`PubChem 2D: ${err.message}`);
  }

  throw new Error(`No 3D/2D coordinates found: ${errors.join('; ')}`);
}

/**
 * Attach description to molecule result
 */
async function attachDescription(result, cid) {
  try {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/description/JSON`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const infoList = data?.InformationList?.Information || [];
      const info = infoList.find((i) => i.Description);
      if (info?.Description) result.description = info.Description;
    }
  } catch (err) {
    // ignore description error
  }
  return result;
}

/**
 * Attach 3D (or 2D) coordinates to molecule result from multiple sources.
 */
async function attach3DData(result, cid) {
  try {
    const { atoms, bonds } = await fetch3DCoordinates(cid, result.smiles, result.iupacName || result.commonName);
    result.atoms = decorateAtoms(atoms);
    result.bonds = bonds;
  } catch (err) {
    console.warn(`Could not fetch coordinates for CID ${cid}: ${err.message}`);
  }

  if (cid) {
    await attachDescription(result, cid);
  }

  return result;
}

/**
 * Search for a molecule by name through PubChem compound lookup.
 */
async function searchMolecule(name) {
  const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/JSON`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No data found for "${name}".`);
  }
  const data = await res.json();
  const compound = data.PC_Compounds[0];

  if (!compound) {
    throw new Error(`No data found for "${name}".`);
  }

  const cid = compound.id.id.cid;
  let result = buildMoleculeData(compound, name);
  result = await attach3DData(result, cid);
  return result;
}

/**
 * Search for a molecule by CID.
 */
async function searchMoleculeByCID(cid) {
  const compound = await fetchCompoundByCID(cid);
  let result = buildMoleculeData(compound, `CID ${cid}`);
  result = await attach3DData(result, cid);
  return result;
}

/**
 * ROBUST multi-strategy molecule search.
 */
async function searchMoleculeRobust(name) {
  if (!name || !name.trim()) {
    throw new Error('Please provide a molecule name.');
  }

  const originalQuery = name.trim();
  const strategies = [];

  // Strategy 1: Direct lookup
  strategies.push({ label: 'direct', fn: () => searchMolecule(originalQuery) });

  // Strategy 2: Lowercase
  const lower = originalQuery.toLowerCase();
  if (lower !== originalQuery) {
    strategies.push({ label: 'lowercase', fn: () => searchMolecule(lower) });
  }

  // Strategy 3: Spanish → English translation
  const translated = translateChemicalName(originalQuery);
  if (translated && translated !== lower) {
    strategies.push({ label: 'translation', fn: () => searchMolecule(translated) });
  }

  // Execute strategies in order until one succeeds
  for (const { label, fn } of strategies) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      console.log(`  [${label}] Failed for "${originalQuery}": ${err.message}`);
    }
  }

  // Strategy 4: Find CIDs by name (more flexible matching)
  try {
    const cids = await findCIDsByName(originalQuery);
    if (cids.length > 0) {
      const result = await searchMoleculeByCID(cids[0]);
      return result;
    }
  } catch (err) {
    console.log(`  [cids-search] Failed: ${err.message}`);
  }

  // Strategy 5: Try translated with CIDs search
  if (translated) {
    try {
      const cids = await findCIDsByName(translated);
      if (cids.length > 0) {
        const result = await searchMoleculeByCID(cids[0]);
        return result;
      }
    } catch (err) {
      console.log(`  [translated-cids] Failed: ${err.message}`);
    }
  }

  // Strategy 6: NCI CACTUS — resolves IUPAC / systematic names directly
  try {
    const result = await searchMoleculeFromIUPAC(originalQuery);
    return result;
  } catch (err) {
    console.log(`  [cactus-iupac] Failed for "${originalQuery}": ${err.message}`);
  }

  // Also try with translated name through CACTUS
  if (translated) {
    try {
      const result = await searchMoleculeFromIUPAC(translated);
      return result;
    } catch (err) {
      console.log(`  [cactus-iupac-translated] Failed: ${err.message}`);
    }
  }

  // Strategy 7: Autocomplete → use first suggestion (fuzzy fallback)
  try {
    const suggestions = await autocompletePubChem(originalQuery);
    // Also get suggestions for translated name
    let allSuggestions = [...suggestions];
    if (translated) {
      const translatedSuggestions = await autocompletePubChem(translated);
      allSuggestions = [...allSuggestions, ...translatedSuggestions];
    }

    // Deduplicate
    const seen = new Set();
    const uniqueSuggestions = allSuggestions.filter((s) => {
      const key = s.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (uniqueSuggestions.length > 0) {
      const suggestionName = uniqueSuggestions[0].name;
      const result = await searchMolecule(suggestionName);
      return result;
    }
  } catch (err) {
    console.log(`  [autocomplete] Failed: ${err.message}`);
  }

  // All strategies failed — build helpful error message
  let errorMsg = `No se encontró la molécula "${originalQuery}".`;
  const helpSuggestions = [];

  if (translated) {
    helpSuggestions.push(`Prueba con el nombre en inglés: "${translated}"`);
  }

  // Try to get autocomplete suggestions for a helpful message
  try {
    const ac = await autocompletePubChem(originalQuery);
    if (ac.length > 0) {
      const names = ac.slice(0, 5).map((s) => `"${s.name}"`).join(', ');
      helpSuggestions.push(`¿Quizás quisiste decir: ${names}?`);
    }
  } catch (e) {
    // ignore
  }

  if (helpSuggestions.length === 0) {
    helpSuggestions.push('Prueba con el nombre en inglés o el nombre sistemático (IUPAC).');
  }

  errorMsg += '\n' + helpSuggestions.join('\n');
  throw new Error(errorMsg);
}

/**
 * Get autocomplete suggestions for the frontend.
 */
export async function fetchSuggestions(query) {
  if (!query || query.trim().length < 1) return [];
  const trimmed = query.trim();

  const suggestions = await autocompletePubChem(trimmed);

  // Also try translated
  const translated = translateChemicalName(trimmed);
  if (translated) {
    const translatedSuggestions = await autocompletePubChem(translated);
    for (const s of translatedSuggestions) {
      if (!suggestions.find((x) => x.name.toLowerCase() === s.name.toLowerCase())) {
        suggestions.push(s);
      }
    }
  }

  return suggestions.slice(0, 10);
}

/**
 * Fetch molecule data directly from PubChem (robust multi-strategy search)
 * without requiring a backend server.
 * @param {string} name - Molecule name in any language
 * @returns {Promise<object>} Molecule data with atoms, bonds, properties
 */
export async function fetchMolecule(name) {
  return searchMoleculeRobust(name);
}

/**
 * Get the PubChem 2D image URL for a molecule CID.
 * @param {number} cid - PubChem compound ID
 * @returns {string} Image URL
 */
export function getPubChemImageUrl(cid) {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`;
}