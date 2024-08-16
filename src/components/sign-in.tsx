import { signIn } from "@/auth";

export function SignIn() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("github", { redirectTo: "/" }); // redirects to the dashboard after signing in
			}}
		>
			<button type="submit">Signin with GitHub</button>
		</form>
	);
}
