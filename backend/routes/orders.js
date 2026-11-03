import { Router } from "express";
import { readData, writeData } from "../utils/db.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();
const PAYMENTS = ["livraison", "mobile_money", "carte"];

// POST /api/orders : un invité peut commander, un utilisateur connecté voit sa commande dans son historique
router.post("/", optionalAuth, (req, res) => {
  const { customer, paymentMethod, items } = req.body;

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return res.status(400).json({ message: "Nom, téléphone et adresse sont obligatoires" });
  }
  if (!PAYMENTS.includes(paymentMethod)) {
    return res.status(400).json({ message: "Mode de paiement invalide" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Le panier est vide" });
  }

  const products = readData("products");
  const lines = [];

  for (const item of items) {
    const product = products.find((p) => p.id === Number(item.productId));
    const quantity = Number(item.quantity);

    if (!product) return res.status(404).json({ message: `Produit ${item.productId} introuvable` });
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantité invalide" });
    }
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Stock insuffisant pour ${product.name} (${product.stock} disponibles)` });
    }
    // On copie le nom et le prix du SERVEUR dans la commande
    lines.push({ productId: product.id, name: product.name, price: product.price, quantity });
  }

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    userId: req.user?.id || null,
    customer,
    paymentMethod,
    items: lines,
    total,
  };

  const orders = readData("orders");
  orders.push(order);
  writeData("orders", orders);

  res.status(201).json({ order });
});

// GET /api/orders/mine : les commandes de l'utilisateur connecté
router.get("/mine", requireAuth, (req, res) => {
  res.json(readData("orders").filter((o) => o.userId === req.user.id));
});

export default router;
