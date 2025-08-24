

import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import cors from '@fastify/cors';

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(cors, {
    origin: '*'
  });

});
