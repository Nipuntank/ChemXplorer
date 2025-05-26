export interface Compound {
  id: number;
  name: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface CompoundResponse {
  data: Compound[];
  pagination: PaginationInfo;
}

export interface CompoundState {
  loading: boolean;
  error: string | null;
  compounds: Compound[];
  pagination: PaginationInfo;
  selectedCompound: Compound | null;
  recentlyViewed: Compound[];
  compareCompounds: Compound[];
}