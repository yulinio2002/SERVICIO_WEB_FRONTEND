import { useMemo, useState } from "react";

export type PaginationMetaInternal = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	startIndex: number;
	endIndex: number;
};

type Options = {
	totalItems: number;
	pageSize: number;
	initialPage?: number;
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

	const meta = useMemo<PaginationMetaInternal>(
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

	const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));
	const next = () => goTo(safePage + 1);
	const prev = () => goTo(safePage - 1);

	return { meta, goTo, next, prev };
}
