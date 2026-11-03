import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div>
            <h3>TechStore</h3>
            <p>Ordinateurs, composants et électronique au meilleur prix.</p>
          </div>
          <div>
            <h3>Boutique</h3>
            <Link to="/produits">Tous les produits</Link>
            <Link to="/produits?category=PC%20portables">PC portables</Link>
            <Link to="/produits?category=Composants">Composants</Link>
          </div>
          <div>
            <h3>Mon compte</h3>
            <Link to="/connexion">Connexion</Link>
            <Link to="/panier">Mon panier</Link>
          </div>
          <div>
            <h3>Aide</h3>
            <Link to="/">Livraison</Link>
            <Link to="/">Retours</Link>
            <Link to="/">Contact</Link>
          </div>
        </div>
        <p className="footer-copy">© 2026 TechStore. Projet étudiant.</p>
      </div>
    </footer>
  );
}

export default Footer;