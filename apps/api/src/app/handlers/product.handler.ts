import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { poductService } from "../services/product.service";

export async function flashSaleHandler(request: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>) {
  const flashSale = await poductService.flashSale();

  if (!flashSale) return reply.notFound("Flash sale not found");

  return flashSale;
}

