import type { NextAuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { loginSchema } from '@/lib/schemas';
import { authService } from '@/_services';
import { userRepository } from '@/_repositories';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials?: Record<'email' | 'password', string>) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await authService.validateCredentials(parsed.data.email, parsed.data.password);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          roles: user.roles,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // On sign-in: store initial roles (user id is stored as token.sub by NextAuth)
        token.roles = (user as { roles?: string[] }).roles;
      } else if (token.sub) {
        // On every subsequent request: refresh roles from DB so changes
        // (e.g. admin promoting a user) take effect without re-login
        const dbUser = await userRepository.findById(token.sub);
        if (dbUser) {
          token.roles = dbUser.roles;
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.roles = token.roles as string[] | undefined;
      }

      return session;
    },
  },
};
