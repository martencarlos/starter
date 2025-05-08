import { z } from 'zod';

// User registration schema
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' })
            .max(50, { message: 'Name must be less than 50 characters' }),
        email: z
            .string()
            .email({ message: 'Please enter a valid email address' })
            .min(5, { message: 'Email must be at least 5 characters long' })
            .max(100, { message: 'Email must be less than 100 characters' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(100, { message: 'Password must be less than 100 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

// User login schema
export const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' })
});

// Reset password schema
export const resetPasswordSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' })
});

// New password schema
export const newPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(100, { message: 'Password must be less than 100 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

// Export types based on the schemas
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
