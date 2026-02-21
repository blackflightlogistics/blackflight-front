export type CursorInfo = {
  after: string | null;
  before: string | null;
  limit: number;
};

export type PaginatedResponse<T> = {
  cursor: CursorInfo;
  data: T[];
};
