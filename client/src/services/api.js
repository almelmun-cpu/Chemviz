const API_BASE = '/api';

/**
 * Fetch molecule data from the backend (robust multi-strategy search).
 * @param {string} name - Molecule name in any language
 * @returns {Promise<object>} Molecule data with atoms, bonds, properties
 */
export async function fetchMolecule(name) {
  const url = `${API_BASE}/molecule/${encodeURIComponent(name.trim())}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || `No se pudo encontrar la molécula "${name}".`
    );
  }

  return res.json();
}

/**
 * Get autocomplete suggestions for a chemical name query.
 * @param {string} query - Partial molecule name
 * @returns {Promise<Array>} List of suggestion objects
 */
export async function fetchSuggestions(query) {
  if (!query || query.trim().length < 1) return [];
  const url = `${API_BASE}/suggest/${encodeURIComponent(query.trim())}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

/**
 * Get the PubChem 2D image URL for a molecule CID.
 * @param {number} cid - PubChem compound ID
 * @returns {string} Image URL
 */
export function getPubChemImageUrl(cid) {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`;
}
