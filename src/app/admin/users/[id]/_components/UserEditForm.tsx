'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userEditSchema, type UserEditFormData } from '@/lib/schemas';
import { updateUser } from '../_actions';

interface Role {
  id: string;
  name: string;
}

interface UserEditFormProps {
  userId: string;
  defaultValues: UserEditFormData;
  roles: Role[];
}

/**
 * Client form for editing a user's profile and role assignments.
 * Uses React Hook Form + Zod for validation before calling the server action.
 */
export const UserEditForm = ({ userId, defaultValues, roles }: UserEditFormProps) => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues,
  });

  const onSubmit = (data: UserEditFormData) => {
    startTransition(async () => {
      try {
        await updateUser(userId, data);
      } catch (error) {
        // redirect() throws internally — let Next.js handle it
        if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
          toast.error(error.message || 'Failed to save changes.');
        } else {
          throw error;
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile fields */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Edit the user&apos;s basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <Input id="firstName" type="text" disabled={isPending} {...register('firstName')} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <Input id="lastName" type="text" disabled={isPending} {...register('lastName')} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" disabled={isPending} {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Role assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Select one or more roles for this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="roleIds"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const checked = field.value.includes(role.id);
                  return (
                    <label key={role.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        disabled={isPending}
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...field.value, role.id]
                            : field.value.filter((id) => id !== role.id);
                          field.onChange(next);
                        }}
                      />
                      <span>{role.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.roleIds && (
            <p className="mt-2 text-xs text-destructive">{errors.roleIds.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
        <Button asChild variant="outline" disabled={isPending}>
          <Link href="/admin/users">Cancel</Link>
        </Button>
      </div>
    </form>
  );
};
