import Navigation from "@/components/Navigation";
import Kanban from "@/app/dashboard/components/Kanban";
import WeeklyChecklist from "@/app/dashboard/components/WeeklyChecklist";
import DailyCheckList from "@/app/dashboard/components/DailyChecklist";
import Footer from "@/components/Footer";
import TodaysList from "@/app/dashboard/components/TodaysList";
import { SessionProvider } from "next-auth/react";
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
