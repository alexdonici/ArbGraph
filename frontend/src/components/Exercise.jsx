import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function Exercise({ exercise, onStatusChange }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) return; // Se previne trimiterea formularului fără o opțiune selectată.

    // Se compară varianta aleasă cu răspunsul corect definit în baza de date.
    const correct = selectedOption === exercise.correct_answer;
    setIsCorrect(correct);
    
    // Se notifică componenta părinte (LessonView) cu privire la rezultat.
    onStatusChange(exercise.id, correct);
  };

  return (
    <div className="exercise-card" style={{ padding: '20px', marginBottom: '25px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
      
      {/* Enunțul întrebării, randat cu suport pentru formule matematice. */}
      <div style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1em' }}>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {exercise.question}
        </ReactMarkdown>
      </div>
      
      <form onSubmit={handleSubmit}>
        {['option_a', 'option_b', 'option_c', 'option_d'].map((optKey) => (
          <div key={optKey} style={{ marginBottom: '12px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start' }}>
              <input
                type="radio"
                name={`exercise-${exercise.id}`}
                value={optKey}
                checked={selectedOption === optKey}
                onChange={(e) => setSelectedOption(e.target.value)}
                style={{ marginTop: '5px', marginRight: '10px' }}
              />
              {/* Variantele de răspuns sunt de asemenea procesate ca Markdown/KaTeX. */}
              <div style={{ flex: 1 }}>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {exercise[optKey]}
                </ReactMarkdown>
              </div>
            </label>
          </div>
        ))}
        
        <button 
          type="submit" 
          className="btn" 
          style={{ marginTop: '15px', padding: '10px 20px', cursor: selectedOption ? 'pointer' : 'not-allowed', opacity: selectedOption ? 1 : 0.6 }}
          disabled={!selectedOption}
        >
          Verifică răspunsul
        </button>
      </form>

      {/* Mesajele de validare a răspunsului */}
      {isCorrect === true && (
        <div style={{ marginTop: '15px', color: '#166534', background: '#dcfce3', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>
          ✅ Răspuns corect!
        </div>
      )}
      {isCorrect === false && (
        <div style={{ marginTop: '15px', color: '#991b1b', background: '#fee2e2', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>
          ❌ Răspuns greșit. Mai încearcă!
        </div>
      )}
    </div>
  );
}

export default Exercise;