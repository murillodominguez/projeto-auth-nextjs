import { z } from 'zod';
import { UserRole } from '../../../generated/prisma/enums';

export const UserInputSchema = z.object({
    name: z.string().min(3).max(52),
    email: z.email(),
    password: z.string().min(128).max(128),
    salt: z.string().min(1)
});

export type UserInput = z.infer<typeof UserInputSchema>;

export const UserSchema = z.object({
    id: z.int().min(1),
    name: z.string().min(3).max(52),
    password: z.string().min(64).max(64),
    salt: z.string().min(1),
    role: z.enum(UserRole),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type FullUserDTO = z.infer<typeof UserSchema>
export type PartialUserDTO = Pick<FullUserDTO, "id" | "role">