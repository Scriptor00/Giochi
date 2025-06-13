// src/components/ListaDesideri.jsx
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function ListaDesideri() {
    const [listaDesideri, setListaDesideri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListaDesideri = async () => {
            try {
               
                const response = await fetch('http://localhost:5038/Giochi?inListaDesideri=true'); 

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
               
                setListaDesideri(data);
            } catch (error) {
                console.error("Errore durante il fetch della lista dei desideri:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchListaDesideri();
    }, []);

    if (loading) {
        return <h2 style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px' }}>Caricamento lista desideri...</h2>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px', padding: '0 20px' }}>
                <h2>Errore nel caricamento della lista desideri:</h2>
                <p>{error.message}</p>
                <p>Assicurati che il tuo backend sia avviato su http://localhost:5038 e che la configurazione CORS sia corretta.</p>
                <p>Prova a navigare a <a href="http://localhost:5038/Giochi?inListaDesideri=true" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-link)' }}>http://localhost:5038/Giochi?inListaDesideri=true</a> nel browser per verificare se l'API risponde.</p>
            </div>
        );
    }

    return (
        <div className="giochi-list-container">
            <h1>Lista dei Desideri</h1>
            {Array.isArray(listaDesideri) && listaDesideri.length > 0 ? (
                <div className="giochi-grid">
                    {listaDesideri.map((gioco) => (
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
                                {gioco.genere && <p className="gioco-card-genre">{gioco.genere}</p>}
                                {gioco.piattaforma && <p className="gioco-card-platform">{gioco.piattaforma}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>La tua lista dei desideri è vuota.</p>
            )}
        </div>
    );
}

export default ListaDesideri;
