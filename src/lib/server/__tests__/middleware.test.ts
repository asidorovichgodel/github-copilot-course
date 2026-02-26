// Mock next/server before imports so NextResponse is available as a jest.fn()
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: unknown, init?: { status?: number }) => ({
      body: data,
      status: init?.status ?? 200,
    })),
  },
}));

import { NextResponse } from 'next/server';
import { errorHandler, withErrorHandling } from '../middleware';
import { AppError } from '../../errors';

const mockJson = NextResponse.json as jest.Mock;

describe('middleware', () => {
  beforeEach(() => {
    mockJson.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('errorHandler()', () => {
    it('should return JSON with AppError status and message for AppError instances', () => {
      // Arrange
      const error = AppError.notFound('User not found');

      // Act
      errorHandler(error);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'User not found' }),
        { status: 404 },
      );
    });

    it('should return status 400 for AppError.validation()', () => {
      // Arrange
      const error = AppError.validation('Invalid input');

      // Act
      errorHandler(error);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'Invalid input' }),
        { status: 400 },
      );
    });

    it('should return status 401 for AppError.unauthorized()', () => {
      // Arrange
      const error = AppError.unauthorized();

      // Act
      errorHandler(error);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'Unauthorized' }),
        { status: 401 },
      );
    });

    it('should return 500 with the error message for a generic Error', () => {
      // Arrange
      const error = new Error('Something went wrong');

      // Act
      errorHandler(error);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'Something went wrong' }),
        { status: 500 },
      );
    });

    it('should return 500 with a generic message for an unknown non-Error value', () => {
      // Arrange
      const error = 'raw string error';

      // Act
      errorHandler(error);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'An unexpected error occurred' }),
        { status: 500 },
      );
    });

    it('should log the error to console', () => {
      // Arrange
      const error = new Error('logged error');

      // Act
      errorHandler(error);

      // Assert
      expect(console.error).toHaveBeenCalledWith('Error:', error);
    });
  });

  describe('withErrorHandling()', () => {
    it('should return the handler result when no error is thrown', async () => {
      // Arrange
      const expectedResponse = { body: { success: true }, status: 200 };
      const handler = jest.fn().mockResolvedValue(expectedResponse);
      const wrappedHandler = withErrorHandling(handler);
      const mockRequest = {} as Parameters<typeof wrappedHandler>[0];

      // Act
      const result = await wrappedHandler(mockRequest);

      // Assert
      expect(result).toBe(expectedResponse);
      expect(handler).toHaveBeenCalledWith(mockRequest);
    });

    it('should catch an AppError thrown by the handler and return an error response', async () => {
      // Arrange
      const handler = jest.fn().mockRejectedValue(AppError.forbidden('Access denied'));
      const wrappedHandler = withErrorHandling(handler);
      const mockRequest = {} as Parameters<typeof wrappedHandler>[0];

      // Act
      await wrappedHandler(mockRequest);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'Access denied' }),
        { status: 403 },
      );
    });

    it('should catch a generic Error thrown by the handler and return a 500 response', async () => {
      // Arrange
      const handler = jest.fn().mockRejectedValue(new Error('DB connection failed'));
      const wrappedHandler = withErrorHandling(handler);
      const mockRequest = {} as Parameters<typeof wrappedHandler>[0];

      // Act
      await wrappedHandler(mockRequest);

      // Assert
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'DB connection failed' }),
        { status: 500 },
      );
    });
  });
});
