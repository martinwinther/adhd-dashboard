import { Pool } from "@neondatabase/serverless";
import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
	const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
	return {
		adapter: PostgresAdapter(pool),
		providers: [github],
		callbacks: {
			authorized: async ({ auth }) => {
				// Logged in users are authenticated, otherwise redirect to login page
				return !!auth;
			},
		},
	};
});
