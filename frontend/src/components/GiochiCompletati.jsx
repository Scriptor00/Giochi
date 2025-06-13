// src/components/GiochiCompletati.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function GiochiCompletati() {
    const [giochiCompletati, setGiochiCompletati] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
 // useEffect per il fetching dei giochi completati
    useEffect(() => {
        const fetchGiochiCompletati = async () => {
            try {
                const response = await fetch('http://localhost:5038/Giochi?completato=true');

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setGiochiCompletati(data);
            } catch (error) {
                console.error("Errore durante il fetch dei giochi completati:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGiochiCompletati();
    }, []); // L'array vuoto assicura che useEffect venga eseguito solo al mount del componente

    // Visualizzazione dello stato di caricamento
    if (loading) {
        return <h2 style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px' }}>Caricamento giochi completati...</h2>;
    }

    // Visualizzazione dello stato di errore
    if (error) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px', padding: '0 20px' }}>
                <h2>Errore nel caricamento dei giochi completati:</h2>
                <p>{error.message}</p>
                <p>Assicurati che il tuo backend sia avviato su http://localhost:5038 e che la configurazione CORS sia corretta.</p>
                <p>Prova a navigare a <a href="http://localhost:5038/Giochi?completato=true" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-link)' }}>http://localhost:5038/Giochi?completato=true</a> nel browser per verificare se l'API risponde.</p>
            </div>
        );
    }

    // Renderizza la collezione di giochi completati o il messaggio di nessun gioco
    return (
        <div className="giochi-list-container">
            <h1>Giochi Completati</h1>
            {Array.isArray(giochiCompletati) && giochiCompletati.length > 0 ? (
                <div className="giochi-grid">
                    {giochiCompletati.map((gioco) => (
                        <Link to={`/giochi/${gioco.id}`} key={gioco.id} className="gioco-card-link">
                            <div className="gioco-card">
                                <img 
                                    src={gioco.urlImmagine} 
                                    alt={`Copertina di ${gioco.nome}`}
                                    className="gioco-card-image"
                                    onError={(e) => { 
                                        e.target.onerror = null; // Impedisce loop infiniti
                                        e.target.src = 'https://via.placeholder.com/150x200?text=No+Image'; // Immagine di fallback
                                    }} 
                                />
                                <h3 className="gioco-card-title">{gioco.nome}</h3>
                                <p className="gioco-card-genre">{gioco.genere}</p>
                                <p className="gioco-card-platform">{gioco.piattaforma}</p>
                                {gioco.votoPersonale != null && <p className="gioco-card-rating">Voto: {gioco.votoPersonale}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <h2 style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>Nessun gioco completato trovato.</h2>
            )}
        </div>
    );
}

export default GiochiCompletati;
