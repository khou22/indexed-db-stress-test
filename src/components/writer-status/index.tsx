import { Button } from "@material-ui/core";
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
        <Button variant="contained" onClick={stop}>
          Stop Writing
        </Button>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() => start(1000, PAYLOAD_SIZE.LARGE, 10000)}
          >
            Slow Big (1000 / {PAYLOAD_SIZE.LARGE} / 10000s)
          </Button>
          <Button
            variant="contained"
            onClick={() => start(1000, PAYLOAD_SIZE.LARGE, 10000)}
          >
            Fast Small (1000 / {PAYLOAD_SIZE.SMALL} / 1000s)
          </Button>
        </>
      )}
    </div>
  );
};

export default WriterStatus;
