import React, { createContext, useContext, useReducer, Dispatch } from "react";
import Notification from "./Notification";
import { StateType, ActionType } from "./types";

interface NotificationProviderProps {
  children: JSX.Element;
}

const NotificationContext = createContext<Dispatch<ActionType> | undefined>(
  undefined
);

const NotificationProvider = (props: NotificationProviderProps) => {
  const [state, dispatch] = useReducer(
    (state: StateType[], action: ActionType) => {
      switch (action.type) {
        case "ADD_NOTIFICATION":
          return [...state, { ...action.payload }];
        case "REMOVE_NOTIFICATION":
          return state.filter((el: StateType) => el.id !== action.id);
        default:
          return state;
      }
    },
    []
  );

  return (
    <NotificationContext.Provider value={dispatch}>
      <div className={"notification_wrapper"}>
        {state.map((note: StateType) => {
          return <Notification dispatch={dispatch} key={note.id} {...note} />;
        })}
      </div>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
export const useNotification = () => {
  const dispatch = useContext(NotificationContext);

  if (!dispatch) {
    throw new Error("NotificationContext dispatch function not provided");
  }

  return (props: StateType) => {
    dispatch({
      id: uniqueID(),
      type: "ADD_NOTIFICATION",
      payload: {
        ...props,
      },
    });
  };
};

export const uniqueID = () => {
  const uniq = "id" + new Date().getTime();
  return uniq;
};
