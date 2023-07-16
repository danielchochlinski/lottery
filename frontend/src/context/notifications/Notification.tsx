import React, { useCallback, useState, useEffect } from "react";
import { ActionType } from "./types";
interface NotificationProps {
  id: string;
  message: string;
  type: string;
  dispatch: React.Dispatch<ActionType>;
}
const Notification = (props: NotificationProps) => {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timer>();

  const handleStartTimer = () => {
    const id: NodeJS.Timer = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 0.5;
        }

        clearInterval(id);
        return prev;
      });
    }, 20);
    setIntervalID(id);
  };

  const handlePauseTimer = useCallback(() => {
    clearInterval(intervalID as NodeJS.Timer);
  }, [intervalID]);

  const handleCloseNotification = useCallback(() => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      props.dispatch({
        type: "REMOVE_NOTIFICATION",
        id: props.id,
        payload: {
          id: "",
          type: "",
          message: "",
        },
      });
    }, 400);
  }, [handlePauseTimer, props]);

  useEffect(() => {
    if (width === 100) {
      // Close notification
      handleCloseNotification();
    }
  }, [handleCloseNotification, width]);

  useEffect(() => {
    handleStartTimer();
  }, []);

  return (
    <div
      onMouseEnter={handlePauseTimer}
      onMouseLeave={handleStartTimer}
      className={`notification_item ${
        props.type === "SUCCESS"
          ? "success"
          : props.type === "ERROR"
          ? "error"
          : "warning"
      } ${exit ? "exit" : ""}`}
    >
      <p>{props.message}</p>
      <div className={"bar"} style={{ width: `${width}%` }} />
    </div>
  );
};

export default Notification;
