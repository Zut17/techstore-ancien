import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/productService";
import "./Products.css";

const PAGE_SIZE = 9;

function Products() {
  // Recherche et catégories : elles vivent dans l'URL (/produits?search=...&category=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const selected = category ? category.split(",") : [];

  // Les autres filtres vivent dans l'état du composant
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(800000);
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger la liste des catégories une seule fois
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Recharger les produits à chaque changement de filtre
  useEffect(() => {
    setLoading(true);
    setError("");
    getProducts({ search, category, sort, maxPrice, inStock })
      .then((data) => {
        setProducts(data);
        setPage(1); // on revient à la première page
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, category, sort, maxPrice, inStock]);

  // Cocher ou décocher une catégorie : on met à jour l'URL
  function toggleCategory(name) {
    const next = selected.includes(name)
      ? selected.filter((c) => c !== name)
      : [...selected, name];
    const params = new URLSearchParams(searchParams);
    if (next.length) params.set("category", next.join(","));
    else params.delete("category");
    setSearchParams(params);
  }

  // Pagination côté frontend : on découpe le tableau
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="container">
      <p className="crumb">Accueil / Produits</p>
      <h1 className="products-title">Tous les produits</h1>

      <div className="products-layout">
        <aside className="products-filters" aria-label="Filtres">
          <h2>Catégories</h2>
          {categories.map((c) => (
            <label key={c}>
              <input type="checkbox" checked={selected.includes(c)} onChange={() => toggleCategory(c)} /> {c}
            </label>
          ))}

          <h2>Prix maximum</h2>
          <input type="range" min="0" max="800000" step="10000" value={maxPrice}
            aria-label="Prix maximum" onChange={(e) => setMaxPrice(Number(e.target.value))} />
          <small>Jusqu'à {maxPrice.toLocaleString("fr-FR")} FCFA</small>

          <h2>Disponibilité</h2>
          <label>
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> En stock
          </label>
        </aside>

        <section aria-label="Liste des produits">
          <div className="products-toolbar">
            <span>{products.length} produit(s)</span>
            <label>
              Trier par{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Pertinence</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </label>
          </div>

          {loading && <p className="state">Chargement...</p>}
          {error && <p className="state form-error">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="state">Aucun produit trouvé.</p>
          )}

          <div className="products-grid">
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {totalPages > 1 && (
            <nav className="products-pagination" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} type="button" className={page === i + 1 ? "active" : ""}
                  onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;