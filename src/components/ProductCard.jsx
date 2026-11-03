import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;

  return (
    <article className="product-card">
      <Link to={`/produits/${product.id}`} className="product-card-image-link">
        <img className="product-card-image" src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <small className="product-card-category">{product.category}</small>
      <h3 className="product-card-name">
        <Link to={`/produits/${product.id}`}>{product.name}</Link>
      </h3>
      <p className="price product-card-price">{formatPrice(product.price)}</p>
      <button
        type="button"
        className="product-card-button"
        onClick={() => addToCart(product)}
        disabled={outOfStock}
      >
        {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
      </button>
    </article>
  );
}

export default ProductCard;