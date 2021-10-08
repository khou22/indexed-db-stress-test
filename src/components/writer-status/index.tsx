import React from "react";
import { useWriter } from "../../hooks/useWriter";

const WriterStatus = () => {
  const { id, isWriting, start, stop, intervalTime, numMessages } = useWriter();

  return (
    <div style={{ border: "1px solid black", padding: 8, margin: 12 }}>
      <h2>Writer: {id}</h2>
      <p>
        {isWriting
          ? `Writing ${numMessages} messages per ${intervalTime} MS`
          : "Stopped"}
      </p>
      {isWriting ? (
        <button onClick={stop}>Stop Writing</button>
      ) : (
        <>
          <button onClick={() => start(50, 1000)}>Start Writing 50/1s</button>
          <button onClick={() => start(500, 100)}>
            Start Writing 500/100 MS
          </button>
          <button onClick={() => start(1000, 1000)}>
            Start Writing 1000/1s
          </button>
          <button onClick={() => start(1000, 10000)}>
            Start Writing 1000/10s
          </button>
          <button onClick={() => start(10000, 5000)}>
            Start Writing 10000/5s
          </button>
        </>
      )}
    </div>
  );
};

export default WriterStatus;
