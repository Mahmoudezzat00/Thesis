'use client'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { SignInWithGoogle } from '@/lib/actions/user.actions'

export function GoogleSignInForm({
  callbackUrl,
  enabled,
}: {
  callbackUrl: string
  enabled: boolean
}) {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className='w-full' variant='outline'>
        {pending ? 'Redirecting to Google...' : 'Sign In with Google'}
      </Button>
    )
  }

  if (!enabled) {
    return (
      <div className='space-y-2'>
        <Button disabled className='w-full' variant='outline'>
          Sign In with Google
        </Button>
        <p className='text-xs text-muted-foreground'>
          Google sign-in needs AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in
          .env.local.
        </p>
      </div>
    )
  }

  const signInWithGoogle = SignInWithGoogle.bind(null, callbackUrl)

  return (
    <form action={signInWithGoogle}>
      <SignInButton />
    </form>
  )
}
