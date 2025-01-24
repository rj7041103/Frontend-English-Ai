import { Component, computed, effect, inject, signal } from '@angular/core';
import { ItemsComponent } from '../items/items.component';
import { ChatRoomItem } from '../../models/chat.models';
import { BehaviorSubject } from 'rxjs';
import { StateService } from '../../../../storage/state.service';
import { ChatService } from '../../service/chat.service';
@Component({
  selector: 'app-sidebar',
  imports: [ItemsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  rooms = signal<{ before: string; next: string }>({ before: '', next: '' });
  stateService = inject(StateService);
  chatService = inject(ChatService);
  //test data
  dataRooms: ChatRoomItem[] = [
    {
      user_name: 'Ts',
    },
    {
      user_name: 'Js',
    },
    {
      user_name: 'Ja',
    },
    {
      user_name: 'C#',
    },
    {
      user_name: 'C++',
    },
    {
      user_name: 'Py',
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

    this.stateService.setRoom(roomName);

    //we leave the previous room
    if (this.rooms().before !== '') {
      this.chatService.leaveRoom(this.rooms().before);
    }
  }
}
