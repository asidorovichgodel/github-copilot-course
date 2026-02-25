import { hashPassword, verifyPassword } from '../password';

describe('password utilities', () => {
  describe('hashPassword()', () => {
    it('should return a hashed string different from the original password', async () => {
      // Arrange
      const password = 'MySecret123';

      // Act
      const hash = await hashPassword(password);

      // Assert
      expect(hash).not.toBe(password);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password on each call', async () => {
      const password = 'MySecret123';

      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword()', () => {
    it('should return true when password matches the hash', async () => {
      // Arrange
      const password = 'MySecret123';
      const hash = await hashPassword(password);

      // Act
      const result = await verifyPassword(password, hash);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when password does not match the hash', async () => {
      const password = 'MySecret123';
      const hash = await hashPassword(password);

      const result = await verifyPassword('WrongPassword', hash);

      expect(result).toBe(false);
    });

    it('should return false for an empty password against a real hash', async () => {
      const hash = await hashPassword('MySecret123');

      const result = await verifyPassword('', hash);

      expect(result).toBe(false);
    });
  });
});
