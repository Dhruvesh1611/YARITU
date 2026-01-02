import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from '../../../../lib/dbConnect';
import Admin from '../../../../models/Admin';
import bcrypt from 'bcryptjs';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          await dbConnect();
          const user = await Admin.findOne({ username: credentials.username });
          if (!user) return null;
          const match = await bcrypt.compare(credentials.password, user.password);
          if (!match) return null;

          return { id: user._id.toString(), name: user.name || user.username, email: user.email, role: user.role || 'admin' };
        } catch (err) {
          console.error('Error authorizing admin user', err);
          return null;
        }
      },
    }),
  ],
  // Ensure the user's role is propagated into the JWT and session
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.role = token.role || 'user';
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});