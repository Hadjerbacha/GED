import React, { useState } from 'react';
import './DocumentManagementPage.css';
import logo from './img/logo.jpg';

interface Document {
  name: string;
  date: string;
  url: string;
}

const DocumentManagementPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingDocument, setPendingDocument] = useState<Document | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('Tous les documents');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const pickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const exists = documents.some(doc => doc.name === file.name);
      if (exists) {
        setErrorMessage('Un document avec ce nom existe déjà.');
      } else {
        setPendingDocument({
          name: file.name,
          date: new Date().toISOString().slice(0, 10),
          url: URL.createObjectURL(file)
        });
        setErrorMessage(null);
      }
    }
  };

  const addDocument = () => {
    if (pendingDocument) {
      setDocuments([...documents, pendingDocument]);
      setPendingDocument(null);
    }
  };

  const removeDocument = (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      const newDocuments = [...documents];
      newDocuments.splice(index, 1);
      setDocuments(newDocuments);
    }
  };

  const archiveDocument = (index: number) => {
    if (window.confirm('Voulez-vous archiver ce document ?')) {
      alert(`Document "${documents[index].name}" archivé avec succès !`);
    }
  };

  const modifyDocument = (index: number) => {
    const newName = prompt('Nouveau nom du document:', documents[index].name);
    if (newName) {
      const newDocuments = [...documents];
      newDocuments[index] = { ...newDocuments[index], name: newName };
      setDocuments(newDocuments);
    }
  };

  const consultDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const filterDocuments = () => {
    return documents.filter(doc =>
      (filterType === 'Tous les documents' || doc.name.endsWith(filterType)) &&
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!startDate || new Date(doc.date) >= new Date(startDate)) &&
      (!endDate || new Date(doc.date) <= new Date(endDate))
    );
  };

  const handleDateValidation = () => {
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      setErrorMessage('La date de fin ne peut pas être avant la date de début.');
    } else {
      setErrorMessage(null);
    }
  };

  const filteredDocuments = filterDocuments();

  return (
    <div className="container">
      <nav className="the-navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo de l'application" className="logo" />
        </div>
        <div className="nav-buttons">
          <button className="nav-button">Statistiques</button>
          <button className="nav-button">Workflows</button>
          <button className="nav-button">À propos</button>
        </div>
      </nav>

      <div className="content">
        <nav className="navbar">
          <div className="nav-right">
            <button className="nav">Accueil</button>
            <button className="nav">Déconnexion</button>
          </div>
        </nav>

        <h1>Gestion des Documents</h1>
        
        <div className="controls">
          <input
            type="text"
            placeholder="Rechercher des documents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Tous les documents">Tous les documents</option>
            <option value=".pdf">PDF</option>
            <option value=".docx">Word</option>
            <option value=".jpg">Images</option>
          </select>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => { 
              setStartDate(e.target.value); 
              handleDateValidation(); 
            }} 
          />
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => { 
              setEndDate(e.target.value); 
              handleDateValidation(); 
            }} 
          />
          <button className="button">Rechercher</button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
        
        <div className="document-upload">
          <input 
            type="text" 
            placeholder="Nom du document"
            value={pendingDocument?.name || ''}
            onChange={(e) => {
              if (pendingDocument) {
                setPendingDocument({ ...pendingDocument, name: e.target.value });
              } else {
                setPendingDocument({
                  name: e.target.value,
                  date: new Date().toISOString().slice(0, 10),
                  url: ''
                });
              }
            }} 
          />
          <input 
            type="file" 
            onChange={pickFile} 
            accept=".pdf,.docx,.jpg,.jpeg,.png"
          />
          <button 
            className="button" 
            onClick={addDocument}
            disabled={!pendingDocument?.url}
          >
            Ajouter
          </button>
        </div>

        <table className="document-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={`${doc.name}-${index}`}>
                <td>{doc.name}</td>
                <td>{doc.date}</td>
                <td className="actions">
                  <button className="button" onClick={() => consultDocument(doc.url)}>
                    Consulter
                  </button>
                  <button className="button" onClick={() => modifyDocument(index)}>
                    Modifier
                  </button>
                  <button className="button" onClick={() => removeDocument(index)}>
                    Supprimer
                  </button>
                  <button className="button" onClick={() => archiveDocument(index)}>
                    Archiver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentManagementPage;