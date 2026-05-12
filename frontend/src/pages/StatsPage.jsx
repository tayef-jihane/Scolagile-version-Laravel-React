import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsPage() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/etudiants/stats')
      .then(res => setEtudiants(res.data.data))
      .catch(() => setErr('Erreur de chargement des statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  const colors = [
    'rgba(66, 133, 244, 0.8)',
    'rgba(128, 0, 128, 0.8)',
    'rgba(0, 180, 160, 0.8)',
    'rgba(255, 150, 150, 0.8)',
    'rgba(220, 60, 60, 0.8)',
    'rgba(255, 200, 50, 0.8)',
    'rgba(50, 200, 100, 0.8)',
    'rgba(232, 0, 13, 0.8)',
  ];

  const chartData = {
    labels: etudiants.map(e => e.nom),
    datasets: [
      {
        label: 'Moyenne',
        data: etudiants.map(e => parseFloat(e.moyenne).toFixed(2)),
        backgroundColor: etudiants.map((_, i) => colors[i % colors.length]),
        borderColor: etudiants.map((_, i) => colors[i % colors.length].replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Moyenne des étudiants du Master RSI',
        color: '#E0E0E0',
        font: { family: "'Rajdhani', sans-serif", size: 16, weight: '700' },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Moyenne: ${ctx.raw} / 20`,
        },
        backgroundColor: '#111',
        titleColor: '#E8000D',
        bodyColor: '#E0E0E0',
        borderColor: '#222',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#CCCCCC', font: { family: "'Rajdhani', sans-serif", size: 13 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        min: 0,
        max: 20,
        ticks: { color: '#CCCCCC', font: { family: "'Space Mono', monospace", size: 11 }, stepSize: 2 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  return (
    <div className="page-content">
      <div className="page-title">STATISTIQUES <span>CHART</span></div>
      <div className="page-subtitle">Projet 5 — Statistiques avec ChartJS</div>

      {err && <div className="alert alert-error">{err}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="loader" style={{ width: 40, height: 40 }}></span>
        </div>
      ) : (
        <>
          <div className="chart-wrapper" style={{ marginBottom: '2rem' }}>
            <Bar data={chartData} options={options} />
          </div>

          <div className="card">
            <div className="card-title">Tableau des moyennes</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Note 1 /20</th>
                  <th>Note 2 /20</th>
                  <th>Moyenne /20</th>
                  <th>Mention</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((e, i) => {
                  const moy = parseFloat(e.moyenne);
                  let mention = 'Insuffisant';
                  if (moy >= 16) mention = 'Très Bien';
                  else if (moy >= 14) mention = 'Bien';
                  else if (moy >= 12) mention = 'Assez Bien';
                  else if (moy >= 10) mention = 'Passable';
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: 'var(--white)' }}>{e.nom}</td>
                      <td>{e.note1}</td>
                      <td>{e.note2}</td>
                      <td style={{ color: moy >= 10 ? '#00C864' : 'var(--red)', fontWeight: 700 }}>
                        {moy.toFixed(2)}
                      </td>
                      <td>
                        <span className="badge" style={{
                          background: moy >= 10 ? 'rgba(0,200,100,0.1)' : 'rgba(232,0,13,0.1)',
                          color: moy >= 10 ? '#00C864' : 'var(--red-light)',
                          border: `1px solid ${moy >= 10 ? '#00C864' : 'var(--red)'}`,
                        }}>
                          {mention}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && etudiants.length === 0 && (
        <div className="alert alert-info">Aucun étudiant enregistré. Inscrivez-vous d'abord.</div>
      )}
    </div>
  );
}
