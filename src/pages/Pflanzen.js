import {useState, useEffect} from "react";

//hier ist die Logik für das Speicher von PFlanzen im local storage
export default function Pflanzen () {
    const [pflanzen, setPflanzen] = useState(() => {
        const saved = localStorage.getItem("pflanzen");
        return saved ? JSON.parse(saved) : [];

 });

 useEffect(() => {
  localStorage.setItem("pflanzen", JSON.stringify(pflanzen));
}, [pflanzen]);


//------------


 const [open, setOpen] = useState(false);


 //wie eine Pflanzendatei aussehen sollte
 const [form, setForm] = useState({
    name: "",
    typ: "",
    datum: "",
 });


 function handleChange(e) {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
 }

 function PflanzeHinzufuegen() {
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
                    flexDirection: "column",
                    gap: 4,
                  }}>
                    <h2>{pflanze.name}</h2>
                    <p>Typ: {pflanze.typ}</p>
                    <p>Datum: {pflanze.datum}</p>
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
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                

                    style={{width: "100%",        
                        padding: "10px 12px", 
                        marginBottom: 10, 
                        borderRadius:10, 
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
                    <button onClick={PflanzeHinzufuegen} style={{marginRight: 10}}>Hinzufügen</button>
                </div>
            </div>
        )}
          
        </div>
    );
}