import { redirect } from 'next/navigation';

export default function Home() {
	// Automatically redirect to dashboard since there's no auth yet
	redirect('/dashboard');
}
