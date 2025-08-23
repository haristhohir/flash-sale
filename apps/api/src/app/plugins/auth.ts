import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import jwt from '@fastify/jwt';
import env from "../config/env";

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: env.JWT_SECRET, // using symmetric key, choosen due to simplicity
    // to increase security, asymmetric keys can be used as well 👇
    // secret: {
    //   private: '',
    //   public: '',
    // },
    sign: {
      expiresIn: '24h'
    }
  });

  fastify.decorate(
    'authenticate',
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
