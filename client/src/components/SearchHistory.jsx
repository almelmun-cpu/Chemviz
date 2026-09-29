import React from 'react';
import './SearchHistory.css';

export default function SearchHistory({ history, onSelect, onClear }) {
  return (
    <div className="card search-history">
      <div className="history-header">
        <h4 className="card-title-sm">Historial</h4>
        {history.length > 0 && (
          <button className="history-clear-btn" onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="history-empty">
          Sin búsquedas recientes
        </p>
      ) : (
        <ul className="history-list">
          {history.map((item, idx) => (
            <li key={`${item}-${idx}`}>
              <button
                className="history-item"
                onClick={() => onSelect(item)}
                title={`Buscar "${item}"`}
              >
                <span className="history-icon">↳</span>
                <span className="history-name">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
