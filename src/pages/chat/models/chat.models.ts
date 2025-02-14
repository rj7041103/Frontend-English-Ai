export interface ChatRoomItem {
  id?: string;
  room_name: string;
  icon?: string;
}

export interface Message extends Omit<ChatRoomItem, 'room_name'> {
  user_name: string;
  room: string;
  message: string;
  time: string | Date;
}

export interface Room {
  room: string;
  message: string;
}
