// src/components/projects/ProjectShowcaseSection.tsx
import QuoteButton from "@components/common/QuoteButton";
import type { ProjectType } from "@interfaces/project/ProjectTypes.ts";

type Props = {
	project: ProjectType;
	className?: string;
	onQuoteClick?: () => void; // Nueva prop
};

export default function ProjectShowcaseSection({
	project,
	className = "",
	onQuoteClick,
}: Props) {
	const isImageRight = (project.layout ?? "imageRight") === "imageRight";

	return (
		<section className={className}>
			<div
				className={[
					"grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center",
					isImageRight
						? ""
						: "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
				].join(" ")}
			>
				{/* Texto */}
				<div>
					<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
						{project.title}
					</h2>

					<p className="mt-6 text-slate-600 leading-relaxed">
						{project.description}
					</p>

					{/* Botón Cotizar */}
					<div className="mt-10">
						<QuoteButton
							onClick={onQuoteClick}
							text="Cotizar"
							className="mt-4"
						/>
					</div>
				</div>

				{/* Imagen */}
				<div className="w-full">
					<div className="overflow-hidden rounded-[28px] border border-slate-200">
						<img
							src={project.image.src}
							alt={project.image.alt}
							className="w-full h-[260px] sm:h-[340px] lg:h-[420px] object-cover"
							loading="lazy"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
