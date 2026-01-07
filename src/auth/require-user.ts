import "server-only"
import { cache } from "react";
import { getCurrentUser } from "./current-user";
import { redirect } from "next/navigation";

export const requireUser = cache(async () => {
  const user = await getCurrentUser({withFullUser: true});
  if (!user) {
    redirect('/login')
  }
  return user;
});