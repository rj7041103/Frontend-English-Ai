import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Message } from '../pages/chat/models/chat.models';
import { ChatService } from '../pages/chat/service/chat.service';
import { User } from '../pages/Auth/models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { ChatRoomItem } from '../pages/chat/models/chat.models';
type AppState = {
  chat: Message[];
  room: ChatRoomItem | null;
  userProgress: {
    currentLevel: 1 | 2 | 3;
    completedTasks: number;
  } | null;
};

const initialState: AppState = {
  chat: [],
  room: null,
  userProgress: null,
};
const MAX_TASKS_PER_LEVEL = {
  1: 10, // 10 tarea de ordenación
  2: 10, // 10 preguntas
  3: 1, // 1 conversación
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
    completeTask() {
      patchState(store, (state) => {
        if (!state.userProgress) {
          return {
            userProgress: {
              currentLevel: 1 as 1 | 2 | 3,
              completedTasks: 1,
            },
          };
        }

        const progress = { ...state.userProgress };
        const maxTasks = MAX_TASKS_PER_LEVEL[progress.currentLevel];

        if (progress.completedTasks + 1 >= maxTasks) {
          const nextLevel = Math.min(progress.currentLevel + 1, 3) as 1 | 2 | 3;
          return {
            userProgress: {
              currentLevel: nextLevel,
              completedTasks: nextLevel === 3 ? 1 : 0,
            },
          };
        }

        return {
          userProgress: {
            ...progress,
            completedTasks: progress.completedTasks + 1,
          },
        };
      });
    },
  }))
);
