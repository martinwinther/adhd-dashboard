import { PowerIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import { auth } from "../auth";

const Navbar = async ({ authenticationStatus, toggleAuthentication }) => {
	const session = await auth();
	return (
		<nav className="flex justify-between items-center px-2 w-full h-12 bg-gray-900 text-white">
			<h1 className="">ADHD - Dashboard</h1>
			<div>
				User: {session?.user?.name}
				<PowerIcon className="ms-2 w-6 h-6 text-white" />
			</div>

			<button onClick={toggleAuthentication}>
				{authenticationStatus ? (
					<div className="flex items-center"></div>
				) : (
					<UserPlusIcon className="size-6 text-white" />
				)}
			</button>
		</nav>
	);
};
export default Navbar;
