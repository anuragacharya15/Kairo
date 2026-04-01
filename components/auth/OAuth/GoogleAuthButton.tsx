'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function GoogleAuthButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <form onSubmit={handleSocialLogin} className="flex flex-col gap-4">
        
        {/* Button */}
        <Button
          type="submit"
          variant="outline"
          className="w-full h-10 flex items-center justify-center gap-2 border border-border hover:bg-muted/50 transition"
          disabled={isLoading}
        >
          {/* Google Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-4 h-4"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.61l6.91-6.91C35.64 2.29 30.21 0 24 0 14.61 0 6.33 5.38 2.44 13.22l8.04 6.24C12.31 13.11 17.69 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.21-.43-4.73H24v9.01h12.7c-.55 2.97-2.2 5.48-4.69 7.16l7.23 5.63C43.99 36.38 46.5 30.72 46.5 24z"/>
            <path fill="#FBBC05" d="M10.48 28.46a14.49 14.49 0 010-8.92l-8.04-6.24A23.96 23.96 0 000 24c0 3.84.92 7.47 2.44 10.7l8.04-6.24z"/>
            <path fill="#34A853" d="M24 48c6.21 0 11.64-2.05 15.52-5.56l-7.23-5.63c-2.01 1.35-4.6 2.14-8.29 2.14-6.31 0-11.69-3.61-13.52-8.96l-8.04 6.24C6.33 42.62 14.61 48 24 48z"/>
          </svg>

          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </Button>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}