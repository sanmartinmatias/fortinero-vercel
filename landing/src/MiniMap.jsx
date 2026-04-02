const MiniMap = ({ players }) => {
  return (
    <div className="relative mx-auto mt-8 group">
      {/* Handheld Device Frame - Scavenged/Industrial Look */}
      <div className="relative w-[320px] h-[320px] bg-slate-800 p-4 rounded-[40px] border-4 border-slate-700 shadow-2xl overflow-hidden">
        
        {/* The Circular Screen */}
        <div className="relative w-full h-full rounded-full bg-[#0a1a0a] border-4 border-emerald-900/50 overflow-hidden inner-shadow-2xl">
          
          {/* 1. Radar Grid Lines (Dragon Ball style) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ 
                 backgroundImage: `
                   linear-gradient(to right, #10b981 1px, transparent 1px),
                   linear-gradient(to bottom, #10b981 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px' 
               }} />

          {/* 2. Concentric Circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1/3 h-1/3 border border-emerald-500/10 rounded-full" />
            <div className="w-2/3 h-2/3 border border-emerald-500/10 rounded-full" />
          </div>

          {/* 3. The Radar Sweep (Pulp Sci-Fi feel) */}
          <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] bg-gradient-to-r from-transparent via-transparent to-emerald-500/10" />

          {/* 4. Player Blips */}
          {Object.entries(players).map(([id, player]) => {
            // Assuming your game world is roughly -100 to 100
            // We map that to 0% - 100%
            const left = ((player.x + 100) / 200) * 100;
            const top = ((player.y + 100) / 200) * 100;

            return (
              <div key={id} 
                className="absolute w-3 h-3 -ml-1.5 -mt-1.5 bg-emerald-400 rounded-full animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  boxShadow: '0 0 15px #34d399, 0 0 5px #fff',
                  transition: 'all 2s linear'
                }}
              >
                {/* ID Tag (Small/Technical) */}
                <span className="absolute top-4 left-0 text-[8px] font-mono text-emerald-500/70 whitespace-nowrap uppercase tracking-tighter">
                  {id.slice(0, 4)}
                </span>
              </div>
            );
          })}

          {/* 5. CRT Glass Glare & Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,118,0.03))] bg-[length:100%_3px,3px_100%]" />
        </div>

        {/* 6. The "Repurposed/Cracked" Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden rounded-[40px]">
           {/* SVG for realistic cracks */}
           <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-400 fill-none opacity-30">
              <path d="M0 20 L30 40 L25 60 M100 10 L70 30 L80 80 M50 0 L55 20" strokeWidth="0.5"/>
           </svg>
        </div>

        {/* Hardware details: Buttons & Branding */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
          <div className="w-8 h-2 bg-slate-900 rounded-full border border-slate-600" />
          <div className="w-8 h-2 bg-slate-900 rounded-full border border-slate-600" />
        </div>
      </div>
      
      {/* Device Label */}
      <p className="mt-4 text-center text-[10px] font-mono text-slate-500 tracking-[0.3em] uppercase">
        Proprietary Frontier Tech // Mod: GAUCHO-V3
      </p>
    </div>
  );
};

export default MiniMap;