import Navigation from "@/components/Navigation";
import Kanban from "@/app/dashboard/components/Kanban";
import WeeklyChecklist from "@/app/dashboard/components/WeeklyChecklist";
import DailyCheckList from "@/app/dashboard/components/DailyChecklist";
import Footer from "@/components/Footer";
import TodaysList from "@/app/dashboard/components/TodaysList";

export default function Home() {
	return (
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
	);
}
