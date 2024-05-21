import { fetchPets } from "@/lib/data";

export default async function AllPets() {
	const pets = await fetchPets();
	const key = 1;
	return (
		<div>
			{pets.map((pet) => (
				<div key={key + 1}>
					<p>{pet.name}</p>
					<p>{pet.owner}</p>
				</div>
			))}
		</div>
	);
}
