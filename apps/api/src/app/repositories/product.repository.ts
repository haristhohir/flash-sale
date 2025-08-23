
import prisma from "../lib/prisma"

export const productRepository = {
  findFlashSale: async () => {
    return prisma.flashSale.findFirst({
      where: {
        deletedAt: null,
      },
      include: {
        product: true
      }
    });
  }
}
