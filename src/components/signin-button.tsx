"use client";
import { handleSignIn } from "@/actions/signInAction";
import { useRouter } from "next/navigation";

export function SignInButton() {
	const router = useRouter();
	return (
		<form
			action={async (event) => {
				await handleSignIn(); // Perform sign-out action
			}}
		>
			<button type="submit">Sign In</button>
		</form>
	);
}
