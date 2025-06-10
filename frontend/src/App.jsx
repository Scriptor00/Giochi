// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './components/HomePage';
import GiochiList from './components/GiochiList';
import HamburgerMenu from './components/HamburgerMenu';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <nav className="main-nav">
                <div className="nav-links-left">
                    <NavLink to="/" className="nav-link" exact activeClassName="active-nav-link">
                        Home
                    </NavLink>
                    <NavLink to="/giochi" className="nav-link" activeClassName="active-nav-link">
                        Tutti i Giochi 
                    </NavLink>
                    <NavLink to="/giochi-completati" className="nav-link" activeClassName="active-nav-link">
                        Giocati
                    </NavLink>
                    <NavLink to="/giochi-in-corso" className="nav-link" activeClassName="active-nav-link">
                        In Corso
                    </NavLink>
                    <NavLink to="/giochi-da-giocare" className="nav-link" activeClassName="active-nav-link">
                        Lista Desideri
                    </NavLink>
                    <NavLink to="/aggiungi-gioco" className="nav-link add-game-nav-link" activeClassName="active-nav-link">
                        Aggiungi Gioco
                    </NavLink>
                </div>
                {/* Pulsante Hamburger */}
                <button className="hamburger-icon" onClick={toggleMenu}>
                    <i className="fas fa-bars"></i>
                </button>
            </nav>

            <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/giochi" element={<GiochiList />} />
                    <Route path="/giochi-completati" element={<h2>Giochi Completati </h2>} />
                    <Route path="/giochi-in-corso" element={<h2>Giochi In Corso </h2>} />
                    <Route path="/giochi-da-giocare" element={<h2>Lista Desideri </h2>} />
                    <Route path="/aggiungi-gioco" element={<h2>Aggiungi Nuovo Gioco </h2>} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
