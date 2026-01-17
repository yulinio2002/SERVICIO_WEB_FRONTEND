import React, { ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
	className?: string;
	fullWidth?: boolean;
}

const Container: React.FC<ContainerProps> = ({
	children,
	className = "",
	fullWidth = false,
}) => {
	if (fullWidth) {
		return <div className={className}>{children}</div>;
	}

	return (
		<div
			className={`mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}
		>
			{children}
		</div>
	);
};

export default Container;
