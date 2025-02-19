import { Component, effect, inject, output } from '@angular/core';
import { ItemsComponent } from '../items/items.component';
import { ChatRoomItem } from '../../models/chat.models';
import { AppStore } from '../../../../store/store';
@Component({
  selector: 'app-sidebar',
  imports: [ItemsComponent],
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
  dataRooms: ChatRoomItem[] = [];
  constructor() {
    effect(() => {
      this.dataRooms.push(this.store.room()!);
    });
  }

  createNewRoom() {
    this.newRoom.emit(true);
  }
}
