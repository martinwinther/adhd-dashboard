import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
	subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ 
	children, 
	className,
	title,
	subtitle
}) => {
	return (
		<div className={cn(
			"bg-surface rounded-xl border-2 border-accent shadow-md overflow-hidden transition-all duration-200",
			"flex flex-col min-h-0 hover:shadow-lg", // Enhanced hover effect
			className
		)}>
			{(title || subtitle) && (
				<div className="px-6 py-4 border-b-2 border-accent/60 bg-accent/10">
					{title && (
						<h2 className="text-xl font-bold text-primary tracking-tight">{title}</h2>
					)}
					{subtitle && (
						<p className="text-sm text-muted mt-1 font-semibold">{subtitle}</p>
					)}
				</div>
			)}
			<div className="flex-1 p-6 min-h-0">
				{children}
			</div>
		</div>
	);
};
