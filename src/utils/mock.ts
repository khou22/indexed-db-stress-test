import { RowData } from "../models";

const MIN_TIMESTAMP = 1000;

const possibleNames = ["apple", "banana", "clementine", "dragonfruit"];

export const generateRandomArray = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n));

// Unmasked planner_viz is 430,000 bytes or so
// Inconsistently running into OOM errors allocating buffer.
// const MAX_PAYLOAD_SIZE = 500000;
const MAX_PAYLOAD_SIZE = 100000;

export const generateMockRowData = (n: number): RowData[] => {
  const mockData: RowData[] = [];

  // Payload only instantiated once
  const payloadSize = Math.floor(Math.random() * MAX_PAYLOAD_SIZE);
  const mockPayload = new Uint8Array(generateRandomArray(payloadSize));

  for (let i = 0; i < n; i++) {
    const timestamp = MIN_TIMESTAMP + performance.now();
    mockData.push({
      id: `${i}`,
      timestamp,
      name: possibleNames[Math.floor(Math.random() * possibleNames.length)],
      payload: mockPayload,
    });
  }

  return mockData;
};
