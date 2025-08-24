

import prisma from "../lib/prisma"

export const transactionRepository = {
  findByProductId: async (id: number) => {
    return prisma.transaction.findFirst({
      where: {
        productId: id,
        deletedAt: null,
      },
      include: {
        product: true
      }
    });
  }
}
