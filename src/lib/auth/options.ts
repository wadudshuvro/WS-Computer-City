import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { securityLog } from '@/lib/auth/securityLog';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim() || '';
        const password = credentials?.password || '';
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) {
          securityLog('login_failed', { email });
          return null;
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
          securityLog('login_failed', { email });
          return null;
        }
        const nextVersion = user.sessionVersion + 1;
        await prisma.user.update({ where: { id: user.id }, data: { sessionVersion: nextVersion } });
        securityLog('login_succeeded', { email, userId: user.id });
        return { id: user.id, email: user.email, name: user.name, role: user.role, sessionVersion: nextVersion };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: string }).role;
        token.sessionVersion = (user as { sessionVersion?: number }).sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid || '');
        session.user.role = String(token.role || '');
        session.user.sessionVersion = typeof token.sessionVersion === 'number' ? token.sessionVersion : undefined;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
