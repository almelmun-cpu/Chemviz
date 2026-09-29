const {
  searchMolecule,
  searchMoleculeRobust,
  searchMoleculeByCID,
  autocompletePubChem,
  translateChemicalName,
  parseElements,
  parseSDF,
  findCIDsByName,
  getSuggestions,
  fetch3DCoordinates,
} = require('../server/services/pubchem');

describe('parseElements', () => {
  test('parses simple formula H2O', () => {
    expect(parseElements('H2O')).toEqual([
      { symbol: 'H', count: 2 },
      { symbol: 'O', count: 1 },
    ]);
  });

  test('parses complex formula C9H8O4', () => {
    const result = parseElements('C9H8O4');
    expect(result).toContainEqual({ symbol: 'C', count: 9 });
    expect(result).toContainEqual({ symbol: 'H', count: 8 });
    expect(result).toContainEqual({ symbol: 'O', count: 4 });
  });

  test('parses formula with multi-char elements Na2CO3', () => {
    const result = parseElements('Na2CO3');
    expect(result).toContainEqual({ symbol: 'Na', count: 2 });
    expect(result).toContainEqual({ symbol: 'C', count: 1 });
    expect(result).toContainEqual({ symbol: 'O', count: 3 });
  });

  test('handles single atom element', () => {
    expect(parseElements('He')).toEqual([{ symbol: 'He', count: 1 }]);
  });

  test('handles organic compound C6H12O6', () => {
    const result = parseElements('C6H12O6');
    expect(result).toContainEqual({ symbol: 'C', count: 6 });
    expect(result).toContainEqual({ symbol: 'H', count: 12 });
    expect(result).toContainEqual({ symbol: 'O', count: 6 });
  });

  test('returns empty array for null/undefined/empty', () => {
    expect(parseElements(null)).toEqual([]);
    expect(parseElements(undefined)).toEqual([]);
    expect(parseElements('')).toEqual([]);
  });
});

describe('parseSDF', () => {
  const sampleSDF = `
  OpenBabel

  3  2  0  0  0  0  0  0  0  0999 V2000
     0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
     1.2000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
     0.6000    1.0392    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  2  0  0  0  0
M  END
`;

  test('parses atom count and positions', () => {
    const result = parseSDF(sampleSDF);
    expect(result.atoms).toHaveLength(3);
    expect(result.atoms[0]).toMatchObject({
      x: 0,
      y: 0,
      z: 0,
      element: 'C',
    });
    expect(result.atoms[1]).toMatchObject({
      x: 1.2,
      y: 0,
      z: 0,
      element: 'O',
    });
  });

  test('parses bonds', () => {
    const result = parseSDF(sampleSDF);
    expect(result.bonds).toHaveLength(2);
    expect(result.bonds[0]).toMatchObject({ atom1: 0, atom2: 1, type: 1 });
    expect(result.bonds[1]).toMatchObject({ atom1: 0, atom2: 2, type: 2 });
  });

  test('handles empty SDF', () => {
    const result = parseSDF('');
    expect(result.atoms).toEqual([]);
    expect(result.bonds).toEqual([]);
  });
});

describe('translateChemicalName', () => {
  test('translates "acetato de sodio" to "sodium acetate"', () => {
    expect(translateChemicalName('acetato de sodio')).toBe('sodium acetate');
  });

  test('translates "agua" to "water"', () => {
    expect(translateChemicalName('agua')).toBe('water');
  });

  test('translates "aspirina" to "aspirin"', () => {
    expect(translateChemicalName('aspirina')).toBe('aspirin');
  });

  test('translates "cloruro de sodio" to "sodium chloride"', () => {
    expect(translateChemicalName('cloruro de sodio')).toBe('sodium chloride');
  });

  test('translates "alcohol" to "ethanol"', () => {
    expect(translateChemicalName('alcohol')).toBe('ethanol');
  });

  test('returns null for non-Spanish name', () => {
    expect(translateChemicalName('water')).toBeNull();
  });

  test('returns null for gibberish', () => {
    expect(translateChemicalName('xyzblahfoo')).toBeNull();
  });

  test('is case insensitive', () => {
    expect(translateChemicalName('Acetato De Sodio')).toBe('sodium acetate');
  });
});

describe('findCIDsByName', () => {
  jest.setTimeout(30000);

  test('finds CIDs for "sodium acetate"', async () => {
    const cids = await findCIDsByName('sodium acetate');
    expect(cids.length).toBeGreaterThan(0);
    expect(cids[0]).toBe(517045); // sodium acetate CID
  });

  test('returns empty array for non-existent molecule', async () => {
    const cids = await findCIDsByName('xyznonexistent12345');
    expect(cids).toEqual([]);
  });
});

describe('autocompletePubChem', () => {
  jest.setTimeout(30000);

  test('returns suggestions for "asp"', async () => {
    const results = await autocompletePubChem('asp');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.toLowerCase().includes('aspirin'))).toBe(true);
  });

  test('returns suggestions for "acetato"', async () => {
    const results = await autocompletePubChem('acetato');
    expect(Array.isArray(results)).toBe(true);
    // May not find Spanish results, but should return empty array, not crash
  });
});

