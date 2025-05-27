import React, { useState } from 'react';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier à importer.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.result) {
        setPredictions(data.result);
      } else {
        alert("Erreur lors de la prédiction : " + data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Projet de Classification du Diagnostic du Cancer</h2><br />
        <img id='figure' src='./../figure.jpg' alt='Figure' width={"250"} height={"200"} />
        <p>Encadrée par Mme. Samira Lafraxo</p>
      </aside>

      <main className="main-content">
        <form method="get" action="http://localhost:5000/download-form" className="card">
          <h1>Guidelines</h1>
          <p className="subtitle">
            Le médecin doit d'abord <strong>télécharger</strong> le fichier modèle, le <strong>remplir</strong> avec les données cliniques issues d'une biopsie de tumeur mammaire, puis l’<strong>importer</strong> sur cette page. <br />En cliquant sur <strong>"Lancer la prédiction"</strong>, le diagnostic s’affichera en bas : <br /><strong>"M"</strong> pour une tumeur <strong>maligne</strong><br /><strong>"B"</strong> pour une tumeur <strong>bénigne</strong>.
          </p>
          <br />
          <button className="download-btn" type="submit">
            ⬇️ Télécharger le fichier modèle à remplir
          </button>
        </form>
        <div className="upload-section">
          <label htmlFor="fileUpload" className="upload-label">
            📂 Importer un fichier Excel rempli
            <input type="file" id="fileUpload" accept=".xlsx, .xls" hidden onChange={handleFileChange} />
          </label>
          <button onClick={handleUpload} className="upload-btn">
            🔍 Lancer la prédiction
          </button>
        </div>
      </main>
      <footer className="results-footer">
        {predictions.length > 0 ? (
          <>
            <h2>Résultats de la Prédiction :</h2>
            <ul>
              {predictions.map((pred, index) => (
                <li key={index}>
                  Patient {index + 1} : <strong>{pred}</strong>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Aucun résultat à afficher pour l'instant.</p>
        )}
      </footer>
    </div>
  );
}

export default App;
