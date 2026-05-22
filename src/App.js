
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


//alle Seiten und Menüleiste verknüpfen
import Home from "./pages/Home";
import Pflanzen from "./pages/Pflanzen";
import Einstellungen from "./pages/Einstellungen";
import Tagebuch from "./pages/Tagebuch";
import Navigationsleiste from "./Komponents/Navigationsleiste";


//Routing fuer die Navigationsleiste 
function App() {
  return (
    <Router>
      <div>
        <Navigationsleiste />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pflanzen" element={<Pflanzen />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="/tagebuch" element={<Tagebuch />} />
        </Routes>
        <Navigationsleiste />
      </div>
    </Router>
  );
}

export default App;
