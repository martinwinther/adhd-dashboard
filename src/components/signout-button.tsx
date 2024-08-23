import { handleSignOut } from "@/actions/signOutAction";
import { useRouter } from "next/navigation";

export function SignOutButton() {
	const router = useRouter();
	return (
		<form
			action={async (event) => {
				await handleSignOut(); // Perform sign-out action
				router.push("/"); // Redirect to the homepage or another route
			}}
		>
			<button type="submit">Sign Out</button>
		</form>
	);
}
