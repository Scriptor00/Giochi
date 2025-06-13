import { useState, useEffect } from 'react';
import './GiochiList.css'; 
import { Link } from 'react-router-dom';
import './GiochiList.css'; 

function GiochiList() {
    const [giochi, setGiochi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [sortField, setSortField] = useState('Nome');
    const [sortOrder, setSortOrder] = useState('asc');

    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [activeFilterYear, setActiveFilterYear] = useState('');
    const [activeSortField, setActiveSortField] = useState('Nome');
    const [activeSortOrder, setActiveSortOrder] = useState('asc');

    const fetchGiochi = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (activeSearchTerm) queryParams.append('searchTerm', activeSearchTerm);
            if (activeFilterYear) queryParams.append('filterYear', activeFilterYear);
            queryParams.append('sortField', activeSortField);
            queryParams.append('sortOrder', activeSortOrder);

            const url = `http://localhost:5038/giochi?${queryParams.toString()}`;
            const response = await fetch(url);

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

    // useEffect per fetch dati
    useEffect(() => {
        if (
            activeSearchTerm.length >= 3 || 
            activeSearchTerm === '' ||  // permette fetch anche con ricerca vuota (reset)
            activeFilterYear !== '' || 
            activeSortField !== '' || 
            activeSortOrder !== ''
        ) {
            fetchGiochi();
        }
    }, [activeSearchTerm, activeFilterYear, activeSortField, activeSortOrder]);

    // Debounce: aggiorna "activeSearchTerm" solo se dopo 500ms non cambia più
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            // Aggiorna activeSearchTerm solo se ci sono almeno 3 caratteri o campo vuoto
            if (searchTerm.length >= 3 || searchTerm === '') {
                setActiveSearchTerm(searchTerm);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout); // pulisce timeout se cambia input
    }, [searchTerm]);

    // Aggiorno filtro anno immediatamente (senza debounce)
    useEffect(() => {
        setActiveFilterYear(filterYear);
    }, [filterYear]);

    // Aggiorno ordinamenti immediatamente (o puoi mettere debounce anche qui)
    useEffect(() => {
        setActiveSortField(sortField);
    }, [sortField]);

    useEffect(() => {
        setActiveSortOrder(sortOrder);
    }, [sortOrder]);

    // Funzione pulsante Cerca per forzare update attivi
    const handleSearchClick = () => {
        setActiveSearchTerm(searchTerm);
        setActiveFilterYear(filterYear);
        setActiveSortField(sortField);
        setActiveSortOrder(sortOrder);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterYear('');
        setSortField('Nome');
        setSortOrder('asc');
        setActiveSearchTerm('');
        setActiveFilterYear('');
        setActiveSortField('Nome');
        setActiveSortOrder('asc');
        setGiochi([]);
        setError(null);
    };

    return (
        <div className="giochi-list-container">
            <h1>La Mia Collezione di Giochi</h1>

            <div className="filters-sort-section">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Cerca per nome, genere, piattaforma..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                    <input
                        type="number"
                        placeholder="Anno di uscita"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="filter-input"
                        min="1970"
                        max={new Date().getFullYear()}
                    />
                    <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="filter-select">
                        <option value="Nome">Ordina per Nome</option>
                        <option value="DataPubblicazione">Ordina per Data</option>
                        <option value="VotoPersonale">Ordina per Voto</option>
                    </select>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
                        <option value="asc">Crescente</option>
                        <option value="desc">Decrescente</option>
                    </select>
                    <button onClick={handleSearchClick} className="filter-search-button">
                        🔍 Cerca
                    </button>
                    <button onClick={handleResetFilters} className="filter-reset-button">
                        🔄 Reset
                    </button>
                </div>
            </div>

            {loading && (
                <h2 style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px' }}>
                    Caricamento giochi...
                </h2>
            )}

            {error && (
                <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '50px', padding: '0 20px' }}>
                    <h2>Errore nel caricamento dei giochi:</h2>
                    <p>{error.message}</p>
                    <p>Assicurati che il tuo backend sia avviato su http://localhost:5038 e che la configurazione CORS sia corretta.</p>
                    <p>Controlla la console del browser per i dettagli sulla richiesta API fallita.</p>
                </div>
            )}

            {!loading && !error && (
                <>
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
                                        {gioco.completato ? (
                                            gioco.votoPersonale != null && (
                                                <p className="gioco-card-meta">Voto Personale: {gioco.votoPersonale}/10</p>
                                            )
                                        ) : gioco.inListaDesideri ? (
                                            <p className="gioco-card-meta">Stato: Da giocare</p>
                                        ) : (
                                            <p className="gioco-card-meta">Stato: In corso</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="no-games-message">Nessun gioco trovato con i filtri selezionati.</p>
                    )}
                </>
            )}
        </div>
    );
}

export default GiochiList;
