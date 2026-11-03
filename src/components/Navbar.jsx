import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/productService";
import "./Navbar.css";

function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");

  // Charge les catégories une seule fois, au premier affichage
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Envoie vers la page produits avec le texte recherché dans l'URL
  function handleSearch(e) {
    e.preventDefault();
    navigate(`/produits?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="navbar">
      <div className="navbar-strip">
        <div className="container">
          <span>Livraison rapide</span>
          <span>Paiement sécurisé</span>
          <span>Retours faciles</span>
        </div>
      </div>

      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="navbar-logo">Tech<span>Store</span></Link>

          <form className="navbar-search" role="search" onSubmit={handleSearch}>
            <label htmlFor="navbar-q" className="sr-only">Rechercher un produit</label>
            <input id="navbar-q" type="search" placeholder="Rechercher un ordinateur, un composant..."
              value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit">Rechercher</button>
          </form>

          <div className="navbar-actions">
            {user ? (
              <>
                <span className="navbar-user">Bonjour, {user.name}</span>
                <button type="button" className="navbar-logout" onClick={logout}>Déconnexion</button>
              </>
            ) : (
              <Link to="/connexion">Connexion</Link>
            )}
            <Link to="/panier">
              Panier <span className="navbar-badge">{itemCount}</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="navbar-menu" aria-label="Catégories">
        <div className="container">
          <Link to="/produits" className="navbar-menu-all">Toutes les catégories</Link>
          {categories.map((c) => (
            <Link key={c} to={`/produits?category=${encodeURIComponent(c)}`}>{c}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;