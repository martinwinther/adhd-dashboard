"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

const Navigation = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

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
						{/* Theme Switcher */}
						<div className="px-4 py-3">
							<ThemeSwitcher />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navigation;
