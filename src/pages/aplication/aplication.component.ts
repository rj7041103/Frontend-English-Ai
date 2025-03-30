import { Component } from '@angular/core';
import { ItemBentoComponent } from './components/item-bento/item-bento.component';

@Component({
  selector: 'app-aplication',
  imports: [ItemBentoComponent],
  templateUrl: './aplication.component.html',
  styleUrl: './aplication.component.css',
})
export class AplicationComponent {}
