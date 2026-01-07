import { getCurrentUser } from "@/auth/current-user";
import LoginForm from "@/components/forms/LoginForm";
import { redirect } from "next/navigation";

export default async function Login() {
    const user = await getCurrentUser({})
    if (user) redirect('/')
    return (
        <div className="w-full flex justify-center">
            <LoginForm />
        </div>
    )
}