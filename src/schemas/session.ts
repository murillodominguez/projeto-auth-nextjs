
import { z } from 'zod'
import { UserRole } from '../../generated/prisma/enums'

export const UserSessionSchema = z.object({
    id: z.number(),
    role: z.enum(UserRole)
})

export type UserSession = z.infer<typeof UserSessionSchema>

export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean,
            httpOnly?: boolean,
            sameSite?: 'strict' | 'lax',
            expires?: number
        }
    ) => void
    get: (key: string) => {name: string; value: string} | undefined
    delete: (key: string) => void
}