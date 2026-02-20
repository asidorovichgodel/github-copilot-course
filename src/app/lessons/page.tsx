import { Filter, Timer } from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const lessons = [
  {
    title: 'Introduction to GitHub Copilot',
    description: 'Learn the basics of Copilot, editor setup, and the core prompting loop.',
    duration: '35 min',
    level: 'Foundations',
    status: 'Coming soon',
  },
  {
    title: 'Writing Effective Prompts',
    description: 'Structure prompts that surface better suggestions and reduce back-and-forth.',
    duration: '45 min',
    level: 'Core',
    status: 'Coming soon',
  },
  {
    title: 'GitHub Copilot Chat',
    description: 'Explore chat-first workflows for refactors, tests, and documentation.',
    duration: '40 min',
    level: 'Core',
    status: 'Coming soon',
  },
  {
    title: 'Best Practices & Security',
    description: 'Mitigate risk with security checklists, validations, and review strategies.',
    duration: '50 min',
    level: 'Advanced',
    status: 'Coming soon',
  },
];

export default function LessonsPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          Lessons
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold">Course lessons</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Learn GitHub Copilot through structured lessons, short exercises, and real-world
            workflows.
          </p>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <div className="min-w-[240px] flex-1">
          <Input aria-label="Search lessons" placeholder="Search lessons" type="search" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Lesson level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Foundations</DropdownMenuItem>
            <DropdownMenuItem>Core</DropdownMenuItem>
            <DropdownMenuItem>Advanced</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="secondary">Notify me</Button>
      </section>

      <section className="grid gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.title} className="border-muted/60">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                <CardDescription className="mt-2 max-w-2xl">
                  {lesson.description}
                </CardDescription>
              </div>
              <Badge variant="secondary">{lesson.status}</Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{lesson.duration}</span>
              </div>
              <div className="rounded-full border px-3 py-1 text-xs font-semibold text-foreground">
                {lesson.level}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button variant="outline">Preview outline</Button>
              <Button disabled>Start lesson</Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
