import { sql } from "@vercel/postgres";

type Pet = {
	name: string;
	owner: string;
};

export async function fetchPets() {
	try {
		const data = sql<Pet>`SELECT * FROM Pets;`;
		return (await data).rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch pet data.");
	}
}
