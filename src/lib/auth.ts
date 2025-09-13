import NextAuth from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from './db'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Demo login for development
        CredentialsProvider({
            id: "demo",
            name: "Demo Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "demo@example.com" }
            },
            async authorize(credentials) {
                if (!credentials?.email) return null

                // For demo purposes, allow any email ending with @demo.com
                if (credentials.email.endsWith('@demo.com')) {
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
                }

                return null
            }
        })
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
}