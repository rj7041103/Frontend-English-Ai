import { Component, ElementRef, inject, viewChild } from '@angular/core';
import confetti from 'canvas-confetti';
import { PracticesService } from './service/practices.service';
import { Observable } from 'rxjs';
import { PracticeTest } from './models/practices.model';

@Component({
  selector: 'app-practices',
  imports: [],
  templateUrl: './practices.component.html',
  styleUrl: './practices.component.css',
})
export class PracticesComponent {
  //HTML Elements
  progressBar = viewChild<ElementRef<HTMLDivElement>>('progressBar');
  questionContainer =
    viewChild<ElementRef<HTMLDivElement>>('questionContainer');
  optionsContainer = viewChild<ElementRef<HTMLDivElement>>('optionsContainer');
  quizContainer = viewChild<ElementRef<HTMLDivElement>>('quizContainer');
  questionText = viewChild<ElementRef<HTMLParagraphElement>>('questionText');
  completionScreen = viewChild<ElementRef<HTMLDivElement>>('completionScreen');
  confettiCanvas = viewChild<ElementRef<HTMLCanvasElement>>('confettiCanvas');

  //Variables
  currentQuestionIndex = 0;
  selectedOption: HTMLDivElement | null = null;

  //Services
  practiceService = inject(PracticesService);
  tests$!: Observable<PracticeTest[]>;

  ngAfterViewInit() {
    this.tests$ = this.practiceService.getTest();
    this.loadQuestion();
  }
  selectOption(element: HTMLDivElement) {
    if (this.selectedOption) {
      this.selectedOption.classList.remove(
        'border-2',
        'border-solid',
        'border-green-400'
      );
      this.selectedOption.classList.add('border-gray-300'); // Vuelve al borde original
    }

    // Actualizamos la opción seleccionada
    this.selectedOption = element;

    // Aplicamos los estilos a la nueva opción seleccionada
    this.selectedOption.classList.add(
      'border-2',
      'border-solid',
      'border-green-400'
    );
  }

  updateProgressBar() {
    this.tests$.subscribe((tests) => {
      const progress = ((this.currentQuestionIndex + 1) / tests.length) * 100;
      this.progressBar()!.nativeElement.style.width = `${progress}%`;
    });
  }
  showCompletionScreen() {
    this.quizContainer()!.nativeElement.classList.add('hidden');
    this.completionScreen()!.nativeElement.classList.remove('hidden');

    // Animación de confeti
    const confettiSettings = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    };

    confetti(confettiSettings);
    setTimeout(() => confetti({ ...confettiSettings, angle: 60 }), 250);
    setTimeout(() => confetti({ ...confettiSettings, angle: 120 }), 500);

    // Sonido de éxito
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0.1, context.currentTime);

    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // Do
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // Mi
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // Sol

    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
  }

  nextQuestion() {
    if (!this.selectedOption) {
      alert('Por favor, selecciona una opción antes de continuar.');
      return;
    }
    this.quizContainer()!.nativeElement.classList.add('fade-out');

    setTimeout(() => {
      this.quizContainer()!.nativeElement.classList.remove('fade-out');
      this.quizContainer()!.nativeElement.classList.add('fade-in');

      this.tests$.subscribe((tests) => {
        if (this.currentQuestionIndex < tests.length - 1) {
          this.currentQuestionIndex++;
          this.loadQuestion();
          this.selectedOption = null;
        } else {
          this.showCompletionScreen();
        }
      });

      setTimeout(() => {
        this.quizContainer()!.nativeElement.classList.remove('fade-in');
      }, 500);
    }, 500);

    this.updateProgressBar();
  }
  loadQuestion() {
    //Mostramos la pregunta
    this.tests$.subscribe((tests) => {
      const question = tests[this.currentQuestionIndex];
      this.questionText()!.nativeElement.textContent = question.question;

      this.optionsContainer()!.nativeElement.innerHTML = '';
      question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add(
          'bg-gray-50',
          'rounded-lg',
          'p-4',
          'border',
          'border-gray-300',
          'cursor-pointer',
          'hover:bg-gray-100',
          'relative'
        );
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => {
          this.selectOption(optionElement);
        });
        this.optionsContainer()!.nativeElement.appendChild(optionElement);
      });
    });
  }
}
