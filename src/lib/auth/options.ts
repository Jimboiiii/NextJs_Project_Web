import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        type RawUser = {
          id: number;
          name: string;
          email: string;
        };

        if (
          credentials?.email === 'admin@admin.com' &&
          credentials?.password === 'admin123'
        ) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
          } as User;
        }

        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const users: RawUser[] = await res.json();

        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.name === credentials?.password
        );

        if (user) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          } as User;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
