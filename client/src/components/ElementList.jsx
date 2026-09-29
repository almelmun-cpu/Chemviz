import React from 'react';
import './ElementList.css';

// CPK colors for common elements
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
};

const ELEMENT_NAMES = {
  H: 'Hidrógeno',
  He: 'Helio',
  Li: 'Litio',
  Be: 'Berilio',
  B: 'Boro',
  C: 'Carbono',
  N: 'Nitrógeno',
  O: 'Oxígeno',
  F: 'Flúor',
  Ne: 'Neón',
  Na: 'Sodio',
  Mg: 'Magnesio',
  Al: 'Aluminio',
  Si: 'Silicio',
  P: 'Fósforo',
  S: 'Azufre',
  Cl: 'Cloro',
  Ar: 'Argón',
  K: 'Potasio',
  Ca: 'Calcio',
  Fe: 'Hierro',
  Cu: 'Cobre',
  Zn: 'Zinc',
  Br: 'Bromo',
  I: 'Yodo',
};

export default function ElementList({ elements }) {
  if (!elements || elements.length === 0) {
    return <p className="no-elements">No hay datos de composición</p>;
  }

  const totalAtoms = elements.reduce((sum, el) => sum + el.count, 0);

  return (
    <div className="element-list">
      <table className="element-table">
        <thead>
          <tr>
            <th></th>
            <th>Elemento</th>
            <th>Símbolo</th>
            <th>Átomos</th>
            <th>% Composición</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((el) => {
            const color = ELEMENT_COLORS[el.symbol] || '#CCCCCC';
            const name = ELEMENT_NAMES[el.symbol] || el.symbol;
            const pct = ((el.count / totalAtoms) * 100).toFixed(1);
            return (
              <tr key={el.symbol}>
                <td>
                  <span
                    className="element-color-dot"
                    style={{ backgroundColor: color }}
                  />
                </td>
                <td className="element-name">{name}</td>
                <td className="element-symbol">{el.symbol}</td>
                <td className="element-count">{el.count}</td>
                <td className="element-pct">{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="element-total">
        Total: <strong>{totalAtoms}</strong> átomos en{' '}
        <strong>{elements.length}</strong> elementos distintos
      </p>
    </div>
  );
}
