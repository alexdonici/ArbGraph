import React from 'react';
import { Link } from 'react-router-dom';

function Home({ lessons, completedLessons }) {
  // Se contorizează doar lecțiile finalizate care există încă în lista curentă.
  const total = lessons.length;
  const validCompletedLessons = lessons.filter(lesson => completedLessons.includes(parseInt(lesson.id)));
  const completed = validCompletedLessons.length;
  
  // Se calculează procentajul de progres, limitat la o valoare maximă de 100%.
  let progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  if (progressPercentage > 100) progressPercentage = 100;

  return (
    <div className="lesson-container" style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>Salut! Bine ai revenit pe ArbGraph! </h1>
      

      <div className="exercise-card" style={{ margin: '40px auto', maxWidth: '500px', padding: '30px' }}>
        <h2 className="exercise-card-title">Progresul tău general</h2>
        
        <div style={{ background: '#e2e8f0', borderRadius: '20px', height: '24px', width: '100%', overflow: 'hidden', margin: '20px 0' }}>
          <div style={{ 
            background: '#04AA6D', 
            height: '100%', 
            width: `${progressPercentage}%`, 
            transition: 'width 1s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.8em'
          }}>
            {progressPercentage > 5 ? `${progressPercentage}%` : ''}
          </div>
        </div>
        
        <p>Ai finalizat <strong>{completed}</strong> din <strong>{total}</strong> lecții și teste disponibile.</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link 
          to={lessons.length > 0 ? `/lesson/${lessons[0].id}` : '#'} 
          className="btn" 
          style={{ textDecoration: 'none', padding: '15px 30px', fontSize: '1.2em' }}
        >
          🚀 Mergi la lecții
        </Link>
      </div>
    </div>
  );
}

export default Home;