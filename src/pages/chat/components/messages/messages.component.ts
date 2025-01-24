import { Component, input } from '@angular/core';
import { Message } from '../../models/chat.models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-messages',
  imports: [FontAwesomeModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent {
  chatMessage = input.required<Message>();
  faUser = faUser;
}
