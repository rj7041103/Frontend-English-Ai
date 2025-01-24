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
import { Message, Room } from './models/chat.models';
import { StateService } from '../../storage/state.service';
@Component({
  selector: 'app-chat',
  imports: [
    SidebarComponent,
    MessagesComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  mensajesPrueba = signal<Message[]>([
    {
      user_name: 'Raul',
      message: 'hola mundo como estan todos',
      room: 'Ts',
      time: '10:30 AM',
    },
    {
      user_name: 'Ale',
      message: 'hola como estas?',
      room: 'Ts',
      time: '10:30 AM',
    },
    {
      user_name: 'Maria',
      message: 'Hay tarea para hoy?',
      room: 'Ts',
      time: '10:30 AM',
    },
  ]);

  //services
  chatService = inject(ChatService);
  stateService = inject(StateService);
  //Form variable and viewChild of the chat input field
  input = viewChild<ElementRef<HTMLInputElement>>('input');
  form: FormGroup;

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
  }
  onSubmit() {
    const currentTime = new Date();
    const formattedTime = this.formatAMPM(currentTime);

    /* const messageContent = {
      name: 'Jesus',
      message: this.form.value.message,
      time: formattedTime,
    }; */
    const roomObject: Message = {
      user_name: 'Jesus',
      room: this.stateService.room(),
      message: this.form.value.message,
      time: formattedTime,
    };
    this.chatService.sendMessageRoom(roomObject);
    this.getMessage();
    this.form.value.message = '';
    this.input()!.nativeElement.value = '';
  }

  private formatAMPM(date: Date): string {
    let hours: number | string = date.getHours();
    const minutes: number | string = date.getMinutes();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12; // Convierte a formato 12 horas
    hours = hours ? hours : 12; // La hora '0' debe ser '12'

    const strMinutes: number | string = minutes < 10 ? '0' + minutes : minutes; // Agrega un cero si es necesario

    return `${hours}:${strMinutes} ${ampm}`; // Retorna el tiempo formateado
  }
  getMessage() {
    this.chatService.chat$.subscribe((data) => {
      console.log('get: ', data, typeof data);
      this.mensajesPrueba.set(data);
    });
  }
}
