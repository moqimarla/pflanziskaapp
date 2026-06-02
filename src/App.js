import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react"; // 1. useState importieren für die Stimmung

// alle Seiten und Menüleiste verknüpfen
import Home from "./pages/Home";
import Pflanzen from "./pages/Pflanzen";
import Einstellungen from "./pages/Einstellungen";
import Tagebuch from "./pages/Tagebuch";
import Navigationsleiste from "./Komponents/Navigationsleiste";

// 2. Das neue Maskottchen-Widget importieren
// Passe den Pfad an, je nachdem wo genau die Datei liegt (z.B. im Ordner Komponents)
import PlantMascotWidget from "./Komponents/PlantMascotWidget"; 

// Routing fuer die Navigationsleiste 
function App() {
  // 3. Hier definieren wir die Stimmung (0 bis 5). 
  // Später wird dieser Wert dynamisch durch deine Berechnungen verändert.
  const [mascotMood, setMascotMood] = useState(3.5);

  return (
    <Router>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Navigationsleiste />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pflanzen" element={<Pflanzen />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="/tagebuch" element={<Tagebuch />} />
        </Routes>
        
        <Navigationsleiste />

        <PlantMascotWidget moodScore={mascotMood} />
      </div>
    </Router>
  );
}

export default App;