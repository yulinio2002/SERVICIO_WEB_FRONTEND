// src/pages/Proyectos.tsx (ejemplo)
import React, { useState, useEffect } from "react";
import ProjectShowcaseSection from "@components/projects/ProjectShowcaseSection.tsx";
import QuoteForm from "@components/servicios/QuoteForm";
import { ProjectType } from "@interfaces/project/ProjectTypes.ts";
import { listarProyectos } from "@services/proyecto/Proyecto.ts";

const Projects: React.FC = () => {
	const [selectedProject, setSelectedProject] = useState<{
		title: string;
		id: number;
	} | null>(null);
	const [projects, setProjects] = useState<ProjectType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			try {
				const data = await listarProyectos();
				if (mounted) setProjects(data);
			} catch (e) {
				console.error("Error cargando proyectos:", e);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const handleProjectSelect = (project: ProjectType) => {
		setSelectedProject({ title: project.title, id: project.id });

		const formElement = document.getElementById("form");
		if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
	};

	const fallback =
		selectedProject ??
		(projects[0] ? { title: projects[0].title, id: projects[0].id } : null);

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
						instalar proyectos oleohidráulicos. <br /> Ponemos a su disposición
						equipos de última generación para el Servicio de Remanufactura de
						Equipos Hidráulicos.
					</p>
				</div>
			</section>

			{/* Sección de proyectos */}
			<section className="container py-12">
				{loading && (
					<div className="min-h-[200px] flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mx-auto"></div>
							<p className="mt-4 text-gray-600">Cargando...</p>
						</div>
					</div>
				)}

				{!loading &&
					projects.map((project, index) => (
						<ProjectShowcaseSection
							key={project.id}
							project={project}
							onQuoteClick={() => handleProjectSelect(project)}
							className={index > 0 ? "mt-20" : ""}
						/>
					))}
			</section>

			{fallback && (
				<QuoteForm serviceTitle={fallback.title} serviceId={fallback.id} />
			)}
		</div>
	);
};

export default Projects;
