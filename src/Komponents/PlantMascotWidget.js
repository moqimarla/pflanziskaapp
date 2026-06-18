import React, { useState, useMemo, useEffect } from 'react';


const MASCOT_CONFIG = {
  0: {  alt: 'Wütend', label: 'Wütend', text: 'Ich verdurste... Bitte gib mir Wasser!' },
  1: {  alt: 'Unglücklich', label: 'Unglücklich', text: 'Mir geht es nicht so gut. Meine Blätter hängen.' },
  2: {  alt: 'Enttäuscht', label: 'Enttäuscht', text: 'Ein kleiner Schluck Wasser wäre jetzt super.' },
  3: { alt: 'Neutral', label: 'Neutral', text: 'Alles okay soweit! Vergiss mich heute nur nicht.' },
  4: {  alt: 'Glücklich', label: 'Glücklich', text: 'Mir geht es blendend! Danke für die tolle Pflege.' },
  5: { alt: 'Sehr glücklich', text: 'Woohoo! Ich blühe!' }
};



export default function PlantMascotWidget({ moodScore }) {
  const [isOpen, setIsOpen] = useState(false);

const [mascotType, setMascotType] = useState(
  localStorage.getItem("mascot") || "pflanziska"
);

//Übernahmew aus Einstellungen
useEffect(() => {
  const handler = () => {
    setMascotType(localStorage.getItem("mascot") || "pflanziska");
  };

  window.addEventListener("mascotChange", handler);

  return () => window.removeEventListener("mascotChange", handler);
}, []);


  const currentMascot = useMemo(() => {
    const roundedMood = Math.round(moodScore);
    const safeMood = Math.max(0, Math.min(5, roundedMood));



      const suffix =
      safeMood === 0 ? "angry"
      : safeMood === 1 ? "sad"
      : safeMood === 2 ? "disappointed"
      : safeMood === 3 ? "neutral"
      : safeMood === 4 ? "happy"
      : "very_happy";


      return {
        ...MASCOT_CONFIG[safeMood],
         image: `/assets/mascot/${mascotType}/mood-${safeMood}-${suffix}.png`,     
         }; 
    }, [moodScore, mascotType]);

      

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="animate-fade-in mb-3 w-64 bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex flex-col gap-1 relative text-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Status: {currentMascot.label}</span>
            <span className="text-xs text-slate-400">Rating: {moodScore}/5</span>
          </div>
          <p className="text-sm leading-relaxed mt-1">"{currentMascot.text}"</p>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-emerald-100 rotate-45"></div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-emerald-50 hover:bg-emerald-100 p-3 rounded-full shadow-lg border-2 border-emerald-400"
      >
        {moodScore <= 1 && <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25"></span>}
        <img src={currentMascot.image} alt={currentMascot.alt} className="w-16 h-16 object-contain" />
      </button>
    </div>
  );
}