import { Router } from "express";
import { readData } from "../utils/db.js";

const router = Router();

// GET /api/products?search=&category=A,B&sort=price_asc&maxPrice=100000&inStock=true&limit=8
router.get("/", (req, res) => {
  const { search, category, sort, maxPrice, inStock, limit } = req.query;
  let list = readData("products");

  // Recherche dans le nom
  if (search) {
    list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  // Une ou plusieurs catégories séparées par des virgules
  if (category) {
    const categories = category.split(",");
    list = list.filter((p) => categories.includes(p.category));
  }

  // Prix maximum (on refuse une valeur qui n'est pas un nombre)
  if (maxPrice) {
    if (Number.isNaN(Number(maxPrice))) {
      return res.status(400).json({ message: "maxPrice doit être un nombre" });
    }
    list = list.filter((p) => p.price <= Number(maxPrice));
  }

  // Seulement les produits en stock
  if (inStock === "true") list = list.filter((p) => p.stock > 0);

  // Tri par prix
  if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

  if (limit) list = list.slice(0, Number(limit));

  res.json(list);
});

// GET /api/products/3/related : produits de la même catégorie, sauf lui-même
router.get("/:id/related", (req, res) => {
  const products = readData("products");
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Produit introuvable" });

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  res.json(related);
});

// GET /api/products/3
router.get("/:id", (req, res) => {
  const product = readData("products").find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Produit introuvable" });
  res.json(product);
});

export default router;
