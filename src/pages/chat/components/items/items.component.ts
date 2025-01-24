import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { ChatRoomItem, Room } from '../../models/chat.models';
import { input } from '@angular/core';
import { ChatService } from '../../service/chat.service';
@Component({
  selector: 'app-items',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  faRocketchat = faRocketchat;
  chatRoomItem = input.required<ChatRoomItem>();
  chatService = inject(ChatService);
  roomName = output<string>();
  //we join a selected room and broadcast the room name
  handleRoom = () => {
    this.chatService.joinRoom(this.chatRoomItem().user_name);
    this.roomName.emit(this.chatRoomItem().user_name);
  };
}
