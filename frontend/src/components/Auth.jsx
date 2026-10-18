import React, { useState } from 'react';

function Auth({ setToken }) {
  // Indică dacă este afișat formularul de autentificare sau cel de înregistrare.
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Stochează mesajele de eroare sau de succes.

  const handleSubmit = async (e) => {
    e.preventDefault(); // Se previne reîncărcarea paginii la trimiterea formularului.
    setMessage('');
    
    // Se selectează ruta corespunzătoare în funcție de modul activ.
    const url = isLogin ? 'http://localhost:8000/api/login/' : 'http://localhost:8000/api/register/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // În cazul autentificării reușite, se reține token-ul primit.
          setToken(data.token);
        } else {
          // După înregistrarea reușită, utilizatorul este redirecționat
          // automat către formularul de autentificare.
          setIsLogin(true);
          setMessage('✅ Cont creat cu succes! Acum te poți loga.');
          setPassword(''); // Se golește câmpul de parolă.
        }
      } else {
        // Se afișează mesajul de eroare returnat de server.
        setMessage('❌ ' + (data.non_field_errors || data.username || 'Date incorecte.'));
      }
    } catch (err) {
      setMessage(' ❌ Eroare de conexiune la server.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="exercise-card" style={{ width: '350px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>
          {isLogin ? 'Autentificare' : 'Creare Cont Nou'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Nume de utilizator" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            placeholder="Parolă" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button type="submit" className="btn">
            {isLogin ? 'Intră în cont' : 'Înregistrează-te'}
          </button>
        </form>

        {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}

        <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
          {isLogin ? 'Nu ai cont? ' : 'Ai deja un cont? '}
          <span 
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isLogin ? 'Creează unul aici' : 'Loghează-te'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;