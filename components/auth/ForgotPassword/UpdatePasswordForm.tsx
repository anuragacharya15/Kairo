"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);

      // small delay for UX
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        className
      )}
      {...props}
    >
      {success ? (
        <Card className="w-full max-w-md shadow-xl border">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="text-green-600" size={26} />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Password updated
            </CardTitle>
            <CardDescription>
              Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-xl border">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="text-primary" size={26} />
              </div>
            </div>

            <CardTitle className="text-2xl font-semibold">
              Set new password
            </CardTitle>

            <CardDescription>
              Enter a strong password to secure your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Button */}
                <Button
                  type="submit"
                  className="w-full font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Update password"}
                </Button>

              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}