import type { PaginationMeta } from "@interfaces/product/ProductTypes";
import { cn } from "@components/common/helpers";

type Props = {
	meta: PaginationMeta;
	onPageChange: (page: number) => void;
	className?: string;
	siblingCount?: number; // cuántos números a la izquierda/derecha
};

function range(start: number, end: number) {
	const out: number[] = [];
	for (let i = start; i <= end; i++) out.push(i);
	return out;
}

function buildPages(current: number, total: number, siblingCount: number) {
	// Siempre mostramos: 1 ... (siblings) current (siblings) ... total
	const pages: Array<number | "dots"> = [];

	if (total <= 7 + siblingCount * 2) {
		return range(1, total);
	}

	const left = Math.max(2, current - siblingCount);
	const right = Math.min(total - 1, current + siblingCount);

	pages.push(1);

	if (left > 2) pages.push("dots");
	for (const p of range(left, right)) pages.push(p);
	if (right < total - 1) pages.push("dots");

	pages.push(total);
	return pages;
}

export default function Pagination({
	meta,
	onPageChange,
	className,
	siblingCount = 1,
}: Props) {
	const { page, totalPages } = meta;

	const pages = buildPages(page, totalPages, siblingCount);

	return (
		<div className={cn("flex items-center justify-center gap-2", className)}>
			<button
				className="px-3 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40"
				onClick={() => onPageChange(page - 1)}
				disabled={page <= 1}
			>
				Anterior
			</button>

			<div className="flex items-center gap-2">
				{pages.map((p, idx) =>
					p === "dots" ? (
						<span key={`dots-${idx}`} className="px-2 text-slate-400">
							…
						</span>
					) : (
						<button
							key={p}
							onClick={() => onPageChange(p)}
							className={cn(
								"w-10 h-10 rounded-full border text-sm font-semibold transition",
								p === page
									? "bg-slate-900 text-white border-slate-900"
									: "border-slate-200 hover:bg-slate-50",
							)}
							aria-current={p === page ? "page" : undefined}
						>
							{p}
						</button>
					),
				)}
			</div>

			<button
				className="px-3 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= totalPages}
			>
				Siguiente
			</button>
		</div>
	);
}
