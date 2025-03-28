import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-item-bento',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './item-bento.component.html',
  styleUrl: './item-bento.component.css',
})
export class ItemBentoComponent {
  //Icons
  faComments = faComments;
  unlockedLevels = JSON.parse(localStorage.getItem('unlockedEnglishLevels')!);
  itemBentoArray = [
    {
      name: 'Level A1 🏠📚',
      english_level: 'A1',
      description: 'Da el primer paso en tu aprendizaje',
      direction: '/level',
    },
    {
      name: 'Level A2 ✏📝',
      english_level: 'A2',
      description: 'Sigue avanzando al segundo nivel',
      direction: '/level',
    },
    {
      name: 'Level B1 🔤📔',
      english_level: 'B1',
      description: 'Domina el tercer nivel y mejora tu inglés',
      direction: '/level',
    },
    {
      name: 'Praticas AI 🤖💬',
      english_level: '',
      description: 'Habla con la IA y mejora tu inglés',
      direction: '/session',
    },
    {
      name: 'Chat 📝💭',
      english_level: '',
      description: 'Chat de Comunidad',
      direction: '/chat',
    },

    {
      name: 'Level B2 🏆📊',
      english_level: 'B2',
      description: 'Llega al cuarto nivel y destaca',
      direction: '/level',
    },
  ];
}
