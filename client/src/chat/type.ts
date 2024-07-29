// /** 接收的信息 */
// export interface IRecMsg {
//   /** 发送者id */
//   senderId: string;
//   /** 消息 */
//   message: string;
// }

// /** 发送的信息 */
// export interface ISendMsg {
//   /** 接收者的id */
//   receiverId: string;
//   /** 消息 */
//   message: string;
// }
type Guid = string;

export interface IMsg {
  senderId: Guid;
  receiverId: Guid;
  msg: string;
  timestamp: Date;
}

enum EState {
  success = 'success',
  error = 'error',
}

export interface IMsgResponse {
  status: EState;
  data: IMsg;
}

// export interface ISendMsgResponse {
//   status: EState;
//   data: ISendMsg;
// }

// export interface IRecMsgResponse {
//   status: EState;
//   data: IRecMsg;
// }