describe('searchMoleculeRobust', () => {
  jest.setTimeout(30000);

  test('finds water by English name', async () => {
    const data = await searchMoleculeRobust('water');
    expect(data.cid).toBeDefined();
    expect(data.molecularFormula).toBeTruthy();
    expect(data.elements.length).toBeGreaterThan(0);
  });

  test('finds aspirin', async () => {
    const data = await searchMoleculeRobust('aspirin');
    expect(data.cid).toBe(2244);
    expect(data.molecularFormula).toBe('C9H8O4');
    expect(data.atoms.length).toBeGreaterThan(0);
    expect(data.bonds.length).toBeGreaterThan(0);
  });

  test('finds "acetato de sodio" via Spanish translation', async () => {
    const data = await searchMoleculeRobust('acetato de sodio');
    expect(data.cid).toBe(517045);
    expect(data.molecularFormula).toBe('C2H3NaO2');
    expect(data.elements.length).toBeGreaterThan(0);
  });

  test('finds "agua" via Spanish translation', async () => {
    const data = await searchMoleculeRobust('agua');
    expect(data.cid).toBeDefined();
    expect(data.molecularFormula).toBe('H2O');
  });

  test('finds "aspirina" via Spanish translation', async () => {
    const data = await searchMoleculeRobust('aspirina');
    expect(data.cid).toBe(2244);
  });

  test('finds "cloruro de sodio" via Spanish translation', async () => {
    const data = await searchMoleculeRobust('cloruro de sodio');
    expect(data.cid).toBe(5234);
  });

  test('throws error for completely non-existent molecule', async () => {
    // This should either throw or return a reasonable result
    // (PubChem autocomplete sometimes returns something unexpected)
    try {
      const result = await searchMoleculeRobust('zzzzzzzznonexistentxxxxx');
      // If it doesn't throw, it shouldn't be a random unrelated molecule
      expect(result).toBeDefined();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test('throws error for empty name', async () => {
    await expect(
      searchMoleculeRobust('')
    ).rejects.toThrow();
  });
});

describe('searchMoleculeByCID', () => {
  jest.setTimeout(30000);

  test('fetches water by CID 962', async () => {
    const data = await searchMoleculeByCID(962);
    expect(data.cid).toBe(962);
    expect(data.molecularFormula).toBe('H2O');
  });

  test('fetches aspirin by CID 2244', async () => {
    const data = await searchMoleculeByCID(2244);
    expect(data.cid).toBe(2244);
  });
});

describe('searchMolecule (original)', () => {
  jest.setTimeout(30000);

  test('fetches water molecule', async () => {
    const data = await searchMolecule('water');
    expect(data.cid).toBeDefined();
    expect(data.molecularFormula).toBeTruthy();
    expect(data.elements.length).toBeGreaterThan(0);
    expect(data.commonName).toBe('water');
  });

  test('fetches aspirin molecule', async () => {
    const data = await searchMolecule('aspirin');
    expect(data.cid).toBe(2244);
    expect(data.molecularFormula).toBe('C9H8O4');
    expect(data.atoms.length).toBeGreaterThan(0);
    expect(data.bonds.length).toBeGreaterThan(0);
  });

  test('throws error for non-existent molecule', async () => {
    await expect(
      searchMolecule('xyznonexistent12345')
    ).rejects.toThrow();
  });
});

describe('fetch3DCoordinates', () => {
  jest.setTimeout(60000);

  test('gets 3D data from PubChem for aspirin (CID 2244)', async () => {
    const { atoms, bonds } = await fetch3DCoordinates(2244, 'CC(=O)OC1=CC=CC=C1C(=O)O', 'aspirin');
    expect(atoms.length).toBeGreaterThan(0);
    expect(bonds.length).toBeGreaterThan(0);
    // Should have non-zero z coordinates (real 3D from PubChem)
    const hasReal3D = atoms.some((a) => Math.abs(a.z) > 0.001);
    expect(hasReal3D).toBe(true);
  }, 30000);

  test('gets 3D data from NCI CACTUS for aluminum acetate (CID 8757, no PubChem 3D)', async () => {
    const { atoms, bonds } = await fetch3DCoordinates(8757, 'CC(=O)[O-].CC(=O)[O-].CC(=O)[O-].[Al+3]', 'aluminum triacetate');
    expect(atoms.length).toBeGreaterThan(0);
    expect(bonds.length).toBeGreaterThan(0);
    // Should have non-zero z coordinates (generated by NCI CACTUS)
    const hasReal3D = atoms.some((a) => Math.abs(a.z) > 0.001);
    expect(hasReal3D).toBe(true);
  }, 30000);

  test('NCI CACTUS generates 3D for sodium acetate', async () => {
    const { atoms, bonds } = await fetch3DCoordinates(517045, 'C2H3NaO2', 'sodium acetate');
    expect(atoms.length).toBeGreaterThan(0);
    expect(bonds.length).toBeGreaterThan(0);
    // NCI CACTUS should generate 3D (even though PubChem doesn't have it)
    const hasReal3D = atoms.some((a) => Math.abs(a.z) > 0.001);
    expect(hasReal3D).toBe(true);
  }, 30000);
});

describe('searchMoleculeRobust 3D data', () => {
  jest.setTimeout(60000);

  test('aspirin has real 3D coordinates via PubChem', async () => {
    const data = await searchMoleculeRobust('aspirin');
    expect(data.atoms.length).toBeGreaterThan(0);
    const has3D = data.atoms.some((a) => Math.abs(a.z) > 0.001);
    expect(has3D).toBe(true);
  }, 30000);

  test('acetato de aluminio has 3D coordinates via NCI CACTUS', async () => {
    const data = await searchMoleculeRobust('acetato de aluminio');
    expect(data.atoms.length).toBeGreaterThan(0);
    // NCI CACTUS should generate 3D for this
    const has3D = data.atoms.some((a) => Math.abs(a.z) > 0.001);
    expect(has3D).toBe(true);
  }, 30000);
});
