import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { isMobile } from "react-device-detect";
import MiniMap from "./MiniMap";


// Separate component for the Mobile Companion View
const MobileCompanion = () => {
  // Store players as an object (as returned by your Redis 'world_map' key)
  const [players, setPlayers] = React.useState({});
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Calling the session endpoint we deployed to Vercel
        const res = await fetch('https://fortinero-vercel.vercel.app/api/session');
        
        if (!res.ok) throw new Error("Server response not OK");

        const data = await res.json();
        
        // Update state with the activePlayers object
        setPlayers(data.activePlayers || {});
        setIsOffline(false);
        console.log("Radar ping: Success", data.activePlayers);
      } catch (err) {
        console.error("Radar offline:", err);
        setIsOffline(true);
      }
    };

    // Initial fetch
    if (!document.hidden) { // Only fetch if the tab is active!
      fetchPlayers();
    }

    // Poll every 5 seconds to keep the "Companion" in sync with the game
    const intervalId = setInterval(fetchPlayers, 5000);

    // Cleanup to prevent the "render bomb" and memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-500 p-6 flex flex-col items-center font-mono">
      {/* Header Info */}
      <header className="mb-6 text-center w-full max-w-sm border-b border-emerald-900/50 pb-4">
        <h1 className="text-2xl font-black tracking-tighter">
          FORTINERO <span className="text-xs bg-emerald-900 px-1 ml-1 text-emerald-200">RECON</span>
        </h1>
        {isOffline ? (
          <p className="text-red-500 text-[10px] mt-2 animate-pulse uppercase tracking-[0.2em]">
            ! Signal Interference !
          </p>
        ) : (
          <p className="text-emerald-700 text-[10px] mt-2 uppercase tracking-[0.2em]">
            Syncing Wastes...
          </p>
        )}
      </header>

      {/* THE COMPONENT INTEGRATION */}
      {/* We pass the players object directly as a prop */}
      <div className={`transition-all duration-700 ${isOffline ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
        <MiniMap players={players} />
      </div>

      {/* Quick Stats Overlay (Optional) */}
      <div className="mt-8 w-full max-w-[320px] bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-md">
        <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-emerald-900/30 pb-2 mb-2">
          <span>Signatures</span>
          <span className="font-bold">{Object.keys(players).length} Detected</span>
        </div>
        
        {/* Small Scrollable list for raw data */}
        <div className="space-y-1 h-24 overflow-y-auto pr-2 text-[9px] opacity-70">
          {Object.entries(players).map(([id, p]) => (
            <div key={id} className="flex justify-between">
              <span>GAUCHO_{id.slice(0, 4)}</span>
              <span>{Math.round(p.x)}X {Math.round(p.y)}Y</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-auto text-[8px] text-emerald-900 uppercase tracking-widest pb-4">
        Handheld Unit: Mod-45 // Sector: Pampa-Cyber
      </footer>
    </div>
  );
};
function App() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "https://uxqqf3lp7rv5jnon.public.blob.vercel-storage.com/UnityBuild/Build/Build.loader.js",
    dataUrl: "https://uxqqf3lp7rv5jnon.public.blob.vercel-storage.com/UnityBuild/Build/UnityBuild.data",
    frameworkUrl: "https://uxqqf3lp7rv5jnon.public.blob.vercel-storage.com/UnityBuild/Build/UnityBuild.framework.js",
    codeUrl: "https://uxqqf3lp7rv5jnon.public.blob.vercel-storage.com/UnityBuild/Build/UnityBuild.wasm",
  });

  const loadingPercentage = Math.round(loadingProgression * 100);

  // 1. Check for mobile first
  if (isMobile) {
    return <MobileCompanion />;
  }

  // 2. Return Desktop WebGL View
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-900">
      <h1 className="text-4xl font-black text-indigo-500 mb-4 tracking-tighter">
        FORTINERO
      </h1>

      <div className="relative w-[960px] h-[600px] bg-black rounded-lg overflow-hidden shadow-2xl">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white z-10">
            <p className="mb-2">Loading Fortinero... {loadingPercentage}%</p>
            <div className="w-64 h-2 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300" 
                style={{ width: `${loadingPercentage}%` }}
              />
            </div>
          </div>
        )}

        <Unity 
          unityProvider={unityProvider} 
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      
      <h1 className="text-indigo-400 text-xl mt-6 opacity-50">
        WEBGL EDITION
      </h1>
    </div>
  );
}

export default App;