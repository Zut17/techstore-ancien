import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getCategories, getProducts } from "../services/productService";
import "./Home.css";

// Petites icônes (SVG) associées à chaque catégorie
const ICONS = {
  "PC portables": <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></>,
  "PC de bureau": <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></>,
  "Composants": <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" /></>,
  "Écrans": <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6" /></>,
  "Accessoires": <><rect x="5" y="3" width="14" height="18" rx="7" /><path d="M12 3v7" /></>,
  "Électronique": <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
};
const DEFAULT_ICON = <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /></>;

function CategoryIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] || DEFAULT_ICON}
    </svg>
  );
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ limit: 8 })])
      .then(([cats, products]) => {
        setCategories(cats);
        setFeatured(products);
      })
      .catch(() =>
        setError("Impossible de charger les produits pour le moment. Vérifiez que le serveur (backend) est bien lancé.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="container home-hero-inner">
          <div>
            <h1 id="home-title">Bienvenue sur TechStore</h1>
            <p>
              Votre boutique en ligne d'ordinateurs, de composants, d'accessoires
              informatiques et de produits électroniques.
            </p>
            <Link to="/produits" className="btn">Voir les produits</Link>
          </div>
          <div className="home-hero-visual" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="5" width="16" height="11" rx="1" />
              <path d="M2 19h20M10 17.5h4" />
            </svg>
          </div>
        </div>
      </section>

      {(loading || categories.length > 0) && (
      <section className="section container" aria-labelledby="home-cats-title">
        <h2 id="home-cats-title" className="section-title">Nos catégories</h2>
        <div className="home-cats">
          {categories.map((c) => (
            <Link key={c} to={`/produits?category=${encodeURIComponent(c)}`} className="home-cat">
              <span className="home-cat-circle"><CategoryIcon name={c} /></span>
              {c}
            </Link>
          ))}
        </div>
      </section>
      )}

      <section className="section container" aria-labelledby="home-offers-title">
        <h2 id="home-offers-title" className="section-title">Nos offres du moment</h2>
        <div className="home-promos">
          <Link to="/produits?category=PC%20portables" className="home-promo home-promo-1">
            <strong>PC portables</strong><span>Découvrez la sélection</span>
          </Link>
          <Link to="/produits?category=Accessoires" className="home-promo home-promo-2">
            <strong>Setup gaming</strong><span>Claviers, souris, casques</span>
          </Link>
        </div>
      </section>

      <section className="section container" aria-labelledby="home-featured-title">
        <h2 id="home-featured-title" className="section-title">Produits en vedette</h2>
        {loading && <p className="state">Chargement...</p>}
        {error && <p className="state form-error">{error}</p>}
        <div className="home-featured">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="section container home-assure" aria-label="Nos engagements">
        <div><strong>Livraison rapide</strong>Suivi de votre commande</div>
        <div><strong>Paiement sécurisé</strong>Plusieurs moyens de paiement</div>
        <div><strong>Retours faciles</strong>Un souci ? On s'en occupe</div>
        <div><strong>Service client</strong>Une équipe à votre écoute</div>
      </section>
    </main>
  );
}

export default Home;