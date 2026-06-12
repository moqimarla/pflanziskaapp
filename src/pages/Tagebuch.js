import { useState, useEffect } from "react";

export default function Tagebuch() {
  const [tagebuch, setTagebuch] = useState(() => {
    const saved = localStorage.getItem("tagebuch");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tagebuch", JSON.stringify(tagebuch));
  }, [tagebuch]);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    datum: "",
    pflanzenId: "",
    typ: "",
    eintrag: "",
  });

  const [editId, setEditId] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function TagebuchSpeichern() {
    if (!form.datum || !form.pflanze || !form.eintrag) return;

    if (editId) {
      setTagebuch(
        tagebuch.map((t) =>
          t.id === editId ? { ...t, ...form } : t
        )
      );
      setEditId(null);
    } else {
      setTagebuch([
        ...tagebuch,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setForm({
      datum: "",
      pflanze: "",
      typ: "",
      eintrag: "",
    });

    setOpen(false);
  }

  function startEdit(eintrag) {
    setForm({
      datum: eintrag.datum,
      pflanze: eintrag.pflanze,
      typ: eintrag.typ,
      eintrag: eintrag.eintrag,
    });

    setEditId(eintrag.id);
    setOpen(true);
  }

  function tagebuchLoeschen(id) {
    setTagebuch(tagebuch.filter((t) => t.id !== id));
  }

  function popupSchliessen() {
    setOpen(false);
    setEditId(null);

    setForm({
      datum: "",
      pflanze: "",
      typ: "",
      eintrag: "",
    });
  }

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "#F4FAF4",
        minHeight: "100vh",
      }}
    >
      <h1>Mein Pflanzentagebuch</h1>

      {tagebuch.length === 0 && (
        <p>Noch keine Einträge vorhanden.</p>
      )}

      {tagebuch.map((eintrag) => (
        <div
          key={eintrag.id}
          style={{
            backgroundColor: "white",
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #E8E8E8",
          }}
        >
          <h2>{eintrag.pflanze}</h2>

          <p
            style={{
              color: "#777",
              fontSize: 14,
            }}
          >
            {eintrag.datum}
          </p>

          {eintrag.typ && (
            <p>
              <strong>Typ:</strong> {eintrag.typ}
            </p>
          )}

          <p>{eintrag.eintrag}</p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
            }}
          >
            <button
              onClick={() => startEdit(eintrag)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#FFD966",
                cursor: "pointer",
              }}
            >
              Bearbeiten
            </button>

            <button
              onClick={() => tagebuchLoeschen(eintrag.id)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#FF8A8A",
                cursor: "pointer",
              }}
            >
              Löschen
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 90,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          fontSize: 30,
          cursor: "pointer",
        }}
      >
        +
      </button>

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
            <input
              name="pflanze"
              placeholder="Pflanze"
              value={form.pflanze}
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
            <select
              name="pflanzeId"
              value={form.pflanzeId}
              onChange={handleChange}
            >
              <option value="">Pflanze auswählen</option>

              {tagebuch.map((pflanze) => (
                <option
                  key={pflanze.id}
                  value={pflanze.id}
                >
                  {pflanze.name}
                </option>
              ))}
            </select>

            <input
              name="typ"
              placeholder="Typ"
              value={form.typ}
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button onClick={popupSchliessen}>
                Abbrechen
              </button>

              <button onClick={TagebuchSpeichern}>
                {editId ? "Speichern" : "Hinzufügen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}