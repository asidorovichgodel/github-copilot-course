import {
  createSuccessResponse,
  createErrorResponse,
  generateRequestId,
  validatePaginationParams,
} from '../helpers';

describe('helpers', () => {
  describe('createSuccessResponse()', () => {
    it('should return a success response with provided data', () => {
      // Arrange
      const data = { id: '1', name: 'John' };

      // Act
      const result = createSuccessResponse(data);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    it('should include a timestamp in ISO format', () => {
      const result = createSuccessResponse('test');

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should work with array data', () => {
      const data = [1, 2, 3];
      const result = createSuccessResponse(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    it('should work with null data', () => {
      const result = createSuccessResponse(null);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('createErrorResponse()', () => {
    it('should return an error response with provided message', () => {
      // Arrange
      const errorMessage = 'Something went wrong';

      // Act
      const result = createErrorResponse(errorMessage);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should include a timestamp in ISO format', () => {
      const result = createErrorResponse('error');

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should not include data field', () => {
      const result = createErrorResponse('error');

      expect(result.data).toBeUndefined();
    });
  });

  describe('generateRequestId()', () => {
    it('should return a string starting with req_', () => {
      const id = generateRequestId();

      expect(typeof id).toBe('string');
      expect(id).toMatch(/^req_\d+_[a-z0-9]+$/);
    });

    it('should generate unique IDs on each call', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).not.toBe(id2);
    });
  });

  describe('validatePaginationParams()', () => {
    it('should return defaults when no params provided', () => {
      const result = validatePaginationParams();

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should use provided valid page and limit', () => {
      const result = validatePaginationParams(3, 25);

      expect(result.page).toBe(3);
      expect(result.limit).toBe(25);
    });

    it('should enforce minimum page of 1', () => {
      const result = validatePaginationParams(0);

      expect(result.page).toBe(1);
    });

    it('should fall back to default limit when limit is 0 (falsy)', () => {
      // 0 is falsy so `limit || DEFAULT_LIMIT` produces DEFAULT_LIMIT (10)
      const result = validatePaginationParams(1, 0);

      expect(result.limit).toBe(10);
    });

    it('should enforce minimum limit of 1 for negative numbers', () => {
      const result = validatePaginationParams(1, -5);

      expect(result.limit).toBe(1);
    });

    it('should cap limit at MAX_LIMIT (100)', () => {
      const result = validatePaginationParams(1, 999);

      expect(result.limit).toBe(100);
    });

    it('should handle negative page values', () => {
      const result = validatePaginationParams(-5);

      expect(result.page).toBe(1);
    });
  });
});
