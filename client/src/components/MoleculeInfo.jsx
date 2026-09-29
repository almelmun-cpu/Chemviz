import React, { useState } from 'react';
import './MoleculeInfo.css';

export default function MoleculeInfo({ iupacName, commonName, molecularFormula, molecularWeight, smiles, cid, source, description }) {
  const isCactus = source === 'cactus';
  const hasDescription = !!description;
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="card molecule-info">
      <div className="molecule-info-header">
        <div>
          <h2 className="molecule-name">{commonName || iupacName}</h2>
          {iupacName && commonName && (
            <p className="molecule-iupac">{iupacName}</p>
          )}
        </div>
        {isCactus ? (
          <span className="badge badge-iupac">Generado desde IUPAC</span>
        ) : cid ? (
          <span className="badge">CID {cid}</span>
        ) : null}
      </div>

      {hasDescription && (
        <div className="molecule-description">
          <p>{description}</p>
        </div>
      )}

      <div className="molecule-props">
        <div className="prop-item">
          <span className="prop-label">Formula Molecular</span>
          <span className="prop-value formula">{molecularFormula || '-'}</span>
        </div>
        <div className="prop-item">
          <span className="prop-label">Peso Molecular</span>
          <span className="prop-value">{molecularWeight ? molecularWeight + ' g/mol' : '-'}</span>
        </div>
        <div className="prop-item smiles-item">
          <span className="prop-label">SMILES</span>
          <div className="smiles-row">
            <span className="prop-value mono">{smiles || '-'}</span>
            {smiles && (
              <button
                className="copy-btn"
                onClick={() => handleCopy(smiles, 'smiles')}
                title="Copiar SMILES"
              >
                {copiedField === 'smiles' ? 'Copiado!' : 'Copiar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
