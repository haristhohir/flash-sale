import { FastifyInstance } from 'fastify';
import { loginHandler } from '../handlers/auth.handler';
import { loginSchema } from '../dto/auth.dto';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', function () {
    return { message: 'Flash Sale API' };
  });


  fastify.post('/auth/login', { schema: loginSchema }, loginHandler);
}
