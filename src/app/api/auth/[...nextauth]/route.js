import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  debug: false,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async session({ session }) {
      // get user session

      return session;
    },
    async signIn({ profile }) {
      // connect to db

      // add to user table if user doesn't exist already
      return true;
    }
  }
})

export { handler as GET, handler as POST }