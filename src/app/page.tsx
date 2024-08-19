import { Session } from "next-auth";
import Link from "next/link";

export default function Home(session: Session) {
	return (
		<main className="flex flex-col h-screen">
			<Link href="/dashboard/">Go To Dashboard</Link>
			<Link href="/login">Login</Link>
		</main>
	);
}
