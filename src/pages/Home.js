import { useState, useEffect } from "react";
  import PlantMascotWidget from "../Komponents/PlantMascotWidget";


export default function Home() {
  const [pflanzen, setPflanzen] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("pflanzen");
    if (saved) setPflanzen(JSON.parse(saved));
  }, []);

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

  function getStatus(pflanze) {
    const interval = getGiessIntervall(pflanze.wasser);

    if (!pflanze.letztesGiessen) {
      return { text: "heute", icon: "💧" };
    }

    const last = new Date(pflanze.letztesGiessen);
    const now = new Date();

    const tageSeit = Math.floor(
      (now - last) / (1000 * 60 * 60 * 24)
    );

    const tageBis = interval - tageSeit;

    if (tageBis <= 0) return { text: "heute", icon: "🔴" };
    if (tageBis === 1) return { text: "morgen", icon: "🟡" };

    return { text: `in ${tageBis} Tagen`, icon: "🟢" };
  }

  function needsWater(pflanze) {
    if (!pflanze.letztesGiessen) return true;

    const interval = getGiessIntervall(pflanze.wasser);

    const last = new Date(pflanze.letztesGiessen);
    const now = new Date();

    const diffDays =
      (now - last) / (1000 * 60 * 60 * 24);

    return diffDays >= interval;
  }

  const needsWaterCount = pflanzen.filter(needsWater).length;

  function getAppStatus() {
    if (pflanzen.length === 0) {
      return { text: "Start", icon: "🌱" };
    }

    if (needsWaterCount === 0) {
      return { text: "Alles gut", icon: "🌿" };
    }

    if (needsWaterCount <= 2) {
      return { text: "Okay", icon: "⚠️" };
    }

    return { text: "Aktion nötig", icon: "🔴" };
  }

  const appStatus = getAppStatus();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4FAF4",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Pflanziska</h1>

        <div
          style={{
            background: "white",
            padding: "6px 10px",
            borderRadius: 20,
            fontSize: 14,
          }}
        >
          {appStatus.icon} {appStatus.text}
        </div>
      </div>

      {/* SUB HEADER */}
      <div>
        <p style={{ marginTop: 4, color: "#003300" }}>
          Deine Pflanzenübersicht
        </p>
      </div>

      {/* LIST */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 16,
        }}
      >
        <h3>Meine Pflanzen</h3>

        {pflanzen.map((pflanze) => {
          const status = getStatus(pflanze);

          return (
            <div
              key={pflanze.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <span>
                {status.icon} {pflanze.name}
              </span>
              <span>{status.text}</span>
            </div>
          );
        })}
      </div>

      {/* TODO SECTION */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 16,
        }}
      >
        <h3>Heute gießen</h3>

        {needsWaterCount === 0 && (
          <p style={{ color: "gray" }}>Alles gut gegossen 🌱</p>
        )}

        {pflanzen.filter(needsWater).map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{p.name}</strong>

            <button
              onClick={() => {
                const updated = pflanzen.map((x) =>
                  x.id === p.id
                    ? {
                        ...x,
                        letztesGiessen: new Date().toISOString(),
                      }
                    : x
                );

                setPflanzen(updated);
                localStorage.setItem(
                  "pflanzen",
                  JSON.stringify(updated)
                );
              }}
            >
              gegossen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  <PlantMascotWidget moodScore={3} />
}