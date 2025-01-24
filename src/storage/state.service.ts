import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  //signal del chatRoom
  chatRoom = signal('');
  readonly room = computed(() => this.chatRoom());

  //signal del access token
  token = signal('');
  readonly accessToken = computed(() => this.token());
  setRoom(room: string) {
    this.chatRoom.set(room);
  }

  setAccessToken(token: string) {
    this.token.set(token);
  }
}
