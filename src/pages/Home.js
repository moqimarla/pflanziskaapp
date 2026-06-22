import { useState, useEffect } from "react";
import PlantMascotWidget from "../Komponents/PlantMascotWidget";
import { useNotifications } from "../context/NotificationContext";



export default function Home() {
  const [pflanzen, setPflanzen] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [username, setUsername] = useState("");
  const {addNotification} = useNotifications();



  //Florian /Pflanziska wechseln 
  const [mascotType, setMascotType] = useState(
  localStorage.getItem("mascot") || "pflanziska"
);

useEffect(() => {
  const handler = () => {
    setMascotType(localStorage.getItem("mascot") || "pflanziska");
  };
  window.addEventListener("mascotChange", handler);
  return () => window.removeEventListener("mascotChange", handler);
}, []);





  useEffect(() => {
    const savedPlants = localStorage.getItem("pflanzen");
    const savedTodos = localStorage.getItem("completedTodos");
    const savedUsername = localStorage.getItem("username");

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedPlants) {
      setPflanzen(JSON.parse(savedPlants));
    }

    if (savedTodos) {
      setCompletedTodos(JSON.parse(savedTodos));
    }
  }, []);


  //Benachrichtigungen für offenen To-Dos
useEffect(() => {
  if (pflanzen.length === 0) return;

  const today = new Date().toDateString();
  const last = localStorage.getItem("todoNotificationDate");

  if (last === today) return;

  const todos = pflanzen.map((pflanze) => ({
    id: pflanze.id,
    text: `${pflanze.name} gießen`,
    pflanze,
    needsWater: needsWater(pflanze),
  }));

  const offeneTodos = todos.filter(
    (t) => !completedTodos.includes(t.id)
  );

  addNotification(
    "Heutige To-Dos 🌱",
    `Du hast noch ${offeneTodos.length} Aufgaben zu erledigen.`,
    "info"
  );

  localStorage.setItem("todoNotificationDate", today);
}, [pflanzen, completedTodos]);



  //hier wird eingestelt, was dsie Angaben aus der API bedueten
  function getGiessIntervall(watering) {
    switch (watering) {
      case "Frequent":
        return 2;

      case "Average":
        return 7;

      case "Minimum":
        return 14;

      default:
        return 7;
    }
  }


  //hier wird eingestellt, wann die Pflanze Wasser braucht
  function needsWater(pflanze) {
    if (!pflanze.letztesGiessen) return true;

    const interval = getGiessIntervall(pflanze.wasser);

    const last = new Date(pflanze.letztesGiessen);
    const now = new Date();

    const diffDays =
      (now - last) / (1000 * 60 * 60 * 24);

    return diffDays >= interval;
  }

  //hier werden die To-Dos erstelt, sind zwei Listen, einmal to-do und einmal gießstatus
const todos = pflanzen.map((pflanze) => ({
  id: pflanze.id,
  text: `${pflanze.name} gießen`,
  pflanze,
  needsWater: needsWater(pflanze),
}));

  const erledigt = todos.filter((t) =>
    completedTodos.includes(t.id)
  ).length;

  const gesamt = todos.length;

  const progress =
    gesamt === 0 ? 1 : erledigt / gesamt;

  const progressPercent = progress * 100;

  //Progress wird in Stimmunt umgewandelt
  function getMoodScore() {
    if (progress === 1) return 5;
    if (progress >= 0.7) return 4;
    if (progress >= 0.4) return 3;
    if (progress >= 0.2) return 2;
    if (progress > 0) return 1;

    return 0;
  }



