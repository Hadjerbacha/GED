// src/LoginComponent.tsx
import React, { useState } from "react";
import axios from "axios";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/accounts/login/", {
        email,
        password,
      });
      console.log("Connexion réussie :", response.data);
      // Stocker un token ou rediriger l'utilisateur après la connexion
    } catch (err) {
      setError("Identifiants invalides");
      console.error("Erreur de connexion :", err);
    }
  };

  return (
    <div>
      <h3>Connexion</h3>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginComponent;
