import React, { useState } from 'react';
import { getPubChemImageUrl } from '../services/api';
import './Structure2D.css';

const CDK_DEPICT_IMAGE = 'https://www.simolecule.com/cdkdepict/depict/bow/svg';

/**
 * Get a 2D structure image URL from SMILES using CDK Depict.
 */
function getSmilesImageUrl(smiles) {
  return `${CDK_DEPICT_IMAGE}?smi=${encodeURIComponent(smiles)}&zoom=2.0`;
}

export default function Structure2D({ cid, smiles, source }) {
  const [error, setError] = useState(false);

  // Decide image source: PubChem if we have a CID, CDK Depict if we only have SMILES
  const imgUrl = cid
    ? getPubChemImageUrl(cid)
    : smiles
    ? getSmilesImageUrl(smiles)
    : '';

  const credit = cid ? (
    <a
      href={`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      PubChem
    </a>
  ) : (
    <a
      href="https://www.simolecule.com/cdkdepict/depict.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      CDK Depict
    </a>
  );

  if (!imgUrl) {
    return (
      <div className="structure-2d-placeholder">
        <p>No hay datos 2D disponibles</p>
      </div>
    );
  }

  return (
    <div className="structure-2d">
      {!error ? (
        <img
          className="structure-2d-img"
          src={imgUrl}
          alt={cid ? `Estructura 2D (CID ${cid})` : `Estructura 2D (SMILES)`}
          onError={() => setError(true)}
        />
      ) : (
        <div className="structure-2d-placeholder">
          <p>No se pudo cargar la imagen 2D</p>
          <p className="hint">
            La estructura 2D no está disponible para esta molécula
          </p>
        </div>
      )}
      <p className="structure-2d-credit">Fuente: {credit}</p>
    </div>
  );
}
