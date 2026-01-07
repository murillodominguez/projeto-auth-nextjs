import { NextResponse, type NextRequest } from "next/server"
import { getUserFromSession, updateUserSessionExpiration } from "./auth/session"
import { redisClient } from "./lib/redis"

const privateRoutes = ["/private", "/"]
const adminRoutes = ["/admin"] 

export async function proxy(request: NextRequest){
    const response = (await proxyAuth(request)) ?? NextResponse.next()

    updateUserSessionExpiration({
        set: (key, value, options) => {
            response.cookies.set({ ...options, name: key, value})
        },
        get: key => request.cookies.get(key)
    })

    const sessionId = request.cookies.get("session-id")?.value

    console.log(await redisClient.get(`session:${sessionId}`))

    return response
}

async function proxyAuth(request: NextRequest) {
    if (privateRoutes.includes(request.nextUrl.pathname)) {
        const user = await getUserFromSession(request.cookies)
        if (user == null) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    if (adminRoutes.includes(request.nextUrl.pathname)) {
        const user = await getUserFromSession(request.cookies)
        if (user == null) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        if (user.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ]
}