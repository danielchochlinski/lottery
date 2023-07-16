export interface ActionType {
  id: string;
  type: string;
  payload: {
    id: string;
    type: string;
    message: string;
  };
}
export interface StateType {
  id: string;
  message: string;
  type: string;
}
