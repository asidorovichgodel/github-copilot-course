import { cn } from '../utils';

describe('cn()', () => {
  it('should merge class names', () => {
    // Arrange & Act
    const result = cn('foo', 'bar');

    // Assert
    expect(result).toBe('foo bar');
  });

  it('should return empty string when no arguments provided', () => {
    expect(cn()).toBe('');
  });

  it('should handle conditional classes with objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('should handle falsy values', () => {
    expect(cn('base', undefined, null, false)).toBe('base');
  });

  it('should deduplicate and resolve Tailwind conflicts', () => {
    // tailwind-merge should pick the last conflicting class
    const result = cn('p-4', 'p-8');

    expect(result).toBe('p-8');
  });

  it('should handle arrays of class names', () => {
    const result = cn(['foo', 'bar'], 'baz');

    expect(result).toBe('foo bar baz');
  });
});
