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
import Link from "next/link";
import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center",
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
              Check your email
            </CardTitle>
            <CardDescription>
              We’ve sent password reset instructions
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center text-sm text-muted-foreground">
            If your account exists, you’ll receive a password reset link shortly.
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-xl border">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="text-primary" size={26} />
              </div>
            </div>

            <CardTitle className="text-2xl font-semibold">
              Forgot password?
            </CardTitle>

            <CardDescription>
              Enter your email and we’ll send you a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-5 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}