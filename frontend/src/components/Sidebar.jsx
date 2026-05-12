import { NavLink } from 'react-router-dom';

const navItems = [
  { num: '00', label: 'Accueil', to: '/home' },
  { num: '01', label: 'About Me (CV)', to: '/cv' },
  { num: '02', label: 'Mes Projets', to: '/projets' },
  { num: '03', label: 'Matrices JS', to: '/projets/matrices' },
  { num: '04', label: 'Formulaire Fichiers', to: '/projets/fichiers' },
  { num: '05', label: 'Images BDD', to: '/projets/images' },
  { num: '06', label: 'Quiz', to: '/projets/quiz' },
  { num: '07', label: 'Statistiques', to: '/projets/stats' },
  { num: '08', label: 'Géolocalisation', to: '/projets/geoloc' },
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
