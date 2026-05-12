import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const projects = [
  { num: '01', name: 'Manipulation de matrices', tech: 'JavaScript', path: '/projects/matrix' },
  { num: '02', name: 'Formulaire avec fichiers', tech: 'PHP / React', path: '/projects/formulaire' },
  { num: '03', name: 'Images en base de données', tech: 'PHP / MySQL', path: '/projects/images' },
  { num: '04', name: 'Quiz interactif', tech: 'JavaScript', path: '/projects/quiz' },
  { num: '05', name: 'Statistiques ChartJS', tech: 'Chart.js', path: '/projects/stats' },
  { num: '06', name: 'Géolocalisation', tech: 'Google Maps API', path: '/projects/geoloc' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="home-hero">
        <div className="home-welcome">
          Bienvenue, <span>{user?.nom || user?.login}</span>
        </div>
        <p className="home-desc">
          Plateforme du module Langage du Web — Master RSI 2025-2026.<br />
          Accédez à vos projets et travaux pratiques.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <Link key={p.num} to={p.path} className="project-card">
            <div className="project-num">{p.num}</div>
            <div className="project-name">{p.name}</div>
            <div className="project-tech">{p.tech}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
