import { Component, effect, inject, output } from '@angular/core';
import { ItemsComponent } from '../items/items.component';
import { ChatRoomItem } from '../../models/chat.models';

import { CreateFormRoomComponent } from '../create-form-room/create-form-room.component';
import { AppStore } from '../../../../store/store';
@Component({
  selector: 'app-sidebar',
  imports: [ItemsComponent, CreateFormRoomComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  //Create new Room
  newRoom = output<boolean>();
  //ouputs
  countRooms = output<number>();
  //store
  readonly store = inject(AppStore);
  //test data
  dataRooms: ChatRoomItem[] = [
    /* {
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
    }, */
  ];
  constructor() {
    effect(() => {
      this.dataRooms.push(this.store.room()!);
    });
  }

  createNewRoom() {
    this.newRoom.emit(true);
  }
}
