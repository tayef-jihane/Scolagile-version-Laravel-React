import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-wrapper">
      <header className="site-header">
        <div className="header-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <polygon points="10,1 19,5.5 19,14.5 10,19 1,14.5 1,5.5"/>
            </svg>
          </div>
          <div className="logo-text">MASTER <span>RSI</span></div>
        </div>
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Accueil</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Me</NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Mes Projets</NavLink>
        </nav>
        <div className="header-user">
          <span>{user?.nom || user?.login}</span>
          <button className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-title">Navigation</div>
          <nav>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">⌂</span> Accueil
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">01</span> About Me
            </NavLink>
            <NavLink to="/projects" end className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">02</span> Mes Projets
            </NavLink>
            <NavLink to="/projects/matrix" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">P1</span> Matrices JS
            </NavLink>
            <NavLink to="/projects/formulaire" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">P2</span> Formulaire
            </NavLink>
            <NavLink to="/projects/images" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">P3</span> Images BD
            </NavLink>
            <NavLink to="/projects/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">P4</span> Quiz
            </NavLink>
            <NavLink to="/projects/stats" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">P5</span> Statistiques
            </NavLink>
            <NavLink to="/projects/geoloc" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-num">P6</span> Géolocalisation
            </NavLink>
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <footer className="site-footer">
        <span>Master RSI</span> — Langage du Web — Pr. Sofia El Amoury — <span>2025-2026</span>
      </footer>
    </div>
  );
}
