import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useState, useEffect } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';

function Einstellungen() {
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();

  const [name, setName] = useState("");
  const [mascot, setMascot] = useState("pflanziska");
  const [plants, setPlants] = useState([]);

  // Pflanzen für Statistik reinladen 
  useEffect(() => {
    const savedPlants = JSON.parse(localStorage.getItem("pflanzen")) || [];
    setPlants(savedPlants);
  }, []);

  const plantCount = plants.length;

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

  function handleDeleteData() {
    const confirmed = window.confirm(
      "Möchtest du wirklich alle Daten löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden."
    );

    if (!confirmed) return;

    localStorage.clear();
    alert("Alle Daten wurden gelöscht.");
    window.location.reload();
  }

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div 
      style={{ 
        padding: '20px', 
        backgroundColor: '#F4FAF4', 
        minHeight: '100vh',         
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#194D1B' }}>
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
          backgroundColor: 'white', 
          boxShadow: '0px 2px 8px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ marginTop: 0, color: '#4F6F00' }}>Dein Name</h3>
          <input
            value={name}
            onChange={handleSaveName}
            placeholder="Pflanziska"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",          
            }}
          />
        </div>

        {/* Maskottchen wählen */}
        <div style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: '0px 2px 8px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ marginTop: 0, color: '#4F6F00' }}>Maskottchen</h3>
          <div style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center"
          }}>
            {/* Pflanziska */}
            <div
              onClick={() => {
                setMascot("pflanziska");
                localStorage.setItem("mascot", "pflanziska");
                window.dispatchEvent(new Event("mascotChange"));
              }}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <img
                src="/assets/mascot/pflanziska/mood-4-happy.png"
                alt="Pflanziska"
                style={{
                  width: "100px",
                  filter: mascot === "pflanziska" ? "none" : "grayscale(100%)",
                  transition: "0.2s"
                }}
              />
              <p style={{ margin: 0, fontWeight: mascot === "pflanziska" ? "bold" : "normal" }}>Pflanziska</p>
            </div>

            {/* Florian */}
            <div
              onClick={() => {
                setMascot("florian");
                localStorage.setItem("mascot", "florian");
                window.dispatchEvent(new Event("mascotChange"));
              }}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <img
                src="/assets/mascot/florian/mood-4-happy.png"
                alt="Florian"
                style={{
                  width: "100px",
                  filter: mascot === "florian" ? "none" : "grayscale(100%)",
                  transition: "0.2s"
                }}
              />
              <p style={{ margin: 0, fontWeight: mascot === "florian" ? "bold" : "normal" }}>Florian</p>
            </div>
          </div>
        </div>

        {/* Benachrichtigungen */}
        <div style={{ 
          marginTop: '20px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '15px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {notificationsEnabled ? (
              <FaBell style={{ color: '#8CB300', fontSize: '20px' }} />
            ) : (
              <FaBellSlash style={{ color: '#f44336', fontSize: '20px' }} />
            )}
            <div>
              <h3 style={{ margin: 0, fontWeight: '600', color: '#4F6F00' }}>Erinnerungen</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Gieß- und Dünge-Benachrichtigungen erhalten
              </p>
            </div>
          </div>

          <button 
            onClick={toggleNotifications}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '50px',
              backgroundColor: notificationsEnabled ? '#8CB300' : '#ccc',
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

        <div style={{ marginTop: '10px', paddingLeft: '5px', fontSize: '14px', color: '#888' }}>
          Status: {notificationsEnabled ? 'Aktiviert' : 'Deaktiviert'}
        </div>

        {/* Statistik */}
        <div style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: '0px 2px 8px rgba(0,0,0,0.02)'
        }}> 
          <h3 style={{ marginTop: 0, color: '#4F6F00' }}>Statistik</h3>
          <p style={{ margin: 0 }}> Pflanzen insgesamt: <strong>{plantCount}</strong></p>
        </div>

        {/* Daten löschen */}
        <div style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: '0px 2px 8px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ marginTop: 0, color: '#d32f2f' }}>Daten</h3>
          <p style={{ color: "#666", marginBottom: "15px" }}>
            Löscht alle Pflanzen und Einstellungen dauerhaft.
          </p>
          <button
            onClick={handleDeleteData}
            style={{
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Alle Daten löschen
          </button>
        </div>
      </div>
    </div>
  );
}

export default Einstellungen;
