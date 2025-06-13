// src/components/GiochiCorso.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./GiochiList.css"; // Assicurati che questo file CSS esista o che gli stili siano in index.css

function GiochiCorso() {
    const [giochiInCorso, setGiochiInCorso] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // useEffect per il fetching dei giochi in corso
    useEffect(() => {
        const fetchGiochiInCorso = async () => {
            try {
                const response = await fetch('http://localhost:5038/Giochi?completato=false&inListaDesideri=false');

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setGiochiInCorso(data);
            } catch (error) {
                console.error("Errore durante il fetch dei giochi in corso:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGiochiInCorso();
    }, []);

    // Visualizzazione dello stato di caricamento
    if (loading) {
        return <h2 style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px' }}>Caricamento giochi in corso...</h2>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px', padding: '0 20px' }}>
                <h2>Errore nel caricamento dei giochi in corso:</h2>
                <p>{error.message}</p>
                <p>Assicurati che il tuo backend sia avviato su http://localhost:5038 e che la configurazione CORS sia corretta.</p>
                <p>Prova a navigare a <a href="http://localhost:5038/Giochi?completato=false" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-link)' }}>http://localhost:5038/Giochi?completato=false</a> nel browser per verificare se l'API risponde.</p>
            </div>
        );
    }

    // Renderizza la collezione di giochi in corso o il messaggio di nessun gioco
    return (
        <div className="giochi-list-container">
            <h1>Giochi Attualmente In Corso</h1>
            {Array.isArray(giochiInCorso) && giochiInCorso.length > 0 ? (
                <div className="giochi-grid">
                    {giochiInCorso.map((gioco) => (
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
                                {gioco.completato === false && gioco.inListaDesideri === false && (
                                    <p className="gioco-card-meta">Stato: In corso</p>
                                )}                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="no-games-message">Nessun gioco attualmente in corso.</p>
            )}
        </div>
    );
}

export default GiochiCorso;
