// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './components/HomePage';
import GiochiList from './components/GiochiList';
import HamburgerMenu from './components/HamburgerMenu';
import AddGioco from './components/AddGioco';
import GiochiCorso from './components/GiochiCorso'; 
import GiochiCompletati from './components/GiochiCompletati'; 
import ListaDesideri from './components/ListaDesideri';
import GiocoDettaglio from './components/GiocoDettaglio';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <nav className="main-nav">
                <div className="nav-links-left">
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
                    {/* Rotte della barra di navigazione per desktop */}
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
                <button className="hamburger-icon" onClick={toggleMenu}>
                    <i className="fas fa-bars"></i>
                </button>
            </nav>

            <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/giochi" element={<GiochiList />} />
                    <Route path="/aggiungi-gioco" element={<AddGioco />} />
                    
                    {/* Questa è la riga cruciale che renderizza il componente GiochiCorso */}
                    <Route path="/giochi-in-corso" element={<GiochiCorso />} /> 
                    
                    {/* Mantenute le rotte placeholder per gli altri stati */}
                    <Route path="/giochi-completati" element={<GiochiCompletati/>} />
                    <Route path="/giochi-da-giocare" element={<ListaDesideri/>} />
                    <Route path="/giochi/:id" element={<GiocoDettaglio/>} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
