// api/session.ts
import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redis = Redis.fromEnv();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests for creating/updating sessions
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { playerId, gameState } = request.body;

    if (!playerId) {
      return response.status(400).json({ error: 'Missing playerId' });
    }

    // "File-like" storage using Redis
    // Set with an expiry (TTL) of 24 hours (86400 seconds)
    await redis.set(`session:${playerId}`, gameState, { ex: 86400 });

    return response.status(200).json({ success: true, message: 'Saved' });
  } catch (error) {
    return response.status(500).json({ error: 'Failed to save session' });
  }
}