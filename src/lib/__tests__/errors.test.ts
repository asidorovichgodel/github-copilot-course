import { AppError } from '../errors';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create an AppError with all properties', () => {
      // Arrange & Act
      const error = new AppError('NOT_FOUND', 404, 'Resource not found', { id: '123' });

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.name).toBe('AppError');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.details).toEqual({ id: '123' });
    });

    it('should create an AppError without details', () => {
      const error = new AppError('INTERNAL_ERROR', 500, 'Server error');

      expect(error.details).toBeUndefined();
    });
  });

  describe('static factory methods', () => {
    describe('validation()', () => {
      it('should create a VALIDATION_ERROR with status 400', () => {
        const error = AppError.validation('Invalid input');

        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Invalid input');
      });

      it('should accept optional details', () => {
        const details = { field: 'email' };
        const error = AppError.validation('Bad field', details);

        expect(error.details).toEqual(details);
      });
    });

    describe('notFound()', () => {
      it('should create a NOT_FOUND error with status 404', () => {
        const error = AppError.notFound('User not found');

        expect(error.code).toBe('NOT_FOUND');
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('User not found');
      });
    });

    describe('unauthorized()', () => {
      it('should create an UNAUTHORIZED error with status 401', () => {
        const error = AppError.unauthorized();

        expect(error.code).toBe('UNAUTHORIZED');
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Unauthorized');
      });

      it('should accept a custom message', () => {
        const error = AppError.unauthorized('Token expired');

        expect(error.message).toBe('Token expired');
      });
    });

    describe('forbidden()', () => {
      it('should create a FORBIDDEN error with status 403', () => {
        const error = AppError.forbidden();

        expect(error.code).toBe('FORBIDDEN');
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe('Forbidden');
      });

      it('should accept a custom message', () => {
        const error = AppError.forbidden('Insufficient permissions');

        expect(error.message).toBe('Insufficient permissions');
      });
    });

    describe('conflict()', () => {
      it('should create a CONFLICT error with status 409', () => {
        const error = AppError.conflict('Email already taken');

        expect(error.code).toBe('CONFLICT');
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe('Email already taken');
      });
    });

    describe('internal()', () => {
      it('should create an INTERNAL_ERROR with status 500', () => {
        const error = AppError.internal();

        expect(error.code).toBe('INTERNAL_ERROR');
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('Internal server error');
      });

      it('should accept a custom message', () => {
        const error = AppError.internal('Something went wrong');

        expect(error.message).toBe('Something went wrong');
      });
    });

    describe('database()', () => {
      it('should create a DATABASE_ERROR with status 500', () => {
        const error = AppError.database('Query failed');

        expect(error.code).toBe('DATABASE_ERROR');
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('Query failed');
      });
    });

    describe('externalApi()', () => {
      it('should create an EXTERNAL_API_ERROR with status 502', () => {
        const error = AppError.externalApi('Third-party service unavailable');

        expect(error.code).toBe('EXTERNAL_API_ERROR');
        expect(error.statusCode).toBe(502);
        expect(error.message).toBe('Third-party service unavailable');
      });
    });
  });
});
