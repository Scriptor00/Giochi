// src/components/GiocoDettaglio.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GiocoDettaglio() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gioco, setGioco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stato per il commento personale
    const [personalComment, setPersonalComment] = useState('');
    const [displayComment, setDisplayComment] = useState('');
    const [isEditingComment, setIsEditingComment] = useState(false);

    // stati per la gestione del completamento e voto
    const [showCompletionForm, setShowCompletionForm] = useState(false); // Controlla la visibilità del form
    const [tempRating, setTempRating] = useState(0); // Voto temporaneo per l'input form

    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Effetto per il fetching dei dettagli del gioco all'avvio del componente o al cambio di ID
    useEffect(() => {
        const fetchGiocoDettaglio = async () => {
            setLoading(true);
            setError(null);
            setMessage(null);
            setErrorMessage(null);

            try {
                const response = await fetch(`http://localhost:5038/Giochi/${id}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setGioco(data);
                
                setPersonalComment(data.commentoPersonale || '');
                setDisplayComment(data.commentoPersonale || '');
                setIsEditingComment(data.commentoPersonale === null || data.commentoPersonale === '');

                // Inizializza il voto temporaneo con il voto esistente, se presente
                setTempRating(data.votoPersonale || 0);

            } catch (err) {
                console.error("Errore durante il fetch del dettaglio gioco:", err);
                setError(`Impossibile caricare i dettagli del gioco. ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchGiocoDettaglio();
    }, [id]);

    // Funzione per salvare il commento personale
    const handleSaveComment = async () => {
        setMessage(null);
        setErrorMessage(null);

        if (!gioco) {
            setErrorMessage("Errore: Dati del gioco non disponibili.");
            return;
        }

        try {
            const updatedGioco = {
                ...gioco,
                commentoPersonale: personalComment
            };

            const response = await fetch(`http://localhost:5038/Giochi/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedGioco)
            });

            if (response.ok) {
                setMessage('Commento salvato con successo!');
                setGioco(updatedGioco);
                setDisplayComment(personalComment);
                setIsEditingComment(false);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            } else {
                const errorData = await response.json();
                const msg = errorData.errors ? 
                            Object.values(errorData.errors).flat().join('; ') : 
                            (errorData.title || 'Errore sconosciuto durante il salvataggio.');
                setErrorMessage(`Errore nel salvataggio: ${msg}`);
                console.error("Dettagli errore backend:", errorData);
            }
        } catch (err) {
            console.error("Errore di rete o server durante il salvataggio:", err);
            setErrorMessage('Impossibile connettersi al server per salvare il commento.');
        }
    };

    // Funzione per entrare in modalità modifica commento
    const handleEditComment = () => {
        setIsEditingComment(true);
        setMessage(null);
        setErrorMessage(null);
        setPersonalComment(displayComment); 
    };

    // funzione per salvare lo stato di completamento e il voto
    const handleSaveCompletion = async () => {
        setMessage(null);
        setErrorMessage(null);

        if (!gioco) {
            setErrorMessage("Errore: Dati del gioco non disponibili.");
            return;
        }

        // Valida il voto
        const rating = parseFloat(tempRating);
        if (isNaN(rating) || rating < 0 || rating > 10) {
            setErrorMessage("Il voto deve essere un numero tra 0 e 10.");
            return;
        }

        try {
            const updatedGioco = {
                ...gioco,
                completato: true, // Marca come completato
                votoPersonale: rating, // Inserisce il voto
                inListaDesideri: false // Rimuove dalla lista desideri se completato
            };

            const response = await fetch(`http://localhost:5038/Giochi/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedGioco)
            });

            if (response.ok) {
                setMessage('Stato di completamento e voto salvati con successo!');
                setGioco(updatedGioco); // Aggiorna lo stato del gioco con i nuovi dati
                setShowCompletionForm(false); // Chiude il form
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            } else {
                const errorData = await response.json();
                const msg = errorData.errors ? 
                            Object.values(errorData.errors).flat().join('; ') : 
                            (errorData.title || 'Errore sconosciuto durante il salvataggio.');
                setErrorMessage(`Errore nel salvataggio dello stato di completamento: ${msg}`);
                console.error("Dettagli errore backend:", errorData);
            }
        } catch (err) {
            console.error("Errore di rete o server durante il salvataggio del completamento:", err);
            setErrorMessage('Impossibile connettersi al server per salvare lo stato di completamento.');
        }
    };

    // Renderizza lo stato di caricamento
    if (loading) {
        return <h2 className="loading-message">Caricamento dettagli gioco...</h2>;
    }

    // Renderizza lo stato di errore
    if (error) {
        return (
            <div className="error-container">
                <h2>Errore:</h2>
                <p>{error}</p>
                <p>Assicurati che il backend sia in esecuzione su <span className="text-link">http://localhost:5038</span>.</p>
                <button onClick={() => navigate('/giochi')} className="back-button">Torna alla lista</button>
            </div>
        );
    }

    // Se il gioco non è stato trovato
    if (!gioco) {
        return (
            <div className="no-game-found-container">
                <h2>Gioco non trovato!</h2>
                <p>L'ID fornito non corrisponde a nessun gioco nella tua collezione.</p>
                <button onClick={() => navigate('/giochi')} className="back-button">Torna alla lista</button>
            </div>
        );
    }

    // Renderizza i dettagli del gioco
    return (
        <div className="gioco-dettaglio-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Torna Indietro
            </button>

            <h1 className="gioco-title">{gioco.nome}</h1>

            <div className="gioco-main-info">
                <img 
                    src={gioco.urlImmagine} 
                    alt={`Copertina di ${gioco.nome}`} 
                    className="gioco-image"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/300x400/374151/d1d5db?text=No+Image'; 
                    }} 
                />
                <div className="gioco-details">
                    <p className="gioco-meta"><strong>Data di Pubblicazione:</strong> {new Date(gioco.dataPubblicazione).toLocaleDateString('it-IT')}</p>
                    <p className="gioco-meta"><strong>Genere:</strong> {gioco.genere}</p>
                    <p className="gioco-meta"><strong>Piattaforma:</strong> {gioco.piattaforma}</p>
                    
                    {/* Sezione Stato e Voto Personale */}
                    <div className="gioco-status-section">
                        <h2 className="section-title">Stato e Voto:</h2>
                        {gioco.completato ? (
                            <div className="status-display">
                                <p className="gioco-meta"><strong>Stato:</strong> <span className="voto-completato">Completato</span></p>
                                {gioco.votoPersonale != null && (
                                    <p className="gioco-meta"><strong>Voto Personale:</strong> <span className="voto-completato">{gioco.votoPersonale}/10</span></p>
                                )}
                                <button onClick={() => setShowCompletionForm(true)} className="edit-status-button">Modifica Stato/Voto</button>
                            </div>
                        ) : gioco.inListaDesideri ? (
                            <div className="status-display">
                                <p className="gioco-meta"><strong>Stato:</strong> <span className="stato-da-giocare">Da giocare</span></p>
                                <button onClick={() => setShowCompletionForm(true)} className="mark-complete-button">Gioco Terminato? Cliccami!</button>
                            </div>
                        ) : ( // Implicito: in corso
                            <div className="status-display">
                                <p className="gioco-meta"><strong>Stato:</strong> <span className="stato-in-corso">In corso</span></p>
                                <button onClick={() => setShowCompletionForm(true)} className="mark-complete-button">Gioco Terminato? Cliccami!</button>
                            </div>
                        )}

                        {/* Form per Completamento e Voto (mostrato condizionalmente) */}
                        {showCompletionForm && (
                            <div className="completion-form">
                                <label htmlFor="personalRating" className="rating-label">Voto Personale (0-10):</label>
                                <input
                                    type="number"
                                    id="personalRating"
                                    className="rating-input"
                                    value={tempRating}
                                    onChange={(e) => setTempRating(e.target.value)}
                                    min="0"
                                    max="10"
                                    step="0.5" // Permetti mezzi voti
                                />
                                <div className="form-buttons">
                                    <button onClick={handleSaveCompletion} className="save-completion-button">Salva</button>
                                    <button onClick={() => setShowCompletionForm(false)} className="cancel-button">Annulla</button>
                                </div>
                            </div>
                        )}
                    </div> {/* Fine Sezione Stato e Voto Personale */}


                    <div className="gioco-trama-section">
                        <h2 className="section-title">Trama:</h2>
                        <p className="gioco-trama">{gioco.trama}</p>
                    </div>
                </div>
            </div>

            {/* Sezione Commento Personale (visibile per giochi completati o in corso) */}
            {gioco.completato || !gioco.inListaDesideri ? (
                <div className="gioco-comment-section">
                    <h2 className="section-title">Il Mio Commento Personale:</h2>
                    {message && <div className="success-message">{message}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                    {/* Logica condizionale per visualizzare o modificare il commento */}
                    {isEditingComment ? (
                        <>
                            <textarea
                                className="comment-textarea"
                                value={personalComment}
                                onChange={(e) => setPersonalComment(e.target.value)}
                                placeholder="Scrivi qui il tuo commento personale sul gioco..."
                                rows="6"
                            ></textarea>
                            <button onClick={handleSaveComment} className="save-comment-button">
                                Salva Commento
                            </button>
                        </>
                    ) : (
                        // Mostra il commento come testo normale
                        <div className="comment-display-area">
                            {displayComment ? (
                                <p className="gioco-comment-text">{displayComment}</p>
                            ) : (
                                <p className="gioco-comment-text no-comment-yet">Nessun commento personale aggiunto. Clicca su Modifica per aggiungerne uno.</p>
                            )}
                            <button onClick={handleEditComment} className="edit-comment-button">
                                {displayComment ? 'Modifica Commento' : 'Aggiungi Commento'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="no-comment-message">Il commento personale è disponibile per i giochi "In Corso" o "Completati".</p>
            )}

            <style jsx>{`
                .gioco-dettaglio-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 2rem;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    background-color: #1a202c; /* Sfondo scuro principale */
                    min-height: 100vh;
                    box-sizing: border-box;
                }

                .loading-message, .error-message, .no-game-found-container p {
                    text-align: center;
                    color: #a0aec0;
                    margin-top: 3rem;
                    font-size: 1.2rem;
                }

                .error-container, .no-game-found-container {
                    text-align: center;
                    color: #a0aec0;
                    margin-top: 3rem;
                    padding: 2rem;
                    background-color: #2d3748;
                    border-radius: 0.75rem;
                    max-width: 650px;
                    margin-left: auto;
                    margin-right: auto;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                    border: 1px solid #4a5568;
                }

                .error-container h2, .no-game-found-container h2 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: #f87171;
                }

                .gioco-title {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #ef4444;
                    text-align: center;
                    margin-bottom: 2.5rem;
                    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
                }

                .gioco-main-info {
                    display: flex;
                    flex-wrap: wrap; /* Permette il wrap su schermi piccoli */
                    gap: 2rem;
                    margin-bottom: 3rem;
                    background-color: #1f2937; /* Sfondo per la sezione info */
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                }

                .gioco-image {
                    width: 100%;
                    max-width: 300px; /* Larghezza massima dell'immagine */
                    height: auto;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    flex-shrink: 0; /* Impedisce che l'immagine si rimpicciolisca troppo */
                    object-fit: cover;
                }

                .gioco-details {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem; /* Spazio tra i paragrafi di dettaglio */
                }

                .gioco-meta {
                    font-size: 1.1rem;
                    color: #cbd5e0;
                }

                .gioco-meta strong {
                    color: #e2e8f0;
                }

                .gioco-trama-section {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #4a5568; /* Linea divisoria */
                }

                .gioco-trama {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #a0aec0;
                }

                .section-title {
                    font-size: 1.7rem;
                    font-weight: 700;
                    color: #f87171;
                    margin-bottom: 1rem;
                }

                /* NUOVI STILI PER LA SEZIONE STATO E VOTO */
                .gioco-status-section {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #4a5568;
                }

                .status-display {
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background-color: #2d3748;
                    border-radius: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .mark-complete-button, .edit-status-button {
                    background-color: #4CAF50; /* Verde per completato */
                    color: white;
                    padding: 0.7rem 1.5rem;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    margin-top: 0.5rem;
                }

                .mark-complete-button:hover, .edit-status-button:hover {
                    background-color: #45a049;
                    transform: translateY(-1px);
                }

                .completion-form {
                    margin-top: 1rem;
                    padding: 1rem;
                    background-color: #2d3748;
                    border-radius: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .rating-label {
                    color: #e2e8f0;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .rating-input {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 0.5rem;
                    border: 1px solid #4a5568;
                    background-color: #1a202c;
                    color: #ffffff;
                    font-size: 1rem;
                    outline: none;
                }

                .rating-input:focus {
                    border-color: #a78bfa;
                    box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.4);
                }

                .form-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end; /* Allinea i bottoni a destra */
                    margin-top: 0.5rem;
                }

                .save-completion-button, .cancel-button {
                    padding: 0.7rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .save-completion-button {
                    background-color: #4c7c5c; /* Verde scuro */
                    color: white;
                    border: none;
                }

                .save-completion-button:hover {
                    background-color: #3f604b;
                    transform: translateY(-1px);
                }

                .cancel-button {
                    background-color: #6c757d; /* Grigio */
                    color: white;
                    border: none;
                }

                .cancel-button:hover {
                    background-color: #5a6268;
                    transform: translateY(-1px);
                }

                /* Fine NUOVI STILI PER LA SEZIONE STATO E VOTO */


                .gioco-comment-section {
                    background-color: #1f2937;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                    margin-top: 2rem;
                }

                .comment-textarea {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #4a5568;
                    background-color: #2d3748;
                    color: #ffffff;
                    font-size: 1rem;
                    min-height: 120px;
                    resize: vertical;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .comment-textarea:focus {
                    border-color: #a78bfa;
                    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.4);
                }

                .save-comment-button, .edit-comment-button {
                    display: block;
                    width: auto;
                    margin-top: 1.5rem;
                    padding: 0.8rem 2rem;
                    background: linear-gradient(to right, #60a5fa, #8b5cf6);
                    color: #ffffff;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease-in-out;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                }

                .save-comment-button:hover, .edit-comment-button:hover {
                    background: linear-gradient(to right, #3b82f6, #7c3aed);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
                }

                .save-comment-button:active, .edit-comment-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                .success-message {
                    background-color: #28a745;
                    color: white;
                    padding: 0.8rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-weight: 600;
                }

                .error-message {
                    background-color: #dc3545;
                    color: white;
                    padding: 0.8rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-weight: 600;
                }

                .back-button {
                    background-color: #4a5568;
                    color: white;
                    padding: 0.7rem 1.2rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    border: none;
                    cursor: pointer;
                }

                .back-button:hover {
                    background-color: #6a768f;
                    transform: translateX(-3px);
                }

                .no-comment-message {
                    text-align: center;
                    color: #a0aec0;
                    font-style: italic;
                    margin-top: 2rem;
                    padding: 1rem;
                    background-color: #2d3748;
                    border-radius: 0.5rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .comment-display-area {
                    background-color: #2d3748;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #4a5568;
                    margin-bottom: 1rem;
                }

                .gioco-comment-text {
                    color: #ffffff;
                    font-size: 1rem;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }
                
                .gioco-comment-text.no-comment-yet {
                    font-style: italic;
                    color: #a0aec0;
                }

                /* Colori per gli stati (coerenti con GiochiList) */
                .voto-completato {
                    color: #34d399;
                    font-weight: bold;
                }

                .stato-da-giocare {
                    color: #60a5fa;
                    font-weight: bold;
                }

                .stato-in-corso {
                    color: #fbbf24;
                    font-weight: bold;
                }

                /* Media Queries per la responsività */
                @media (max-width: 768px) {
                    .gioco-dettaglio-container {
                        padding: 1rem;
                    }
                    .gioco-title {
                        font-size: 2.2rem;
                    }
                    .gioco-main-info {
                        flex-direction: column;
                        align-items: center;
                        gap: 1.5rem;
                    }
                    .gioco-image {
                        max-width: 250px;
                    }
                    .gioco-details {
                        text-align: center;
                    }
                    .section-title {
                        font-size: 1.5rem;
                    }
                    .save-comment-button, .edit-comment-button, .mark-complete-button, .edit-status-button,
                    .save-completion-button, .cancel-button, .back-button {
                        width: 100%;
                        margin-left: 0;
                        margin-right: 0;
                    }
                    .form-buttons {
                        justify-content: center; /* Centra i bottoni nel form su mobile */
                    }
                }

                @media (max-width: 480px) {
                    .gioco-title {
                        font-size: 1.8rem;
                        margin-bottom: 1.5rem;
                    }
                    .gioco-image {
                        max-width: 200px;
                    }
                    .gioco-meta {
                        font-size: 1rem;
                    }
                    .gioco-trama {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default GiocoDettaglio;
