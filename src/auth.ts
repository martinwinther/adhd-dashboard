// src/auth.ts (or wherever your auth middleware is defined)
import { Pool } from "@neondatabase/serverless";
import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
	const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
	return {
		adapter: PostgresAdapter(pool),
		providers: [github, Google],
	};
});
