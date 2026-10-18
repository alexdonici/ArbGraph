import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Exercise from './Exercise';

// Parametrii primesc valori implicite pentru a preveni erorile de randare
// în situația în care componenta este montată înainte de încărcarea datelor.
function LessonView({ lessons = [], completedLessons = [], onLessonComplete = () => {}, isDarkMode }) {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const lessonIdNum = parseInt(id);
  const isCompleted = completedLessons.includes(lessonIdNum);

  // Adresa de bază a serverului Django. Valoarea se modifică într-un
  // singur loc, în cazul în care este necesară schimbarea portului.
  const DJANGO_BASE_URL = "http://localhost:8000";

  // Se determină poziția lecției curente în listă pentru a configura
  // butoanele de navigare către lecția anterioară și cea următoare.
  const currentIndex = lessons.findIndex(l => l.id === lessonIdNum);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  useEffect(() => {
    // Se readuce pagina în partea de sus, pentru a asigura o experiență
    // consecventă pe dispozitivele mobile.
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Se aplică derularea și asupra containerului principal de conținut.
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Se preiau datele lecției corespunzătoare identificatorului din rută.
    fetch(`${DJANGO_BASE_URL}/api/lessons/${id}/`)
      .then(res => res.json())
      .then(data => {
        setLesson(data);
        setCorrectAnswers({}); // Se reinițializează starea exercițiilor la schimbarea lecției.
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleExerciseStatus = (exerciseId, isCorrect) => {
    setCorrectAnswers(prev => {
      const newState = { ...prev, [exerciseId]: isCorrect };
      // Verificarea se efectuează doar după ce lista de exerciții a fost încărcată,
      // pentru a evita accesarea unei valori inexistente.
      if (lesson && lesson.exercises) {
        const allCorrect = lesson.exercises.every(ex => newState[ex.id] === true);
        if (allCorrect && !isCompleted) {
          onLessonComplete(id);
        }
      }
      return newState;
    });
  };

  if (!lesson) return <div style={{ color: isDarkMode ? '#f8fafc' : '#333', padding: '40px' }}>Se încarcă lecția... ⏳</div>;

  // Conținutul Markdown stochează imaginile cu căi relative începând cu /media/.
  // Se prefixează aceste căi cu adresa serverului Django pentru a le putea afișa.
  const markdownSlefuit = lesson.content.replaceAll('/media/', `${DJANGO_BASE_URL}/media/`);

  // Componentă personalizată pentru randarea imaginilor din Markdown,
  // utilizată pentru a controla dimensiunea și alinierea acestora.
  const renderizatoarePersonale = {
    img: ({ src, alt }) => {
      return (
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            maxWidth: '350px',   // Limitează lățimea, potrivită pentru matrice și grafuri.
            width: '100%',       // Permite scalarea pe ecranele de dimensiuni reduse.
            height: 'auto',      // Păstrează proporțiile originale ale imaginii.
            display: 'block',    // Plasează imaginea pe un rând separat.
            margin: '25px auto', // Centrează imaginea pe orizontală.
            borderRadius: '6px'  // Aplică o rotunjire discretă a colțurilor.
          }} 
        />
      );
    }
  };

  return (
    <div className="lesson-container" style={{ color: isDarkMode ? '#f8fafc' : 'inherit', padding: '20px' }}>
      {/* Titlul lecției */}
      <h1 style={{ color: '#04AA6D', marginBottom: '10px' }}>{lesson.title}</h1>
      <hr style={{ marginBottom: '30px', border: 'none', borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0' }} />

      {/* Conținutul teoretic în format Markdown, cu căile imaginilor corectate
          și cu stilul personalizat aplicat. */}
      <ReactMarkdown 
        remarkPlugins={[remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={renderizatoarePersonale}
      >
        {markdownSlefuit}
      </ReactMarkdown>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: isDarkMode ? '2px solid #334155' : '2px solid #eee' }} />
      
      {/* Mesaj de finalizare, adaptat în funcție de tipul lecției
          (test de evaluare sau lecție obișnuită). */}
      {isCompleted && (
        <div style={{ marginBottom: '30px', padding: '15px', background: '#dcfce3', color: '#166534', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>
          {lesson.title.toLowerCase().includes("test") || lesson.title.toLowerCase().includes("evaluare") 
            ? "🏆 Felicitări! Ai promovat acest test de evaluare!" 
            : "🎉 Ai finalizat cu succes această lecție!"}
        </div>
      )}

      <h2>Exerciții:</h2>
      {lesson.exercises && lesson.exercises.length > 0 ? (
        lesson.exercises.map(ex => (
          <Exercise 
            key={ex.id} 
            exercise={ex} 
            onStatusChange={handleExerciseStatus} 
          />
        ))
      ) : (
        <p>Această lecție nu are încă exerciții.</p>
      )}

      {/* Butoanele de navigare între lecții */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '50px',
        paddingTop: '20px',
        borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
      }}>
        <div>
          {prevLesson && (
            <Link 
              to={`/lesson/${prevLesson.id}`} 
              className="btn" 
              style={{ textDecoration: 'none', background: '#64748b', padding: '10px 15px', borderRadius: '6px', color: '#fff' }}
            >
              ⬅️ Lecția anterioară
            </Link>
          )}
        </div>
        
        <div>
          {nextLesson && (
            <Link 
              to={`/lesson/${nextLesson.id}`} 
              className="btn" 
              style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '6px', background: '#04AA6D', color: '#fff' }}
            >
              Lecția următoare ➡️
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}

export default LessonView;