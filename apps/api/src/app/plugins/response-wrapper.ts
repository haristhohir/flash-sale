
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode ?? 500;

    reply.status(statusCode).send({
      success: false,
      error: {
        message: error.message,
        code: statusCode,
      },
    });
  });

  fastify.addHook("preSerialization", async (request, reply, payload) => {
    if ((payload as any)?.success !== undefined) {
      return payload;
    }

    return {
      success: true,
      data: payload,
    };
  });
})
