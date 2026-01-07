import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { getCurrentUser } from "@/auth/current-user"
import { Button } from "./ui/button"
import { logout } from "@/app/actions"

export default async function Header() {
  const user = await getCurrentUser({withFullUser: true, redirectIfNotFound: false})

  return (
    <div className="flex justify-between items-center bg-[#0000FF] dark:bg-[#000000] dark:border-b-1 dark:border-gray-900 w-screen h-10 p-5 mb-3">
        <h1 className="font-bold text-xxl">ArticleRepo</h1>
        <nav>
          <ul className="flex items-center gap-3">
            { !user && <li className="font-bold transition cursor-pointer"><Link href="/register">Sign Up</Link></li>}
            { !user && <li className="font-bold transition cursor-pointer"><Link href="/login">Sign In</Link></li>}
            { user && <p>{user.name}</p>}
            <li className="font-bold transition cursor-pointer"><Link href="/">Home</Link></li>
            { user && <form action={logout}><button className="font-bold transition cursor-pointer" type="submit">Logout</button></form>}
            <ThemeToggle />
          </ul>
        </nav>
    </div>
  )
}