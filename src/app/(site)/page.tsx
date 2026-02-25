import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Command, ShieldCheck, Sparkles, Timer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const highlights = [
  {
    title: 'Comprehensive lessons',
    description:
      'Move from onboarding to advanced prompting with bite-sized, practical guidance.',
  },
  {
    title: 'Practical examples',
    description: 'See real-world scenarios for testing, refactors, and API design.',
  },
  {
    title: 'Hands-on exercises',
    description: 'Apply the skills immediately with structured practice workflows.',
  },
];

const outcomes = [
  'Craft prompts that steer Copilot toward high-signal suggestions.',
  'Speed up repetitive work without sacrificing quality or review standards.',
  'Use Copilot Chat to debug, refactor, and document with confidence.',
  'Assess security risks in AI-generated code before shipping.',
  'Build repeatable workflows for team-wide adoption.',
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Badge className="w-fit" variant="secondary">
            Updated for 2026
          </Badge>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
              Master GitHub Copilot with a modern, hands-on course.
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Learn how to design prompts, review AI output, and ship features faster without
              compromising quality.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/lessons">
                Start learning
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/YOUR_USERNAME/github-copilot-course"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span>10+ guided lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Security-aware workflows</span>
            </div>
            <div className="flex items-center gap-2">
              <Command className="h-4 w-4" />
              <span>Prompting playbooks</span>
            </div>
          </div>
        </div>

        <Card className="border-muted/60 shadow-lg shadow-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-5 w-5" />
              Learning flight plan
            </CardTitle>
            <CardDescription>
              A curated path that blends instruction, practice, and peer-review habits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 rounded-xl border bg-background/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Prompting fundamentals</span>
                <Badge variant="secondary">Week 1</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Copilot Chat workflows</span>
                <Badge variant="secondary">Week 2</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Security & QA readiness</span>
                <Badge variant="secondary">Week 3</Badge>
              </div>
            </div>
            <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              Pair each lesson with challenge prompts and review checklists to build confidence.
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/lessons">Browse the syllabus</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} className="border-muted/60">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">What you will learn</h2>
          <p className="text-muted-foreground">
            Build a repeatable workflow to plan, prompt, and validate Copilot output across your
            daily work.
          </p>
          <div className="grid gap-3">
            {outcomes.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <Card className="border-muted/60">
          <CardHeader>
            <CardTitle>Best practices toolkit</CardTitle>
            <CardDescription>
              Templates, checklists, and prompts that stay useful long after the course ends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-background/60 p-4">
              <p className="text-sm font-semibold">Prompting checklist</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clarify intent, add constraints, and include examples to guide Copilot faster.
              </p>
            </div>
            <div className="rounded-xl border bg-background/60 p-4">
              <p className="text-sm font-semibold">Review rubric</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Validate output for security, edge cases, and maintainability.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
