import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemBentoComponent } from './components/item-bento/item-bento.component';

@Component({
  selector: 'app-aplication',
  imports: [RouterLink, ItemBentoComponent],
  templateUrl: './aplication.component.html',
  styleUrl: './aplication.component.css',
})
export class AplicationComponent {}
