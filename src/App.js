import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react"; 

// Alle Seiten und Menüleiste verknüpfen
import Home from "./pages/Home";
import Pflanzen from "./pages/Pflanzen";
import Einstellungen from "./pages/Einstellungen";
import Tagebuch from "./pages/Tagebuch";
import Navigationsleiste from "./Komponents/Navigationsleiste";

// Das globale Benachrichtigungs-System importieren
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  // Die Stimmung bleibt zentral in der App.js, damit jede Seite sie später manipulieren kann
  const [mascotMood, setMascotMood] = useState(3.5);

  return (
    <NotificationProvider>
      <Router>
        <div style={{ position: "relative", minHeight: "100vh", paddingBottom: "80px" }}>
          <Navigationsleiste />
          
          <Routes>
            {/* NEU: Wir übergeben moodScore und setMascotMood an die Home-Seite */}
            <Route path="/" element={<Home moodScore={mascotMood} setMascotMood={setMascotMood} />} />
            <Route path="/pflanzen" element={<Pflanzen />} />
            <Route path="/einstellungen" element={<Einstellungen />} />
            <Route path="/tagebuch" element={<Tagebuch />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;