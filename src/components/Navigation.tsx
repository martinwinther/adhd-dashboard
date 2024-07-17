"use client";

import { PowerIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";

//component declaration

/* async function UserAvatar() {
	const session = await auth();

	return (
		<div>
			<img src={session.user.image} alt="User Avatar" />
		</div>
	);
} */

const Navigation = () => {
	const [authenticationStatus, setAuthenticationStatus] = useState(false);

	const toggleAuthentication = () => {
		setAuthenticationStatus(!authenticationStatus);
		console.log(authenticationStatus);
	};
	const name = "Martin";

	return (
		<nav className="flex justify-between items-center px-2 w-full h-12 bg-gray-900 text-white">
			<h1 className="">ADHD - Dashboard</h1>

			<button onClick={toggleAuthentication}>
				{authenticationStatus ? (
					<div className="flex items-center">
						User: {name} <PowerIcon className="ms-2 w-6 h-6 text-white" />
					</div>
				) : (
					<UserPlusIcon className="size-6 text-white" />
				)}
			</button>
		</nav>
	);
};

export default Navigation;
