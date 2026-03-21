import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    phone: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    nickname: z.string().optional(),
  }).refine((data) => data.phone || data.email, {
    message: "Either phone or email must be provided",
    path: ["phone"],
  })
});

export const loginUserSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, 'Email or phone is required'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const registerAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.string().optional(),
  })
});

export const loginAdminSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

// Types for inferred schemas
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
export type RegisterAdminInput = z.infer<typeof registerAdminSchema>['body'];
export type LoginAdminInput = z.infer<typeof loginAdminSchema>['body'];
