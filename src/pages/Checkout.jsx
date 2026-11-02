import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import "./Checkout.css";

function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();

  // Formulaire contrôlé : chaque champ est lié à un état
  const [name, setName] = useState(user ? user.name : "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("livraison");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation simple côté navigateur
    if (!name.trim() || !phone.trim() || !address.trim()) {
      return setError("Veuillez remplir tous les champs.");
    }
    if (!/^[0-9+\s]{8,15}$/.test(phone.trim())) {
      return setError("Numéro de téléphone invalide.");
    }

    setLoading(true);
    try {
      const data = await createOrder({
        customer: { name, phone, address },
        paymentMethod: payment,
        items: cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      setOrder(data.order);
      clearCart();
    } catch (err) {
      setError(err.message);   // par exemple : stock insuffisant
    } finally {
      setLoading(false);
    }
  }

  // 1. Commande confirmée
  if (order) {
    return (
      <main className="container checkout-success" role="status">
        <h1>Merci, votre commande a bien été enregistrée</h1>
        <p>Numéro de commande : {order.id}</p>
        <p>Total : {formatPrice(order.total)}</p>
        <Link to="/produits" className="btn">Continuer mes achats</Link>
      </main>
    );
  }

  // 2. Panier vide
  if (cartItems.length === 0) {
    return (
      <main className="container state">
        <h1>Votre panier est vide</h1>
        <Link to="/produits" className="btn">Voir les produits</Link>
      </main>
    );
  }

  // 3. Formulaire
  return (
    <main className="container">
      <p className="crumb">Accueil / Panier / Commande</p>
      <h1 className="checkout-title">Finaliser ma commande</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Mes coordonnées</legend>
            <div className="field">
              <label htmlFor="co-name">Nom complet</label>
              <input id="co-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="co-phone">Téléphone</label>
              <input id="co-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="co-address">Adresse de livraison</label>
              <input id="co-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Mode de paiement</legend>
            {[
              ["livraison", "Paiement à la livraison"],
              ["mobile_money", "Mobile Money"],
              ["carte", "Carte bancaire"],
            ].map(([value, label]) => (
              <label key={value} className="checkout-radio">
                <input type="radio" name="payment" value={value}
                  checked={payment === value} onChange={() => setPayment(value)} /> {label}
              </label>
            ))}
          </fieldset>

          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn checkout-submit" disabled={loading}>
            {loading ? "Envoi..." : "Confirmer la commande"}
          </button>
        </form>

        <aside className="checkout-summary" aria-label="Votre commande">
          <h2>Votre commande</h2>
          {cartItems.map((i) => (
            <div key={i.id}><span>{i.name} x{i.quantity}</span><span>{formatPrice(i.price * i.quantity)}</span></div>
          ))}
          <div className="checkout-total"><span>Total</span><span>{formatPrice(total)}</span></div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
