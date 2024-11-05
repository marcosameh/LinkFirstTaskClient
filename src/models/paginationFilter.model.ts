export interface PaginationFilter {
    start: number;
    length: number;
    searchValue?: string;
    sortColumn?: string;
    sortDirection?: string;
}
