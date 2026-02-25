import { requireAuth } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';
import { ProfileCard } from './_components/ProfileCard';

export const metadata = {
  title: 'My Profile',
};

type UserWithRoles = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  roles: Array<{ role: { name: string } }>;
};

async function getUser(id: string): Promise<UserWithRoles | null> {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  }) as Promise<UserWithRoles | null>;
}

export default async function ProfilePage() {
  const session = await requireAuth();
  const user = await getUser(session.user.id);

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Your account information and roles.
        </p>
      </div>

      <ProfileCard
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles.map((r) => r.role.name),
        }}
      />
    </div>
  );
}
