import prisma from "../lib/prisma"

export const userRepository = {
  findByEmail: async (email: string) => prisma.user.findUnique({ where: { email, deletedAt: null } }),
}
