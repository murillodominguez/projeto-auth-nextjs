import "server-only"

import { cookies } from "next/headers";
import { cache } from "react";
import { getUserFromSession } from "./session";
import { UserDAL } from "@/data/user/user.dal";
import { redirect } from "next/navigation";

const dal = await UserDAL.create()

type FullUser = Exclude<
    Awaited<ReturnType<typeof dal.getUserById>>,
    undefined | null
>

type User = Exclude<
    Awaited<ReturnType<typeof getUserFromSession>>,
    undefined | null
>

function _getCurrentUser(options: {
    withFullUser: true,
    redirectIfNotFound: true
}): Promise<FullUser>
function _getCurrentUser(options: {
    withFullUser: true,
    redirectIfNotFound?: false
}): Promise<FullUser | null>
function _getCurrentUser(options: {
    withFullUser?: false,
    redirectIfNotFound: true
}): Promise<User>
function _getCurrentUser(options: {
    withFullUser?: false,
    redirectIfNotFound?: false
}): Promise<User | null>
async function _getCurrentUser ({
    withFullUser = false,
    redirectIfNotFound = false
} = {}) {
    const user = await getUserFromSession(await cookies())

    if (user == null) {
        if (redirectIfNotFound) return redirect("/login")
        return null
    }

    const fullUser = withFullUser ? await dal.getUserById(user.id) : null

    if (withFullUser) {
        if (fullUser == null) throw new Error("User not found in database")
        return fullUser
    }

    return user
}

export const getCurrentUser = cache(_getCurrentUser)