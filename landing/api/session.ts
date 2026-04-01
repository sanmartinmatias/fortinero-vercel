// api/session.ts
import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redis = Redis.fromEnv();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {

  // 1. Handle GET (Browser Test)
  if (request.method === 'GET') {
    const allPlayers = await redis.hgetall('world_map');
    return response.status(200).json({ 
      status: "fortinero API is Online", 
      activePlayers: allPlayers 
    });
  }

  // Only allow POST requests for creating/updating sessions
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    try {
  const { playerId, gameState } = request.body;

  if (!playerId) {
    return response.status(400).json({ error: 'Missing playerId' });
  }

  // Use hset to put this player into the "world_map" collection
  // This saves the gameState inside the hash under the playerId field
  await redis.hset('world_map', { 
    [playerId]: JSON.stringify(gameState) 
  });

  // Optional: If you want the whole world_map to expire eventually
  await redis.expire('world_map', 86400); 

  return response.status(200).json({ success: true, message: 'Saved to World Map' });
}
  } catch (error) {
    return response.status(500).json({ error: 'Failed to save session' });
  }
}