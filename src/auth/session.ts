import {
    UserSessionSchema,
    UserSession,
    Cookies
} from '@/schemas/session'
import crypto from 'crypto'
import { redisClient } from '@/lib/redis'

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
export const COOKIE_SESSION_KEY = "session-id"

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
    const sessionId = getSessionIdFromCookie(cookies)
    return getUserSessionById(sessionId)
}

function getSessionIdFromCookie(cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (!sessionId) return null
    return sessionId
}

export async function deleteUserSessionFromRedis(cookies: Pick<Cookies, "get">) {
    const sessionId = getSessionIdFromCookie(cookies)

    try {
        const result = await redisClient.del(`session:${sessionId}`)
        if (result == 1) console.log(`[RedisDeleteSession] Deleted user session id: ${sessionId}`)
        else throw new Error("[RedisDeleteSession] Session key not found or not deleted")
        console.log("[deleteUserSession] Successfully deleted session from cookies")
    } catch(err) {
        console.error(err)
    }
}

export async function updateUserSession(user: UserSession, cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    try {
        await redisClient.set(`session:${sessionId}`, JSON.stringify(UserSessionSchema.parse(user)), "EX", SESSION_EXPIRATION_SECONDS)
        console.log(`[RedisUpdateSession] Updated session for user id = ${user.id}`)
    } catch(err) {
        throw new Error(`[RedisUpdateSession] ${err}`)
    }
}

export async function updateUserSessionExpiration(
    cookies: Pick<Cookies, "get" | "set">
) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    const user = await getUserSessionById(sessionId)
    if (user == null) return

    try {
        await redisClient.set(`session:${sessionId}`, JSON.stringify(user), "EX", SESSION_EXPIRATION_SECONDS)
        console.log(`[RedisUpdateSession] Refresh session for user id = ${user.id}`)
    } catch(err) {
        throw new Error(`[RedisUpdateSession] ${err}`)
    }

    try {
        setCookie(sessionId, cookies)
        console.log(`[updateUserSessionExpiration] Refresh session for user id = ${user.id}`)
    } catch (err) {
        throw new Error(`[updateUserSessionExpiration] ${err}`)
    }
}

export async function createUserSession(user: UserSession, cookies: Pick<Cookies, "set">) {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    
    try {
        await redisClient.set(`session:${sessionId}`, JSON.stringify(UserSessionSchema.parse(user)), "EX", SESSION_EXPIRATION_SECONDS)
        console.log(`[RedisCreateSession] Setted session key for user id = ${user.id}`)
    } catch(err) {
        throw new Error(`[RedisCreateSession] ${err}`)
    }
    
    setCookie(sessionId, cookies)
}


async function getUserSessionById(sessionId: string | null ) {
    const rawSession = await redisClient.get(`session:${sessionId}`)
    if (!rawSession) return null

    const { success, data: user } =  UserSessionSchema.safeParse(JSON.parse(rawSession))

    return success ? user : null
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
}