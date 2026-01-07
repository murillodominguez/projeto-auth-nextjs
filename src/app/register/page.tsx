import { getCurrentUser } from "@/auth/current-user";
import RegisterForm from "@/components/forms/RegisterForm";
import { redirect } from "next/navigation";

export default async function Register() {
    const user = await getCurrentUser({})
    if (user) redirect('/')
    return (
        <div className="w-full flex justify-center">
            <RegisterForm />
        </div>
    )
}