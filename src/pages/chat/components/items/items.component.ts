import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { ChatRoomItem, Room } from '../../models/chat.models';
import { input } from '@angular/core';
import { ChatService } from '../../service/chat.service';
@Component({
  selector: 'app-items',
  imports: [FontAwesomeModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  //Icons
  faRocketchat = faRocketchat;

  //Input binding
  chatRoomItem = input.required<ChatRoomItem>();
  //services
  chatService = inject(ChatService);

  handleRoom = () => {
    this.chatService.handleChatRoom(this.chatRoomItem());
  };
}
