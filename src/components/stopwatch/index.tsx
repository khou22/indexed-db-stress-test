import React, { useState } from "react";

export const StopWatch = () => {
  const [time, setTime] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      setTime((time) => time + 10);
    }, 10);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <span>
      <span className="digits">
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
      <span className="digits">
        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
      </span>
      <span className="digits mili-sec">
        {("0" + ((time / 10) % 100)).slice(-2)}
      </span>
    </span>
  );
};
