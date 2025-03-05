import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-found',
  imports: [RouterLink],
  templateUrl: './no-found.component.html',
  styleUrl: './no-found.component.css',
})
export class NoFoundComponent {
  starsContainer = viewChild<ElementRef<HTMLDivElement>>('stars');
  planetFace = viewChild<ElementRef<HTMLDivElement>>('planetFace');
  eyeLeft = viewChild<ElementRef<HTMLDivElement>>('eyeLeft');
  eyeRight = viewChild<ElementRef<HTMLDivElement>>('eyeRight');
  mouth = viewChild<ElementRef<HTMLDivElement>>('mouth');
  ngAfterViewInit() {
    this.createStars();
    this.animateFace();
  }
  createStars() {
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.classList.add(
        'absolute',
        'bg-white',
        'rounded-full',
        'animate-twinkle',
        'animate-move-stars'
      );

      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Posición aleatoria
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      // Animación con retraso aleatorio
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.style.animationDuration = `${Math.random() * 3 + 1}s, ${
        Math.random() * 30 + 10
      }s`;

      this.starsContainer()!.nativeElement.appendChild(star);
    }
  }

  animateFace() {
    const expressions = [
      // Triste normal
      {
        eyeHeight: '12px',
        mouthWidth: '30px',
        mouthCurve: '40%',
        mouthRotate: '180deg',
      },
      // Más triste
      {
        eyeHeight: '8px',
        mouthWidth: '35px',
        mouthCurve: '80%',
        mouthRotate: '180deg',
      },
      // Mueca a la derecha
      {
        eyeHeight: '10px',
        mouthWidth: '25px',
        mouthCurve: '30%',
        mouthRotate: '190deg',
      },
      // Mueca a la izquierda
      {
        eyeHeight: '10px',
        mouthWidth: '25px',
        mouthCurve: '30%',
        mouthRotate: '170deg',
      },
      // Muy triste
      {
        eyeHeight: '6px',
        mouthWidth: '40px',
        mouthCurve: '100%',
        mouthRotate: '180deg',
      },
    ];

    let index = 0;

    setInterval(() => {
      const expression = expressions[index];

      this.eyeLeft()!.nativeElement.style.height = expression.eyeHeight;
      this.eyeRight()!.nativeElement.style.height = expression.eyeHeight;

      this.mouth()!.nativeElement.style.width = expression.mouthWidth;
      this.mouth()!.nativeElement.style.borderRadius = `0 0 ${expression.mouthCurve} ${expression.mouthCurve}`;
      this.mouth()!.nativeElement.style.transform = `rotate(${expression.mouthRotate})`;

      index = (index + 1) % expressions.length;
    }, 1200);
  }
}
