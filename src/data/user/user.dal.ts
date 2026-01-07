import { prisma } from "../prisma";

import {
    UserInputSchema,
    UserInput,
    UserSchema,
    FullUserDTO,
    PartialUserDTO
} from "./user.dto";

export class UserDAL {
    private constructor() {}

    static create() {
        return new UserDAL()
    }

    async listUsers(): Promise<FullUserDTO[]> {
        const rows = await prisma.user.findMany({
            orderBy: { createdAt: "desc" }
        })

        return rows.map((r) => ({
            id: r.id,
            name: r.name,
            password: r.password,
            salt: r.salt,
            role: r.role,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }))
    }

    async checkUserExists(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })

        if (user) return true
        return false
    }
    
    async getUserByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        
        if (user) return user
        return null
    }
    
    async getUserNameById(id: number): Promise<string | null> {
        const user = await this.getUserById(id)
        
        return user ? user.name : null
    }

    async getUserById(id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })

        if (user) return user
        return null
    }


    async createUser(input: UserInput): Promise<FullUserDTO> {
        const parsed = UserInputSchema.safeParse(input)

        if (!parsed.success) {
            const message = parsed.error.issues
                .map((i) => `${i.path.join(".")}: ${i.message}`)
                .join(", ");
            throw new Error(`[UserDAL] ValidationError: ${message}`)
        }

        const user = await prisma.user.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                password: parsed.data.password,
                salt: parsed.data.salt,
            }
        })

        return ({
            id: user.id,
            name: user.name,
            password: user.password,
            salt: user.salt,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }
}