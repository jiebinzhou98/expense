import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TopNav() {
  const sb = await createSupabaseServerClient();
  const {data} = await sb.auth.getUser();
  const user = data.user;

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">Expense Tracker</Link>

        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/accounts" className="text-sm underline">Accounts</Link>
            <Link href="/categories" className="text-sm underline">Categories</Link>
            <Link href="/transactions" className="text-sm underline">Transactions</Link>
            <SignOutButton/>
          </div>
        ): (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm underline">Log in</Link>
            <Link href="/register" className="text-sm underline">Create Account</Link>
          </div>
        )}
      </div>
    </header>
  )
}