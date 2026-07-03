import { useState, useEffect } from "react";
import {FaPen, FaTrash} from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";

export default function Tagebuch() {
  const [tagebuch, setTagebuch] = useState(() => {
    const saved = localStorage.getItem("tagebuch");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tagebuch", JSON.stringify(tagebuch));
  }, [tagebuch]);

  const [open, setOpen] = useState(false);

  const { addNotification } = useNotifications();

  const [form, setForm] = useState({
    datum: "",
    pflanzenId: "",
    eintrag: "",
    bild: "",
  });

  const [pflanzen] = useState(() => {
    const saved = localStorage.getItem("pflanzen");
    return saved ? JSON.parse(saved) : [];
  });

  const [editId, setEditId] = useState(null);

  const [ausgewaehltePflanzeId, setAusgewaehltePflanzeId] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function TagebuchSpeichern() {
    if (!form.datum || !form.pflanzenId || !form.eintrag) return;

    if (editId) {
      setTagebuch(
        tagebuch.map((t) =>
          t.id === editId ? { ...t, ...form } : t
        )
      );
      setEditId(null);

      addNotification("Eintrag aktualisiert 📝", `Die Änderungen an "${form.datum}, ${form.pflanzenId}" wurden gespeichert.`, "info");
    } else {
      setTagebuch([
        ...tagebuch,
        {
          id: Date.now(),
          ...form,
        },
      ]);
      addNotification("Tagebucheintrag hinzugefügt! 🌱", `"${form.datum}, ${form.pflanzenId}" wurde erfolgreich zu deinem Tagebuch hinzugefügt.`, "success");
    }

    setForm({
      datum: "",
      pflanzenId: "",
      eintrag: "",
      bild: "",
    });

    setOpen(false);
  }

  function startEdit(eintrag) {
    setForm({
      datum: eintrag.datum,
      pflanzenId: eintrag.pflanzenId,
      eintrag: eintrag.eintrag,
      bild: eintrag.bild,
    });

    setEditId(eintrag.id);
    setOpen(true);
  }

  function tagebuchLoeschen(id) {
    const bestaetigt = window.confirm("Möchtest du diesen Eintrag wirklich löschen?");
    if (!bestaetigt) return;
    
    // Namen für das Lösch-Popup kurz sichern, bevor der Eintrag aus der Liste fliegt
    const geloeschtereintrag = tagebuch.find(p => p.id === id);
    const pflanze = geloeschtereintrag ? pflanzen.find(p => p.id === Number(geloeschtereintrag.pflanzenId)) : null;
    const nameFürNotification = pflanze ? pflanze.name : "Ein Eintrag";

    setTagebuch(tagebuch.filter((t) => t.id !== id));

    // NEU: Notification für das erfolgreiche Löschen
    addNotification("Eintrag entfernt 🗑️", `"${nameFürNotification}" wurde aus deiner Sammlung gelöscht.`, "error");
}

  function popupSchliessen() {
    setOpen(false);
    setEditId(null);

    setForm({
      datum: "",
      pflanzenId: "",
      eintrag: "",
      bild: "",
    });
  }

  function handleBildChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm(prev => ({
        ...prev,
        bild: reader.result,
      }));
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  }

  const bildButtonStyle = {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #8CB300",
    backgroundColor: "white",
    color: "#4F6F00",
    textAlign: "center",
    cursor: "pointer",
    boxSizing: "border-box",
  };

  const popupButtonStyle = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #8CB300",
    backgroundColor: "white",
    color: "#4F6F00",
    textAlign: "center",
    cursor: "pointer",
    boxSizing: "border-box",
    fontSize: 14,
  };

  function getEintraegeNachPflanze(pflanzenId) {
    return tagebuch
      .filter((eintrag) => Number(eintrag.pflanzenId) === Number(pflanzenId))
      .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  }

  const pflanzenMitEintraegen = pflanzen.filter(
    (pflanze) => getEintraegeNachPflanze(pflanze.id).length > 0
  );

  useEffect(() => {
    if (!ausgewaehltePflanzeId && pflanzenMitEintraegen.length > 0) {
      setAusgewaehltePflanzeId(pflanzenMitEintraegen[0].id);
    }
  }, [pflanzenMitEintraegen, ausgewaehltePflanzeId]);




  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "#F4FAF4",
        minHeight: "100vh",
      }}
    >
      <h1>Mein Pflanzentagebuch</h1>

      {pflanzenMitEintraegen.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          {pflanzenMitEintraegen.map((pflanze) => (
            <button
              key={pflanze.id}
              onClick={() => setAusgewaehltePflanzeId(pflanze.id)}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid #8CB300",
                backgroundColor:
                  ausgewaehltePflanzeId === pflanze.id ? "#8CB300" : "white",
                color:
                  ausgewaehltePflanzeId === pflanze.id ? "white" : "#4F6F00",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: 14,
              }}
            >
              {pflanze.name}
            </button>
          ))}
        </div>
      )}

      {tagebuch.length === 0 && (
        <p>Noch keine Einträge vorhanden.</p>
      )}

      {ausgewaehltePflanzeId ? (
        (() => {
          const pflanze = pflanzen.find(
            (p) => p.id === Number(ausgewaehltePflanzeId)
          );

          const eintraegeDerPflanze = getEintraegeNachPflanze(ausgewaehltePflanzeId);

          if (!pflanze) return null;

          return (
            <div style={{ marginBottom: 30 }}>
              <h2
                style={{
                  marginTop: 25,
                  marginBottom: 12,
                  color: "#4F6F00",
                  borderBottom: "2px solid #DDEECC",
                  paddingBottom: 6,
                }}
              >
                {pflanze.name}
              </h2>

              {eintraegeDerPflanze.map((eintrag) => (
                <div
                  key={eintrag.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 12,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                    border: "1px solid #E8E8E8",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginTop: 0 }}>
                      {eintrag.datum}
                    </h3>

                    <p>
                      {eintrag.eintrag.length > 100
                        ? eintrag.eintrag.substring(0, 100) + "..."
                        : eintrag.eintrag}
                    </p>

                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button
                        onClick={() => startEdit(eintrag)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 6,
                        }}
                      >
                        <FaPen size={24} color="#8CB300" />
                      </button>

                      <button
                        onClick={() => tagebuchLoeschen(eintrag.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 6,
                        }}
                      >
                        <FaTrash size={24} color="#E74C3C" />
                      </button>
                    </div>
                  </div>

                  {eintrag.bild && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={eintrag.bild}
                        alt=""
                        style={{
                          width: "min(240px, 100%)",
                          height: 240,
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()
      ) : (
        <p style={{ color: "#777" }}>
          Wähle oben eine Pflanze aus, um ihre Tagebucheinträge zu sehen.
        </p>
      )}

      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 90,
          right: 20,
          width: 60,
          height: 60,
        backgroundColor: "#8CAA08",
          color: "white",
          borderRadius: "50%",
          border: "none",
          fontSize: 25,
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* Popup für neuen Eintrag oder Bearbeitung eines bestehenden Eintrags */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#F4FAF4",
              padding: 20,
              borderRadius: 14,
              width: "85%",
              maxWidth: 400,
              boxSizing: "border-box",
            }}
          >
            <h2>
              {editId
                ? "Tagebucheintrag bearbeiten"
                : "Neuer Tagebucheintrag"}
            </h2>
            
            <select
              name="pflanzenId"
              value={form.pflanzenId}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 10,
                borderRadius: 10,
                border: "1px solid #E8E8E8",
                boxSizing: "border-box",
            }}
            >
              <option value="">Pflanze auswählen</option>

              {pflanzen.map((pflanze) => (
                <option
                  key={pflanze.id}
                  value={pflanze.id}
                >
                  {pflanze.name}
                </option>
              ))}
            </select>

            <input
              name="datum"
              type="date"
              value={form.datum}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 10,
                borderRadius: 10,
                border: "1px solid #E8E8E8",
                boxSizing: "border-box",
              }}
            />

            <textarea
              name="eintrag"
              placeholder="Wie entwickelt sich deine Pflanze?"
              value={form.eintrag}
              onChange={handleChange}
              rows={5}
              maxLength={500}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 15,
                borderRadius: 10,
                border: "1px solid #E8E8E8",
                boxSizing: "border-box",
                resize: "none",
              }}
            />

            <label style={bildButtonStyle}>
              Bild aus Galerie auswählen
              <input
                type="file"
                accept="image/*"
                onChange={handleBildChange}
                style={{ display: "none" }}
              />
            </label>

            <label style={bildButtonStyle}>
              Foto aufnehmen
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleBildChange}
                style={{ display: "none" }}
              />
            </label>

            {form.bild && (
              <img
                src={form.bild}
                alt="Vorschau"
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 15,
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 5,
              }}
            >
              <button onClick={popupSchliessen}
                      style={popupButtonStyle}>
                Abbrechen
              </button>

              <button 
                onClick={TagebuchSpeichern} 
                style={{
                  ...popupButtonStyle,
                  backgroundColor: "#8CB300",
                  color: "white",
                }}
              >
                {editId ? "Speichern" : "Hinzufügen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}