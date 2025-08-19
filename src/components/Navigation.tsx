"use client";

import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

const Navigation = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const name = "Martin"; // placeholder for user name

	// Close dropdown when clicking outside or pressing Escape
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscapeKey);
		
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, []);

	const handleSignOut = () => {
		// TODO: Implement sign out functionality
		console.log("Sign out clicked");
		setIsDropdownOpen(false);
	};

	const handleSettings = () => {
		// TODO: Implement settings functionality
		console.log("Settings clicked");
		setIsDropdownOpen(false);
	};

	return (
		<div className="fixed top-4 right-4 z-50">
			{/* User Menu */}
			<div className="relative">
				<button
					ref={buttonRef}
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					className="flex items-center justify-center w-12 h-12 bg-surface/90 backdrop-blur-xl rounded-full shadow-lg border border-accent/60 hover:bg-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:shadow-xl"
					aria-label="User menu"
				>
					<UserCircleIcon className="w-6 h-6 text-primary" />
				</button>

				{/* Dropdown Menu */}
				{isDropdownOpen && (
					<div
						ref={dropdownRef}
						className="absolute right-0 mt-2 w-80 bg-surface/95 backdrop-blur-xl rounded-xl shadow-xl border border-accent/60 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
					>
						{/* User Info */}
						<div className="px-4 py-3 border-b border-accent/60">
							<p className="text-sm font-medium text-primary">{name}</p>
							<p className="text-xs text-muted">Signed in</p>
						</div>

						{/* Theme Switcher */}
						<div className="px-4 py-3 border-b border-accent/60">
							<ThemeSwitcher />
						</div>

						{/* Menu Items */}
						<div className="py-1">
							<button
								onClick={handleSettings}
								className="flex items-center w-full px-4 py-2.5 text-sm text-primary hover:bg-accent/10 transition-colors duration-150 rounded-lg mx-1"
							>
								<Cog6ToothIcon className="w-4 h-4 mr-3 text-muted" />
								Settings
							</button>
							<button
								onClick={handleSignOut}
								className="flex items-center w-full px-4 py-2.5 text-sm text-primary hover:bg-accent/10 transition-colors duration-150 rounded-lg mx-1"
							>
								<ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-muted" />
								Sign Out
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navigation;
