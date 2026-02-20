import { RegistrationForm } from './_components/RegistrationForm';
import { Badge } from '@/components/ui/badge';

export default function SignUpPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          Authentication
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold">Create account</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Join the course and start mastering GitHub Copilot with hands-on lessons.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="my-12">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
