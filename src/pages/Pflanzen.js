import { useState, useEffect } from "react";
// NEU: Das Benachrichtigungs-System importieren
import { useNotifications } from "../context/NotificationContext";
import { FaPen, FaTrash, FaTint, FaSun } from "react-icons/fa";

// Hier ist die Logik für das Speichern von Pflanzen im local storage
export default function Pflanzen () {
    const [pflanzen, setPflanzen] = useState(() => {
        const saved = localStorage.getItem("pflanzen");
        return saved ? JSON.parse(saved) : [];
    });

    const [tagebuch] = useState(() => {
        const saved = localStorage.getItem("tagebuch");
        return saved ? JSON.parse(saved) : [];
    });

    // NEU: Den Notification-Hook aktivieren
    const { addNotification } = useNotifications();

    useEffect(() => {
        console.log("SAVE", pflanzen);
        localStorage.setItem("pflanzen", JSON.stringify(pflanzen));
    }, [pflanzen]);

    // ------------
    const [open, setOpen] = useState(false);

    // wie eine Pflanzendatei aussehen sollte
    const [form, setForm] = useState({
        name: "",
        typ: "",
        datum: "",
        wasser: "", 
        licht: "",
        bild: "",
    });

    const [editId, setEditId] = useState(null);
    const [fehler, setFehler] = useState("");
    const [suchbegriff, setSuchbegriff] = useState("");
    const [vorschlaege, setVorschlaege] = useState([]);

    useEffect(() => {
        if (suchbegriff.trim().length === 0) {
            setVorschlaege([]);
            return;
        }

        const timeout = setTimeout(() => {
            suchePflanzen(suchbegriff);
        }, 500);
        
        return () => clearTimeout(timeout);
    }, [suchbegriff]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleBildChange = async (e) => {
        const file = e.target.files[0]; // <--- Hier wurde die [0] ergänzt!
        if (!file) return;

        const kleinesBild = await resizeImage(file);

        setForm({
            ...form,
            bild: kleinesBild,
        });
        
        e.target.value = "";
    };


        // NEU: Funktion zur Bildkompression (verhindert vollen Speicher)
    function resizeImage(file, maxWidth = 600, quality = 0.7) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const scale = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const resizedBase64 = canvas.toDataURL("image/jpeg", quality);
                    resolve(resizedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // das ist die API verknüpfung. Wird auf maximal 4 Eintraege reduziert, die angezeigt werden
    async function suchePflanzen(text){
        if(text.trim().length === 0){
            setVorschlaege([]);
            return;
        }

        try {
            const response = await fetch(
                `https://perenual.com/api/v2/species-list?key=${process.env.REACT_APP_PERENUAL_KEY}&q=${text}`
            );
            const data = await response.json();
            setVorschlaege((data.data || []).slice(0, 4));
        } catch (error) {
            console.error("Fehler bei der Pflanzensuche:", error);
        }
    }

    // hier wird das alles von Perenual gefetcht
    async function pflanzeAuswaehlen(pflanze) {
        try {
            const response = await fetch(
        `https://perenual.com/api/v2/species/details/${pflanze.id}?key=${process.env.REACT_APP_PERENUAL_KEY}`
            );
            const data = await response.json();

            setForm(prev => ({
                ...prev,
                typ: pflanze.common_name || (pflanze.scientific_name && pflanze.scientific_name[0]) || "",
                wasser: data.watering || "",
                licht: data.sunlight ? data.sunlight.join(", ") : "",
                bild: data.default_image ? data.default_image.regular_url : ""
            }));
            setVorschlaege([]);
            setSuchbegriff("");
        } catch (error) {
            console.error("Fehler beim Abrufen der Pflanzendetails:", error);
        }
    }

    function WaterIcon({ level }) {
        const count = level === "Minimum" ? 1 : level === "Average" ? 2 : level === "Frequent" ? 3 : 2;
        return (
            <span style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: count }).map((_, i) => (
                    <FaTint key={i} color="#3498DB" size={24} />
                ))}
            </span>
        );
    }

    function SunIcon({ level }) {
        const count = level === "Low" ? 1 : level === "Medium" ? 2 : level === "High" ? 3 : 2;
        return (
            <span style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: count }).map((_, i) => (
                    <FaSun key={i} color="#F1C40F" size={24} />
                ))}
            </span>
        );
    }
    function PflanzeSpeichern() {
        if (!form.name || !form.typ) return;
        const nameExistiert = pflanzen.some(
            p => p.name.toLowerCase() === form.name.toLowerCase() && p.id !== editId
        );

        if (nameExistiert) {
            setFehler("Eine Pflanze mit diesem Namen existiert bereits.");
            return;
        }

        if (editId) {
            setPflanzen(
                pflanzen.map(p => p.id === editId ? { ...p, ...form } : p)
            );
            setEditId(null);
            addNotification("Pflanze aktualisiert 📝", `Die Änderungen an "${form.name}" wurden gespeichert.`, "info");
        } else {
            setPflanzen([
                ...pflanzen,
                { id: Date.now(), ...form }
            ]);
            addNotification("Pflanze eingezogen! 🌱", `"${form.name}" wurde erfolgreich zu deiner Sammlung hinzugefügt.`, "success");
        }

        setForm({ name: "", typ: "", datum: "", wasser: "", licht: "", bild: "" });
        setOpen(false);
    }  

    function startEdit(pflanze) {
        setForm({
            name: pflanze.name,
            typ: pflanze.typ,
            datum: pflanze.datum,
            wasser: pflanze.wasser || "",
            licht: pflanze.licht || "",
            bild: pflanze.bild || ""
        });
        setEditId(pflanze.id);
        setOpen(true);
    }

    function pflanzeLoeschen(id) {
        const bestaetigt = window.confirm("Möchtest du diese Pflanze wirklich löschen?");
        if (!bestaetigt) return;
        
        const geloeschtePflanze = pflanzen.find(p => p.id === id);
        const nameFürNotification = geloeschtePflanze ? geloeschtePflanze.name : "Eine Pflanze";

        setPflanzen(pflanzen.filter(p => p.id !== id));
        addNotification("Pflanze entfernt 🗑️", `"${nameFürNotification}" wurde aus deiner Sammlung gelöscht.`, "error");
    }

    function getAktuellesTagebuchBild(pflanzenId) {
        const eintraegeMitBild = tagebuch
            .filter(
                (eintrag) => Number(eintrag.pflanzenId) === Number(pflanzenId) && eintrag.bild
            )
            .sort((a, b) => new Date(b.datum) - new Date(a.datum));

        return eintraegeMitBild.length > 0 ? eintraegeMitBild[0].bild : null;
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
        fontSize: 14,
        fontWeight: "bold"
    };
    
        return (
        <div style={{ padding: 20, backgroundColor: "#F4FAF4", minHeight: "100vh" }}>      
            <h1>Meine Pflanzen</h1>
            
            {/* Vertikale Liste statt Raster */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}>
                {pflanzen.map((pflanze) => {
                    const titelbild = getAktuellesTagebuchBild(pflanze.id) || pflanze.bild;

                    return (
                        <div key={pflanze.id} 
                            style={{
                                backgroundColor: "white", 
                                borderRadius: 16,
                                padding: 12,
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                                border: "1px solid #E8E8E8",
                                display: "flex", // Nebeneinander-Anordnung (Bild links, Text rechts)
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            {/* Linkes Element: Kompaktes Thumbnail-Bild */}
                            <img
                                src={titelbild || "/assets/mascot/pflanziska/mood-4-happy.png"}
                                alt={pflanze.name}
                                style={{
                                    width: 160, // Feste, kompakte Breite für Thumbnails
                                    height: 160, // Feste Höhe für quadratische Bilder
                                    objectFit: "cover",
                                    borderRadius: 12,
                                    flexShrink: 0 // Verhindert, dass das Bild gequetscht wird
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/mascot/pflanziska/mood-4-happy.png";
                                }}
                            />     
                            {/* Rechtes Element: Name, Details und Steuerung */}
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center", 
                                flex: 1, 
                                minWidth: 0 
                            }}>
                                <div style={{ textAlign: "left" }}>
                                    <h2 style={{ margin: 0, fontSize: 18, color: "#000000", fontWeight: "bold" }}> 
                                        {pflanze.name} 
                                    </h2>
                                    <p style={{ margin: "2px 0", color: "#666", fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}> 
                                        {pflanze.typ}
                                    </p>
                                    <p style={{ margin: 0, color: "#888", fontSize: 15 }}> 
                                        {pflanze.datum}
                                    </p>
                                    
                                    {/* Kleine Status-Icons unter dem Text */}     
                                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                        <WaterIcon level={pflanze.wasser} />
                                        <SunIcon level={pflanze.licht} />
                                    </div>
                                </div>
                               
                                {/* Bearbeitungs-Button ganz rechts */}
                                <button
                                    onClick={() => startEdit(pflanze)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 8,
                                        flexShrink: 0
                                    }}
                                >
                                    <FaPen size={16} color="#8CB300" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Button */}
            <button 
                onClick={() => {
                    setForm({ name: "", typ: "", datum: "", wasser: "", licht: "", bild: "" });
                    setSuchbegriff("");
                    setEditId(null);
                    setOpen(true);
                }}
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
            {/* Pop Up */}
            {open && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "#F4FAF4",
                        padding: 20,
                        borderRadius: 14,
                        width: "85%",
                        maxWidth: 320,
                        boxSizing: "border-box",
                    }}>
                        <h2>{editId ? "Pflanze bearbeiten" : "Neue Pflanze"}</h2>

                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            style={{
                                width: "100%",        
                                padding: "10px 12px", 
                                marginBottom: 10, 
                                borderRadius: 10, 
                                border: "1px solid #E8E8E8",
                                boxSizing: "border-box",
                                outline: "none",
                            }}
                        />                
                        <input
                            name="typ"
                            placeholder="Pflanzentyp suchen"
                            value={form.typ}
                            onChange={(e) => {
                                handleChange(e);
                                setSuchbegriff(e.target.value);
                            }}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                marginBottom: 10,
                                borderRadius: 10,
                                border: "1px solid #E8E8E8",
                                boxSizing: "border-box",
                                outline: "none",
                            }}
                        />

                        {vorschlaege.map((pflanze) => (
                            <div 
                                key={pflanze.id}
                                onClick={() => pflanzeAuswaehlen(pflanze)}
                                style={{
                                    backgroundColor: "white",
                                    padding: 10,
                                    marginBottom: 5,
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    border: "1px solid #E8E8E8",
                                }}
                            >
                                <strong> {pflanze.common_name}</strong>
                                <br/>
                                <small>{pflanze.scientific_name ? pflanze.scientific_name : ""}</small>
                            </div>
                        ))}

                        <input
                            name="datum"
                            type="date"
                            value={form.datum}
                            onChange={handleChange}
                            style={{
                                width: "100%",        
                                padding: "10px 12px", 
                                marginBottom: 15, 
                                borderRadius: 10, 
                                border: "1px solid #E8E8E8",
                                boxSizing: "border-box",
                                outline: "none",
                                backgroundColor: "white",
                                color: "#333"
                            }}
                        />
                        
                        {/* Bild-Upload Bereich */}
                        <label style={bildButtonStyle}>
                            {form.bild ? "📸 Foto ändern" : "📸 Foto hinzufügen"}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleBildChange} 
                                style={{ display: "none" }} 
                            />
                        </label>

                        {/* Bildvorschau im Popup */}
                        {form.bild && (
                            <div style={{ textAlign: "center", marginBottom: 15 }}>
                                <img 
                                    src={form.bild} 
                                    alt="Vorschau" 
                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }} 
                                />
                            </div>
                        )}
                        
                        {fehler && <p style={{ color: "red", fontSize: "12px", margin: "0 0 10px 0" }}>{fehler}</p>}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                            <button onClick={() => { setOpen(false); setFehler(""); }} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ccc", background: "white", cursor: "pointer", fontSize: 14 }}>Abbrechen</button>
                            <button onClick={PflanzeSpeichern} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#8CAA08", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: 14 }}>{editId ? "Speichern" : "Hinzufügen"}</button>
                            
                            {editId && (
                                <button
                                    onClick={() => {
                                        pflanzeLoeschen(editId);
                                        setOpen(false);
                                    }}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 4,
                                    }}
                                >
                                    <FaTrash size={20} color="#E74C3C" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
