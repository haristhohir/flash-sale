
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import env from "../config/env";
import fastifyRedis from "@fastify/redis";

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(fastifyRedis, {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  })
});
