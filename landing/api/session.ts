import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redis = Redis.fromEnv();
const SESSION_TIMEOUT_MS = 60000; // 1 minute (adjust as needed for "sparse" updates)

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const WORLD_KEY = 'world_map';

  // 1. Handle GET (Browser Test + Neighborhood Sync)
  if (request.method === 'GET') {
    const allPlayers = await redis.hgetall(WORLD_KEY);
    
    if (!allPlayers) {
      return response.status(200).json({ status: "Online", activePlayers: {} });
    }

    const now = Date.now();
      const activePlayers: Record<string, any> = {};
    const expiredPlayers: string[] = [];

    // Cleanup Logic: Iterate and filter
    for (const [id, data] of Object.entries(allPlayers)) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        
        if (now - parsed.lastSeen < SESSION_TIMEOUT_MS) {
          activePlayers[id] = parsed;
        } else {
          expiredPlayers.push(id);
        }
      } catch (e) {
        expiredPlayers.push(id); // Clean up corrupted data
      }
    }

    // Fire-and-forget: Delete expired gauchos from Redis
    if (expiredPlayers.length > 0) {
      await redis.hdel(WORLD_KEY, ...expiredPlayers);
    }

    return response.status(200).json({ 
      status: "fortinero API is Online", 
      activePlayers 
    });
  }

  // 2. Handle POST (Unity Pulse)
  if (request.method === 'POST') {
    try {
      const { playerId, x, y, gameState } = request.body;

      if (!playerId) return response.status(400).json({ error: 'Missing playerId' });

      // Wrap data with a timestamp
      const playerRecord = {
        x: x || 0,
        y: y || 0,
        gameState: gameState || {},
        lastSeen: Date.now() // The critical "heartbeat"
      };

      await redis.hset(WORLD_KEY, { [playerId]: playerRecord });

      return response.status(200).json({ success: true });
    } catch (error) {
      return response.status(500).json({ error: 'Failed to save' });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}