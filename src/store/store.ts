import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Message } from '../pages/chat/models/chat.models';
import { ChatService } from '../pages/chat/service/chat.service';
import { User } from '../pages/Auth/models/auth.model';
import { jwtDecode } from 'jwt-decode';
type AppState = {
  chat: Message[];
  room: string;
};

const initialState: AppState = {
  chat: [],
  room: '',
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setRoom: (current_room: string) =>
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
  }))
);
