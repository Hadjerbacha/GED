// src/WorkflowComponent.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdvancedSearch from "./components/AdvancedSearch"; // Ajuste le chemin si nécessaire
import { useNavigate } from "react-router-dom";

const WorkflowComponent = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // État pour les utilisateurs
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Utilisateur sélectionné
  const [workflowStatus, setWorkflowStatus] = useState("pending");
  const navigate = useNavigate();
  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
    }
  };

  // Fonction pour récupérer tous les workflows
  const fetchWorkflows = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/workflows/");
      setWorkflows(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des workflows :", err);
    }
  };

  // Fonction pour soumettre la création d'un workflow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log({
        name: workflowName,
        description: workflowDescription,
        assigned_user: selectedUserId ? parseInt(selectedUserId) : null, // Transforme l'ID en entier
        status: workflowStatus,
      });
  
      const response = await axios.post("http://127.0.0.1:8000/create_workflow/", {
        name: workflowName,
        description: workflowDescription,
        assigned_user: selectedUserId ? parseInt(selectedUserId) : null, // Transforme l'ID en entier
        status: workflowStatus,  // Assurez-vous que status est bien défini
      });
      console.log("Workflow créé", response.data);
      fetchWorkflows(); // Recharge les workflows après la création
      setWorkflowName(""); // Réinitialise les champs du formulaire
      setWorkflowDescription("");
      setSelectedUserId(null); // Réinitialise l'utilisateur sélectionné
      setWorkflowStatus("pending");
    } catch (err) {
      console.error("Erreur lors de la création du workflow :", err);
    }
  };
  

   // Récupérer les utilisateurs et workflows au chargement du composant
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/users/");
        setUsers(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs :", err);
      }
    };

    const fetchWorkflows = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");  // Rediriger vers la page de login si pas connecté
        return;
      }
      try {
        const response = await axios.get("http://127.0.0.1:8000/workflows/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkflows(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des workflows :", err);
      }
    };

    fetchUsers();
    fetchWorkflows();
  }, [navigate]);

  // Fonction pour trouver le nom d'utilisateur basé sur l'ID
  const getAssignedUsername = (userId: number | null) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Non assigné"; // Affiche le nom de l'utilisateur ou "Non assigné" si non trouvé
  };

  // Fonction de recherche filtrée
  // Nouvelle fonction de recherche
const handleSearch = async (query: string) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/workflows/", {
      params: { query }
    });
    setWorkflows(response.data);
  } catch (err) {
    console.error("Erreur lors de la recherche :", err);
  }
};

  


  return (
    <div className="container mt-4">
      <h3>Créer un Workflow</h3>
      <AdvancedSearch onSearch={handleSearch} />
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Nom du workflow"
            className="form-control"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Description du workflow"
            className="form-control"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <select
            className="form-control"
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Choisir un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <select
            className="form-control"
            value={workflowStatus}
            onChange={(e) => setWorkflowStatus(e.target.value)}
            required
          >
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>

      <h4>Liste des Workflows</h4>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Assigné à</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr key={workflow.id}>
              <td>{workflow.id}</td>
              <td>{workflow.name}</td>
              <td>{workflow.description}</td>
              <td>{getAssignedUsername(workflow.assigned_user)}</td> 
              <td>{workflow.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkflowComponent;
