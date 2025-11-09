import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TopNav() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        {/* Left side — brand */}
        <Link
          href="/"
          className="font-semibold text-lg text-gray-900 hover:text-primary transition-colors"
        >
          Expense Tracker
        </Link>

        {/* Right side — nav links */}
        {user ? (
          <nav className="flex items-center gap-5">
            <Link
              href="/accounts"
              className="text-sm text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Accounts
            </Link>
            <Link
              href="/categories"
              className="text-sm text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/transactions"
              className="text-sm text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Transactions
            </Link>

            {/* Sign out button */}
            <SignOutButton/>
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Create Account
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
