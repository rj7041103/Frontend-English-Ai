import { Component, inject} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { ChatRoomItem, Room } from '../../models/chat.models';
import { input } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { AppStore } from '../../../../store/store';
@Component({
  selector: 'app-items',
  imports: [FontAwesomeModule, RouterLink],
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
