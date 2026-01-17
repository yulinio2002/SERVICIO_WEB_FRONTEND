// src/components/servicios/ServiceContent.tsx
import React from "react";

interface ServiceContentProps {
	subtitle: string;
	title: string;
	description: string;
	content: string;
	features: string[];
	onQuoteClick: () => void;
}

const ServiceContent: React.FC<ServiceContentProps> = ({
	subtitle,
	title,
	description,
	content,
	features,
	onQuoteClick,
}) => {
	return (
		<section className="bg-white">
			<div className="container">
				<p className="subtitle text-center mb-4 2xl:mb-5">{subtitle}</p>
				<h1 className="title-xl text-center w-full max-w-4xl m-auto mb-6 2xl:mb-7">
					{title}
				</h1>
				<div className="html max-w-6xl m-auto text-center mb-10">
					{description && (
						<p className="text-lg mb-4 font-medium">{description}</p>
					)}
					{content && <p className="mb-6 text-gray-700">{content}</p>}

					{features && features.length > 0 && (
						<ul className="text-left max-w-3xl mx-auto space-y-3 mb-8">
							{features.map((feature, index) => (
								<li key={index} className="flex items-start">
									<span className="text-blue-primary mr-3 mt-1 text-xl">•</span>
									<span className="text-gray-700">{feature}</span>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="flex w-full justify-center">
					<button onClick={onQuoteClick} className="flex items-center group">
						<div className="view-more">
							<span>Cotizar</span>
							<div>
								<i className="las la-angle-right"></i>
							</div>
						</div>
					</button>
				</div>
			</div>
		</section>
	);
};

export default ServiceContent;


