import { FastifyReply, RouteGenericInterface } from "fastify";
import { FastifyRequest } from "fastify/types/request";
import { LoginRequestDto, LoginResponseDto } from "../dto/auth.dto";
import { authService } from "../services/auth.service";

export async function loginHandler(request: FastifyRequest<{ Body: LoginRequestDto }>, reply: FastifyReply<RouteGenericInterface>) {
  const { email, password } = request.body;

  try {
    const result = await authService.login(email, password);
    const response: LoginResponseDto = {
      accessToken: reply.server.jwt.sign({ sub: result.userId, email }),
    }

    return response;
  } catch (error: any) {
    return reply.unauthorized(error.message)
  }
}
