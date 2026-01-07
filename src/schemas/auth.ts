import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string().min(4, "Your name must have minimum 4 characters").max(52, "Your name must contain at maximum 52 characters"),
    email: z.email("Please provide a valid email"),
    password: z.string().min(8, "Your password must be atleast")
})

export type SignUpData = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
    email: z.email("Please provide a valid email"),
    password: z.string().min(8, "Password must contain at least 8 characters")
})

export type SignInData = z.infer<typeof SignInSchema>