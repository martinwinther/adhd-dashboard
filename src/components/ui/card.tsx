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
			"bg-surface rounded-lg border border-accent shadow-sm overflow-hidden",
			"flex flex-col min-h-0", // Ensures proper flex behavior
			className
		)}>
			{(title || subtitle) && (
				<div className="px-4 py-3 border-b border-accent/60 bg-accent/10">
					{title && (
						<h2 className="text-lg font-semibold text-primary">{title}</h2>
					)}
					{subtitle && (
						<p className="text-sm text-muted mt-1">{subtitle}</p>
					)}
				</div>
			)}
			<div className="flex-1 p-4 min-h-0">
				{children}
			</div>
		</div>
	);
};
