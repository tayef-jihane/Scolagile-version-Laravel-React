import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GeolocPage() {
  const { user, updateUser } = useAuth();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [myPos, setMyPos] = useState(null);

  // Charger les géolocalisations des étudiants au montage du composant
  useEffect(() => {
    fetchGeolocations();
  }, []);

  // Récupérer les géolocalisations depuis le backend
  const fetchGeolocations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/etudiants/geolocations');
      setEtudiants(res.data.data || []);
    } catch (error) {
      console.error('Erreur de chargement des géolocalisations:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Erreur inconnue';
      setErr(`Erreur de chargement: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Détecter la position GPS de l'utilisateur
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErr('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setLoading(true);
    setErr('');
    setMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMyPos({ latitude, longitude });
        setMsg(`Position détectée: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Impossible de détecter votre position.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission refusée. Autorisez la géolocalisation pour ce site.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible. Essayez plus tard.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai dépassé. Essayez à nouveau.';
            break;
          default:
            errorMessage += ` (${error.message})`;
        }
        setErr(errorMessage);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Enregistrer la position en base de données
  const saveLocation = async () => {
    if (!myPos) {
      setErr('Veuillez d\'abord détecter votre position.');
      return;
    }

    setSaving(true);
    setErr('');

    try {
      const res = await api.post('/etudiants/geoloc', {
        latitude: myPos.latitude,
        longitude: myPos.longitude,
      });

      if (res.data.success) {
        updateUser(res.data.data);
        setMsg('Position enregistrée avec succès!');
        fetchGeolocations(); // Rafraîchir la liste
      } else {
        setErr(res.data.error || 'Erreur lors de l\'enregistrement.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Erreur inconnue';
      setErr(`Erreur: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  // Construire l'URL Google Maps avec tous les marqueurs
  const buildMapUrl = () => {
    if (etudiants.length === 0) {
      // Centrer sur Settat, Maroc par défaut
      return 'https://www.google.com/maps?q=33.0138,-7.6359&z=12&output=embed';
    }

    // Si un seul étudiant, centrer sur lui
    if (etudiants.length === 1) {
      const { latitude, longitude } = etudiants[0];
      return `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
    }

    // Si plusieurs étudiants, créer une URL avec tous les marqueurs
    const markers = etudiants.map(e => `${e.latitude},${e.longitude}`).join('|');
    const centerLat = etudiants.reduce((sum, e) => sum + e.latitude, 0) / etudiants.length;
    const centerLng = etudiants.reduce((sum, e) => sum + e.longitude, 0) / etudiants.length;
    return `https://www.google.com/maps?q=${markers}&center=${centerLat},${centerLng}&z=10&output=embed`;
  };

  return (
    <div className="page-content">
      {/* En-tête de la page */}
      <div className="page-title">GÉO<span>LOCALISATION</span></div>
      <div className="page-subtitle">Projet 6 — Positions des étudiants sur Google Maps</div>

      {/* Messages d'erreur et de succès */}
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}

      {/* Section: Ma position */}
      <div className="card">
        <div className="card-title">Ma position</div>
        <p style={{
          color: 'var(--gray)',
          marginBottom: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem'
        }}>
          Cliquez sur "Obtenir ma position" pour détecter votre position GPS, puis "Enregistrer" pour la sauvegarder.
        </p>

        {/* Affichage de la position actuelle */}
        {user?.latitude && user?.longitude && (
          <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
            Position actuelle: {user.latitude.toFixed(6)}, {user.longitude.toFixed(6)}
          </div>
        )}

        {/* Affichage de la nouvelle position détectée */}
        {myPos && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            Nouvelle position: {myPos.latitude.toFixed(6)}, {myPos.longitude.toFixed(6)}
          </div>
        )}

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <button
            className="btn btn-primary"
            onClick={detectLocation}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : '📍 Obtenir ma position'}
          </button>

          {myPos && (
            <button
              className="btn btn-outline"
              onClick={saveLocation}
              disabled={saving}
            >
              {saving ? <span className="loader"></span> : '💾 Enregistrer'}
            </button>
          )}
        </div>

        {/* Affichage des coordonnées détectées */}
        {myPos && (
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--gray)',
                letterSpacing: '2px'
              }}>
                LATITUDE
              </span>
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--red)',
                fontSize: '1.1rem',
                marginTop: '0.25rem'
              }}>
                {myPos.latitude.toFixed(6)}
              </div>
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--gray)',
                letterSpacing: '2px'
              }}>
                LONGITUDE
              </span>
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--red)',
                fontSize: '1.1rem',
                marginTop: '0.25rem'
              }}>
                {myPos.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section: Carte des étudiants */}
      <div className="card">
        <div className="card-title">Carte des étudiants</div>
        <div className="map-placeholder" style={{ height: '500px' }}>
          <iframe
            src={buildMapUrl()}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte des étudiants"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '0.5rem'
            }}
          />
        </div>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--gray)',
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          {etudiants.length > 0
            ? 'Cliquez sur les marqueurs pour voir les positions.'
            : 'Aucune position enregistrée. Soyez le premier à ajouter la vôtre!'}
        </p>
      </div>

      {/* Section: Tableau des positions */}
      {etudiants.length > 0 && (
        <div className="card">
          <div className="card-title">
            Positions enregistrées ({etudiants.length})
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Étudiant</th>
                  <th style={{ textAlign: 'left' }}>Latitude</th>
                  <th style={{ textAlign: 'left' }}>Longitude</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((e) => (
                  <tr key={e.id || e.login}>
                    <td style={{ fontWeight: 600 }}>{e.nom}</td>
                    <td style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}>
                      {parseFloat(e.latitude).toFixed(6)}
                    </td>
                    <td style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}>
                      {parseFloat(e.longitude).toFixed(6)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={`https://www.google.com/maps?q=${e.latitude},${e.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        style={{
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.75rem',
                          display: 'inline-block'
                        }}
                      >
                        Voir sur Maps
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message si aucune position n'est enregistrée */}
      {!loading && etudiants.length === 0 && (
        <div className="alert alert-info">
          Aucune position enregistrée. Soyez le premier à ajouter la vôtre!
        </div>
      )}
    </div>
  );
}