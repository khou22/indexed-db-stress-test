export type RangeType =
  | {
      type: "write";
      source: string;
      start: number;
      end: number;
      numMessages: number;
      payloadSize: number;
      estimatedMessagesAlreadySaved: number;
    }
  | {
      type: "read";
      source: string;
      numMessages: number;
      start: number;
      end: number;
    };
