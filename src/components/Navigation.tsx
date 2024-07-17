"use client";

import { User } from "lucide-react";
import React, { useEffect, useState } from "react";

import Navbar from "./Navbar";

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

	return (
		<Navbar
			authenticationStatus={authenticationStatus}
			toggleAuthentication={toggleAuthentication}
		/>
	);
};

export default Navigation;
