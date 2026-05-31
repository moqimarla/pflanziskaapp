import {useState, useEffect} from "react";

//hier ist die Logik für das Speicher von PFlanzen im local storage
export default function Pflanzen () {
    const [pflanzen, setPflanzen] = useState(() => {
        const saved = localStorage.getItem("pflanzen");
        return saved ? JSON.parse(saved) : [];

 });

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

 /*function PflanzeHinzufuegen() {
    if (!form.name || !form.typ) return;

    setPflanzen([
        ...pflanzen,
 {id: Date.now(),
    ...form,
 },
    ]);
 
    setForm({
        name: "",
        typ: "",
        datum: "",
    });
    setOpen(false);
 }*/

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

        setForm({
            name: pflanze.scientific_name?.[0] || "",
            typ: pflanze.common_name || "",
            datum: "",
            wasser: data.watering || "",
            licht: data.sunlight?.join(", ") || "",
            bild: data.default_image?.regular_url || ""
        });

        setVorschlaege([]);
        setSuchbegriff(pflanze.common_name || "");

    } catch (error) {
        console.error("Fehler beim Abrufen der Pflanzendetails:", error);
    }
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
    } else {
        setPflanzen([
        ...pflanzen,
        { id: Date.now(), ...form }
        ]);
    }

    setForm({ name: "", typ: "", datum: "" });
    setOpen(false);
}  

 function startEdit(pflanze) {
  setForm({
    name: pflanze.name,
    typ: pflanze.typ,
    datum: pflanze.datum,
  });

  setEditId(pflanze.id);
  setOpen(true);
}

console.log(process.env.REACT_APP_PERENUAL_KEY);

 function pflanzeLoeschen(id) {
    const bestaetigt = window.confirm("Möchtest du diese Pflanze wirklich löschen?");
     if (!bestaetigt) return;
  setPflanzen(pflanzen.filter(p => p.id !== id));
}

 //ab hier nur noch styling, keine Funktion perse und: JSX, also Kommentare anders schreiben

    return (
        
        <div style = {{padding:20, backgroundColor: "#F4FAF4", minHeight: "100vh"}}>      {/* hier muss noch iwann der username rein */}  
            <h1>Meine Pflanzen</h1>
            {/*Liste  */}
            {pflanzen.map((pflanze) => (
                <div key={pflanze.id} style={{
                    backgroundColor: "white", 
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 12,
                    boxShadow: "0px 2px8px rgba(0,0,0,0.05)",
                    border: "1px solid #E8E8E8",
                    display: "flex",
                    flexDirection: "space-between",
                    gap: 12,
                  }}>
                    <div style={{flex: 1}}>
                    <h2>{pflanze.name}</h2>
                    <p>Typ: {pflanze.typ}</p>
                    <p>Datum: {pflanze.datum}</p>
                    <p>Wasser: {pflanze.wasser}</p>
                    <p>Licht: {pflanze.licht}</p>
                      <button
                            onClick={() => startEdit(pflanze)}
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
                            onClick={() => pflanzeLoeschen(pflanze.id)}
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
                    
                    



                    {pflanze.bild && (
                    <img 
                         src={pflanze.bild}
                         alt={pflanze.name}
                          style={{ width: "20%", height: "20%", objectFit: "cover", borderRadius: 10, marginTop: 10 }}
                        />
)}
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
    
                     

                   

                    </div>
                </div>
            ))}

       {/* Button */}
       <button 
         onClick={() => setOpen(true)}
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
                    <h2>Neue Pflanze</h2>

                    <input
                    placeholder="Pflanze suchen"
                    value={suchbegriff}
                    onChange={(e) => setSuchbegriff(e.target.value)}
                    style={{
                        width: "100%",        
                        padding: "10px 12px", 
                        marginBottom: 10, 
                        borderRadius:10, 
                        border: "1px solid #E8E8E8",
                        boxSizing: "border-box",
                         outline: "none",}}
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
                    placeholder="Typ"
                    value={form.typ}
                    onChange={handleChange}
                    style={{
                        width: "100%",        
                        padding: "10px 12px", 
                        marginBottom: 10, 
                        borderRadius:10, 
                        border: "1px solid #E8E8E8",
                        boxSizing: "border-box",
                         outline: "none",}}
                    />
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
                         outline: "none",}}
                    />
                    <button onClick={() => setOpen(false)}>Abbrechen</button>
                    <button onClick={PflanzeSpeichern} style={{marginRight: 10}}>Hinzufügen</button>
                </div>
            </div>
        )}
          
        </div>
    );
}