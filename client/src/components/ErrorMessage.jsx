import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">Molécula no encontrada</h3>
        <p className="error-text">{message}</p>
      </div>
    </div>
  );
}
