import { userRepository } from "../repositories/user.repository"
import bcrypt from 'bcryptjs';

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);

    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    return { userId: 1 }
  }
}
