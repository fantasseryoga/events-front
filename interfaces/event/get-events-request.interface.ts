export interface GetEventsRequestInterface {
  pageSize: number,
  pageNumber: number,
  title?: string,
  cityIds?: string[],
  categoryIds?: string[],
  sortBy?: string,
};