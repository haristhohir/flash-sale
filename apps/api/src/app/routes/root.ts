import { FastifyInstance } from 'fastify';
import { loginHandler } from '../handlers/auth.handler';
import { loginSchema } from '../dto/auth.dto';
import { flashSaleHandler } from '../handlers/product.handler';
import { withAuthMiddleware } from '../middlewares/auth.middleware';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', function () {
    return { message: 'Flash Sale API' };
  });

  fastify.post('/auth/login', { schema: loginSchema }, loginHandler);
  fastify.get('/products/flash-sale', { preHandler: withAuthMiddleware }, flashSaleHandler);
}
