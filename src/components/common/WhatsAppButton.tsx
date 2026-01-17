// src/components/common/WhatsAppButton.tsx
import React from "react";

const WhatsAppButton: React.FC = () => {
	const phoneNumber = "51981276880";
	const message =
		"Hola Oleohidraulics, quisiera información sobre sus servicios.";
	const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(
		message,
	)}&app_absent=0`;

	return (
		<a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
			aria-label="Contactar por WhatsApp"
		>
			<img
				src="/icons/whatsapp.jpg"
				alt="WhatsApp"
				className="w-full h-full object-contain"
			/>
		</a>
	);
};

export default WhatsAppButton;
