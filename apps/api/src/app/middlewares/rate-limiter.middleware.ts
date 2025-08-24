import { FastifyReply, FastifyRequest } from "fastify";
import { RATE_LIMITER_PREFIX_KEY } from "../constants/redis.constant";

// can be used only after authMiddleware
export const rateLimiterMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  const limit = 5;
  const timeWindow = 60; // in seconds
  const redis = reply.server.redis;

  try {
    const userId = (req.user as any).sub;
    const key = `${RATE_LIMITER_PREFIX_KEY}:${userId}`;

    const tx = redis.multi();

    tx.incr(key);
    tx.expire(key, timeWindow, "NX");

    const result = await tx.exec();
    let count = 0;

    if (result) {
      count = parseInt(result[0][1] as string);
    }

    if (count > limit) {
      return reply.tooManyRequests("Request limit exceeded. Please try again later.");
    } else {
      reply.header("X-RateLimit-Limit", limit);
      reply.header("X-RateLimit-Remaining", Math.max(limit - count, 0));
      reply.header("X-RateLimit-Reset", timeWindow);
    }
  } catch (error) {
    console.error(error);
    return reply.unauthorized('Unauthorized access');
  }
}
