//hier ist die Navigationsleiste, die isdt untem im Browser fenster und funktioniert schon.
//Text muss durch icons ersetzt werden

import { useLocation, Link } from "react-router-dom";

export default function Navigationsleiste() {
  const location = useLocation();

  //Navigationslogik , also einfach nur Links, die da hinfuehren mit Titel
  return (
    <div style={styles.nav}>
      <Link style={styles.item(location.pathname === "/")} to="/">
        Home
      </Link>

      <Link style={styles.item(location.pathname === "/pflanzen")} to="/pflanzen">
        Pflanzen
      </Link>

      <Link style={styles.item(location.pathname === "/einstellungen")} to="/einstellungen">
        Einstellungen
      </Link>

      <Link style={styles.item(location.pathname === "/tagebuch")} to="/tagebuch">
        Tagebuch
      </Link>
    </div>
  );
}

//styling und position dafür 
const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },

  item: (active) => ({
    textDecoration: "none",
    color: active ? "#8CAA08" : "#333",
    fontWeight: "600",
    fontSize: "18px",
  }),
};

