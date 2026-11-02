import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import "./CartItem.css";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <article className="cart-item">
      <img className="cart-item-image" src={item.image} alt={item.name} />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <small>{formatPrice(item.price)} l'unité</small>
      </div>

      <div className="cart-item-quantity">
        <button type="button" aria-label="Moins" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button type="button" aria-label="Plus" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>

      <p className="price cart-item-subtotal">{formatPrice(item.price * item.quantity)}</p>

      <button type="button" className="btn-link cart-item-remove" onClick={() => removeFromCart(item.id)}>
        Supprimer
      </button>
    </article>
  );
}

export default CartItem;