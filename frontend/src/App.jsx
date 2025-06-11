// src/App.jsx
import React, { useState } from 'react'; // Importa useState per la gestione dello stato
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; // Importa i componenti di React Router
import HomePage from './components/HomePage'; // Importa il componente HomePage
import GiochiList from './components/GiochiList'; // Importa il componente GiochiList
import HamburgerMenu from './components/HamburgerMenu'; // Importa il nuovo componente HamburgerMenu
import AddGioco from './components/AddGioco'; // Importa il componente AddGioco

function App() {
    // Stato per controllare l'apertura/chiusura dell'hamburger menu
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    // Funzione per invertire lo stato dell'hamburger menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router> {/* Il Router avvolge l'intera applicazione per abilitare la navigazione */}
            <nav className="main-nav"> {/* La barra di navigazione principale */}
                <div className="nav-links-left"> {/* Contenitore per i link di navigazione standard (visibili su desktop) */}
                    {/* Aggiornato NavLink per React Router v6: rimosso 'exact', 'activeClassName' diventa funzione 'className' */}
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => "nav-link" + (isActive ? " active-nav-link" : "")}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/giochi" 
                        className={({ isActive }) => "nav-link" + (isActive ? " active-nav-link" : "")}
                    >
                        Tutti i Giochi
                    </NavLink>
                    <NavLink 
                        to="/giochi-completati" 
                        className={({ isActive }) => "nav-link" + (isActive ? " active-nav-link" : "")}
                    >
                        Giocati
                    </NavLink>
                    <NavLink 
                        to="/giochi-in-corso" 
                        className={({ isActive }) => "nav-link" + (isActive ? " active-nav-link" : "")}
                    >
                        In Corso
                    </NavLink>
                    <NavLink 
                        to="/giochi-da-giocare" 
                        className={({ isActive }) => "nav-link" + (isActive ? " active-nav-link" : "")}
                    >
                        Lista Desideri
                    </NavLink>
                    <NavLink 
                        to="/aggiungi-gioco" 
                        className={({ isActive }) => "nav-link add-game-nav-link" + (isActive ? " active-nav-link" : "")}
                    >
                        Aggiungi Gioco
                    </NavLink>
                </div>
                {/* Pulsante Hamburger (visibile su mobile, nascosto su desktop tramite CSS) */}
                <button className="hamburger-icon" onClick={toggleMenu}>
                    <i className="fas fa-bars"></i> {/* Icona di Font Awesome per l'hamburger */}
                </button>
            </nav>

            {/* Il componente HamburgerMenu, la sua visibilità è controllata dallo stato 'isMenuOpen' */}
            <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} /> 

            <main> {/* Il tag <main> racchiude il contenuto principale della pagina */}
                <Routes> {/* Le Routes definiscono quali componenti vengono renderizzati in base all'URL */}
                    <Route path="/" element={<HomePage />} /> {/* Rotta per la Home Page */}
                    <Route path="/giochi" element={<GiochiList />} /> {/* Rotta per la lista di tutti i giochi */}
                    {/* Collega la rotta /aggiungi-gioco al nuovo componente AddGioco */}
                    <Route path="/aggiungi-gioco" element={<AddGioco />} /> 
                    {/* Placeholder per future rotte di categoria (es. giochi completati, in corso, ecc.) */}
                    <Route path="/giochi-completati" element={<h2>Giochi Completati (WIP)</h2>} />
                    <Route path="/giochi-in-corso" element={<h2>Giochi In Corso (WIP)</h2>} />
                    <Route path="/giochi-da-giocare" element={<h2>Lista Desideri (WIP)</h2>} />
                    <Route path="/giochi/:id" element={<h2>Dettaglio Gioco (WIP)</h2>} /> {/* Rotta per il dettaglio gioco */}
                </Routes>
            </main>
        </Router>
    );
}

export default App;
