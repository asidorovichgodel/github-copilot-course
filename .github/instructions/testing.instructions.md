# Testing Instructions for GitHub Copilot

When generating tests for this project, follow these guidelines:

## Testing Principles

### Test Pyramid
- **Unit Tests** (70%): Test individual functions/methods
- **Integration Tests** (20%): Test component interactions
- **E2E Tests** (10%): Test complete user workflows

### Good Test Characteristics (F.I.R.S.T)
- **Fast**: Run quickly
- **Independent**: Don't depend on other tests
- **Repeatable**: Same result every time
- **Self-validating**: Pass or fail clearly
- **Timely**: Written alongside code

## Test Structure

### AAA Pattern (Arrange-Act-Assert)

```typescript
describe('UserService', () => {
  it('should return user data when user exists', async () => {
    // Arrange: Set up test data and dependencies
    const mockUserId = '123';
    const expectedUser = { id: '123', name: 'John Doe' };
    const mockDb = createMockDatabase(expectedUser);
    const userService = new UserService(mockDb);

    // Act: Execute the code under test
    const result = await userService.getUser(mockUserId);

    // Assert: Verify the results
    expect(result).toEqual(expectedUser);
    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [mockUserId]);
  });
});
```

## Naming Conventions

### Test File Names
- JavaScript/TypeScript: `filename.test.ts` or `filename.spec.ts`
- Python: `test_filename.py`

### Test Names
Be descriptive and follow pattern: `should [expected behavior] when [condition]`

```typescript
// Good test names
it('should return null when user does not exist', () => {});
it('should throw ValidationError when email is invalid', () => {});
it('should cache results after first call', () => {});

// Bad test names
it('works', () => {});
it('test user', () => {});
it('should pass', () => {});
```

## JavaScript/TypeScript Tests

### Using Jest

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { UserService } from './UserService';

describe('UserService', () => {
  let userService: UserService;
  let mockDatabase: MockDatabase;

  beforeEach(() => {
    // Setup before each test
    mockDatabase = createMockDatabase();
    userService = new UserService(mockDatabase);
  });

  afterEach(() => {
    // Cleanup after each test
    mockDatabase.clear();
  });

  describe('getUser', () => {
    it('should return user data when user exists', async () => {
      const userId = '123';
      const expectedUser = { id: userId, name: 'John' };
      mockDatabase.addUser(expectedUser);

      const result = await userService.getUser(userId);

      expect(result).toEqual(expectedUser);
    });

    it('should return null when user does not exist', async () => {
      const result = await userService.getUser('nonexistent');

      expect(result).toBeNull();
    });

    it('should throw DatabaseError when database is unavailable', async () => {
      mockDatabase.simulateFailure();

      await expect(userService.getUser('123')).rejects.toThrow(DatabaseError);
    });
  });

  describe('createUser', () => {
    it('should save user with generated ID', async () => {
      const userData = { name: 'Jane', email: 'jane@example.com' };

      const result = await userService.createUser(userData);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(userData.name);
      expect(mockDatabase.save).toHaveBeenCalledWith(expect.objectContaining(userData));
    });

    it('should throw ValidationError when email is invalid', async () => {
      const invalidUser = { name: 'Jane', email: 'invalid' };

      await expect(userService.createUser(invalidUser)).rejects.toThrow(ValidationError);
    });
  });
});
```

### Async Testing

```typescript
// Using async/await (preferred)
it('should fetch data successfully', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// Using done callback (when needed)
it('should handle callback', (done) => {
  fetchDataWithCallback((error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    done();
  });
});
```

## Python Tests

### Using pytest

```python
import pytest
from user_service import UserService, ValidationError, DatabaseError

class TestUserService:
    @pytest.fixture
    def user_service(self):
        """Create a UserService instance for testing."""
        mock_db = MockDatabase()
        return UserService(mock_db)

    def test_get_user_returns_data_when_exists(self, user_service):
        """Should return user data when user exists."""
        # Arrange
        user_id = "123"
        expected_user = {"id": user_id, "name": "John"}
        user_service.db.add_user(expected_user)

        # Act
        result = user_service.get_user(user_id)

        # Assert
        assert result == expected_user

    def test_get_user_returns_none_when_not_exists(self, user_service):
        """Should return None when user does not exist."""
        result = user_service.get_user("nonexistent")
        assert result is None

    def test_create_user_raises_error_on_invalid_email(self, user_service):
        """Should raise ValidationError when email is invalid."""
        invalid_user = {"name": "Jane", "email": "invalid"}
        
        with pytest.raises(ValidationError, match="Invalid email"):
            user_service.create_user(invalid_user)

    @pytest.mark.parametrize("email,expected", [
        ("user@example.com", True),
        ("invalid", False),
        ("user@", False),
        ("@example.com", False),
    ])
    def test_email_validation(self, user_service, email, expected):
        """Should validate email addresses correctly."""
        result = user_service.is_valid_email(email)
        assert result == expected
```

## Mocking

### Mock External Dependencies

```typescript
// Mock HTTP requests
import { jest } from '@jest/globals';

const mockFetch = jest.fn();
global.fetch = mockFetch;

it('should fetch user data', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: '1', name: 'John' }),
  });

  const result = await fetchUserData('1');
  
  expect(result.name).toBe('John');
  expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
});
```

### Mock Modules

```typescript
jest.mock('./database', () => ({
  Database: jest.fn().mockImplementation(() => ({
    query: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue(true),
  })),
}));
```

## Test Coverage

### Aim for High Coverage
- Critical paths: 100%
- Business logic: 90%+
- Overall: 80%+

### What to Test
- ✅ Happy path scenarios
- ✅ Error conditions
- ✅ Edge cases (empty arrays, null, undefined)
- ✅ Boundary values
- ✅ Invalid inputs

### What NOT to Test
- ❌ Third-party libraries
- ❌ Language/framework built-ins
- ❌ Trivial getters/setters
- ❌ Configuration files
- ❌ Auto-generated code

## Integration Tests

```typescript
describe('User API Integration', () => {
  let app: Express;
  let database: Database;

  beforeAll(async () => {
    database = await setupTestDatabase();
    app = createApp(database);
  });

  afterAll(async () => {
    await database.close();
  });

  it('should create and retrieve user', async () => {
    // Create user
    const createResponse = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    const userId = createResponse.body.id;

    // Retrieve user
    const getResponse = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(getResponse.body.name).toBe('John');
  });
});
```

## Best Practices

1. **One Assertion Per Test** (when possible)
2. **Test Behavior, Not Implementation**
3. **Use Descriptive Names**
4. **Keep Tests Simple**
5. **Avoid Test Interdependence**
6. **Use Fixtures for Common Setup**
7. **Mock External Services**
8. **Test Edge Cases**
9. **Keep Tests Fast**
10. **Maintain Tests Like Production Code**
