'use server'

import { CreateArticleFormData, CreateArticleFormSchema } from '@/schemas/blog'
import { UserDAL } from '@/data/user/user.dal'
import { ArticleCreateInput } from '@/data/blog/blog.dto'
import { revalidatePath } from 'next/cache'
import { BlogDAL } from '@/data/blog/blog.dal'
import { SignInData, SignInSchema, SignUpData, SignUpSchema } from '@/schemas/auth'
import { comparePasswords, generateSalt, hashPassword } from '@/auth/password-hasher'
import { redirect } from 'next/navigation'
import { createUserSession, deleteUserSessionFromRedis } from '@/auth/session'
import { cookies } from 'next/headers'
import { COOKIE_SESSION_KEY } from '@/auth/session'
import { getCurrentUser } from '@/auth/current-user'

export async function createArticleAction(data: CreateArticleFormData) {
    const user = await getCurrentUser({})
    console.log(user)
    if (!user) throw new Error("[createArticleAction] No user signed for post")

    const parsed = CreateArticleFormSchema.safeParse(data)

    if (!parsed.success) {
        console.error("[createArticleAction] Invalid input format")
        return {
            ok: false as const,
            error: parsed.error.issues
                .map((i) => `[createArticleAction] ${i.path.join(".")}: ${i.message}`)
                .join(", ")
        }
    }

    try {
        const dal = await BlogDAL.create();
        const created = await dal.createArticle(data)
        revalidatePath('/')
        console.log(`[createArticleAction] Created article id="${created.id}" by user id=${user.id}`)
        return { ok: true as const, postId: created.id }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(message)
        return { ok: false as const, error: message }
    }

}

export async function signIn(unsafeData: SignInData) {
    const { success, data } = SignInSchema.safeParse(unsafeData)

    if (!success) {
        console.error("Deu ruim no sign in")
        return { ok: false, error: "Wrong credentials"}
    }

    try {
        const dal = UserDAL.create()
        const user = await dal.getUserByEmail(data.email)
        
        if (!user) return { ok: false, error: "Wrong credentials"}

        const isCorrectPassword = await comparePasswords({
            hashedPassword: user.password,
            password: data.password,
            salt: user.salt
        })

        if (!isCorrectPassword) { 
            return { ok: false, error: "Wrong credentials"}
        }

        await createUserSession(user, await cookies())

    } catch(err) {
        console.error("[signInAction]",err)
        return { ok: false, error: "Internal Server Error. Please report to support team" }
    } 

    redirect('/')

}

export async function signUp(unsafeData: SignUpData) {
    const { success, data } = SignUpSchema.safeParse(unsafeData)

    if (!success){
        console.error("Deu ruim no sign up")
        return {ok: false, error: "Unable to create account"}
    }

    const salt = generateSalt()
    const hashedPassword = await hashPassword(data.password, salt)

    try {
        const dal = UserDAL.create();
        if (await dal.checkUserExists(data.email)) {
            console.error('Account already exists')
            return { ok: false as const, error: "Account with this email already exists" }
        }
        const formattedUser = {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            salt: salt,
        }
        const user = await dal.createUser(formattedUser)
        
        if (!user) return { ok: false as const, error: "Unable to create account" }

        await createUserSession(user, await cookies())
        console.log('Account created successfully', user)
        redirect('/')

    } catch(err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error('[signUpAction]', message)
        return { ok: false as const, error: message }
    }
}

export async function logout() {
    const cookie = await cookies()
    deleteUserSessionFromRedis(cookie)
    cookie.delete(COOKIE_SESSION_KEY)
    console.log("[logout] Successfully deleted session from cookies")
    redirect('/')
}