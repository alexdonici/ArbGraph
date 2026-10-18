import React, { useState } from 'react';

function Profile({ isDarkMode, token, setToken, lessons = [], completedLessons = [] }) {

  // Stări pentru a afișa/ascunde formularele și avertismentele din pagină
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Stări pentru formulare separate
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState(''); // Pentru mesaje de succes/eroare textuale

  // Culori dinamice pentru a repara contrastul în Dark Mode
  const textColor = isDarkMode ? '#f8fafc' : '#333333';
  const subtitleColor = isDarkMode ? '#94a3b8' : '#64748b';
  const cardBg = isDarkMode ? '#1e293b' : '#ffffff';
  const cardBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const inputBg = isDarkMode ? '#0f172a' : '#f1f5f9';

  // --- FUNCȚIA DE DECONECTARE ---
  const handleLogout = () => {
    setToken(null);
  };

  // --- MODIFICARE USERNAME ---
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setUpdateMessage("❌ Te rog să introduci un nume de utilizator valid.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/update-profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ username: newUsername })
      });

      const data = await response.json();
      if (response.ok) {
        setUpdateMessage("✅ Numele de utilizator a fost actualizat cu succes!");
        setNewUsername('');
      } else {
        setUpdateMessage(`❌ Eroare: ${data.error || 'Nu s-a putut salva.'}`);
      }
    } catch (err) {
      console.error(err);
      setUpdateMessage("❌ Eroare: Nu mă pot conecta la serverul Django.");
    }
  };

  // --- MODIFICARE PAROLĂ ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setUpdateMessage("❌ Parola nouă nu poate fi goală.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setUpdateMessage("❌ Parolele introduse nu coincid!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/update-profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setUpdateMessage("✅ Parola a fost modificată cu succes!");
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setUpdateMessage(`❌ Eroare: ${data.error || 'Nu s-a putut salva parola.'}`);
      }
    } catch (err) {
      console.error(err);
      setUpdateMessage("❌ Eroare: Nu mă pot conecta la serverul Django.");
    }
  };

  // --- ȘTERGERE DEFINITIVĂ CONT ---
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Ești sigur că vrei să îți ștergi contul definitiv? Această acțiune nu poate fi anulată!");
    if (!confirmDelete) return;

    try {
      const response = await fetch('http://localhost:8000/api/delete-account/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.ok) {
        sessionStorage.removeItem('token');
        setToken(null);
        window.location.href = '/'; 
      } else {
        alert("A apărut o eroare la ștergerea contului.");
      }
    } catch (error) {
      console.error("Eroare de rețea:", error);
    }
  };

  // Calculăm progresul sincronizat perfect cu Sidebar-ul
  const validCompletedLessons = lessons.filter(lesson => completedLessons.includes(parseInt(lesson.id)));
  const completedCount = validCompletedLessons.length;
  const totalCount = lessons.length > 0 ? lessons.length : 21;

  return (
    <div style={{ padding: '40px', color: textColor, fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      <h1 style={{ color: '#04AA6D', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <span>👤</span> Contul meu
      </h1>

      {/* CARD 1: Statistici */}
      <div style={{
        backgroundColor: cardBg,
        padding: '30px',
        borderRadius: '12px',
        border: `1px solid ${cardBorder}`,
        marginBottom: '30px',
        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Statistici de învățare 📈</h2>
        <p>
          Până acum ai finalizat <strong>{completedCount}</strong> din totalul de <strong>{totalCount}</strong> lecții disponibile pe platformă.
        </p>
        <p style={{ color: subtitleColor, marginBottom: '5px' }}>
          Continuă tot așa! Mai ai puțin până devii expert în grafuri și arbori.
        </p>
      </div>

      {/* CARD 2: Setări cont */}
      <div style={{
        backgroundColor: cardBg,
        padding: '30px',
        borderRadius: '12px',
        border: `1px solid ${cardBorder}`,
        borderLeft: '5px solid #ef4444', 
        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#ef4444' }}>Setări cont ⚙️</h2>
        
        {/* Butoane principale de acțiune */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
          <button onClick={() => { setShowEditForm(!showEditForm); setUpdateMessage(''); }} style={{
            padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            ✏️ Modifică datele
          </button>

          <button onClick={handleLogout} style={{
            padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            🚪 Ieși din cont
          </button>

          <button onClick={() => setShowDeleteWarning(true)} style={{
            padding: '10px 20px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            🗑️ Șterge contul
          </button>
        </div>

        {/* Notificare de succes sau eroare integrată în card */}
        {updateMessage && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            borderRadius: '6px', 
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: updateMessage.includes('✅') ? (isDarkMode ? '#14532d' : '#dcfce7') : (isDarkMode ? '#7f1d1d' : '#fee2e2'), 
            color: updateMessage.includes('✅') ? (isDarkMode ? '#4ade80' : '#166534') : (isDarkMode ? '#fca5a5' : '#991b1b'),
            border: `1px solid ${updateMessage.includes('✅') ? '#22c55e' : '#ef4444'}`
          }}>
            {updateMessage}
          </div>
        )}

        {/* ZONA FORMULARE SEPARATE (USERNAME SAU PAROLĂ) */}
        {showEditForm && (
          <div style={{ 
            backgroundColor: inputBg, 
            padding: '20px', 
            borderRadius: '8px', 
            border: `1px solid ${cardBorder}`, 
            marginBottom: '25px',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            
            {/* Secțiunea 1: Schimbare Nume */}
            <form onSubmit={handleUpdateUsername} style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Schimbă numele de utilizator</h3>
              <input 
                type="text" placeholder="Nume nou utilizator" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, color: textColor, outline: 'none' }}
              />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#04AA6D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Actualizează Username
              </button>
            </form>

            {/* Divizor vertical discret între formulare */}
            <div style={{ width: '1px', backgroundColor: cardBorder, alignSelf: 'stretch' }} className="form-divider"></div>

            {/* Secțiunea 2: Schimbare Parolă */}
            <form onSubmit={handleUpdatePassword} style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Schimbă parola contului</h3>
              <input 
                type="password" placeholder="Parolă nouă" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, color: textColor, outline: 'none' }}
              />
              <input 
                type="password" placeholder="Confirmă parola nouă" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, color: textColor, outline: 'none' }}
              />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#04AA6D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Actualizează Parola
              </button>
            </form>

          </div>
        )}

        {/* ZONA FORMULAR ȘTERGERE CONT */}
        {showDeleteWarning && (
          <div style={{ backgroundColor: isDarkMode ? '#2c1515' : '#fef2f2', border: '1px solid #ef4444', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#b91c1c', marginTop: '0' }}>⚠️ PERICOL: Ștergere Definitivă</h3>
            <p style={{ marginBottom: '15px', fontSize: '14px' }}>Această acțiune este <strong>ireversibilă</strong>. Toate datele tale, progresul cursurilor și contul vor fi eliminate definitiv de pe server.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDeleteAccount} style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Sunt sigur, șterge contul
              </button>
              <button onClick={() => setShowDeleteWarning(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: textColor, border: `1px solid ${cardBorder}`, borderRadius: '6px', cursor: 'pointer' }}>
                Anulează
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;
