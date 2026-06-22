//hier ist die Navigationsleiste, die isdt untem im Browser fenster und funktioniert schon.
//Text muss durch icons ersetzt werden

import { useLocation, Link } from "react-router-dom";
import {FaHome, FaLeaf, FaBook, FaCog} from "react-icons/fa";

export default function Navigationsleiste() {
  const location = useLocation();
  const iconSize = window.innerWidth < 400 ? 20 : 30; // Dynamische groesse

  //Navigationslogik , also einfach nur Links, die da hinfuehren mit Titel
  return (

    
    <div style={styles.nav}>
      <Link style={styles.item(location.pathname === "/")} to="/">
        <FaHome size={iconSize} />
      </Link>

      <Link style={styles.item(location.pathname === "/pflanzen")} to="/pflanzen">
        <FaLeaf size={iconSize} />
      </Link>

      <Link style={styles.item(location.pathname === "/tagebuch")} to="/tagebuch">
        <FaBook size={iconSize} />
      </Link>
      
      <Link style={styles.item(location.pathname === "/einstellungen")} to="/einstellungen">
        <FaCog size={iconSize}  />
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
  zIndex:1000,
  },

  item: (active) => ({
    textDecoration: "none",
    color: active ? "#8CAA08" : "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex:1,

  }),
};
