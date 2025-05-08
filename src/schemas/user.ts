
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  is_active: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginCredentialsSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;


export const RegisterCredentialsSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;
    