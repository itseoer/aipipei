export interface Result {
  id: string;
  score: number;
  analysis: string;
  suggestions: string[];
  timestamp: string;
}

export interface FilterState {
  scoreRange: [number, number];
  timeRange: string;
  testType: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
} 