import {
  emailSchema,
  passwordSchema,
  nameSchema,
  userRegistrationSchema,
  userCreateSchema,
  userProfileSchema,
  userEditSchema,
  loginSchema,
} from '../userSchemas';

describe('userSchemas', () => {
  describe('emailSchema', () => {
    it('should accept a valid email', () => {
      expect(() => emailSchema.parse('user@example.com')).not.toThrow();
    });

    it('should reject an invalid email', () => {
      expect(() => emailSchema.parse('not-an-email')).toThrow();
    });

    it('should reject an empty string', () => {
      expect(() => emailSchema.parse('')).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('should accept a valid password', () => {
      expect(() => passwordSchema.parse('Password1')).not.toThrow();
    });

    it('should reject password shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Pass1');
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase letter', () => {
      const result = passwordSchema.safeParse('password1');
      expect(result.success).toBe(false);
    });

    it('should reject password without a number', () => {
      const result = passwordSchema.safeParse('Password');
      expect(result.success).toBe(false);
    });
  });

  describe('nameSchema', () => {
    it('should accept a valid name', () => {
      expect(() => nameSchema.parse('John')).not.toThrow();
    });

    it('should reject a name shorter than 2 characters', () => {
      expect(() => nameSchema.parse('J')).toThrow();
    });

    it('should reject a name longer than 100 characters', () => {
      expect(() => nameSchema.parse('A'.repeat(101))).toThrow();
    });
  });

  describe('userRegistrationSchema', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    };

    it('should accept valid registration data', () => {
      const result = userRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const result = userRegistrationSchema.safeParse({
        ...validData,
        confirmPassword: 'DifferentPass1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('confirmPassword');
      }
    });

    it('should reject with invalid email', () => {
      const result = userRegistrationSchema.safeParse({
        ...validData,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
    });

    it('should reject with short first name', () => {
      const result = userRegistrationSchema.safeParse({
        ...validData,
        firstName: 'J',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('userCreateSchema', () => {
    it('should accept valid data without confirmPassword', () => {
      const result = userCreateSchema.safeParse({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'Password1',
      });
      expect(result.success).toBe(true);
    });

    it('should still validate password strength', () => {
      const result = userCreateSchema.safeParse({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('userProfileSchema', () => {
    it('should accept valid profile fields', () => {
      const result = userProfileSchema.safeParse({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const result = userProfileSchema.safeParse({
        firstName: 'Alice',
        lastName: 'Smith',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('userEditSchema', () => {
    it('should accept profile fields with roleIds', () => {
      const result = userEditSchema.safeParse({
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
        roleIds: ['role-1', 'role-2'],
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty roleIds array', () => {
      const result = userEditSchema.safeParse({
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
        roleIds: [],
      });
      expect(result.success).toBe(true);
    });

    it('should reject when roleIds is missing', () => {
      const result = userEditSchema.safeParse({
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid credentials', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-email',
        password: 'somepassword',
      });
      expect(result.success).toBe(false);
    });
  });
});
