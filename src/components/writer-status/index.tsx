import React from "react";
import { useWriter } from "../../hooks/useWriter";
import { PAYLOAD_SIZE } from "../../utils/mock";

const WriterStatus = () => {
  const { id, isWriting, start, stop, intervalTime, payloadSize, numMessages } =
    useWriter();

  return (
    <div style={{ border: "1px solid black", padding: 8, margin: 12 }}>
      <h2>Writer: {id}</h2>
      <p>
        {isWriting
          ? `Writing ${numMessages} messages of size ${payloadSize} per ${intervalTime} MS`
          : "Stopped"}
      </p>
      {isWriting ? (
        <button onClick={stop}>Stop Writing</button>
      ) : (
        <>
          <button onClick={() => start(1000, PAYLOAD_SIZE.LARGE, 10000)}>
            Slow Big (1000 / {PAYLOAD_SIZE.LARGE} / 10000s)
          </button>
          <button onClick={() => start(1000, PAYLOAD_SIZE.LARGE, 10000)}>
            Fast Small (1000 / {PAYLOAD_SIZE.SMALL} / 1000s)
          </button>
        </>
      )}
    </div>
  );
};

export default WriterStatus;
