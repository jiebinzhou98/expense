//home page
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const sb = await createSupabaseServerClient();
  const {data} = await sb.auth.getUser();
  const user = data.user;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">
          {user ? `Welcome back ${user.email ?`, ${user?.email}` : ''}!` : 'Welcome}'}
        </h1>
        <p className="text-muted-foreground">
          {user ? 'Start by creating an account (e.g., usage, savings) and a few categories.' : 'Create an account to start tracking your expenses.'}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-2">Quick actions</h2>
          <Separator className="my-3"/>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link href="/accounts">Add account</Link></Button>
            <Button asChild variant="secondary"><Link href="/categories">Add Category</Link></Button>
            <Button asChild variant="outline"><Link href="transactions">Add Transactions</Link></Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-2">This Month</h2>
          <Separator className="my-3"/>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Expenses</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Income</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-2">Recent Activity</h2>
          <Separator className="my-3"/>
          <p className="text-sm text-muted-foreground">No Transactions Yet</p>
        </Card>
      </section>
    </main>
  )
}