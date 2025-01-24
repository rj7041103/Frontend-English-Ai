export interface ChatRoomItem {
  id?: string;
  user_name: string;
  icon?: string;
}

export interface Message extends ChatRoomItem {
  room: string;
  message: string;
  time: string | Date;
}

export interface Room {
  room: string;
  message: string;
}
