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

    const [message, setMessage] = useState(null); 
    const [error, setError] = useState(null); 

    const navigate = useNavigate(); 

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
            VotoPersonale: parseFloat(votoPersonale) 

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
                    navigate('/giochi');
                }, 1500);
            } else {
                const errorData = await response.json(); // Tenta di leggere la risposta JSON per dettagli
                const errorMessage = errorData.errors ?
                    Object.values(errorData.errors).flat().join('; ') :
                    (errorData.title || 'Errore sconosciuto durante l\'aggiunta del gioco.');
                setError(`Errore: ${response.status} - ${errorMessage}`);
                console.error("Dettagli errore backend:", errorData); // Logga i dettagli completi per debugging
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
                        onChange={(e) => setCompletato(e.target.checked)}
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
                    />
                </div>

                <button type="submit" className="button primary-button submit-button">
                    Aggiungi Gioco
                </button>
            </form>
        </div>
    );
}

export default AddGioco;
