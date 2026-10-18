import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Profile from './components/Profile';
import Auth from './components/Auth';
import About from './components/About';
import LessonView from './components/LessonView';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('token') || null;
  });

  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);

  // Sincronizarea temei întunecate cu starea aplicației și cu localStorage.
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Sincronizarea token-ului de autentificare cu localStorage.
  // La deconectare, se reinițializează și progresul lecțiilor.
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
      setCompletedLessons([]);
    }
  }, [token]);

  // După autentificare, se încarcă de pe server lista de lecții
  // și progresul asociat contului curent.
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8000/api/lessons/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
      })
      .catch(err => console.error('Eroare la încărcarea lecțiilor:', err));

    // Se preia progresul aferent contului autentificat.
    fetch('http://localhost:8000/api/completed-lessons/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCompletedLessons(data);
      })
      .catch(err => console.error('Eroare la încărcarea progresului:', err));

  }, [token]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLessonComplete = async (lessonId) => {
    const lessonIdNum = parseInt(lessonId);
    if (completedLessons.includes(lessonIdNum)) return;

    // Actualizare optimistă a stării locale, înaintea confirmării de la server.
    setCompletedLessons(prev => [...prev, lessonIdNum]);

    // Persistarea progresului în baza de date.
    try {
      await fetch('http://localhost:8000/api/completed-lessons/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ lesson_id: lessonIdNum })
      });
    } catch (err) {
      console.error('Eroare la salvarea progresului:', err);
    }
  };

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          lessons={lessons}
          completedLessons={completedLessons}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        <div className="main-content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home isDarkMode={isDarkMode} lessons={lessons} completedLessons={completedLessons} />} />
            <Route path="/profile" element={<Profile isDarkMode={isDarkMode} token={token} setToken={setToken} lessons={lessons} completedLessons={completedLessons} />} />
            <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
            <Route path="/lesson/:id" element={<LessonView isDarkMode={isDarkMode} lessons={lessons} completedLessons={completedLessons} onLessonComplete={handleLessonComplete} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;