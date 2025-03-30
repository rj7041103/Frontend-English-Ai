import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-level',
  imports: [RouterLink],
  templateUrl: './level.component.html',
  styleUrl: './level.component.css',
})
export class LevelComponent {
  currentTaskLevel: number = 0;
  canActive2 = signal(false);
  canActive3 = signal(false);
  currentLevel: string | null = '';
  constructor() {
    effect(() => {
      this.canActive2();
      this.canActive3();
    });
  }
  ngAfterViewInit() {
    this.currentLevel = localStorage.getItem('currentTaskLevel');
    if (this.currentLevel != null && this.currentLevel == '2') {
      this.canActive2.set(true);
      console.log('2: ', this.canActive2());
    }
    if (this.currentLevel != null && this.currentLevel == '3')
      this.canActive3.set(true);

    /* this.currentTaskLevel = Number(localStorage.getItem('currentTaskLevel')); */
  }
}
