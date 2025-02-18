import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MessagesComponent } from './components/messages/messages.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ChatService } from './service/chat.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPaperclip,
  faPaperPlane,
  faMicrophone,
  faBars,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { Message } from './models/chat.models';
import { AppStore } from '../../store/store';
import { formatAMPM } from '../../utils/dateFormat';
import { CreateFormRoomComponent } from './components/create-form-room/create-form-room.component';
import { count } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    SidebarComponent,
    MessagesComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    CreateFormRoomComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  //service
  chatService = inject(ChatService);
  readonly store = inject(AppStore);
  //Form chat variable and viewChild of the chat input field
  input = viewChild<ElementRef<HTMLInputElement>>('input');
  form: FormGroup;

  //Room's part
  newRoom = signal<boolean>(false);
  //iconos del chat
  faPaperclip = faPaperclip;
  faPaperPlane = faPaperPlane;
  faMicrophone = faMicrophone;
  faBars = faBars;
  faCode = faCode;

  constructor(private fb: FormBuilder) {
    //formulario del chat
    this.form = this.fb.group({
      message: ['', [Validators.required]],
    });

    //Check if there is a room
    this.isThereaRoom();
  }
  //function to create a new room
  createRoom(event: boolean) {
    event === true ? this.newRoom.set(true) : this.newRoom.set(false);
  }
  onSubmit() {
    const currentTime = new Date();
    const formattedTime = formatAMPM(currentTime);
    const user_info = this.store.getUser();
    const roomObject: Message = {
      user_name: user_info?.user_name ?? 'Anonymous',
      room: this.store.room()!.room_name,
      message: this.form.value.message,
      time: formattedTime,
    };
    //Actualizacion del chat
    this.store.updateChat(roomObject, this.chatService);
    //Reinicio de los valores del formulario
    this.form.value.message = '';
    this.input()!.nativeElement.value = '';
  }

  roomCreated(event: boolean) {
    if (event === true) {
      this.newRoom.set(false);
    }
  }

  isThereaRoom() {
    if (this.store.room() === null) {
      this.newRoom.set(true);
    }
  }
}
