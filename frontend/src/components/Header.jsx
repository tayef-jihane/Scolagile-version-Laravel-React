import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header() {
  const { etudiant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="header-logo">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" />
          </svg>
        </div>
        <span className="logo-text">MASTER <span>RSI</span></span>
      </div>

      {etudiant && (
        <nav className="header-nav">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Accueil</NavLink>
          <NavLink to="/cv" className={({ isActive }) => isActive ? 'active' : ''}>About Me</NavLink>
          <NavLink to="/projets" className={({ isActive }) => isActive ? 'active' : ''}>Mes Projets</NavLink>
        </nav>
      )}

      <div className="header-user">
        {etudiant ? (
          <>
            <span>▸ {etudiant.nom}</span>
            <button className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }} onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <span>Langage du Web — 2025/2026</span>
        )}
      </div>
    </header>
  );
}
