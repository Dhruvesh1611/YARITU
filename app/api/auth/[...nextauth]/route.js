import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        // This is where you would add your own logic to validate the credentials
        // For this example, we'll use a hardcoded admin user
        if (
          credentials.username === "admin" &&
          credentials.password === "password"
        ) {
          // include a role property so we can expose it on the session
          return { id: "1", name: "Admin", email: "admin@example.com", role: 'admin' };
        }
        return null;
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