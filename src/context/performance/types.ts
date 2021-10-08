export type RangeType =
  | {
      type: "write";
      source: string;
      start: number;
      end: number;
      numMessages: number;
      payloadSize: number;
    }
  | {
      type: "read";
      source: string;
      start: number;
      end: number;
    };
