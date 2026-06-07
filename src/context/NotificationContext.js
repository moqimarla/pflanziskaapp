import React, { createContext, useState, useEffect, useContext } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('plantNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Hier sammeln wir die aktiven Benachrichtigungen, die auf dem Bildschirm aufploppen
  const [activeNotifications, setActiveNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('plantNotifications', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Die globale Funktion, die von überall aufgerufen werden kann
  const addNotification = (title, message, type = 'info', duration = 4000) => {
    if (!notificationsEnabled) {
      console.log(`🚫 Benachrichtigung blockiert ("${title}"), da deaktiviert.`);
      return;
    }

    const id = Date.now();
    const newNotification = { id, title, message, type };

    setActiveNotifications((prev) => [...prev, newNotification]);

    // Nach Ablauf der Zeit automatisch wieder entfernen
    setTimeout(() => {
      setActiveNotifications((prev) => prev.filter(item => item.id !== id));
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ notificationsEnabled, setNotificationsEnabled, addNotification }}>
      {children}
      
      {/* Das visuelle Container-System, das jetzt unten definiert ist */}
      <NotificationContainer 
        list={activeNotifications} 
        onClose={(id) => setActiveNotifications((prev) => prev.filter(item => item.id !== id))} 
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

// Die visuelle Komponente für die Popups am Bildschirmrand
function NotificationContainer({ list, onClose }) {
  if (list.length === 0) return null;

  // Hilfsfunktion für die Farben je nach Typ
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success': return { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' };
      case 'error': return { bg: '#FFEBEE', border: '#F44336', text: '#C62828' };
      case 'warning': return { bg: '#FFF3E0', border: '#FF9800', text: '#EF6C00' };
      default: return { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '350px',
      width: '100%'
    }}>
      {list.map((notification) => {
        const styles = getTypeStyles(notification.type);
        return (
          <div 
            key={notification.id}
            onClick={() => onClose(notification.id)}
            style={{
              padding: '12px 16px',
              backgroundColor: styles.bg,
              borderLeft: `5px solid ${styles.border}`,
              color: styles.text,
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '2px' }}>
              {notification.title}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              {notification.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}