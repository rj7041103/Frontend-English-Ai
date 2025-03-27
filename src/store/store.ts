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
    completedQuestions: number;
    unlockedLevels: number[];
    totalTasks: {
      level1: number;
      level2: number;
      level3: number;
    };
  };
};

const initialState: AppState = {
  chat: [],
  room: null,
  userProgress: {
    currentLevel: 1,
    completedQuestions: 0,
    unlockedLevels: [1],
    totalTasks: {
      level1: 10,
      level2: 10,
      level3: 1,
    },
  },
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
    completeTask(level: 1 | 2 | 3) {
      patchState(store, (state) => {
        const progress = { ...state.userProgress };

        // Verificar si la tarea corresponde al nivel actual
        if (level !== progress.currentLevel) return state;

        const newCompleted = progress.completedQuestions + 1;
        const maxTasks = progress.totalTasks[`level${level}`];

        // Determinar si se completa el nivel
        if (newCompleted >= maxTasks) {
          const nextLevel = Math.min(level + 1, 3) as 1 | 2 | 3;

          return {
            userProgress: {
              ...progress,
              currentLevel: nextLevel,
              completedQuestions: 0,
              unlockedLevels: [...progress.unlockedLevels, nextLevel],
            },
          };
        }

        return {
          userProgress: {
            ...progress,
            completedQuestions: newCompleted,
          },
        };
      });
    },

    // Método para verificar acceso a un nivel
    isLevelUnlocked(level: number): boolean {
      return store.userProgress().unlockedLevels.includes(level);
    },
  }))
);
