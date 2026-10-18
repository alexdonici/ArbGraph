import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ lessons, completedLessons, isDarkMode, toggleTheme }) {
  const location = useLocation();

  const total = lessons.length;
  const validCompletedLessons = lessons.filter(lesson => completedLessons.includes(parseInt(lesson.id)));
  const completed = validCompletedLessons.length;
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const moduleTitles = [
    "Modulul 1: Grafuri: Fundamente",
    "Modulul 2: Grafuri: Algoritmi avansați",
    "Modulul 3: Arbori: Fundamente",
    "Modulul 4: Arbori: Algoritmi avansați"
  ];

  const modules = [];
  let currentModIndex = 0;

  lessons.forEach((lesson) => {
    if (!modules[currentModIndex]) {
      modules.push({
        id: `m${currentModIndex + 1}`,
        title: moduleTitles[currentModIndex] || `Modulul ${currentModIndex + 1}`,
        lessons: []
      });
    }

    modules[currentModIndex].lessons.push(lesson);

    const isTest = lesson.title.toLowerCase().includes("test") || lesson.title.toLowerCase().includes("evaluare");
    if (isTest) {
      currentModIndex++;
    }
  });

  const chapters = [
    {
      title: "📘 PARTEA I: GRAFURI",
      modules: modules.filter((mod, index) => index < 2) 
    },
    {
      title: "🌲 PARTEA II: ARBORI",
      modules: modules.filter((mod, index) => index >= 2) 
    }
  ];

  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const currentModule = modules.find(m => 
      m.lessons.some(l => `/lesson/${l.id}` === location.pathname)
    );
    if (currentModule) {
      setExpandedModules(prev => ({ ...prev, [currentModule.id]: true }));
    }
  }, [location.pathname, lessons]);

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <nav className="sidebar" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden',
      position: 'sticky',
      top: 0              
    }}>
      
      {/* Zona fixă superioară, care conține logo-ul aplicației. */}
      <div className="logo-container" style={{ 
        flexShrink: 0,
        padding: 0,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 10
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="logo-text">
            <span style={{ color: '#04AA6D' }}>Arb</span>Graph
          </h1>
        </Link>
      </div>

      {/* Stilurile aferente barei de derulare și efectului de hover sunt
          definite local, în cadrul componentei. */}
      <style>{`
        .subtle-scroll {
          scrollbar-width: thin; 
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        .subtle-scroll::-webkit-scrollbar {
          width: 6px; 
        }
        .subtle-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .subtle-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .subtle-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.4); 
        }

        /* Efect de evidențiere pentru elementele de tip test. */
        .test-glow {
          transition: all 0.4s ease !important; 
        }
        .test-glow:hover {
          filter: brightness(1.15); 
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.7); 
          transform: translateX(4px); 
        }
      `}</style>

      {/* Zona derulabilă, care cuprinde restul conținutului barei laterale. */}
      <div className="subtle-scroll" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingTop: '20px',
        scrollbarGutter: 'stable' 
      }}>
        
        {/* Comutatorul pentru tema întunecată. */}
        <div className="theme-switch-container" style={{ marginBottom: '0px' }}>
          <span style={{ fontSize: '18px', opacity: isDarkMode ? 0.5 : 1, transition: '0.3s' }}>☀️</span>
          <label className="theme-switch" htmlFor="theme-toggle">
            <input type="checkbox" id="theme-toggle" checked={isDarkMode} onChange={toggleTheme} />
            <div className="slider"></div>
          </label>
          <span style={{ fontSize: '18px', opacity: isDarkMode ? 1 : 0.5, transition: '0.3s' }}>🌙</span>
        </div>

        {/* Navigarea principală, dispusă pe orizontală. */}
        <div className="nav-section" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '0 10px',
          marginBottom: '15px'
        }}>
          {/* Se utilizează !important pentru a suprascrie culoarea verde
              definită implicit în index.css. */}
          <Link to="/" style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, 
            padding: '8px 5px', fontSize: '11px', margin: '0 2px', textAlign: 'center',
            textDecoration: 'none',
            /* Element activ: fundal gri translucid. */
            backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1) !important' : 'transparent',
            /* Element activ: text de culoare albă. */
            color: location.pathname === '/' ? '#f8fafc !important' : '#94a3b8 !important',
            borderRadius: '8px',
            fontWeight: location.pathname === '/' ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '18px', marginBottom: '4px' }}>🏠</span> Acasă
          </Link>

          <Link to="/profile" style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, 
            padding: '8px 5px', fontSize: '11px', margin: '0 2px', textAlign: 'center',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/profile' ? 'rgba(255, 255, 255, 0.1) !important' : 'transparent',
            color: location.pathname === '/profile' ? '#f8fafc !important' : '#94a3b8 !important',
            borderRadius: '8px',
            fontWeight: location.pathname === '/profile' ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '18px', marginBottom: '4px' }}>👤</span> Profil
          </Link>

          <Link to="/about" style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, 
            padding: '8px 5px', fontSize: '11px', margin: '0 2px', textAlign: 'center',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/about' ? 'rgba(255, 255, 255, 0.1) !important' : 'transparent',
            color: location.pathname === '/about' ? '#f8fafc !important' : '#94a3b8 !important',
            borderRadius: '8px',
            fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '18px', marginBottom: '4px' }}>📖</span> Despre
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        {/* Bara de progres a cursului. */}
        <div className="progress-container">
          <div className="progress-header">
            <span>Progres curs</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Randarea capitolelor și a modulelor aferente. */}
        <div style={{ paddingBottom: '20px' }}>
          {chapters.map((chapter, cIndex) => {
            if (chapter.modules.length === 0) return null;

            return (
              <div key={cIndex} style={{ marginBottom: '15px' }}>
                <div style={{
                  padding: '10px 15px 5px 15px',
                  color: '#94a3b8', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '1.5px',
                }}>
                  {chapter.title}
                </div>

                {chapter.modules.map(mod => {
                  const isExpanded = expandedModules[mod.id];

                  return (
                    <div key={mod.id} style={{ marginBottom: '2px' }}>
                      <div 
                        onClick={() => toggleModule(mod.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 15px',
                          cursor: 'pointer',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#f8fafc', 
                          fontWeight: 'bold',
                          userSelect: 'none',
                          borderLeft: isExpanded ? '4px solid #04AA6D' : '4px solid transparent',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span style={{ fontSize: '13px' }}>{mod.title}</span>
                        <span style={{ 
                          fontSize: '10px', 
                          transform: isExpanded ? 'rotate(180deg)' : 'none', 
                          transition: 'transform 0.3s ease' 
                        }}>
                          ▼
                        </span>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.35s ease-in-out'
                      }}>
                        <div style={{ overflow: 'hidden' }}>
                          <ul 
                            className="lesson-list" 
                            style={{ 
                              paddingLeft: '15px',
                              paddingRight: '10px',
                              margin: isExpanded ? '5px 0 10px 0' : '0', 
                              opacity: isExpanded ? 1 : 0,
                              transition: 'opacity 0.35s ease-in-out, margin 0.35s ease-in-out',
                              listStyle: 'none'
                            }}
                          >
                            {mod.lessons.map(lesson => {
                              const isCompleted = completedLessons.includes(parseInt(lesson.id));
                              const isActive = location.pathname === `/lesson/${lesson.id}`;
                              const isTest = lesson.title.toLowerCase().includes("test") || lesson.title.toLowerCase().includes("evaluare");
                              
                              const itemClass = `lesson-link ${isActive ? 'current' : ''} ${isCompleted ? 'completed' : 'pending'} ${isTest ? 'test-glow' : ''}`;
                              
                              const testStyle = isTest ? {
                                backgroundColor: isActive ? '#DAA520' : '#FFD700',
                              } : {};

                              return (
                                <li key={lesson.id}>
                                  <Link 
                                    to={`/lesson/${lesson.id}`} 
                                    className={itemClass} 
                                    style={{
                                      ...testStyle,
                                      color: isTest ? '#1e1e1e' : '#e2e8f0', 
                                      fontWeight: isActive ? 'bold' : 'normal',
                                      display: 'flex',
                                      alignItems: 'center',
                                      borderLeft: isCompleted ? '4px solid #04AA6D' : (isTest ? '4px solid #B8860B' : '4px solid transparent'),
                                      paddingLeft: '10px',
                                      transition: 'all 0.4s ease'
                                    }}
                                  >
                                    {isTest && !isCompleted && <span style={{ marginRight: '8px' }}>🏆</span>}
                                    {lesson.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

      </div>
    </nav>
  );
}

export default Sidebar;