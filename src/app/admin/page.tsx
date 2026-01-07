import { getCurrentUser } from "@/auth/current-user"

export default async function Admin() {
    const user = await getCurrentUser({withFullUser: true, redirectIfNotFound: true})
    return (
        <div>Welcome back, admin! Your name is {user.name}</div>
    )
}