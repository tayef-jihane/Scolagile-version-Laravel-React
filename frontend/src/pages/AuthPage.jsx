import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  // Suppression de note1 et note2 du formulaire
  const [form, setForm] = useState({
    login: '',
    pass: '',
    nom: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const doLogin = async () => {
      let result;
      if (isRegister) {
        // Envoi uniquement de login, pass et nom
        result = await register({
          login: form.login,
          pass: form.pass,
          nom: form.nom,
        });
      } else {
        result = await login(form.login, form.pass);
      }

      if (result.success) {
        window.location.replace('/');
      } else {
        setError(result.error);
      }
    };

    doLogin();
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-title">{isRegister ? 'Inscription' : 'Connexion'}</div>
        <div className="auth-subtitle">
          {isRegister ? 'Créer un compte étudiant' : 'Master RSI — Accès sécurisé'}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} method="post" action="#">
          <div className="form-group">
            <label>Login</label>
            <input
              type="text"
              name="login"
              placeholder="Votre identifiant"
              value={form.login}
              onChange={handleChange}
              maxLength={20}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="pass"
              placeholder="Votre mot de passe"
              value={form.pass}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={form.nom}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading
              ? <span className="loader" style={{ width: 16, height: 16 }}></span>
              : (isRegister ? "S'inscrire" : 'Se connecter')}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}