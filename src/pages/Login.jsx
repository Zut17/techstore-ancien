import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/authService";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Appelée par les deux formulaires après un succès
  function onSuccess({ user, token }) {
    login(user, token);   // enregistre l'utilisateur et le token (AuthContext)
    navigate("/");        // retour à l'accueil
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    try {
      onSuccess(await loginUser(loginForm));
    } catch (err) {
      setLoginError(err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegisterError("");
    try {
      onSuccess(await registerUser(registerForm));
    } catch (err) {
      setRegisterError(err.message);
    }
  }

  return (
    <main className="container">
      <p className="crumb">Accueil / Connexion</p>

      <div className="login-grid">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Connexion</h2>
          <p>Heureux de vous revoir.</p>
          <div className="field">
            <label htmlFor="li-email">Adresse e-mail</label>
            <input id="li-email" type="email" value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="li-pass">Mot de passe</label>
            <input id="li-pass" type="password" value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          </div>
          {loginError && <p className="form-error" role="alert">{loginError}</p>}
          <button type="submit" className="btn">Se connecter</button>
        </form>

        <form className="login-form" onSubmit={handleRegister}>
          <h2>Créer un compte</h2>
          <p>Suivez vos commandes en un clic.</p>
          <div className="field">
            <label htmlFor="re-name">Nom complet</label>
            <input id="re-name" type="text" value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="re-email">Adresse e-mail</label>
            <input id="re-email" type="email" value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="re-pass">Mot de passe (6 caractères minimum)</label>
            <input id="re-pass" type="password" value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
          </div>
          {registerError && <p className="form-error" role="alert">{registerError}</p>}
          <button type="submit" className="btn btn-dark">Créer mon compte</button>
        </form>
      </div>
    </main>
  );
}

export default Login;
