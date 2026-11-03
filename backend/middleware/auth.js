import jwt from "jsonwebtoken";

// Clé secrète pour signer les tokens (projet scolaire : en vrai, elle serait dans un fichier .env)
export const JWT_SECRET = "techstore_secret_scolaire";

// Si un token valide est présent, req.user contient l'utilisateur. Sinon on continue.
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // token invalide ou expiré : on traite la personne comme un invité
    }
  }
  next();
}

// Refuse l'accès si l'utilisateur n'est pas connecté
export function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user) return res.status(401).json({ message: "Connexion requise" });
    next();
  });
}
