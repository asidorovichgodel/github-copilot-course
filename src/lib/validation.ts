/**
 * Validation utilities for request data
 * Reusable across services and controllers
 */

import { AppError } from './errors';

/**
 * Validates that a value is a non-empty string
 */
export function validateString(
  value: unknown,
  fieldName: string,
  minLength = 1,
  maxLength = 255,
): string {
  if (typeof value !== 'string') {
    throw AppError.validation(`${fieldName} must be a string`);
  }

  if (value.length < minLength) {
    throw AppError.validation(`${fieldName} must be at least ${minLength} characters`);
  }

  if (value.length > maxLength) {
    throw AppError.validation(`${fieldName} must not exceed ${maxLength} characters`);
  }

  return value;
}

/**
 * Validates that a value is a valid email
 */
export function validateEmail(email: unknown): string {
  const emailStr = validateString(email, 'Email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailStr)) {
    throw AppError.validation('Invalid email format');
  }

  return emailStr;
}

/**
 * Validates that a value is a positive number
 */
export function validatePositiveNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || value <= 0) {
    throw AppError.validation(`${fieldName} must be a positive number`);
  }

  return value;
}

/**
 * Validates that a value is present (not null or undefined)
 */
export function validateRequired<T>(value: T, fieldName: string): Exclude<T, null | undefined> {
  if (value === null || value === undefined) {
    throw AppError.validation(`${fieldName} is required`);
  }

  return value as Exclude<T, null | undefined>;
}
