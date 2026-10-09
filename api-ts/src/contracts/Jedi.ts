export interface JediDto {
  jediId: number;
  name: string;
  jediTypeId: number;
}

export interface PagedJedi {
  items: JediDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
