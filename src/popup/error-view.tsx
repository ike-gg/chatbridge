interface ErrorProps {
	message: string;
	title?: string;
}

export const ErrorView = ({ message, title = "Error" }: ErrorProps) => {
	return (
		<div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 w-80 min-h-[200px] flex flex-col items-center justify-center">
			<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
				<svg
					className="w-8 h-8 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Error"
				>
					<title>Error</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<h1 className="text-xl font-bold text-red-700 mb-2">{title}</h1>
			<p className="text-sm text-red-600 text-center max-w-xs">{message}</p>
		</div>
	);
};
