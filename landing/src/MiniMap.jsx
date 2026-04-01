const MiniMap = ({ players }) => {
  return (
    <div className="relative w-[300px] h-[300px] bg-slate-900 border-2 border-indigo-500/50 rounded-lg overflow-hidden mx-auto">
      {/* Background Grid Pattern (Optional Pulp/Sci-Fi aesthetic) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {Object.entries(players).map(([id, pos]) => (
        <div key={id} 
          className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] transition-all duration-[2000ms] linear"
          style={{
            left: `${(pos.x + 100) / 200 * 10}%`,
            top: `${(pos.y + 100) / 200 * 10}%`,
          }}
        />
      ))}
    </div>
  );
};

export default MiniMap;