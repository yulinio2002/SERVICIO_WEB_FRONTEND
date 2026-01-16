// src/components/common/QuoteButton.tsx
import React from "react";

interface QuoteButtonProps {
	text?: string;
	onClick?: () => void;
	className?: string;
	buttonClassName?: string;
}

const QuoteButton: React.FC<QuoteButtonProps> = ({
	text = "Cotizar",
	onClick,
	className = "",
	buttonClassName = "",
}) => {
	return (
		<div className={`flex w-full justify-center ${className}`}>
			<button
				onClick={onClick}
				className={`flex items-center group ${buttonClassName}`}
			>
				<div className="view-more">
					<span>{text} </span>
					<div className="h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center ml-3 group-hover:bg-orange-600 transition-colors duration-300">
						<i className="las la-angle-right text-white text-xs"></i>
					</div>
				</div>
			</button>
		</div>
	);
};

export default QuoteButton;
