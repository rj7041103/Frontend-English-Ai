import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Message } from '../pages/chat/models/chat.models';
import { ChatService } from '../pages/chat/service/chat.service';
import { User } from '../pages/Auth/models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { ChatRoomItem } from '../pages/chat/models/chat.models';
type AppState = {
  chat: Message[];
  room: ChatRoomItem | null;
};

const initialState: AppState = {
  chat: [],
  room: null,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setRoom: (current_room: ChatRoomItem) =>
      patchState(store, { room: current_room }),
    updateChat: (message: Message, chatService: ChatService) => {
      chatService.sendMessageRoom(message);
      chatService.chat$.subscribe((data) => {
        console.log('La data recibida es: ', data);
        patchState(store, {
          chat: [...data],
        });
      });
    },

    getUser(): User | null {
      const token = localStorage.getItem('token');
      if (token !== null && token !== '') {
        return jwtDecode(token) as User;
      } else {
        return null;
      }
    },

    handleChatRoom(roomName: ChatRoomItem) {},
  }))
);
