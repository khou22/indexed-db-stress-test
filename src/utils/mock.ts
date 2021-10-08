import { RowData } from "../models";

const MIN_TIMESTAMP = 1000;

export const POSSIBLE_NAMES = ["apple", "banana", "clementine", "dragonfruit"];

// Unmasked planner_viz is 430,000 bytes or so
// Inconsistently running into OOM errors allocating buffer.
// const MAX_PAYLOAD_SIZE = 500000;
export const PAYLOAD_SIZE = {
  SMALL: 10000,
  MEDIUM: 100000,
  LARGE: 500000,
};

export const generateRandomArray = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n));

export const generateMockRowData = (
  n: number,
  payloadSize: number
): RowData[] => {
  const mockData: RowData[] = [];
  const mockPayload = new Uint8Array(generateRandomArray(payloadSize));

  for (let i = 0; i < n; i++) {
    const timestamp = MIN_TIMESTAMP + performance.now();
    mockData.push({
      id: `${i}`,
      timestamp,
      name: POSSIBLE_NAMES[Math.floor(Math.random() * POSSIBLE_NAMES.length)],
      payload: mockPayload,
    });
  }

  return mockData;
};
