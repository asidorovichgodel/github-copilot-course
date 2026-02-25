import Link from 'next/link';

import { RegistrationForm } from './_components/RegistrationForm';

export default function SignUpPage() {
  return (
    <div className='w-full lg:grid lg:min-h-svh lg:grid-cols-2'>
      <div className='flex items-center justify-center py-12'>
        <div className='mx-auto grid w-[360px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-semibold tracking-tight'>Create account</h1>
            <p className='text-balance text-sm text-muted-foreground'>
              Create an account to start managing candidate profiles.
            </p>
          </div>
          <RegistrationForm />
          <p className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link href='/sign-in' className='underline underline-offset-4'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className='hidden bg-muted lg:block'>
        <img
          src='/placeholder.svg'
          alt='CV Manager workspace'
          className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  );
}
