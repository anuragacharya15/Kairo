import { createClient } from "@/lib/supabase/server";
import { Button } from "../ui/button";
import Link from "next/link";
import { NavbarUser } from "..//NavbarUser";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="h-9 px-4 text-sm font-medium hover:bg-muted/50"
        >
          <Link href="/auth/login">Sign in</Link>
        </Button>

        <Button
          asChild
          size="sm"
          className="h-9 px-4 text-sm font-medium shadow-sm"
        >
          <Link href="/auth/sign-up">Get Started</Link>
        </Button>

      </div>
    );
  }

  return (
    <div className="flex items-center">
      <NavbarUser
        name={user.user_metadata?.full_name || ""}
        email={user.email!}
      />
    </div>
  );
}