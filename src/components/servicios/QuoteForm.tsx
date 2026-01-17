// src/components/servicios/QuoteForm.tsx
import React, { useState } from "react";
import type {
	QuoteFormData,
	QuoteFormErrors,
} from "@interfaces/servicio/QuoteForm";

interface QuoteFormProps {
	serviceTitle: string;
	serviceId: number;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ serviceTitle, serviceId }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<QuoteFormData>({
		formTitle: serviceTitle,
		formType: "services",
		formId: serviceId,
		company: "",
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		message: "",
		privacyPolicyAndDataUse: false,
	});

	const [errors, setErrors] = useState<QuoteFormErrors>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value, type } = e.target;
		const checked =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		// Clear error when user starts typing
		if (errors[name as keyof QuoteFormErrors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const validate = (): boolean => {
		const newErrors: QuoteFormErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "El nombre es requerido";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "El apellido es requerido";
		}

		if (!formData.email.trim()) {
			newErrors.email = "El correo electrónico es requerido";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "El correo electrónico no es válido";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "El teléfono es requerido";
		}

		if (!formData.privacyPolicyAndDataUse) {
			newErrors.privacyPolicyAndDataUse =
				"Debe aceptar las políticas de privacidad";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setLoading(true);

		try {
			// Aquí iría la llamada a tu API
			// await cotizacionService.enviarCotizacion(formData);

			console.log("Form data:", formData);

			// Simular envío
			await new Promise((resolve) => setTimeout(resolve, 2000));

			alert("Cotización enviada exitosamente");

			// Reset form
			setFormData({
				formTitle: serviceTitle,
				formType: "services",
				formId: serviceId,
				company: "",
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
				message: "",
				privacyPolicyAndDataUse: false,
			});
		} catch (error) {
			console.error("Error al enviar cotización:", error);
			alert("Error al enviar la cotización. Por favor intente nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="bg-white pt-0 pb-0" id="form">
			<div className="container">
				<div className="bg-gradient-to-r from-grad-primary to-grad-secondary w-full rounded-2xl py-10 px-7 sm:py-12 sm:px-16 md:py-14 xl:py-28 xl:px-24">
					<p className="mt-6 text-center text-lg font-bold tracking-widest">
						COTIZA CON NOSOTROS
					</p>
					<p className="mt-6 text-center text-2xl font-extrabold tracking-widest">
						Estamos listos para ayudarte
					</p>

					<form
						onSubmit={handleSubmit}
						className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg"
					>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-10 lg:gap-x-24">
							{/* Service Title */}
							<div>
								<div className="border-b border-gray-350 leading-tight">
									<div className="font-bold py-2 text-black">
										{serviceTitle}
									</div>
								</div>
							</div>

							{/* Company */}
							<div>
								<input
									type="text"
									placeholder="Empresa"
									name="company"
									value={formData.company}
									onChange={handleChange}
									className="w-full px-4 py-2 border-b border-gray-350 bg-transparent text-black placeholder-gray-700 focus:outline-none focus:border-white"
								/>
							</div>

							{/* First Name */}
							<div>
								<input
									type="text"
									placeholder="Nombres"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									className="w-full px-4 py-2 border-b border-gray-350 bg-transparent text-black placeholder-gray-700 focus:outline-none focus:border-white"
								/>
								{errors.firstName && (
									<p className="text-red-500 text-sm mt-1">
										{errors.firstName}
									</p>
								)}
							</div>

							{/* Last Name */}
							<div>
								<input
									type="text"
									placeholder="Apellidos"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									className="w-full px-4 py-2 border-b border-gray-350 bg-transparent text-black placeholder-gray-700 focus:outline-none focus:border-white"
								/>
								{errors.lastName && (
									<p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
								)}
							</div>

							{/* Phone */}
							<div>
								<input
									type="text"
									placeholder="Teléfono"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									className="w-full px-4 py-2 border-b border-gray-350 bg-transparent text-black placeholder-gray-700 focus:outline-none focus:border-white"
								/>
								{errors.phone && (
									<p className="text-red-500 text-sm mt-1">{errors.phone}</p>
								)}
							</div>

							{/* Email */}
							<div>
								<input
									type="email"
									placeholder="Correo electrónico"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-2 border-b border-gray-350 bg-transparent text-black placeholder-gray-700 focus:outline-none focus:border-white"
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">{errors.email}</p>
								)}
							</div>

							{/* Message */}
							<div className="col-span-1 lg:col-span-2 mb-4 mt-4">
								<textarea
									name="message"
									rows={2}
									placeholder="Mensaje"
									value={formData.message}
									onChange={handleChange}
									className="w-full px-4 py-2 border-b border-gray-350 bg-transparent text-black placeholder-gray-700 focus:outline-none focus:border-white resize-none"
								/>
							</div>

							{/* Privacy Policy */}
							<div className="col-span-1 lg:col-span-2 mb-5">
								<label className="flex justify-center items-center text-black">
									<input
										type="checkbox"
										name="privacyPolicyAndDataUse"
										checked={formData.privacyPolicyAndDataUse}
										onChange={handleChange}
										className="form-checkbox"
									/>
									<span className="ml-2">
										He leído y acepto la{" "}
										<a
											href="/politica-de-privacidad"
											target="_blank"
											className="font-bold border-b border-black"
										>
											Política de Privacidad
										</a>{" "}
										y{" "}
										<a
											href="/uso-de-datos"
											target="_blank"
											className="font-bold border-b border-black"
										>
											Uso de Datos
										</a>
									</span>
								</label>
								{errors.privacyPolicyAndDataUse && (
									<p className="text-red-500 text-sm mt-1 text-center">
										{errors.privacyPolicyAndDataUse}
									</p>
								)}
							</div>

							{/* Submit Button */}
							<div className="col-span-1 lg:col-span-2 flex w-full justify-center">
								<button
									type="submit"
									disabled={loading}
									className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
								>
									{loading ? "Enviando..." : "Enviar mensaje"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};

export default QuoteForm;
