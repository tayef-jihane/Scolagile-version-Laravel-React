import { useAuth } from '../context/AuthContext';

export default function AboutPage() {
  const { user } = useAuth();

  const skills = [
    { name: 'HTML / CSS', level: 90 },
    { name: 'JavaScript', level: 80 },
    { name: 'PHP', level: 75 },
    { name: 'MySQL', level: 70 },
    { name: 'React.js', level: 65 },
    { name: 'Laravel', level: 60 },
  ];

  return (
    <div className="page-content">
      <div className="cv-page">
        <div className="cv-header">
          <div className="cv-photo-placeholder">
            {/* Remplacez par votre vraie photo */}
            <span>VOTRE<br/>PHOTO<br/>ICI</span>
          </div>
          <div className="cv-info">
            <h1>{user?.nom || 'Étudiant RSI'}</h1>
            <div className="cv-role">Étudiant Master RSI — Langage du Web</div>
            <div className="cv-contact-items">
              <div className="cv-contact-item">
                <span>✉</span> {user?.login}@ump.ac.ma
              </div>
              <div className="cv-contact-item">
                <span>🎓</span> Université Hassan 1er — FST Settat
              </div>
              <div className="cv-contact-item">
                <span>📅</span> Année 2025-2026
              </div>
            </div>
          </div>
        </div>

        <div className="cv-body">
          <div className="cv-sidebar">
            <div className="cv-section">
              <div className="cv-section-title">Compétences</div>
              {skills.map((s) => (
                <div className="skill-bar-wrap" key={s.name}>
                  <div className="skill-bar-label">
                    <span>{s.name}</span>
                    <span>{s.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" style={{ width: `${s.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cv-section">
              <div className="cv-section-title">Notes</div>
              <ul>
                <li>Module 1 : {user?.note1 ?? '—'} / 20</li>
                <li>Module 2 : {user?.note2 ?? '—'} / 20</li>
                <li>Moyenne : {user?.moyenne?.toFixed(2) ?? '—'} / 20</li>
              </ul>
            </div>

            <div className="cv-section">
              <div className="cv-section-title">Langues</div>
              <ul>
                <li>Arabe — Natif</li>
                <li>Français — Courant</li>
                <li>Anglais — Technique</li>
              </ul>
            </div>
          </div>

          <div className="cv-main">
            <div className="cv-section">
              <div className="cv-section-title">Profil</div>
              <p>
                Étudiant en Master Réseaux et Systèmes Informatiques à la Faculté des Sciences et
                Techniques de Settat. Passionné par le développement web, les réseaux et les nouvelles
                technologies. Ce portfolio présente les travaux réalisés dans le cadre du module
                "Langage du Web".
              </p>
            </div>

            <div className="cv-section">
              <div className="cv-section-title">Formation</div>
              <ul>
                <li><strong>Master RSI</strong> — FST Settat (2024-2026)</li>
                <li><strong>Licence Informatique</strong> — (2021-2024)</li>
                <li><strong>Baccalauréat Sciences Physiques</strong></li>
              </ul>
            </div>

            <div className="cv-section">
              <div className="cv-section-title">Projets Réalisés</div>
              <ul>
                <li>Manipulation de matrices avec JavaScript</li>
                <li>Gestion de formulaires avec fichiers PHP</li>
                <li>Insertion et affichage d'images en base de données</li>
                <li>Quiz interactif (JavaScript + PHP)</li>
                <li>Statistiques avec Chart.js</li>
                <li>Géolocalisation avec Google Maps API</li>
              </ul>
            </div>

            <div className="cv-section">
              <div className="cv-section-title">Expériences</div>
              <ul>
                <li>Stage développement web — Casablanca (2024)</li>
                <li>Projet académique — Application de gestion scolaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
