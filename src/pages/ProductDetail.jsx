import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getProductById, getRelatedProducts } from "../services/productService";
import { formatPrice } from "../utils/formatPrice";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();            // l'id lu dans l'URL (c'est un texte)
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setQuantity(1);
    getProductById(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    getRelatedProducts(id).then(setRelated).catch(() => setRelated([]));
  }, [id]);

  if (loading) return <p className="state">Chargement...</p>;

  if (notFound) {
    return (
      <main className="container state">
        <h1>Produit introuvable</h1>
        <Link to="/produits" className="btn">Retour aux produits</Link>
      </main>
    );
  }

  // addToCart ajoute 1 article : on l'appelle autant de fois que la quantité choisie
  function handleAdd() {
    for (let i = 0; i < quantity; i++) addToCart(product);
  }

  return (
    <main className="container">
      <p className="crumb">Accueil / {product.category} / {product.name}</p>

      <div className="product-detail">
        <img className="product-detail-image" src={product.image} alt={product.name} />

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-category">{product.category}</p>
          <p className="price product-detail-price">{formatPrice(product.price)}</p>
          <p className={product.stock > 0 ? "product-detail-stock" : "form-error"}>
            {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
          </p>
          <p>{product.description}</p>

          <div className="product-detail-actions">
            <div className="product-detail-qty">
              <button type="button" aria-label="Moins" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" aria-label="Plus" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
            <button type="button" className="btn" onClick={handleAdd} disabled={product.stock === 0}>
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="product-detail-related">
          <h2 className="section-title">Produits similaires</h2>
          <div className="product-detail-related-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductDetail;