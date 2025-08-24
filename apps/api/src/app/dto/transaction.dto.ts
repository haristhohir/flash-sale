import { FastifySchema } from "fastify";

export interface PurchaseRequestDto {
  id: number;
}

export const purchaseSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      email: { type: 'number' },
    },
  },
};

