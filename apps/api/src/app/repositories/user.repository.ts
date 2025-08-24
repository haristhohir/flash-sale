import prisma from "../lib/prisma"

export const userRepository = {
  findByEmail: async (email: string) => prisma.user.findUnique({ where: { email, deletedAt: null } }),
  findWithLimit: async (limit: number) => prisma.user.findMany({ select: { id: true, email: true }, take: limit }),
}
