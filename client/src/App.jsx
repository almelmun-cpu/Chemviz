import React, { useState, useEffect } from 'react';
import { useMolecule } from './hooks/useMolecule';
import SearchBar from './components/SearchBar';
import MoleculeInfo from './components/MoleculeInfo';
import Structure2D from './components/Structure2D';
import Structure3D from './components/Structure3D';
import ElementList from './components/ElementList';
import './App.css';

function App() {
  const { data, loading, error, search } = useMolecule();

  // Handle URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      search(q);
    }
  }, []);

  const handleSearch = (query) => {
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
    search(query);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🧪</span>
            <span className="logo-text">ChemViz</span>
          </div>
          <p className="tagline">Explorador Molecular 3D y Datos Químicos</p>
        </div>
      </header>

      <main className="app-main">
        <div className="main-layout">
          {/* Left Sidebar - History or Info */}
          <aside className="sidebar left-sidebar">
            <div className="card">
              <h3 className="card-title-sm">Acerca de</h3>
              <p className="quick-info">
                ChemViz permite buscar moléculas por su nombre común o IUPAC y
                visualizar su estructura tridimensional y propiedades.
              </p>
            </div>
          </aside>

          {/* Center Content */}
          <section className="content">
            <div className="search-section">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            {loading && (
              <div className="loading-container fade-in">
                <div className="spinner"></div>
                <p>Analizando estructura molecular...</p>
              </div>
            )}

            {error && (
              <div className="error-container fade-in">
                <p className="error-text">⚠️ {error}</p>
              </div>
            )}

            {data && !loading && !error && (
              <div className="results fade-in-up" key={data.cid || data.iupacName}>
                <MoleculeInfo
                  iupacName={data.iupacName}
                  commonName={data.commonName}
                  molecularFormula={data.molecularFormula}
                  molecularWeight={data.molecularWeight}
                  smiles={data.smiles}
                  cid={data.cid}
                  source={data.source}
                  description={data.description}
                />

                {/* Structure visualizations */}
                <div className="structure-grid">
                  <div className="card structure-card">
                    <h3 className="card-title">Estructura 2D</h3>
                    <Structure2D cid={data.cid} smiles={data.smiles} source={data.source} />
                  </div>
                  <div className="card structure-card">
                    <h3 className="card-title">Modelo 3D interactivo</h3>
                    <Structure3D atoms={data.atoms} bonds={data.bonds} />
                  </div>
                </div>
              </div>
            )}

            {!data && !loading && !error && (
              <div className="empty-state fade-in">
                <div className="empty-icon">🧬</div>
                <h2>Explora el Universo Químico</h2>
                <p>
                  Busca una molécula para ver su estructura interactiva y sus propiedades físicas.
                </p>
              </div>
            )}
          </section>

          {/* Right Sidebar - Composition */}
          <aside className="sidebar right-sidebar">
            {data && !loading && !error && (
              <div className="card fade-in">
                <h3 className="card-title-sm">Composición</h3>
                <ElementList elements={data.elements} />
              </div>
            )}
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <p>ChemViz © 2026 • Datos proporcionados por PubChem y NCI CACTUS</p>
      </footer>
    </div>
  );
}

export default App;
