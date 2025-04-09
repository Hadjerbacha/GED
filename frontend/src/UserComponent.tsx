// src/UserComponent.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserComponent = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/create_user/", {
        username,
        email,
        password,
      });
      console.log("Utilisateur créé :", response.data);
      setUsername("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur :", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Créer un utilisateur</h3>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Mot de passe"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>

      <h4>Liste des utilisateurs</h4>
      <ul className="list-group">
        {users.map((user) => (
          <li className="list-group-item" key={user.id}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserComponent;
