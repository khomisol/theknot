import type { FastifyRequest, FastifyReply } from 'fastify';

function getApiKeys(): string[] {
  return (process.env.API_KEYS || '').split(',').filter(Boolean);
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'API key is required',
    });
  }

  const API_KEYS = getApiKeys();
  if (!API_KEYS.includes(apiKey as string)) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid API key',
    });
  }

  // API key is valid, continue
}
