export type RowData = {
  id: string;
  timestamp: number;
  name: string;
  payload: Uint8Array;
};

export type ReadPerformanceMetadataType = {
  readTime: number;
  transferTime: number;
};
