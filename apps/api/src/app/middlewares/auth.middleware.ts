import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export const withAuthMiddleware = async (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  try {
    await req.jwtVerify();
  } catch (error) {
    return reply.unauthorized('Unauthorized access');
  }
}

