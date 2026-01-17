import { useMemo, useState } from "react";

type Options = {
	totalItems: number;
	initialPage?: number;
	pageSize: number;
};

export function usePagination({
	totalItems,
	pageSize,
	initialPage = 1,
}: Options) {
	const [page, setPage] = useState(initialPage);

	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	const safePage = Math.min(Math.max(1, page), totalPages);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	const meta = useMemo(
		() => ({
			page: safePage,
			pageSize,
			totalItems,
			totalPages,
			startIndex,
			endIndex,
		}),
		[safePage, pageSize, totalItems, totalPages, startIndex, endIndex],
	);

	const goTo = (p: number) => setPage(p);
	const next = () => setPage((p) => Math.min(p + 1, totalPages));
	const prev = () => setPage((p) => Math.max(p - 1, 1));

	return { meta, goTo, next, prev };
}
