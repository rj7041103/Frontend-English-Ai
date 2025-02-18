import { Component, inject, Input, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../service/chat.service';
import { AppStore } from '../../../../store/store';

@Component({
  selector: 'app-create-form-room',
  imports: [ReactiveFormsModule],
  templateUrl: './create-form-room.component.html',
  styleUrl: './create-form-room.component.css',
})
export class CreateFormRoomComponent {
  //form
  form: FormGroup;

  // Two way binding
  newRoomCreated = output<boolean>();

  //store
  readonly store = inject(AppStore);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      icon: ['', [Validators.required]],
      room_name: ['', [Validators.required]],
    });
  }
  onSubmit() {
    this.createdRoom();
  }

  createdRoom() {
    this.newRoomCreated.emit(true);
    this.store.setRoom(this.form.value);
  }
}
