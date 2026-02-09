import { useState, useEffect } from 'react';

function App() {
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem('promptPerfect_prompt') || '';
  });
  const [output, setOutput] = useState(() => {
    return localStorage.getItem('promptPerfect_output') || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [outputLoaded, setOutputLoaded] = useState(() => {
    return !!localStorage.getItem('promptPerfect_output');
  });
  const [outputKey, setOutputKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('promptPerfect_prompt', prompt);
  }, [prompt]);

  useEffect(() => {
    if (output) {
      localStorage.setItem('promptPerfect_output', output);
    }
  }, [output]);

  const handleRephrase = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/rephrase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      const result = data.text || data.rephrased?.text;
      
      if (result) {
        setOutput(result);
        setOutputKey(prev => prev + 1);
        setOutputLoaded(true);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setOutput('');
    setOutputLoaded(false);
    localStorage.removeItem('promptPerfect_prompt');
    localStorage.removeItem('promptPerfect_output');
  };

  return (
    <div className="app-wrapper">
      {/* ==================== HEADER SECTION ==================== */}
      <header className="header-section">
        <div className="header-container">
          {/* Logo & Brand */}
          <div className="header-brand">
            <div className="header-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="header-title">Prompt Enhancer</h1>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {(prompt || output) && (
              <button onClick={handleClear} className="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================== MAIN SECTION ==================== */}
      <main className="main-section">
        <div className="main-container">
          
          {/* Hero Text */}
          <div className="hero-section">
            <h2 className="hero-title">Refine your prompts for better AI results</h2>
            <p className="hero-subtitle">
              Transform simple prompts into detailed, effective instructions that get you better outputs.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">
            
            {/* ========== INPUT CARD ========== */}
            <div className="card card-input animate-enter stagger-1">
              <div className="card-header">
                <div className="card-label">
                  <div className="card-label-dot input-dot"></div>
                  <span>Input Prompt</span>
                </div>
                <span className="card-hint">{prompt.length} characters</span>
              </div>
              
              <div className="card-body">
                <textarea
                  id="promptInput"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='Enter your initial prompt here...&#10;&#10;Example: "A futuristic city at sunset with flying cars"'
                  className="card-textarea"
                />
              </div>
              
              <div className="card-footer">
                <button 
                  onClick={handleRephrase}
                  disabled={isLoading || !prompt.trim()}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      <span>Enhance Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ========== OUTPUT CARD ========== */}
            <div key={outputKey} className="card card-output animate-enter stagger-2">
              <div className="card-header">
                <div className="card-label">
                  <div className="card-label-dot output-dot"></div>
                  <span>Enhanced Output</span>
                </div>
                {output && (
                  <span className="status-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Ready
                  </span>
                )}
              </div>
              
              <div className="card-body">
                {isLoading ? (
                  <div className="card-placeholder loading">
                    <div className="loading-spinner"></div>
                    <span>Processing your prompt...</span>
                  </div>
                ) : output ? (
                  <div className={`card-content ${outputLoaded ? 'fade-in' : ''}`}>
                    {output}
                  </div>
                ) : (
                  <div className="card-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                    <p className="placeholder-title">Your enhanced prompt will appear here</p>
                    <p className="placeholder-hint">Enter a prompt on the left and click "Enhance"</p>
                  </div>
                )}
              </div>
              
              {output && !isLoading && (
                <div className="card-footer">
                  <button onClick={handleCopy} className="btn-secondary">
                    {copySuccess ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ==================== FOOTER SECTION ==================== */}
      <footer className="footer-section">
        <div className="footer-container">
          <p>Powered by AI • Made with care</p>
        </div>
      </footer>
    </div>
  );
}

export default App;