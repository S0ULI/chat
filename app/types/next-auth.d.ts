import type { session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

type UserId = string

// we use declare when we some property is there but ts does not 
// so in here we are saying that in module 'next-auth' type of session is like below
declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId
        }
    }
}

// same thing here, we are saying in module 'next-auth/jwt' jwt has id witch is UserId (string)
declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
    }
}