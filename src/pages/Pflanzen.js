import {useState, useEffect} from "react";
// NEU: Das Benachrichtigungs-System importieren
import { useNotifications } from "../context/NotificationContext";
import {FaPen, FaTrash, FaTint, FaSun} from "react-icons/fa";

//hier ist die Logik für das Speicher von PFlanzen im local storage
export default function Pflanzen () {
    const [pflanzen, setPflanzen] = useState(() => {
        const saved = localStorage.getItem("pflanzen");
        return saved ? JSON.parse(saved) : [];

 });

 // NEU: Den Notification-Hook aktivieren
 const { addNotification } = useNotifications();

 useEffect(() => {
    console.log("SAVE", pflanzen);
  localStorage.setItem("pflanzen", JSON.stringify(pflanzen));
}, [pflanzen]);

//------------

 const [open, setOpen] = useState(false);

 //wie eine Pflanzendatei aussehen sollte
 const [form, setForm] = useState({
    name: "",
    typ: "",
    datum: "",
    wasser: "", 
    licht: "",
 });

 const [editId, setEditId] = useState(null);

 const [fehler, setFehler] = useState("");

 const [suchbegriff, setSuchbegriff] = useState("");
 const [vorschlaege, setVorschlaege] = useState([]);

 useEffect(() => {
    if (suchbegriff.trim().length === 0) {
        setVorschlaege([]);
        return
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



    //das ist dfie API verknüpfung. Wird auf maximal 4 Eintraege reduziert, die angezeigt werden,
    //suche nur alle 500ms, damit wir nicht szu viele Anfragen haben
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

//hier wird das alles von Perenual gefetcht
async function pflanzeAuswaehlen(pflanze) {
    try {
       const response = await fetch(
    `https://perenual.com/api/v2/species/details/${pflanze.id}?key=${process.env.REACT_APP_PERENUAL_KEY}`
);

        const data = await response.json();

    setForm(prev => ({
    ...prev,
    typ: pflanze.common_name ||
         pflanze.scientific_name?.[0] || "",
    wasser: data.watering || "",
    licht: data.sunlight?.join(", ") || "",
    bild: data.default_image?.regular_url || ""
}));

setVorschlaege([]);
setSuchbegriff("");

    } catch (error) {
        console.error("Fehler beim Abrufen der Pflanzendetails:", error);
    }
}

function WaterIcon({ level }) {
    const count = 
     level === "Minimum" ? 1 :
    level === "Average" ? 2 :
    level === "Frequent" ? 3 : 2;

    return (
        <span style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: count }).map((_, i) => (
                <FaTint key={i} color="#3498DB" size = {24} />
            ))}
        </span>
    );
}

function SunIcon({ level }) {
    const count = 
     level === "Low" ? 1 :
    level === "Medium" ? 2 :
    level === "High" ? 3 : 2;

    return (
        <span style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: count }).map((_, i) => (
                <FaSun key={i} color="#F1C40F" size = {24} />
            ))}
        </span>
    );
}
    


 function PflanzeSpeichern() {
    if (!form.name || !form.typ) return;
    const nameExistiert = pflanzen.some(
        p =>
        p.name.toLowerCase() === form.name.toLowerCase() &&
        p.id !== editId
    );

    if (nameExistiert) {
        setFehler("Eine Pflanze mit diesem Namen existiert bereits.");
        return;
    }

    if (editId) {
        setPflanzen(
            pflanzen.map(p =>
            p.id === editId ? { ...p, ...form } : p
            )
        );
        setEditId(null);
        
        // NEU: Notification für das erfolgreiche Bearbeiten
        addNotification("Pflanze aktualisiert 📝", `Die Änderungen an "${form.name}" wurden gespeichert.`, "info");
    } else {
        setPflanzen([
        ...pflanzen,
        { id: Date.now(), ...form }
        ]);

        // NEU: Notification für das erfolgreiche Hinzufügen
        addNotification("Pflanze eingezogen! 🌱", `"${form.name}" wurde erfolgreich zu deiner Sammlung hinzugefügt.`, "success");
    }

    setForm({ name: "", typ: "", datum: "" });
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

console.log(process.env.REACT_APP_PERENUAL_KEY);

 function pflanzeLoeschen(id) {
    const bestaetigt = window.confirm("Möchtest du diese Pflanze wirklich löschen?");
    if (!bestaetigt) return;
    
    // Namen für das Lösch-Popup kurz sichern, bevor die Pflanze aus der Liste fliegt
    const geloeschtePflanze = pflanzen.find(p => p.id === id);
    const nameFürNotification = geloeschtePflanze ? geloeschtePflanze.name : "Eine Pflanze";

    setPflanzen(pflanzen.filter(p => p.id !== id));

    // NEU: Notification für das erfolgreiche Löschen
    addNotification("Pflanze entfernt 🗑️", `"${nameFürNotification}" wurde aus deiner Sammlung gelöscht.`, "error");
}

 //ab hier nur noch styling, keine Funktion perse und: JSX, also Kommentare anders schreiben

    return (
        
        <div style = {{padding:20, backgroundColor: "#F4FAF4", minHeight: "100vh"}}>      {/* hier muss noch iwann der username rein */}  
            <h1>Meine Pflanzen</h1>
            {/*Liste  */}
<div style = {{
display: "grid",
gridTemplateColumns: "repeat(2,1fr)",
gap: 16,}}>
            {pflanzen.map((pflanze) => (
                
                    <div key={pflanze.id} 
                    style={{
                    backgroundColor: "white", 
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 14,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #E8E8E8",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                  }}>


{/*Bild*/}
<img
  src={pflanze.bild || "/assets/mascot/pflanziska/mood-4-happy.png"}
  alt={pflanze.name}
  style={{
    width: "100%",
    height: 160,
    objectFit: "cover",
borderRadius: 14,

  }}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src =  "/assets/mascot/pflanziska/mood-4-happy.png";
  }}
/>     



                    <div style={{padding: 12, textAlign:"center"}}>

                    <h2 style ={{margin: 0, fontSize: 18}}> {pflanze.name} </h2>
                    <p style = {{margin: 3, color: "#555", fontSize: 14}}> {pflanze.typ}</p>
                    <p style = {{margin: 3, color: "#555", fontSize: 14}}> {pflanze.datum}</p>
                    
               {/*kleine Icons für Wasser und Sonne*/}     
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: 10 }}>
                    <WaterIcon level={pflanze.wasser} />
                    <SunIcon level={pflanze.licht} />
                    </div>



                    <div style={{display: "flex", justifyContent: "space-between", marginTop: 10,}}>
                      <button
                            onClick={() => startEdit(pflanze)}
                            style={{
                                background:"Transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: 6,
                            }}
                        >
                            <FaPen size={18} color="#8CB300" />
                        </button>


                         <button
                            onClick={() => pflanzeLoeschen(pflanze.id)}
                            style={{
                               background:"Transparent",
                                border: "none",
                                cursor: "pointer",
                             
                            }}
                        >
                            <FaTrash size={18} color="#E74C3C" />
                        </button>
                        </div>
                      </div>

                </div>
))}
</div>
       {/* Button */}
       <button 
         onClick={() => {
            // Beim Öffnen für eine neue Pflanze das Formular und Suchfeld leeren
            setForm({ name: "", typ: "", datum: "", wasser: "", licht: "", bild: "" });
            setSuchbegriff("");
            setEditId(null);
            setOpen(true);
         }}
         style = {{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 60,
            height: 60,
            fontSize: 30,
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
                right:0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <div style={{
                    backgroundColor: "#F4FAF4",
                    padding: 20,
                    borderRadius: 14,
                    width: "85%",
                    maxWidth: 320,
                    boxSizing: "border-box",
                }}>
                    {/* die Inputs sind eigentlich alle nach dem gleichen Prinzip aufgebaut */}
                    <h2>{editId ? "Pflanze bearbeiten" : "Neue Pflanze"}</h2>

                   
                    <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                

                    style={{width: "100%",        
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
                                <small>{pflanze.scientific_name?.[0]}</small>
                        </div>
                    ))}

                    <input
                    name="datum"
                    type ="date"
                    value = {form.datum}
                    onChange={handleChange}
                    style={{
                        width: "100%",        
                        padding: "10px 12px", 
                        marginBottom: 10, 
                        borderRadius:10, 
                        border: "1px solid #E8E8E8",
                        boxSizing: "border-box",
                         outline: "none",
backgroundColor: "white",
color: "#333,"}}
                    />
                    
                    {fehler && <p style={{color: "red", fontSize: "12px", margin: "0 0 10px 0"}}>{fehler}</p>}

                    <button onClick={() => { setOpen(false); setFehler(""); }}>Abbrechen</button>
                    <button onClick={PflanzeSpeichern} style={{marginRight: 10}}>{editId ? "Speichern" : "Hinzufügen"}</button>
                </div>
            </div>
        )}
          
        </div>
    );
}