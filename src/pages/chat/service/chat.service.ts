import { inject, Injectable, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { ChatRoomItem, Message, Room } from '../models/chat.models';
import { AppStore } from '../../../store/store';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // State's rooms
  rooms = signal<{ before: string; next: string }>({ before: '', next: '' });
  //store
  readonly store = inject(AppStore);
  _chat$ = new BehaviorSubject<Message[]>([]);
  public chat$ = this._chat$.asObservable();
  constructor(private socket: Socket) {
    this.updateMessage();
  }
  sendMessage(message: string) {
    console.log(message);
    this.socket.emit('message', message);
  }

  //Send a Message to a specific room
  sendMessageRoom(roomObject: Message) {
    console.log('roomObject:', roomObject);
    this.socket.emit('event_message', roomObject);
  }

  //Join a room
  joinRoom(roomName: string) {
    this.socket.emit('joinRoom', roomName);
  }

  leaveRoom(roomName: string) {
    this.socket.emit('leaveRoom', roomName);
  }

  updateMessage() {
    //Actualizamos el BehaviorSubject
    this.socket.fromEvent('new_message').subscribe((data: any) => {
      const current = this._chat$.getValue();
      if (!current.includes(data)) {
        const state = [...current, data];
        this._chat$.next(state);
      }
    });
  }
  handleChatRoom(roomObject: ChatRoomItem) {
    //we join a room
    this.joinRoom(roomObject.room_name)
    //we clean the array of messages that we may have when changing rooms
    this._chat$.next([]);
    //we change the state of the room
    this.rooms.update((oldData) => {
      return {
        before: oldData.next,
        next: roomObject.room_name,
      };
    });

    //we leave the previous room
    if (this.rooms().before !== '') {
      this.leaveRoom(this.rooms().before);
    }
    this.store.setRoom(roomObject);
  }
}
