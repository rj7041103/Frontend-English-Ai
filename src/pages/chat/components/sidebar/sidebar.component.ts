import {
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { ItemsComponent } from '../items/items.component';
import { ChatRoomItem } from '../../models/chat.models';
import { ChatService } from '../../service/chat.service';
import { AppStore } from '../../../../store/store';
import { CreateFormRoomComponent } from '../create-form-room/create-form-room.component';
@Component({
  selector: 'app-sidebar',
  imports: [ItemsComponent, CreateFormRoomComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // State's rooms
  rooms = signal<{ before: string; next: string }>({ before: '', next: '' });
  //services
  chatService = inject(ChatService);
  readonly store = inject(AppStore);
  //Create new Room
  newRoom = output<boolean>();
  /* newRoomEvent = output<boolean>(); */
  //test data
  dataRooms: ChatRoomItem[] = [
    {
      room_name: 'Ts',
    },
    {
      room_name: 'Js',
    },
    {
      room_name: 'Ja',
    },
    {
      room_name: 'C#',
    },
    {
      room_name: 'C++',
    },
    {
      room_name: 'Py',
    },
  ];
  handleChatRoom(roomName: string) {
    //we clean the arrangement of messages that we may have when changing rooms
    this.chatService._chat$.next([]);
    //we change the state of the room
    this.rooms.update((oldData) => {
      return {
        before: oldData.next,
        next: roomName,
      };
    });

    //we leave the previous room
    if (this.rooms().before !== '') {
      this.chatService.leaveRoom(this.rooms().before);
    }
    this.store.setRoom(roomName);
  }

  createNewRoom() {
    this.newRoom.emit(true);
  }
}
