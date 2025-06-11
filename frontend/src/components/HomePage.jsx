// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="home-container">
            {/* Sezione di Benvenuto e Introduzione */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Il Mio Diario di Giochi</h1>
                    <p className="hero-subtitle">
                        Benvenuto nel tuo santuario videoludico personale.
                        Qui ogni avventura prende vita e ogni ricordo è custodito.
                    </p>
                    {/* Il link principale per esplorare la collezione */}
                    <Link to="/giochi" className="button primary-button hero-button">
                        Esplora la Collezione
                    </Link>
                    {/* NUOVO PULSANTE: Aggiungi un Nuovo Gioco */}
                    <Link to="/aggiungi-gioco" className="button primary-button hero-button add-game-home-button">
                        Aggiungi un Nuovo Gioco
                    </Link>
                </div>
            </section>

            {/* Il footer */}
            <footer className="home-footer-new">
                <p>&copy; {new Date().getFullYear()} Il Tuo Diario di Giochi. Ogni gioco, una pagina. Ogni sessione, un'emozione.</p>
            </footer>
        </div>
    );
}

export default HomePage;
