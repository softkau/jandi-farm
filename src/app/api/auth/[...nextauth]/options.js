import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';

export const authOptions = {
  debug: false,
  providers: [ // 여기에 다른 OAuth Providers 넣어줄 수도 있다(Github 등)
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    /** session callback 일단 중요해보이니까 적어놓기
     * @param {Session} session
     * @param {JWT} token
     * @param {AdapterUser} user
     */
    async session({ session, token, user }) {
      /* session 예시!
      session {
        user: {
          name: string,
          email: string,
          image: string
        },
        expires: Date
      } */

      // find mongoDB entry
      const sessionUser = await User.findOne({
        email: session.user.email
      });
      
      // set session.user.id to mongoDB objectID
      session.user.id = sessionUser._id.toString();

      return session;
    },
    //async redirect({ url, baseUrl }) {
    //  // go back to root when signIn or signOut.
    //  return baseUrl;
    //},
    async signIn({ profile }) {
      try {
        // connect to db
        await connectToDB();

        const userExists = await User.findOne({ email: profile.email });
        // add to user table if user doesn't exist already
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "_"),
            image: profile.picture
          });
        }

        return true;
      } catch (error) {
        console.log('[에러] 로그인 실패');
        console.log(error);
        return false;
      }
    }
  }
}