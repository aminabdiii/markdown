import { z } from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().positive('Age must be a positive integer'),
});

export const getUserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const userIdParamsSchema = z.object({
  userId: z
    .string('شناسه کاربر الزامی است')
    .min(1, 'شناسه کاربر نمی‌تواند خالی باشد')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'شناسه کاربر فقط می‌تواند شامل حروف، اعداد، خط تیره و زیرخط باشد'
    ),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type GetUserQuery = z.infer<typeof getUserQuerySchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
