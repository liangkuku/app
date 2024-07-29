import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { EState, IMsg, IMsgResponse } from './events.type';
import { stat } from 'fs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients: Map<string, string> = new Map(); // userId -> socketId 映射

  afterInit(server: any) {
    console.log('Gateway initialized');
  }

  handleConnection(client: Socket) {
    // 假设用户ID通过查询参数传递
    const userId = client.handshake.query.userId as string;

    if (userId && typeof userId === 'string') {
      this.clients.set(userId, client.id);
      console.log(`Client connected: ${client.id} (User ID: ${userId})`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.clients.entries()].find(
      ([key, value]) => value === client.id,
    )?.[0];
    if (userId) {
      this.clients.delete(userId);
      console.log(`User ID: ${userId} offline`);
    }
  }

  private getMsgResponse(state: EState, data: IMsg) {
    return {
      status: state,
      data,
    };
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: IMsg): Promise<IMsgResponse> {
    const targetSocketId = this.clients.get(payload.receiverId);
    if (!targetSocketId)
      return this.getMsgResponse(EState.error, {
        ...payload,
        msg: 'error receiverId',
      });

    const targetClient = this.server.sockets.sockets.get(targetSocketId);
    if (!targetClient) {
      return this.getMsgResponse(EState.error, {
        ...payload,
        msg: 'error find targetClient',
      });
    }

    targetClient.emit(
      'message',
      this.getMsgResponse(EState.success, {
        ...payload,
      }),
    );

    return this.getMsgResponse(EState.success, {
      ...payload,
    });
  }

  //   @SubscribeMessage('events')
  //   findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //     return from([1, 2, 3, 4]).pipe(
  //       map((item) => ({ event: 'events', data: item })),
  //     );
  //   }

  //   @SubscribeMessage('identity')
  //   async identity(@MessageBody() data: number): Promise<number> {
  //     return data + Math.random();
  //   }
}
