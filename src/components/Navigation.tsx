"use client";

import { PowerIcon, UserPlusIcon } from "@heroicons/react/16/solid";
//imports
import React, { useEffect, useState } from "react";

//component declaration
const Navigation = () => {
	const [authenticationStatus, setAuthenticationStatus] = useState(false);
	/*
    //login
	    //if logged out
	        //icon 1
	        //"login"
	    //if logged in
	        //icon 2
	        //"logout"
    */
	const toggleAuthentication = () => {
		setAuthenticationStatus(!authenticationStatus);
		console.log(authenticationStatus);
	};
	const name = "Martin";
	//settings
	//triple dots or widget
	//user description
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
