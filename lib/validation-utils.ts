/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/validation-utils.ts
import { ZodError } from 'zod';
import { ValidationErrorDetail } from './validate_request';

export function formatZodError(
  zodError: ZodError,
  source: 'body' | 'query' | 'params' = 'body'
) {
  const errors: ValidationErrorDetail[] = [];

  zodError.issues.forEach((error) => {
    const fieldPath =
      error.path.length > 0 ? `${source}.${error.path.join('.')}` : source;

    errors.push({
      field: fieldPath,
      message: error.message,
      value:
        error.path.reduce((obj, key) => obj?.[key], zodError as any) ??
        'undefined',
      expected: getExpectedType(error),
    });
  });

  return errors;
}

function getExpectedType(error: any): string | undefined {
  if (error.code === 'invalid_type') {
    return error.expected;
  }
  if (error.validation) {
    return error.validation;
  }
  return undefined;
}
