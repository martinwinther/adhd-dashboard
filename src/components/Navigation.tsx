"use client";

import { PowerIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

const Navigation = () => {
	const [authenticationStatus, setAuthenticationStatus] = useState(false);

	// toggles the authentication status
	const toggleAuthentication = () => {
		setAuthenticationStatus(!authenticationStatus);
		console.log(authenticationStatus);
	};

	const name = "Martin"; // placeholder for user name

	return (
		<nav className="flex justify-between items-center px-2 w-full h-12 bg-gray-900 text-white">
			<h1 className="">ADHD - Dashboard</h1>
			{/* 
						changes what is rendered based on the authentication status
					*/}
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
