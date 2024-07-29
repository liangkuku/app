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
import { ChatMessage } from './events.type';

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

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: ChatMessage) {
    const targetSocketId = this.clients.get(payload.receiverId);
    if (!targetSocketId)
      return {
        status: 'error',
        data: {
          message: 'error receiverId',
        },
      };

    const targetClient = this.server.sockets.sockets.get(targetSocketId);
    if (!targetClient)
      return {
        status: 'error',
        data: {
          message: 'error find targetClient',
        },
      };

    targetClient.emit('message', {
      status: 'success',
      data: {
        message: payload.message,
        senderId: payload.senderId,
      },
    });
    return {
      status: 'success',
      data: {
        message: payload.message,
        receiverId: payload.receiverId,
      },
    };
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
