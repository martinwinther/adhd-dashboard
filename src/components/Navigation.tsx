"use client";

import { PowerIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";

import { SignInButton } from "./signin-button";
import { SignOutButton } from "./signout-button";
import { useSession } from "next-auth/react";

const Navigation = () => {
	// toggles the authentication status

	const [authenticationStatus, setAuthenticationStatus] = useState(false);
	const session = useSession();

	useEffect(() => {
		if (session.status === "authenticated") {
			setAuthenticationStatus(true);
		} else {
			setAuthenticationStatus(false);
		}
	}, [session.status]);

	const name = "Martin"; // placeholder for user name

	const checkStatus = () => {
		console.log(authenticationStatus);
		console.log(session.data);
	};

	return (
		<nav className="flex justify-between items-center px-2 w-full h-12 bg-gray-900 text-white">
			<h1 className="">ADHD - Dashboard</h1>

			<button onClick={checkStatus}>Status</button>
			{authenticationStatus ? <SignOutButton /> : <SignInButton />}

			{/* 
						changes what is rendered based on the authentication status
					*/}

			<div className="flex items-center">
				User: {name} <PowerIcon className="ms-2 w-6 h-6 text-white" />
			</div>
		</nav>
	);
};

export default Navigation;
