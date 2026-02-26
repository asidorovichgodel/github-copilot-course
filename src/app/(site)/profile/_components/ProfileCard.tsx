'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Edit2, Mail, Save, User, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { userProfileSchema, type UserProfileFormData } from '@/lib/schemas/userSchemas';
import { updateProfile } from '@/app/_actions/profileActions';

type Props = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  };
};

/**
 * Profile card with inline edit mode.
 * Uses React Hook Form + Zod for client-side validation before calling the
 * updateProfile server action (which re-validates on the server).
 */
export function ProfileCard({ user }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  const onSubmit = (data: UserProfileFormData) => {
    startTransition(async () => {
      try {
        await updateProfile(data);
        toast.success('Profile updated successfully.');
        setEditing(false);
      } catch (error) {
        if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
          toast.error(error.message || 'Failed to save changes.');
        } else {
          throw error;
        }
      }
    });
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>General information associated with your account.</CardDescription>
        </div>

        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <Input id="firstName" disabled={isPending} {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <Input id="lastName" disabled={isPending} {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" disabled={isPending} {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Roles — read-only */}
            <div>
              <p className="text-sm font-medium">Roles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? 'Saving…' : 'Save changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                <p className="mt-1 text-base">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                <p className="mt-1 text-base">{user.lastName}</p>
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mt-1 flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email}
              </p>
            </div>

            {/* Roles */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
