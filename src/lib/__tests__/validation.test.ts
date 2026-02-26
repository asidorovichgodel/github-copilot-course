import {
  validateString,
  validateEmail,
  validatePositiveNumber,
  validateRequired,
} from '../validation';
import { AppError } from '../errors';

describe('validation', () => {
  describe('validateString()', () => {
    it('should return the string when valid', () => {
      // Arrange & Act
      const result = validateString('hello', 'Name');

      // Assert
      expect(result).toBe('hello');
    });

    it('should throw when value is not a string', () => {
      expect(() => validateString(123, 'Name')).toThrow(AppError);
      expect(() => validateString(123, 'Name')).toThrow('Name must be a string');
    });

    it('should throw when string is too short', () => {
      expect(() => validateString('a', 'Name', 3)).toThrow('Name must be at least 3 characters');
    });

    it('should throw when string exceeds maxLength', () => {
      expect(() => validateString('hello world', 'Name', 1, 5)).toThrow(
        'Name must not exceed 5 characters',
      );
    });

    it('should throw when value is null', () => {
      expect(() => validateString(null, 'Name')).toThrow('Name must be a string');
    });

    it('should throw when value is undefined', () => {
      expect(() => validateString(undefined, 'Name')).toThrow('Name must be a string');
    });

    it('should use default minLength of 1', () => {
      expect(() => validateString('', 'Name')).toThrow('Name must be at least 1 characters');
    });

    it('should use default maxLength of 255', () => {
      const longStr = 'a'.repeat(256);
      expect(() => validateString(longStr, 'Name')).toThrow('Name must not exceed 255 characters');
    });
  });

  describe('validateEmail()', () => {
    it('should return a valid email string', () => {
      const result = validateEmail('user@example.com');

      expect(result).toBe('user@example.com');
    });

    it('should throw for an invalid email format', () => {
      expect(() => validateEmail('not-an-email')).toThrow('Invalid email format');
    });

    it('should throw for email missing @ symbol', () => {
      expect(() => validateEmail('userexample.com')).toThrow('Invalid email format');
    });

    it('should throw for email missing domain', () => {
      expect(() => validateEmail('user@')).toThrow('Invalid email format');
    });

    it('should throw when value is not a string', () => {
      expect(() => validateEmail(42)).toThrow(AppError);
    });

    it('should throw for empty string', () => {
      expect(() => validateEmail('')).toThrow(AppError);
    });
  });

  describe('validatePositiveNumber()', () => {
    it('should return the number when it is positive', () => {
      const result = validatePositiveNumber(5, 'Count');

      expect(result).toBe(5);
    });

    it('should return a positive decimal number', () => {
      const result = validatePositiveNumber(3.14, 'Amount');

      expect(result).toBe(3.14);
    });

    it('should throw for zero', () => {
      expect(() => validatePositiveNumber(0, 'Count')).toThrow('Count must be a positive number');
    });

    it('should throw for negative numbers', () => {
      expect(() => validatePositiveNumber(-1, 'Count')).toThrow('Count must be a positive number');
    });

    it('should throw when value is not a number', () => {
      expect(() => validatePositiveNumber('5', 'Count')).toThrow('Count must be a positive number');
    });

    it('should throw when value is null', () => {
      expect(() => validatePositiveNumber(null, 'Count')).toThrow(
        'Count must be a positive number',
      );
    });
  });

  describe('validateRequired()', () => {
    it('should return the value when it is not null or undefined', () => {
      expect(validateRequired('hello', 'Name')).toBe('hello');
      expect(validateRequired(0, 'Count')).toBe(0);
      expect(validateRequired(false, 'Flag')).toBe(false);
      expect(validateRequired([], 'Items')).toEqual([]);
    });

    it('should throw when value is null', () => {
      expect(() => validateRequired(null, 'Name')).toThrow('Name is required');
    });

    it('should throw when value is undefined', () => {
      expect(() => validateRequired(undefined, 'Name')).toThrow('Name is required');
    });

    it('should throw an AppError', () => {
      expect(() => validateRequired(null, 'Name')).toThrow(AppError);
    });
  });
});
