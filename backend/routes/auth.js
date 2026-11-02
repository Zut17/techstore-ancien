import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readData, writeData } from "../utils/db.js";
import { JWT_SECRET } from "../middleware/auth.js";

const router = Router();

// Crée un token valable 7 jours
function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
}

// On n'envoie JAMAIS le mot de passe au navigateur
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  const users = readData("users");
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: "Cet e-mail est déjà utilisé" });
  }

  // On stocke le mot de passe haché, jamais en clair
  const user = { id: Date.now(), name, email, password: await bcrypt.hash(password, 10) };
  users.push(user);
  writeData("users", users);

  res.status(201).json({ user: publicUser(user), token: makeToken(user) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = readData("users").find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  // Même message dans les deux cas : on ne révèle pas si l'e-mail existe
  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  res.json({ user: publicUser(user), token: makeToken(user) });
});

export default router;
