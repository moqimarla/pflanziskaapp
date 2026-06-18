import React from 'react'; // useState und useEffect werden hier nicht mehr benötigt!
// NEU: Das Benachrichtigungs-System importieren
import { useNotifications } from '../context/NotificationContext';

//Marla: füge hier sachen ein, damit die Benutzer namentlich begrüßt werden
import {useState, useEffect} from 'react';

// Wir importieren ein schönes Icon für die Benachrichtigungen
import { FaBell, FaBellSlash } from 'react-icons/fa';

function Einstellungen() {
  // NEU: Zustand und Setter direkt aus der globalen Zentrale holen
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();

const [name, setName] = useState("");

const [mascot, setMascot] = useState("pflanziska");

//////////////////////
//Marla: hier ist das für die Namen & Florian/Pflanziska auswahl 

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) setName(saved);
    const savedMascot = localStorage.getItem("mascot");
    if (savedMascot) setMascot(savedMascot);
  }, []);

  function handleSaveName(e) {
    const value = e.target.value;
    setName(value);
    localStorage.setItem("username", value);
  }

function handleMascotChange(e) {

  const value = e.target.value;

  setMascot(value);

  localStorage.setItem("mascot", value);
  window.dispatchEvent(new Event("mascotChange")); // Informiere alle Komponenten über die Änderung

}

  /////////////////////

  // Funktion zum Umschalten nutzt jetzt die globale Funktion
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Einstellungen
      </h1>

      {/* Benutzername */}
      <div style={{ 
       display: 'flex', 
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>

        <h3 style={{ marginTop: 0 }}>Dein Name</h3>

        <input
        value = {name}
        onChange={handleSaveName}
        placeholder="Pflanziska"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8",
          border: "1px solid #ccc",
          boxSizing: "border-box",          
        }}
        />
      </div>


<div
  style={{
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  }}
>


 {/* Pflanziska/Florian wählen */}
  
<div
  style={{
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  }}
>
  <h3 style={{ marginTop: 0 }}>Maskottchen</h3>

  <div
    style={{
      display: "flex",
      gap: "20px",
      justifyContent: "center"
    }}
  >
    {/* Pflanziska */}
    <div
      onClick={() => {
        setMascot("pflanziska");
        localStorage.setItem("mascot", "pflanziska");
        window.dispatchEvent(new Event("mascotChange"));
      }}
      style={{
        cursor: "pointer",
        textAlign: "center"
      }}
    >
      <img
        src="/assets/mascot/pflanziska/mood-4-happy.png"
        alt="Pflanziska"
        style={{
          width: "100px",
          filter:
            mascot === "pflanziska"
              ? "none"
              : "grayscale(100%)",
          transition: "0.2s"
        }}
      />
      <p style = {{margin:0}}>Pflanziska</p>
    </div>

    {/* Florian */}
    <div
      onClick={() => {
        setMascot("florian");
        localStorage.setItem("mascot", "florian");
        window.dispatchEvent(new Event("mascotChange"));
      }}
      style={{
        cursor: "pointer",
        textAlign: "center"
      }}
    >
      <img
        src="/assets/mascot/florian/mood-4-happy.png"
        alt="Florian"
        style={{
          width: "100px",
          filter:
            mascot === "florian"
              ? "none"
              : "grayscale(100%)",
          transition: "0.2s"
        }}
      />
      <p style = {{margin:0}}>Florian</p>
    </div>
  </div>
</div>

  
</div>



      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '15px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Dynamisches Icon je nach Zustand */}
          {notificationsEnabled ? (
            <FaBell style={{ color: '#4CAF50', fontSize: '20px' }} />
          ) : (
            <FaBellSlash style={{ color: '#f44336', fontSize: '20px' }} />
          )}
          <div>
            <h3 style={{ margin: 0, fontWeight: '600' }}>Erinnerungen</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Gieß- und Dünge-Benachrichtigungen erhalten
            </p>
          </div>
        </div>

        {/* Der Schalter (Toggle Button) */}
        <button 
          onClick={toggleNotifications}
          style={{
            width: '50px',
            height: '26px',
            borderRadius: '50px',
            backgroundColor: notificationsEnabled ? '#4CAF50' : '#ccc',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 0.2s',
            padding: 0
          }}
        >
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: 'white',
            position: 'absolute',
            top: '2px',
            left: notificationsEnabled ? '26px' : '2px',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }} />
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
        Status: {notificationsEnabled ? 'Aktiviert' : 'Deaktiviert'}
      </div>
    </div>
  );
}

export default Einstellungen;