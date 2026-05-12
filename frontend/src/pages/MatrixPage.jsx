import { useState } from 'react';

function useMatrix(label) {
  const [rows, setRows] = useState('');
  const [cols, setCols] = useState('');
  const [values, setValues] = useState('');

  const generate = () => {
    const r = parseInt(rows);
    const c = parseInt(cols);
    if (!r || !c || r < 1 || c < 1 || r > 10 || c > 10) {
      alert('Entrez des dimensions valides (1-10)');
      return null;
    }
    let matrix = [];
    let text = '';
    for (let i = 0; i < r; i++) {
      let row = [];
      for (let j = 0; j < c; j++) {
        const val = Math.floor(Math.random() * 9) + 1;
        row.push(val);
      }
      matrix.push(row);
      text += row.join(' ') + '\n';
    }
    setValues(text.trim());
    return matrix;
  };

  const parseMatrix = () => {
    const lines = values.trim().split('\n');
    return lines.map(line => line.trim().split(/\s+/).map(Number));
  };

  return { rows, setRows, cols, setCols, values, setValues, generate, parseMatrix, label };
}

function MatrixInput({ m }) {
  return (
    <div className="matrix-box">
      <div className="matrix-box-title">Matrice N°{m.label}</div>
      <div className="form-group">
        <label>Nombres de lignes</label>
        <input type="number" min="1" max="10" value={m.rows}
          onChange={e => m.setRows(e.target.value)} placeholder="ex: 3" />
      </div>
      <div className="form-group">
        <label>Nombres de colonnes</label>
        <input type="number" min="1" max="10" value={m.cols}
          onChange={e => m.setCols(e.target.value)} placeholder="ex: 3" />
      </div>
      <button className="btn btn-primary" style={{ marginBottom: '1rem' }} onClick={m.generate}>
        Générer des valeurs aléatoires
      </button>
      <div className="form-group">
        <label>Valeurs générées</label>
        <textarea className="matrix-output" value={m.values}
          onChange={e => m.setValues(e.target.value)} rows={6}
          placeholder="Cliquez sur Générer ou saisissez manuellement (une ligne par rangée)" />
      </div>
    </div>
  );
}

export default function MatrixPage() {
  const m1 = useMatrix('1');
  const m2 = useMatrix('2');
  const [sumResult, setSumResult] = useState('');
  const [prodResult, setProdResult] = useState('');

  const matrixToText = (mat) => mat.map(row => row.join(' ')).join('\n');

  const addMatrices = () => {
    try {
      const A = m1.parseMatrix();
      const B = m2.parseMatrix();
      if (A.length !== B.length || A[0].length !== B[0].length) {
        alert('Les matrices doivent avoir les mêmes dimensions pour la somme.');
        return;
      }
      const C = A.map((row, i) => row.map((val, j) => val + B[i][j]));
      setSumResult(matrixToText(C));
    } catch {
      alert('Erreur de format. Vérifiez les matrices.');
    }
  };

  const multiplyMatrices = () => {
    try {
      const A = m1.parseMatrix();
      const B = m2.parseMatrix();
      if (A[0].length !== B.length) {
        alert('Le nombre de colonnes de M1 doit égaler le nombre de lignes de M2 pour le produit.');
        return;
      }
      const C = Array.from({ length: A.length }, () => Array(B[0].length).fill(0));
      for (let i = 0; i < A.length; i++)
        for (let j = 0; j < B[0].length; j++)
          for (let k = 0; k < B.length; k++)
            C[i][j] += A[i][k] * B[k][j];
      setProdResult(matrixToText(C));
    } catch {
      alert('Erreur de format. Vérifiez les matrices.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-title">MATRICES <span>JS</span></div>
      <div className="page-subtitle">Projet 1 — Manipulation de matrices avec JavaScript</div>

      <div className="matrix-grid">
        <MatrixInput m={m1} />
        <MatrixInput m={m2} />
      </div>

      <div className="matrix-result-grid">
        <div className="matrix-box">
          <div className="matrix-box-title">Résultat — Somme</div>
          <button className="btn btn-primary" style={{ marginBottom: '1rem' }} onClick={addMatrices}>
            Calculer Somme
          </button>
          <div className="form-group">
            <label>Résultat de la Somme</label>
            <textarea className="matrix-output" value={sumResult} readOnly rows={6}
              placeholder="Le résultat apparaîtra ici..." />
          </div>
        </div>

        <div className="matrix-box">
          <div className="matrix-box-title">Résultat — Produit</div>
          <button className="btn btn-primary" style={{ marginBottom: '1rem' }} onClick={multiplyMatrices}>
            Calculer Produit
          </button>
          <div className="form-group">
            <label>Résultat du Produit</label>
            <textarea className="matrix-output" value={prodResult} readOnly rows={6}
              placeholder="Le résultat apparaîtra ici..." />
          </div>
        </div>
      </div>
    </div>
  );
}
