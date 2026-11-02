import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import "./Cart.css";

function Cart() {
  const { cartItems, clearCart, total, itemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="container cart-empty">
        <h1>Votre panier est vide</h1>
        <p>Découvrez nos produits et ajoutez vos favoris.</p>
        <Link to="/produits" className="btn">Voir les produits</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <p className="crumb">Accueil / Panier</p>
      <h1 className="cart-title">Mon panier</h1>

      <div className="cart-layout">
        <section className="cart-list" aria-label="Articles">
          {cartItems.map((item) => <CartItem key={item.id} item={item} />)}
          <div className="cart-actions">
            <Link to="/produits" className="btn-link">Continuer mes achats</Link>
            <button type="button" className="btn-link" onClick={clearCart}>Vider le panier</button>
          </div>
        </section>

        <aside className="cart-summary" aria-label="Récapitulatif">
          <h2>Récapitulatif</h2>
          <div><span>Articles ({itemCount})</span><span>{formatPrice(total)}</span></div>
          <div><span>Livraison</span><span>À définir</span></div>
          <div className="cart-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <Link to="/commande" className="btn">Passer la commande</Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
