import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddGioco() {
    const [nome, setNome] = useState('');
    const [dataPubblicazione, setDataPubblicazione] = useState('');
    const [urlImmagine, setUrlImmagine] = useState('');
    const [trama, setTrama] = useState('');
    const [genere, setGenere] = useState('');
    const [piattaforma, setPiattaforma] = useState('');
    const [completato, setCompletato] = useState(false);
    const [votoPersonale, setVotoPersonale] = useState(0);
    const [inListaDesideri, setInListaDesideri] = useState(false); 

    const [message, setMessage] = useState(null); 
    const [error, setError] = useState(null); 

    const navigate = useNavigate(); 

    // Handler per la checkbox "Completato"
    const handleCompletatoChange = (e) => {
        const isChecked = e.target.checked;
        setCompletato(isChecked);
        // Se il gioco è completato, non può essere nella lista desideri
        if (isChecked) {
            setInListaDesideri(false);
        }
    };

    // Handler per la checkbox "Aggiungi alla Lista Desideri"
    const handleInListaDesideriChange = (e) => {
        const isChecked = e.target.checked;
        setInListaDesideri(isChecked);
        // Se il gioco è nella lista desideri, non è completato e non ha un voto
        if (isChecked) {
            setCompletato(false);
            setVotoPersonale(0); // Resetta il voto se va in wishlist
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setMessage(null); 
        setError(null);

        const payloadToSend = {
            Nome: nome, 
            DataPubblicazione: dataPubblicazione,
            UrlImmagine: urlImmagine,
            Trama: trama,
            Genere: genere,
            Piattaforma: piattaforma,
            Completato: completato,
            // Se il gioco è in lista desideri, il voto personale deve essere 0
            VotoPersonale: inListaDesideri ? 0 : parseFloat(votoPersonale), 
            InListaDesideri: inListaDesideri 
        };

        console.log("Dati inviati:", payloadToSend); 

        try {
            const response = await fetch('http://localhost:5038/Giochi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadToSend) 
            });

            if (response.ok) {
                setMessage('Gioco aggiunto con successo!');
                
                setTimeout(() => {
                    if (inListaDesideri) {
                        navigate('/giochi-da-giocare'); 
                    } else if (completato) {
                        navigate('/giochi-completati'); 
                    } else {
                        navigate('/giochi-in-corso'); 
                    }
                }, 1500);
            } else {
                const errorData = await response.json(); 
                const errorMessage = errorData.errors ?
                    Object.values(errorData.errors).flat().join('; ') :
                    (errorData.title || 'Errore sconosciuto durante l\'aggiunta del gioco.');
                setError(`Errore: ${response.status} - ${errorMessage}`);
                console.error("Dettagli errore backend:", errorData); 
            }
        } catch (err) {
            console.error('Errore di rete o server:', err);
            setError('Impossibile connettersi al server. Assicurati che il backend sia in esecuzione.');
        }
    };

    return (
        <div className="add-gioco-container">
            <h1>Aggiungi un Nuovo Gioco al tuo Diario</h1>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="add-gioco-form">
                <div className="form-group">
                    <label htmlFor="nome">Nome del Gioco:</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dataPubblicazione">Data di Pubblicazione:</label>
                    <input
                        type="date"
                        id="dataPubblicazione"
                        value={dataPubblicazione} 
                        onChange={(e) => setDataPubblicazione(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="urlImmagine">URL Immagine Copertina:</label>
                    <input
                        type="url"
                        id="urlImmagine"
                        value={urlImmagine} 
                        onChange={(e) => setUrlImmagine(e.target.value)}
                        placeholder="Es: https://image.api.playstation.com/..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="trama">Trama:</label>
                    <textarea
                        id="trama"
                        value={trama} 
                        onChange={(e) => setTrama(e.target.value)}
                        rows="5"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="genere">Genere:</label>
                    <input
                        type="text"
                        id="genere"
                        value={genere} 
                        onChange={(e) => setGenere(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="piattaforma">Piattaforma:</label>
                    <input
                        type="text"
                        id="piattaforma"
                        value={piattaforma} 
                        onChange={(e) => setPiattaforma(e.target.value)}
                        placeholder="Es: PS4/PS5/PC"
                    />
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="completato"
                        checked={completato} 
                        onChange={handleCompletatoChange} // Usa il nuovo handler
                    />
                    <label htmlFor="completato">Completato</label>
                </div>

                <div className="form-group">
                    <label htmlFor="votoPersonale">Voto Personale (0-10):</label>
                    <input
                        type="number"
                        id="votoPersonale"
                        value={votoPersonale} 
                        onChange={(e) => setVotoPersonale(e.target.value)}
                        min="0"
                        max="10"
                        step="0.5"
                        disabled={inListaDesideri} // Disabilita se in lista desideri
                    />
                </div>

                {/* *** CAMPO PER LA LISTA DESIDERI *** */}
                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="inListaDesideri"
                        checked={inListaDesideri}
                        onChange={handleInListaDesideriChange} // Usa il nuovo handler
                    />
                    <label htmlFor="inListaDesideri">Aggiungi alla Lista Desideri</label>
                </div>

                <button type="submit" className="button primary-button submit-button">
                    Aggiungi Gioco
                </button>
            </form>
        </div>
    );
}

export default AddGioco;
