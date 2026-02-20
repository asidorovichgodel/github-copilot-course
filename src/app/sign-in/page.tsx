import { LoginForm } from './_components/LoginForm';
import { Badge } from '@/components/ui/badge';

export default function SignInPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          Authentication
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold">Sign in</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Access your course progress and personalized learning experience.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="my-12">
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
