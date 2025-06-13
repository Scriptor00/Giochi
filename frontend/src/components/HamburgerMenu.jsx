import { NavLink } from 'react-router-dom'; 

function HamburgerMenu({ isOpen, toggleMenu }) {
    return (
        <>
            {/* Overlay: appare e oscura il resto della pagina quando il menu è aperto */}
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}

            {/* Il menu laterale vero e proprio. La classe 'open' lo fa scorrere in vista */}
            <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
                <nav className="hamburger-nav">
                    {/* Bottoncino per chiudere il menu, posizionato in alto a destra */}
                    <button onClick={toggleMenu} className="close-menu-button">
                        <i className="fas fa-times"></i> {/* Icona "X" di Font Awesome */}
                    </button>

                    {/* Link alle diverse categorie del diario di giochi */}
                    <NavLink to="/giochi" className="hamburger-link" onClick={toggleMenu} exact activeClassName="active-link">
                        <i className="fas fa-list-alt"></i> Giochi Completati
                    </NavLink>
                    {/* <NavLink to="/giochi-completati" className="hamburger-link" onClick={toggleMenu} activeClassName="active-link">
                        <i className="fas fa-check-circle"></i> Giocati
                    </NavLink> */}
                    <NavLink to="/giochi-in-corso" className="hamburger-link" onClick={toggleMenu} activeClassName="active-link">
                        <i className="fas fa-play-circle"></i> In Corso
                    </NavLink>
                    <NavLink to="/giochi-da-giocare" className="hamburger-link" onClick={toggleMenu} activeClassName="active-link">
                        <i className="fas fa-plus-circle"></i> Lista Desideri
                    </NavLink>
                    <NavLink to="/aggiungi-gioco" className="hamburger-link add-game-link" onClick={toggleMenu} activeClassName="active-link">
                        <i className="fas fa-gamepad"></i> Aggiungi un Nuovo Gioco
                    </NavLink>
                </nav>
            </div>
        </>
    );
}

export default HamburgerMenu;
