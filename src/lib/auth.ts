import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
    providers: [
        // Demo login for development
        CredentialsProvider({
            id: "demo",
            name: "Demo Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "demo@demo.com" }
            },
            async authorize(credentials) {
                if (!credentials?.email) return null

                // For demo purposes, allow any email ending with @demo.com
                if (credentials.email.endsWith('@demo.com')) {
                    try {
                        let user = await prisma.user.findUnique({
                            where: { email: credentials.email }
                        })

                        if (!user) {
                            user = await prisma.user.create({
                                data: {
                                    email: credentials.email,
                                    name: credentials.email.split('@')[0],
                                }
                            })
                        }

                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                        }
                    } catch (error) {
                        console.error('Demo auth error:', error)
                        return null
                    }
                }

                return null
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}