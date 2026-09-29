import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSuggestions } from '../services/api';
import './SearchBar.css';

const EXAMPLES = [
  'water', 'aspirin', 'caffeine', 'ethanol', 'glucose',
  'sodium acetate', 'penicillin', 'benzene', 'nicotine', 'cholesterol'
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const lastSubmittedRef = useRef(null);

  // Debounced autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 1 || trimmedQuery === lastSubmittedRef.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(trimmedQuery);
        // Ensure the query hasn't become the submitted one while fetching
        if (query.trim() === lastSubmittedRef.current) return;
        
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setActiveIndex(-1);
      } catch {
        // ignore
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSubmit = useCallback((value) => {
    const searchTerm = (value || query).trim();
    if (searchTerm && !loading) {
      lastSubmittedRef.current = searchTerm;
      setQuery(searchTerm); // Also update input to match the submitted value
      setShowSuggestions(false);
      setSuggestions([]);
      onSearch(searchTerm);
      inputRef.current?.blur(); // Remove focus to avoid onFocus triggering again
    }
  }, [query, loading, onSearch]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSubmit(suggestions[activeIndex].name);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSuggestionClick = (name) => {
    handleSubmit(name);
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder='Busca una molécula… ej: "aspirin", "acetato de sodio", "glucose"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={loading}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); }}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="search-button"
          disabled={!query.trim() || loading}
        >
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
              onMouseDown={() => handleSuggestionClick(s.name)}
            >
              <span className="suggestion-name">{s.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Quick examples */}
      <div className="quick-examples">
        <span>⚡ Rápidas: </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="example-chip"
            onClick={() => { setQuery(ex); handleSubmit(ex); }}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
