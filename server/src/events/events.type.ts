type Guid = string;
export interface IMsg {
  id: Guid;
  senderId: Guid;
  receiverId: Guid;
  msg: string;
  timestamp: Date;
}

export enum EState {
  success = 'success',
  error = 'error',
}

export interface IMsgResponse {
  status: EState;
  data: IMsg;
}
