import { Injectable, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { Message, Room } from '../models/chat.models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  _chat$ = new BehaviorSubject<Message[]>([]);
  public chat$ = this._chat$.asObservable();
  constructor(private socket: Socket) {
    this.getMessage();
  }
  sendMessage(message: string) {
    console.log(message);
    this.socket.emit('message', message);
  }

  //Send a Message to a specific room
  sendMessageRoom(roomObject: Message) {
    console.log(roomObject);
    this.socket.emit('event_message', roomObject);
  }

  //Join a room
  joinRoom(roomName: string) {
    this.socket.emit('joinRoom', roomName);
  }

  leaveRoom(roomName: string) {
    this.socket.emit('leaveRoom', roomName);
  }

  getMessage() {
    this.socket.fromEvent('new_message').subscribe((data: any) => {
      const current = this._chat$.getValue();
      if (!current.includes(data)) {
        const state = [...current, data];
        this._chat$.next(state);
      }
    });
  }
}
