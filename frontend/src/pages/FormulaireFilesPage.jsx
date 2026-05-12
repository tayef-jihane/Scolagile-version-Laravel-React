import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FormulaireFilesPage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    nom: user?.nom || '',
    login: user?.login || '',
    note1: user?.note1 || '',
    note2: user?.note2 || '',
  });
  const [etudiants, setEtudiants] = useState([]);
  const [view, setView] = useState('form'); // 'form' | 'list'
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setMsg('');
    try {
      const res = await api.put(`/etudiants/${user.id}`, {
        nom: form.nom,
        note1: parseInt(form.note1) || 0,
        note2: parseInt(form.note2) || 0,
      });
      updateUser(res.data.data);
      setMsg('Données mises à jour et enregistrées avec succès !');
    } catch (e) {
      setErr('Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await api.get('/etudiants');
      setEtudiants(res.data.data);
      setView('list');
    } catch {
      setErr('Impossible de charger la liste.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (et) => {
    setEditId(et.id);
    setEditForm({ nom: et.nom, note1: et.note1, note2: et.note2 });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/etudiants/${id}`, {
        nom: editForm.nom,
        note1: parseInt(editForm.note1),
        note2: parseInt(editForm.note2),
      });
      setEtudiants(prev => prev.map(e => e.id === id
        ? { ...e, ...editForm, moyenne: (parseInt(editForm.note1) + parseInt(editForm.note2)) / 2 }
        : e
      ));
      setEditId(null);
      setMsg('Étudiant modifié avec succès !');
    } catch {
      setErr('Erreur lors de la modification.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-title">FORMULAIRE <span>FICHIERS</span></div>
      <div className="page-subtitle">Projet 2 — Gestion de formulaire avec les données</div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}

      {view === 'form' && (
        <div className="card file-form-container">
          <div className="card-title">Gestion de formulaire avec les fichiers</div>

          <div className="file-form-section-title">1. Informations</div>
          <form onSubmit={handleSubmit}>
            <div className="inline-form-row">
              <div className="form-group">
                <label>Nom</label>
                <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required />
              </div>
              <div className="form-group">
                <label>Login (CNE)</label>
                <input value={form.login} disabled style={{ opacity: 0.6 }} />
              </div>
            </div>

            <div className="file-form-section-title" style={{ marginTop: '1.5rem' }}>2. Notes des modules</div>
            <div className="inline-form-row">
              <div className="form-group">
                <label>Module 1</label>
                <input name="note1" type="number" min="0" max="20" value={form.note1}
                  onChange={handleChange} placeholder="Note /20" />
              </div>
              <div className="form-group">
                <label>Module 2</label>
                <input name="note2" type="number" min="0" max="20" value={form.note2}
                  onChange={handleChange} placeholder="Note /20" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loader"></span> : 'Valider'}
              </button>
              <button type="button" className="btn btn-outline" onClick={loadList} disabled={loading}>
                Consulter la liste
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              Liste des étudiants enregistrés dans le fichier
            </div>
            <button className="btn btn-outline" onClick={() => setView('form')}>← Retour</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Login (CNE)</th>
                <th>Nom</th>
                <th>Module 1</th>
                <th>Module 2</th>
                <th>Moyenne</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map(et => (
                <tr key={et.id}>
                  {editId === et.id ? (
                    <>
                      <td>{et.login}</td>
                      <td>
                        <input value={editForm.nom} onChange={e => setEditForm({ ...editForm, nom: e.target.value })}
                          style={{ background: 'var(--black-3)', border: '1px solid var(--red)', color: 'var(--white)', padding: '0.3rem 0.5rem', width: '100%' }} />
                      </td>
                      <td>
                        <input type="number" min="0" max="20" value={editForm.note1}
                          onChange={e => setEditForm({ ...editForm, note1: e.target.value })}
                          style={{ background: 'var(--black-3)', border: '1px solid var(--red)', color: 'var(--white)', padding: '0.3rem 0.5rem', width: '70px' }} />
                      </td>
                      <td>
                        <input type="number" min="0" max="20" value={editForm.note2}
                          onChange={e => setEditForm({ ...editForm, note2: e.target.value })}
                          style={{ background: 'var(--black-3)', border: '1px solid var(--red)', color: 'var(--white)', padding: '0.3rem 0.5rem', width: '70px' }} />
                      </td>
                      <td>—</td>
                      <td>
                        <button className="btn btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => saveEdit(et.id)}>
                          Sauver
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{et.login}</td>
                      <td>{et.nom}</td>
                      <td>{et.note1}</td>
                      <td>{et.note2}</td>
                      <td>{parseFloat(et.moyenne).toFixed(2)}</td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => startEdit(et)}>
                          Modifier
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
