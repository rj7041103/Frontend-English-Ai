import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import confetti from 'canvas-confetti';
import { PracticesService } from './service/practices.service';
import { BehaviorSubject } from 'rxjs';
import { PracticeTest } from './models/practices.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../store/store';

@Component({
  selector: 'app-practices',
  imports: [AsyncPipe, CommonModule, RouterLink],
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

  //Completion Exam
  completionScreen = viewChild<ElementRef<HTMLDivElement>>('completionScreen');
  confettiCanvas = viewChild<ElementRef<HTMLCanvasElement>>('confettiCanvas');
  resultTable = viewChild<ElementRef<HTMLDivElement>>('resultTable');

  //Timer
  timerBar = viewChild<ElementRef<HTMLDivElement>>('timerBar');
  timerText = viewChild<ElementRef<HTMLDivElement>>('timerText');
  hourHand = viewChild<ElementRef<HTMLDivElement>>('hourHand');
  minuteHand = viewChild<ElementRef<HTMLDivElement>>('minuteHand');

  //Variables
  currentQuestionIndex = 0;
  selectedOption: HTMLDivElement | null = null;
  optionsLocked = false;
  timerInterval: any;
  secondsLeft = 30;
  correctCount = 0;
  totalQuestions = 0;
  isReady = signal<boolean>(false);
  appStore = inject(AppStore);

  //Services
  practiceService = inject(PracticesService);
  testsSubject = new BehaviorSubject<PracticeTest[]>([]);

  ngAfterViewInit() {
    this.practiceService.getTest().subscribe((tests) => {
      this.testsSubject.next(tests);
      this.loadQuestion();
      this.startTimer();
    });
  }
  startTimer() {
    clearInterval(this.timerInterval);
    this.secondsLeft = 30;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.secondsLeft--;
      this.updateTimerDisplay();

      if (this.secondsLeft <= 0) {
        clearInterval(this.timerInterval);
        if (!this.selectedOption) {
          this.autoSelectWrongOption();
        }
      }
    }, 1000);
  }

  updateTimerDisplay() {
    // Update timer bar width and color
    const percentage = (this.secondsLeft / 30) * 100;
    this.timerBar()!.nativeElement.style.width = `${percentage}%`;

    // Refined color change logic
    if (this.secondsLeft > 15) {
      // Green (30-15 seconds)
      this.timerBar()!.nativeElement.style.backgroundColor = '#10B981';
    } else if (this.secondsLeft > 10) {
      // Yellow (15-10 seconds)
      this.timerBar()!.nativeElement.style.backgroundColor = '#F59E0B';
    } else if (this.secondsLeft > 0) {
      // Red (10-0 seconds)
      this.timerBar()!.nativeElement.style.backgroundColor = '#EF4444';
    } else {
      // Ensure red when time is up
      this.timerBar()!.nativeElement.style.backgroundColor = '#EF4444';
    }

    // Update timer text
    this.timerText()!.nativeElement.textContent = `${this.secondsLeft}s`;

    // For a 30 second timer, we'll make the minute hand complete one full rotation
    // and the hour hand complete 1/12th of a rotation
    const minuteRotation = 360 * (1 - this.secondsLeft / 30);
    const hourRotation = minuteRotation / 12;

    this.minuteHand()!.nativeElement.style.transform = `rotate(${minuteRotation}deg)`;
    this.hourHand()!.nativeElement.style.transform = `rotate(${hourRotation}deg)`;

    // Add tick sound for last 10 seconds
    if (this.secondsLeft <= 10 && this.secondsLeft > 0) {
      this.playTickSound();
    }
  }
  autoSelectWrongOption() {
    if (this.optionsLocked) return;
    const tests = this.testsSubject.getValue();
    const currentTest = tests[this.currentQuestionIndex];
    const options = Array.from(this.optionsContainer()!.nativeElement.children);

    // Find the first incorrect option
    const wrongOption = options.find(
      (option) => option.textContent !== currentTest.answer
    );
    if (wrongOption) {
      this.selectOption(wrongOption, wrongOption.textContent!);
    }

    // Automatically move to next question and reset timer
    setTimeout(this.nextQuestion.bind(this), 500);
  }
  selectOption(element: any, option: string) {
    if (this.optionsLocked) return;
    this.selectedOption = element;
    const tests = this.testsSubject.getValue();
    this.totalQuestions = tests.length;
    this.optionsLocked = true;
    const correctAnswer = tests[this.currentQuestionIndex].answer;
    // Store user's answer in the question object
    tests[this.currentQuestionIndex].userAnswer = option;
    this.testsSubject.next(tests);
    // Stop the timer
    clearInterval(this.timerInterval);

    if (option === correctAnswer) {
      //update progress state in the second task
      this.appStore.completeTask(2);
      console.log(
        'completed questions: ',
        this.appStore.userProgress().completedQuestions
      );

      console.log(
        'current level: ',
        this.appStore.userProgress().currentTaskLevel
      );

      console.log('English level: ', this.appStore.userProgress().englishLevel);

      this.selectedOption!.classList.add(
        'border-green-500',
        'shadow-shadowGreen'
      );
      this.playCorrectSound();
      this.correctCount++;
    } else {
      this.selectedOption!.classList.add(
        'border-incorrectAnswer',
        'shadow-shadowRed'
      );
      this.playIncorrectSound();
    }
  }
  playCorrectSound() {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, context.currentTime);

    // Melodía ascendente
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // Do
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // Mi
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // Sol

    oscillator.start();
    setTimeout(() => oscillator.stop(), 300);
  }

  playIncorrectSound() {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, context.currentTime);

    // Tono bajo descendente
    oscillator.frequency.setValueAtTime(392.0, context.currentTime); // Sol
    oscillator.frequency.exponentialRampToValueAtTime(
      98.0,
      context.currentTime + 0.3
    ); // Sol bajo

    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
  }

  playTickSound() {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0.05, context.currentTime);
    oscillator.frequency.setValueAtTime(1000, context.currentTime); // High pitch tick

    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
  }
  calculatePassStatus(): boolean {
    //console.log('t: ', this.totalQuestions);
    const percentage = (this.correctCount / this.totalQuestions) * 100;
    return percentage >= 65;
  }

  updateProgressBar() {
    const progress =
      ((this.currentQuestionIndex + 1) / this.testsSubject.getValue().length) *
      100;
    this.progressBar()!.nativeElement.style.width = `${progress}%`;
  }
  showCompletionScreen() {
    this.isReady.set(true);
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
    /* const context = new AudioContext();
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
    setTimeout(() => oscillator.stop(), 500); */
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

      if (this.currentQuestionIndex < this.testsSubject.getValue().length - 1) {
        this.currentQuestionIndex++;
        this.loadQuestion();
        this.selectedOption = null;
      } else {
        this.showCompletionScreen();
      }
      setTimeout(() => {
        this.quizContainer()!.nativeElement.classList.remove('fade-in');
      }, 200);
    }, 320);

    this.updateProgressBar();
    this.startTimer();
  }
  loadQuestion() {
    //Mostramos la pregunta
    const tests = this.testsSubject.getValue();
    const question = tests[this.currentQuestionIndex];
    this.questionText()!.nativeElement.textContent = question.question;

    this.optionsContainer()!.nativeElement.innerHTML = '';
    this.optionsLocked = false;
    question.options.forEach((option: string, index) => {
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
        if (!this.optionsLocked) {
          this.selectOption(optionElement, option);
        }
      });
      this.optionsContainer()!.nativeElement.appendChild(optionElement);
    });
  }

  retryTest() {
    window.location.reload();
  }
}
