import { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { db } from "@lib/db/db"

// a function to check for nullity of our env keys
// if we don't have our envs it'll throw an error
// if we have them it'll return them
function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if(clientId || clientId?.length === 0){
        throw new Error('missing GOOGLE_CLIENT_ID')
    }
    if(clientSecret || clientSecret?.length === 0){
        throw new Error('missing GOOGLE_CLIENT_SECRET')
    }
    return {
        clientId: clientId ?? '',
        clientSecret: clientSecret ?? ''
    }
}


// our auth options
const authOptions: NextAuthOptions = {
    // an adapter to connect our authentication to our database
    adapter: UpstashRedisAdapter(db),
    // stating the strategy of our session
    session: {
        strategy: 'jwt'
    },
    // where our sign in page would be
    pages: {
        signIn: '/login',
    },
    // adding providers
    providers: [
        // google provider needs a client id and a client secret
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret
        })
    ],
    // next will execute these callbacks when something happens
    callbacks: {
        // next auth will call this function when jwt is created it has a token and a user and it must return our token object
        async jwt({token, user}){
            // and in here we will check wether the user exists in our database or not
            const dbUser = (await db.get(`user:${token.id}`)) as User | null
            if(!dbUser) {
                // if user does not exist then it will return empty token
                token.id = user!.id
                return token
            }
            // but if there was a user it will return our token with the proper data from users credentials which have been stored in user in jwt
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.image
            }
        },
        // next auth call this function when session is created
        async session({session, token}) {
            // if there is a token then we will put our token in our session and then we'll return the session
            if(token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session;
        },
        // it will redirect us after sign in
        redirect() {
            return '/dashboard'
        }
    }
}

export default authOptions