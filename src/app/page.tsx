"use client";
import Navigation from "@/components/Navigation";
import Kanban from "@/app/dashboard/Kanban";
import WeeklyChecklist from "@/app/dashboard/WeeklyChecklist";
import DailyCheckList from "@/app/dashboard/DailyChecklist";
import Footer from "@/components/Footer";
import TodaysList from "@/app/dashboard/TodaysList";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function Home(session: Session) {
	return (
		<SessionProvider session={session}>
			<main className="flex flex-col justify-between h-screen">
				<Navigation />
				<div className="flex flex-col items-center flex-1">
					<div className="flex flex-row justify-between items-center w-10/12 mt-4">
						<Kanban />
						<TodaysList />
						<DailyCheckList />
					</div>

					<div className="w-10/12 py-4 flex-grow">
						<WeeklyChecklist />
					</div>
				</div>
				<Footer />
			</main>
		</SessionProvider>
	);
}
