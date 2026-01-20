import { useState } from 'react';
import Container from '../components/common/Container';

const Contacto = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company: '',
    form_title: '',
    email: '',
    message: '',
    privacy_policy_and_data_use: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
		<div className="wrapper bg-white">
			{/* Contact Form Section */}
			<section
				className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg pt-4 pb-12"
				id="form"
			>
				<Container>
					<div className="w-full rounded-2xl py-10 px-7 md:px-10 lg:py-28 lg:px-24">
						<p className="subtitle text-center mb-4 2xl:mb-5 text-black">
							CONTACTO
						</p>
						<h1 className="title-xl text-center w-full max-w-7xl m-auto mb-6 xl:mb-7 text-black font-bold text-3xl lg:text-4xl">
							¡Trabajemos juntos!
						</h1>
						<p className="text-center mb-14 md:mb-20 text-black">
							Escríbenos y uno de nuestros especialistas se pondrá en contacto
							contigo a la brevedad.
						</p>

						<form onSubmit={handleSubmit}>
							<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-24">
								<div>
									<input
										type="text"
										placeholder="Nombres"
										name="first_name"
										value={formData.first_name}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary"
										aria-label="Nombres"
									/>
								</div>
								<div>
									<input
										type="text"
										placeholder="Apellidos"
										name="last_name"
										value={formData.last_name}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary"
										aria-label="Apellidos"
									/>
								</div>
								<div>
									<input
										type="text"
										placeholder="Teléfono"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary"
										aria-label="Teléfono"
									/>
								</div>
								<div>
									<input
										type="text"
										placeholder="Empresa"
										name="company"
										value={formData.company}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary"
										aria-label="Empresa"
									/>
								</div>
								<div>
									<input
										type="text"
										placeholder="Tipo de servicio"
										name="form_title"
										value={formData.form_title}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary"
										aria-label="Tipo de servicio"
									/>
								</div>
								<div>
									<input
										type="email"
										placeholder="Correo electrónico"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary"
										aria-label="Correo electrónico"
									/>
								</div>
								<div className="col-span-1 lg:col-span-2 mb-4 mt-4">
									<textarea
										name="message"
										cols={30}
										rows={4}
										placeholder="Mensaje"
										value={formData.message}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-primary resize-none"
									/>
								</div>
								<div className="col-span-1 lg:col-span-2 mb-5">
									<label className="flex justify-center items-center text-black">
										<input
											type="checkbox"
											className="form-checkbox h-5 w-5 text-orange-primary rounded border-gray-300"
											name="privacy_policy_and_data_use"
											checked={formData.privacy_policy_and_data_use}
											onChange={handleChange}
										/>
										<span className="ml-2">
											He leído y acepto la{" "}
											<a
												href="#"
												target="_blank"
												className="font-bold border-b border-black hover:text-orange-primary"
											>
												Política de Privacidad
											</a>{" "}
											y{" "}
											<a
												href="#"
												className="font-bold border-b border-white hover:text-orange-primary"
											>
												Uso de Datos
											</a>
										</span>
									</label>
								</div>
								<div className="col-span-1 lg:col-span-2 flex w-full justify-center">
									<button
										type="submit"
										className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-300 hover:text-white transition-colors flex items-center gap-2"
									>
										<span>Enviar mensaje</span>
										<i className="las la-angle-right text-xl"></i>
									</button>
								</div>
							</div>
						</form>
					</div>
				</Container>
			</section>

			{/* Map Section */}
			<section className="bg-white py-0">
				<Container>
					<iframe
						loading="lazy"
						className="w-full h-96 rounded-2xl"
						src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3900.272821381431!2d-76.98593492512096!3d-12.161819988084055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDA5JzQyLjYiUyA3NsKwNTknMDAuMSJX!5e0!3m2!1ses-419!2spe!4v1768932797230!5m2!1ses-419!2spe"
						style={{ border: 0 }}
						allowFullScreen
						title="Ubicación de Oleohidraulics Services"
					/>

				</Container>
			</section>
		</div>
	);
};

export default Contacto;
