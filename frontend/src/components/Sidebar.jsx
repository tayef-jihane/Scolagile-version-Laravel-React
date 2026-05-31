import { NavLink } from 'react-router-dom';

const navItems = [
  { num: '01', label: 'Accueil', to: '/home' },
  { num: '02', label: 'About Me (CV)', to: '/cv' },
  { num: '03', label: 'Mes Projets', to: '/projets' },
  { num: '04', label: 'Matrices JS', to: '/projets/matrices' },
  { num: '05', label: 'Formulaire Fichiers', to: '/projets/fichiers' },
  { num: '06', label: 'Images BDD', to: '/projets/images' },
  { num: '07', label: 'Quiz', to: '/projets/quiz' },
  { num: '08', label: 'Statistiques', to: '/projets/stats' },
  { num: '09', label: 'Géolocalisation', to: '/projets/geoloc' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Navigation</div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/home'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-num">{item.num}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
