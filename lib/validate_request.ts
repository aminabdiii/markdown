/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/validate-request.ts
import { NextRequest } from 'next/server';
import { z, ZodSchema } from 'zod';
import { formatZodError } from './validation-utils';

export interface ValidationErrorDetail {
  field: string; // نام فیلد دقیق (مثلاً 'body.email')
  message: string; // پیغام خطا
  value: any; // مقدار دریافتی
  expected?: string; // نوع داده مورد انتظار (اختیاری)
}

export interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationErrorDetail[];
  timestamp: string;
  path: string;
}

export class ValidationError extends Error {
  constructor(
    public statusCode: number,
    public errors: ValidationErrorDetail[],
    public source: string
  ) {
    super(`Validation failed in ${source}`);
    this.name = 'ValidationError';
  }
}

export async function validateRequest<
  T extends {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
  }
>(
  request: NextRequest,
  schemas: T,
  routeParams?: Record<string, string> // برای پارامترهای مسیر
) {
  const {
    body: bodySchema,
    params: paramsSchema,
    query: querySchema,
  } = schemas;
  const result: { body?: any; params?: any; query?: any } = {};
  const allErrors: ValidationErrorDetail[] = [];

  // 🔍 اعتبارسنجی Body
  if (bodySchema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      const body = await request.json().catch(() => ({}));
      const validation = bodySchema.safeParse(body);

      if (!validation.success) {
        const bodyErrors = formatZodError(validation.error, 'body');
        allErrors.push(...bodyErrors);
      } else {
        result.body = validation.data;
      }
    } catch (error) {
      allErrors.push({
        field: 'body',
        message: 'Invalid JSON in request body',
        value: 'undefined',
        expected: 'valid JSON',
      });
    }
  }

  // 🔍 اعتبارسنجی Query Parameters
  if (querySchema) {
    const query = Object.fromEntries(new URL(request.url).searchParams);
    const validation = querySchema.safeParse(query);

    if (!validation.success) {
      const queryErrors = formatZodError(validation.error, 'query');
      allErrors.push(...queryErrors);
    } else {
      result.query = validation.data;
    }
  }

  // 🔍 اعتبارسنجی Route Parameters
  if (paramsSchema && routeParams) {
    const validation = paramsSchema.safeParse(routeParams);

    if (!validation.success) {
      const paramsErrors = formatZodError(validation.error, 'params');
      allErrors.push(...paramsErrors);
    } else {
      result.params = validation.data;
    }
  }

  // 🚨 اگر خطایی وجود داشت، پرتاب کن
  if (allErrors.length > 0) {
    // تشخیص کد وضعیت بر اساس نوع خطا
    const hasClientError = allErrors.some(
      (error) =>
        error.message.includes('Required') ||
        error.message.includes('Invalid') ||
        error.value === 'undefined'
    );

    const statusCode = hasClientError ? 400 : 422;

    throw new ValidationError(statusCode, allErrors, 'request validation');
  }

  return result as {
    body: T['body'] extends ZodSchema ? z.infer<T['body']> : undefined;
    params: T['params'] extends ZodSchema ? z.infer<T['params']> : undefined;
    query: T['query'] extends ZodSchema ? z.infer<T['query']> : undefined;
  };
}
