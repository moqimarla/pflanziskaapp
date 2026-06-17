import React, { useState, useMemo } from 'react';

const MASCOT_CONFIG = {
  0: { image: '/assets/mascot/mood-0-angry.png', alt: 'Wütend', label: 'Wütend', text: 'Ich verdurste... Bitte gib mir Wasser!' },
  1: { image: '/assets/mascot/mood-1-sad.png', alt: 'Unglücklich', label: 'Unglücklich', text: 'Mir geht es nicht so gut. Meine Blätter hängen.' },
  2: { image: '/assets/mascot/mood-2-disappointed.png', alt: 'Enttäuscht', label: 'Enttäuscht', text: 'Ein kleiner Schluck Wasser wäre jetzt super.' },
  3: { image: '/assets/mascot/mood-3-neutral.png', alt: 'Neutral', label: 'Neutral', text: 'Alles okay soweit! Vergiss mich heute nur nicht.' },
  4: { image: '/assets/mascot/mood-4-happy.png', alt: 'Glücklich', label: 'Glücklich', text: 'Mir geht es blendend! Danke für die tolle Pflege.' },
  5: { image: '/assets/mascot/mood-5-very_happy.png', alt: 'Sehr glücklich', text: 'Woohoo! Ich blühe!' }
};




export default function PlantMascotWidget({ moodScore }) {
  const [isOpen, setIsOpen] = useState(false);

const mascotType =
  localStorage.getItem("mascot") || "pflanziska";

  const currentMascot = useMemo(() => {
    const roundedMood = Math.round(moodScore);
    const safeMood = Math.max(0, Math.min(5, roundedMood));
const mascotType = localStorage.getItem("mascot") || "pflanziska";


return {
...MASCOT_CONFIG[safeMood], 
image: `/assets/mascot/${mascotType}-mood-${safeMood}${
safeMood ===0 
? '-angry'
: safeMood === 1
? '-sad'
: safeMood === 2
? '-disappointed'
: safeMood === 3
? '-neutral'
: safeMood === 4
? '-happy'
: '-very_happy'
}.png`,
};
  }, [moodScore]);

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