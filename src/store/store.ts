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
    englishLevel: 'A1' | 'A2' | 'B1' | 'B2';
    unlockedEnglishLevels: ('A1' | 'A2' | 'B1' | 'B2')[];
    currentTaskLevel: 1 | 2 | 3 | 4;
    completedQuestions: number;
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
    englishLevel: 'A1',
    unlockedEnglishLevels: ['A1'],
    currentTaskLevel: 1,
    completedQuestions: 0,
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
      patchState(store, (state: any) => {
        const progress = { ...state.userProgress };

        // Verificar si la tarea corresponde al nivel actual
        if (level !== progress.currentTaskLevel) return state;

        const newCompleted = progress.completedQuestions + 1;
        const maxTasks = progress.totalTasks[`level${level}`];

        // Determinar si se completa el nivel
        if (newCompleted >= maxTasks) {
          const nextLevel = Math.min(level + 1, 4) as 1 | 2 | 3 | 4;
          if (nextLevel === 4) {
            const englishLevels = ['A1', 'A2', 'B1', 'B2'];
            const currentIndex = englishLevels.indexOf(progress.englishLevel);
            const nextEnglishLevel = englishLevels[currentIndex + 1];

            return {
              userProgress: {
                ...progress,
                englishLevel: nextEnglishLevel,
                unlockedEnglishLevels: [
                  ...progress.unlockedEnglishLevels,
                  nextEnglishLevel,
                ],
                currentTaskLevel: nextLevel,
                completedQuestions: 0,
              },
            };
          }

          return {
            userProgress: {
              ...progress,
              currentTaskLevel: nextLevel,
              completedQuestions: 0,
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

    saveProgressEnglishLevel() {
      localStorage.setItem(
        'user_english_level',
        store.userProgress().englishLevel
      );

      localStorage.setItem(
        'unlockedEnglishLevels',
        JSON.stringify(store.userProgress().unlockedEnglishLevels)
      );
    },

    saveProgressTasks() {
      localStorage.setItem(
        'currentTaskLevel',
        store.userProgress().currentTaskLevel + ''
      );
    },
  }))
);
