import { Link } from 'react-router-dom';

const projects = [
  {
    num: 1,
    name: 'Manipulation de matrices avec Javascript',
    tech: 'JavaScript',
    desc: 'Génération aléatoire, calcul de somme et produit de matrices.',
    path: '/projects/matrix',
  },
  {
    num: 2,
    name: 'Manipulation de formulaires avec les fichiers (en PHP)',
    tech: 'PHP / Fichiers',
    desc: 'Saisie et consultation des données dans un fichier texte.',
    path: '/projects/formulaire',
  },
  {
    num: 3,
    name: 'Insertion et affichage d\'images dans une base de données',
    tech: 'PHP / MySQL',
    desc: 'Upload, stockage binaire et affichage d\'images depuis la BD.',
    path: '/projects/images',
  },
  {
    num: 4,
    name: 'Quiz',
    tech: 'JavaScript / API',
    desc: 'Quiz interactif sur JavaScript et PHP avec envoi de notes.',
    path: '/projects/quiz',
  },
  {
    num: 5,
    name: 'Statistiques avec chartJS',
    tech: 'Chart.js',
    desc: 'Visualisation des moyennes des étudiants du Master RSI.',
    path: '/projects/stats',
  },
  {
    num: 6,
    name: 'Géolocalisation',
    tech: 'Google Maps API',
    desc: 'Affichage des positions GPS des étudiants sur une carte.',
    path: '/projects/geoloc',
  },
];

export default function ProjectsPage() {
  return (
    <div className="page-content">
      <div className="page-title">MES <span>PROJETS</span></div>
      <div className="page-subtitle">Master RSI — Langage du Web 2025-2026</div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Projet</th>
              <th>Technologie</th>
              <th>Description</th>
              <th>Accès</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.num}>
                <td>
                  <span className="badge badge-red">{String(p.num).padStart(2, '0')}</span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--white)' }}>{p.name}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--red)' }}>
                  {p.tech}
                </td>
                <td style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>{p.desc}</td>
                <td>
                  <Link to={p.path} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                    Ouvrir →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
