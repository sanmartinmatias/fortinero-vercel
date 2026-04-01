import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { isMobile } from "react-device-detect";
import MiniMap from "./MiniMap";
import { SpeedInsights } from '@vercel/speed-insights/react';


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
    fetchPlayers();

    // Poll every 5 seconds to keep the "Companion" in sync with the game
    const intervalId = setInterval(fetchPlayers, 5000);

    // Cleanup to prevent the "render bomb" and memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-indigo-500 tracking-tighter">
          FORTINERO <span className="text-xs border border-indigo-500 px-1 ml-2">RADAR</span>
        </h1>
        {isOffline && (
          <p className="text-red-500 text-xs mt-2 animate-pulse">CONNECTION LOST</p>
        )}
      </header>

      <div className="w-full max-w-md space-y-4">
        {Object.entries(players).length > 0 ? (
          Object.entries(players).map(([id, player]) => (
            <div key={id} className="p-4 bg-slate-800 border-l-4 border-indigo-500 rounded-r-lg shadow-md">
              <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-300">Player_{id.slice(0, 4)}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                POS: {Math.round(player.x)}, {Math.round(player.y)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 italic mt-10">Searching for frontiersmen...</p>
        )}
      </div>
      <SpeedInsights />
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
      <SpeedInsights />
    </div>
  );
}

export default App;