// src/components/GiochiList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function GiochiList() {
    const [giochi, setGiochi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect per il fetching dei dati dal backend
    useEffect(() => {
        const fetchGiochi = async () => {
            try {
                const response = await fetch('http://localhost:5038/giochi');

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setGiochi(data);
            } catch (error) {
                console.error("Errore durante il fetch dei giochi:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGiochi();
    }, []); // L'array vuoto assicura che useEffect venga eseguito solo al mount del componente

    // Visualizzazione dello stato di caricamento
    if (loading) {
        return <h2 style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px' }}>Caricamento giochi...</h2>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px', padding: '0 20px' }}>
                <h2>Errore nel caricamento dei giochi:</h2>
                <p>{error.message}</p>
                <p>Assicurati che il tuo backend sia avviato su http://localhost:5038 e che la configurazione CORS sia corretta.</p>
                <p>Prova a navigare a <a href="http://localhost:5038/giochi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-link)' }}>http://localhost:5038/giochi</a> nel browser per verificare se l'API risponde.</p>
            </div>
        );
    }

    // Renderizza la collezione di giochi o il messaggio di nessun gioco
    return (
    <div className="giochi-list-container">
        <h1>La Mia Collezione di Giochi</h1> 
        {Array.isArray(giochi) && giochi.length > 0 ? (
            <div className="giochi-grid">
                {giochi.map((gioco) => (
                    <Link to={`/giochi/${gioco.id}`} key={gioco.id} className="gioco-card-link">
                        <div className="gioco-card">
                            <img 
                                src={gioco.urlImmagine} 
                                alt={`Copertina di ${gioco.nome}`}
                                className="gioco-card-image"
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = 'https://via.placeholder.com/150x200?text=No+Image'; 
                                }} 
                            />
                            <h3 className="gioco-card-title">{gioco.nome}</h3>
                            {gioco.genere && <p className="gioco-card-meta">{gioco.genere}</p>} 
                            {gioco.votoPersonale && <p className="gioco-card-meta">Voto Personale: {gioco.votoPersonale}/10</p>} {/* Mostra il voto se esiste */}
                          
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <p className="no-games-message">Ancora nessun gioco registrato nella mia collezione.</p> 
        )}
    </div>
);
}

export default GiochiList;