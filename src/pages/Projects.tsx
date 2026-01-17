// src/pages/Proyectos.tsx (ejemplo)
import React, { useState } from "react";
import ProjectShowcaseSection from "@components/projects/ProjectShowcaseSection.tsx";
import QuoteForm from "@components/servicios/QuoteForm";
import { ProjectType } from "@interfaces/project/ProjectTypes.ts";

const Projects: React.FC = () => {
	// Estado para el proyecto seleccionado
	const [selectedProject, setSelectedProject] = useState<{
		title: string;
		id: number;
	} | null>(null);

	const projects: ProjectType[] = [
		{
			id: 1,
			slug: "proyecto-1",
			title: "Proyecto Hidráulico Industrial",
			description: "Sistema hidráulico completo para máquina industrial...",
			image: {
				src: "/images/img1.jpg",
				alt: "Proyecto 1",
			},
			layout: "imageRight",
		},
		{
			id: 2,
			slug: "proyecto-2",
			title: "Sistema Oleohidráulico Móvil",
			description: "Implementación de sistema hidráulico para maquinaria móvil...",
			image: {
				src: "/images/img2.jpg",
				alt: "Proyecto 2",
			},
			layout: "imageLeft",
		},
		// Agrega más proyectos aquí...
	];

	// Función para manejar la selección de proyecto
	const handleProjectSelect = (project: ProjectType) => {
		setSelectedProject({
			title: project.title,
			id: project.id
		});

		const formElement = document.getElementById('form');
		if (formElement) {
			formElement.scrollIntoView({ behavior: 'smooth' });
		}
	}


	return (
		<div className="pt-20">
			<section className="mt-5 md:mt-15">
				<div className="container">
					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						NUESTROS PROYECTOS
					</p>

					<p className="mt-6 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						Venta de Equipos Oleohidráulicos a nivel nacional
					</p>

					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Oleohidraulics Services contamos con profesionales idóneos y
						capacitados, que les brindaran las mejores soluciones del mercado.
						Nuestra área de ingeniería está capacitada para diseñar, construir e
						instalar proyectos oleohidráulicos. <br/> Ponemos a su disposición equipos
						de última generación para el Servicio de Remanufactura de Equipos
						Hidráulicos.
					</p>
				</div>
			</section>

			{/* Sección de proyectos */}
			<section className="container py-12">
				{projects.map((project, index) => (
					<ProjectShowcaseSection
						key={project.id}
						project={project}
						onQuoteClick={() => handleProjectSelect(project)}
						className={index > 0 ? "mt-20" : ""}
					/>
				))}
			</section>

			<QuoteForm
				serviceTitle={selectedProject?.title || projects[1].title}
				serviceId={selectedProject?.id || projects[1].id}
			/>
		</div>
	);
};

export default Projects;
