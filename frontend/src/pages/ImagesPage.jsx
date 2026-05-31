import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

export default function ImagesPage() {
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const API_BASE = 'http://localhost:8000/api';

  // Charger la liste des images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/images');
      setImages(res.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      setErr('Erreur de chargement des images.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les URLs des images avec le token JWT
  useEffect(() => {
    const loadImageUrls = async () => {
      const urls = {};
      const token = localStorage.getItem('rsi_token');

      for (const img of images) {
        try {
          const response = await fetch(`${API_BASE}/images/${img.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            urls[img.id] = URL.createObjectURL(blob);
          } else {
            urls[img.id] = null;
          }
        } catch (error) {
          console.error(`Erreur de chargement de l'image ${img.id}:`, error);
          urls[img.id] = null;
        }
      }
      setImageUrls(urls);
    };

    if (images.length > 0) {
      loadImageUrls();
    }
  }, [images]);

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  // Gérer l'upload de l'image
  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) {
      setErr('Veuillez choisir un fichier image.');
      return;
    }

    setUploading(true);
    setErr('');
    setMsg('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('rsi_token');
      const res = await api.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMsg('Image insérée avec succès dans la base de données !');
      setPreview(null);
      fileRef.current.value = '';
      fetchImages(); // Recharger la liste des images
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      const errorMsg = error.response?.data?.error ||
                       error.response?.data?.errors?.image?.[0] ||
                       'Erreur lors de l\'upload.';
      setErr(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  // Gérer la suppression d'une image
  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette image ?')) return;

    try {
      const token = localStorage.getItem('rsi_token');
      await api.delete(`/images/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setImages(prev => prev.filter(img => img.id !== id));
      setMsg('Image supprimée.');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setErr('Erreur lors de la suppression.');
    }
  };

  // Formater la taille du fichier
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Nettoyer les URLs des images lors du démontage du composant
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  return (
    <div className="page-content">
      <div className="page-title">IMAGES <span>BD</span></div>
      <div className="page-subtitle">Projet 3 — Insertion et affichage d'images dans une base de données</div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}

      <div className="card">
        <div className="card-title">Manipulation d'images avec les bases de données</div>

        <div className="form-group">
          <label>Choix d'une image à insérer</label>
          <div className="file-upload-zone" onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ fontSize: '2rem', color: 'var(--red)' }}></div>
                <p>Cliquez pour choisir une image (JPG, PNG, GIF — max 5MB)</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? <span className="loader"></span> : 'Insérer Image'}
          </button>
          <button className="btn btn-outline" onClick={fetchImages} disabled={loading}>
            {loading ? <span className="loader"></span> : 'Afficher toutes les images'}
          </button>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="card">
          <div className="card-title">Galerie ({images.length} image{images.length > 1 ? 's' : ''})</div>
          <div className="image-grid">
            {images.map((img) => {
              const imgUrl = imageUrls[img.id];
              return (
                <div className="image-item" key={img.id}>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={img.name}
                      style={{ cursor: 'pointer', maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}
                      onClick={() => window.open(`${API_BASE}/images/${img.id}`, '_blank')}
                    />
                  ) : (
                    <div style={{
                      background: '#f0f0f0',
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '0.9rem'
                    }}>
                      Erreur de chargement
                    </div>
                  )}
                  <div className="image-item-info">
                    <div className="image-item-name">{img.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray)', marginTop: '0.2rem' }}>
                      {img.type} — {formatSize(img.size)}
                    </div>
                    <div className="image-item-actions">
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                        onClick={() => handleDelete(img.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        !loading && <div className="alert alert-info">Aucune image dans la base de données. Commencez par en insérer une.</div>
      )}
    </div>
  );
}