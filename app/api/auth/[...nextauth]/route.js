import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          credentials.username === "admin" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "1",
            name: "Admin",
            role: "admin",
          };
        }

        if (
          credentials.username === "viewer" &&
          credentials.password === "viewer123"
        ) {
          return {
            id: "2",
            name: "Viewer",
            role: "viewer",
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