//neue Logikfunktion, ToDos können jetzt abgehakt und resettet werden, Pflanziskas Emotionen verändern sich auch mit
  const moodScore = getMoodScore();

  function completeTodo(todo) {
    
    const isDone = completedTodos.includes(todo.id);

    if (isDone) {
  const updateCompleted = completedTodos.filter (
(id) => id !== todo.id
);

setCompletedTodos(updateCompleted);

localStorage.setItem(
"completedTodos",
JSON.stringify(updateCompleted)
);


const updatedPlants = pflanzen.map((p) =>
  p.id === todo.id
    ? { ...p, letztesGiessen: null }
    : p
);

setPflanzen (updatedPlants);
localStorage.setItem(
"pflanzen", 
JSON.stringify(updatedPlants)
);
return;
}

const updateCompleted = [

    ...completedTodos,

    todo.id,

  ];

  setCompletedTodos(updateCompleted);

  localStorage.setItem(

    "completedTodos",

    JSON.stringify(updateCompleted)

  );

  const updatedPlants = pflanzen.map((p) =>

    p.id === todo.id

      ? {

          ...p,

          letztesGiessen: new Date().toISOString(),

        }

      : p

  );

  setPflanzen(updatedPlants);

  localStorage.setItem(

    "pflanzen",

    JSON.stringify(updatedPlants)

  );

  const neueErledigt = erledigt + 1;

  if (neueErledigt === gesamt) {

    updateStreak();

  }

}



//Streak update Funktion
 
  function updateStreak() {
    const today = new Date().toDateString();

    const data =
      JSON.parse(
        localStorage.getItem("streakData")
      ) || {
        streak: 0,
        lastCompletedDay: null,
      };

    if (data.lastCompletedDay === today) {
      return;
    }

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      data.lastCompletedDay ===
      yesterday.toDateString()
    ) {
      data.streak += 1;
    } else {
      data.streak = 1;
    }

    data.lastCompletedDay = today;

    localStorage.setItem(
      "streakData",
      JSON.stringify(data)
    );
  }

  const streakData =
    JSON.parse(
      localStorage.getItem("streakData")
    ) || {
      streak: 0,
    };

  const weekDays = [
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
    "So",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4FAF4",
        padding: 20,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#194D1B",
        }}
      >
         Hallo{username ? `, ${username}` : ""}!     
         </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <img
  src={`/assets/mascot/${mascotType}/mood-${Math.round(moodScore)}${
    moodScore === 0 ? "-angry"
    : moodScore === 1 ? "-sad"
    : moodScore === 2 ? "-disappointed"
    : moodScore === 3 ? "-neutral"
    : moodScore === 4 ? "-happy"
    : "-very_happy"
  }.png`}
          alt=""
          style={{
            width: "50%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          textAlign: "right",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {streakData.streak} 🌱
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3>Gieß-Streak</h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 15,
          }}
        >
          {weekDays.map((day, index) => (
            <div
              key={day}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background:
                    index <
                    Math.min(
                      streakData.streak,
                      7
                    )
                      ? "#8CB300"
                      : "#DDDDDD",
                  marginBottom: 5,
                }}
              />
              <small>{day}</small>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <h3>Heutige To-Dos</h3>

          <strong>
            {erledigt}/{gesamt}
          </strong>
        </div>

        <div
          style={{
            height: 10,
            background: "#E5E5E5",
            borderRadius: 99,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "#8CB300",
              borderRadius: 99,
            }}
          />
        </div>

        {todos.length === 0 && (
          <p>Keine Aufgaben heute 🌱</p>
        )}

  {todos.map((todo) => {
  const isDone = completedTodos.includes(todo.id);

  return (
    <div
      key={todo.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 12px",
        marginBottom: 10,
        borderRadius: 14,
        borderBottom: "1px solid #eee",
        background: isDone ? "#F2F2F2" : "#FAFAFA",
        opacity: isDone ? 0.6 : 1,
      }}
    >
     
<div
  onClick={() => completeTodo(todo)}
  style={{
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "2px solid #8CB300",
    background: isDone ? "#8CB300" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  }}
>
  {isDone && (
    <span style={{ color: "white", fontSize: 14 }}>✓</span>
  )}
</div>

      <span
        style={{
          flex:1,
          fontSize: 16,
          fontWeight: 500,
          color: isDone ? "#888" : "#1A2B1A",
          textDecoration: isDone ? "line-through" : "none",
        }}
      >
        {todo.text}
      </span>
    </div>
  );
})}
      </div>
    </div>
  );
}