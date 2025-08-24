import { authService } from "./auth.service";
import { userRepository } from "../repositories/user.repository";
import bcrypt from 'bcryptjs';

describe('authService', () => {
  describe('login', () => {
    it('should return userId if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(true) as unknown as boolean);

      const result = await authService.login('test@example.com', 'password');

      expect(result).toEqual({ userId: mockUser.id });
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw an error if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(false) as unknown as boolean);

      await expect(authService.login('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    });
  });

  describe('getUsers', () => {
    it('should return a list of users with a default limit of 10', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' }
      ];
      jest.spyOn(userRepository, 'findWithLimit').mockResolvedValue(mockUsers);

      const result = await authService.getUsers();

      expect(result).toEqual(mockUsers);
      expect(userRepository.findWithLimit).toHaveBeenCalledWith(10);
    });

    it('should return a list of users with a specified limit', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' }
      ];
      jest.spyOn(userRepository, 'findWithLimit').mockResolvedValue(mockUsers);

      const result = await authService.getUsers(5);

      expect(result).toEqual(mockUsers);
      expect(userRepository.findWithLimit).toHaveBeenCalledWith(5);
    });
  });
});

