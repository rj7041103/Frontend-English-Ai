import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RearrangeSentences } from './models/sentences.model';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-rearrange-sentences',
  imports: [RouterLink],
  templateUrl: './rearrange-sentences.component.html',
  styleUrl: './rearrange-sentences.component.css',
})
export class RearrangeSentencesComponent {
  wordLists: RearrangeSentences[] = [
    {
      level: 1,
      words: ['the', 'cat', 'is', 'black'],
      sentence: 'the cat is black',
    },
    {
      level: 2,
      words: ['my', 'dog', 'likes', 'to', 'play'],
      sentence: 'my dog likes to play',
    },
    {
      level: 3,
      words: ['she', 'reads', 'books', 'every', 'day'],
      sentence: 'she reads books every day',
    },
    {
      level: 4,
      words: ['I', 'want', 'to', 'learn', 'English', 'today'],
      sentence: 'I want to learn English today',
    },
    {
      level: 5,
      words: ['they', 'are', 'going', 'to', 'the', 'beach', 'tomorrow'],
      sentence: 'they are going to the beach tomorrow',
    },
    {
      level: 6,
      words: ['he', 'always', 'drinks', 'coffee', 'in', 'the', 'morning'],
      sentence: 'he always drinks coffee in the morning',
    },
  ];

  //Variables
  currentLevel = 1;

  wordBank: (string | null)[] = [];

  correctSentence = '';

  wordsLearned = 0;

  totalWords = this.wordLists.length;

  draggedElement: null | HTMLElement = null;

  dragStartIndex: number | null = null;

  router = inject(Router);

  //HTML elements
  checkBtn = viewChild<ElementRef<HTMLButtonElement>>('checkBtn');
  nextLevelBtn = viewChild<ElementRef<HTMLButtonElement>>('nextLevelBtn');
  resetBtn = viewChild<ElementRef<HTMLButtonElement>>('resetBtn');
  progressBar = viewChild<ElementRef<HTMLDivElement>>('progressBar');
  levelDisplay = viewChild<ElementRef<HTMLDivElement>>('levelDisplay');
  instruction = viewChild<ElementRef<HTMLParagraphElement>>('instruction');
  sentenceArea = viewChild<ElementRef<HTMLDivElement>>('sentenceArea');
  emptyPrompt = viewChild<ElementRef<HTMLDivElement>>('emptyPrompt');
  feedback = viewChild<ElementRef<HTMLDivElement>>('feedback');
  gameContainer = viewChild<ElementRef<HTMLDivElement>>('gameContainer');

  ngAfterViewInit() {
    this.initializeGame();
  }

  initializeGame() {
    this.setupEventListeners();
    this.updateLevelDisplay();
    this.updateProgressBar();
    this.loadLevel();
  }

  setupEventListeners() {
    this.checkBtn()!.nativeElement.addEventListener('click', () =>
      this.checkSentence()
    );
    this.nextLevelBtn()!.nativeElement.addEventListener('click', () =>
      this.nextLevel()
    );
    this.resetBtn()!.nativeElement.addEventListener('click', () =>
      this.resetSentence()
    );
    // Touch events for mobile support
    this.setupMobileSupport();
  }

  setupMobileSupport() {
    document.addEventListener(
      'touchstart',
      (e: any) => {
        const target = e.target as HTMLElement; // Cast e.target to HTMLElement
        if (target.classList.contains('word-card')) {
          this.draggedElement = target;
          this.draggedElement!.classList.add('opacity-50');
          this.draggedElement!.classList.add('dragging');
          this.dragStartIndex = [
            ...this.draggedElement.parentNode!.children,
          ].indexOf(this.draggedElement);
        }
      },
      { passive: false }
    );

    document.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        if (!this.draggedElement) return;

        const touch = e.touches[0];

        // Move the dragged element to follow the finger
        this.draggedElement.style.position = 'fixed';
        this.draggedElement.style.top = `${
          touch.clientY - this.draggedElement.offsetHeight / 2
        }px`;
        this.draggedElement.style.left = `${
          touch.clientX - this.draggedElement.offsetWidth / 2
        }px`;
        this.draggedElement.style.zIndex = 1000 + '';

        const afterElement = this.getDragAfterElement(
          this.sentenceArea()!.nativeElement,
          touch.clientX
        );

        if (!afterElement) {
          this.sentenceArea()!.nativeElement.appendChild(this.draggedElement);
        } else {
          this.sentenceArea()!.nativeElement.insertBefore(
            this.draggedElement,
            afterElement
          );
        }
      },
      { passive: false }
    );

    document.addEventListener('touchend', (e) => {
      if (!this.draggedElement) return;

      // Reset styles
      this.draggedElement.style.position = '';
      this.draggedElement.style.top = '';
      this.draggedElement.style.left = '';
      this.draggedElement.style.zIndex = '';
      this.draggedElement.classList.remove('opacity-50');
      this.draggedElement.classList.remove('dragging');

      const sentenceArea = document.getElementById('sentence-area');
      // Update wordBank based on current order
      this.wordBank = Array.from(
        sentenceArea!.querySelectorAll('.word-card')
      ).map((el) => el.textContent);

      this.draggedElement = null;
      this.dragStartIndex = null;
    });
  }

  loadLevel() {
    const levelData = this.wordLists[this.currentLevel - 1];
    this.wordBank = this.shuffleArray([...levelData.words]);
    this.correctSentence = levelData.sentence;

    // Reset UI state
    this.feedback()!.nativeElement.innerHTML = '';
    document
      .getElementById('next-level-btn')!
      .classList.add('opacity-50', 'pointer-events-none');

    this.renderWords();
    this.setupDragAndDrop();

    // Update instruction based on level

    this.instruction()!.nativeElement.textContent = `Level ${this.currentLevel}: Arrange the words to form a correct English sentence.`;
    this.instruction()!.nativeElement.classList.add(
      'animate__animated',
      'animate__fadeIn'
    );
  }

  updateLevelDisplay() {
    document.getElementById('level-display')!.textContent =
      this.currentLevel + '';
  }

  updateProgressBar() {
    const progressPercentage = this.currentLevel;
    document.getElementById('progress')!.style.width = `${progressPercentage}%`;
  }

  renderWords() {
    this.sentenceArea()!.nativeElement.innerHTML = '';

    if (this.wordBank.length === 0) {
      this.sentenceArea()!.nativeElement.innerHTML =
        '<div class="text-white/50 text-center text-lg pointer-events-none" id="empty-prompt">Arrange the words to form a sentence</div>';
      return;
    }

    this.wordBank.forEach((word) => {
      const wordElement = document.createElement('div');
      wordElement.textContent = word;
      wordElement.classList.add(
        'word-card',
        'bg-gradient-to-r',
        'from-blue-600',
        'to-indigo-600',
        'text-white',
        'px-5',
        'py-3',
        'rounded-lg',
        'cursor-move',
        'hover:shadow-lg',
        'shadow-md',
        'transition-all',
        'select-none',
        'animate__animated',
        'animate__fadeIn'
      );
      wordElement.draggable = true;
      this.sentenceArea()!.nativeElement.appendChild(wordElement);
    });
  }

  setupDragAndDrop() {
    const draggableWords = document.querySelectorAll('.word-card');

    draggableWords.forEach((word) => {
      word.addEventListener('dragstart', (e: Event) => {
        const dragEvent = e as DragEvent;
        this.draggedElement = word as HTMLElement;
        dragEvent.dataTransfer!.setData('text/plain', word.textContent ?? '');
        setTimeout(() => {
          word.classList.add('opacity-50');
          word.classList.add('dragging');
        }, 0);
      });
      word.addEventListener('dragend', (e) => {
        word.classList.remove('opacity-50');
        word.classList.remove('dragging');
        draggableWords.forEach((w) => w.classList.remove('drag-over'));
      });
    });

    this.sentenceArea()!.nativeElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggable = document.querySelector('.dragging');

      if (draggable) {
        const mouseX = e.clientX;
        const afterElement = this.getDragAfterElement(
          this.sentenceArea()!.nativeElement,
          mouseX
        );

        if (!afterElement) {
          this.sentenceArea()!.nativeElement.appendChild(draggable);
        } else {
          this.sentenceArea()!.nativeElement.insertBefore(
            draggable,
            afterElement
          );
        }
      }
    });

    this.sentenceArea()!.nativeElement.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!this.draggedElement) return;

      // Update wordBank based on current order
      this.wordBank = Array.from(
        this.sentenceArea()!.nativeElement.querySelectorAll('.word-card')
      ).map((el) => el.textContent);

      this.draggedElement = null;
    });
  }

  getDragAfterElement(container: any, x: any) {
    const draggableElements = [
      ...container.querySelectorAll('.word-card:not(.dragging)'),
    ];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;

      if (offset < 0 && offset > (closest.offset || Number.NEGATIVE_INFINITY)) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, {}).element;
  }

  resetSentence() {
    const levelData = this.wordLists[this.currentLevel - 1];
    this.wordBank = this.shuffleArray([...levelData.words]);
    this.renderWords();
    this.setupDragAndDrop();
    this.feedback()!.nativeElement.innerHTML = '';
  }

  checkSentence() {
    const wordElements = Array.from(
      this.sentenceArea()!.nativeElement.querySelectorAll('.word-card')
    );
    const constructedSentence = wordElements
      .map((el) => el.textContent)
      .join(' ');

    if (constructedSentence.trim() === this.correctSentence.trim()) {
      this.feedback()!.nativeElement.innerHTML = `
            <div class="text-green-400 animate__animated animate__bounceIn flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ¡Correcto! You've mastered this sentence! 
            </div>
        `;

      // Make all words glow
      wordElements.forEach((el) => {
        el.classList.add('correct-word');
        el.classList.replace('from-blue-600', 'from-green-500');
        el.classList.replace('to-indigo-600', 'to-emerald-600');
      });

      // Enable next level button
      this.nextLevelBtn()!.nativeElement.classList.remove(
        'opacity-50',
        'pointer-events-none'
      );
      this.nextLevelBtn()!.nativeElement.classList.add(
        'animate__animated',
        'animate__pulse'
      );

      // Update words learned count
      this.wordsLearned += this.wordBank.length;
      this.updateProgressBar();
    } else {
      this.feedback()!.nativeElement.innerHTML = `
            <div class="text-red-400 animate__animated animate__shakeX flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Not quite right. Try again! 
            </div>
        `;

      // Shake the sentence area
      this.sentenceArea()!.nativeElement.classList.add(
        'animate__animated',
        'animate__shakeX'
      );
      this.sentenceArea()!.nativeElement.addEventListener(
        'animationend',
        () => {
          this.sentenceArea()!.nativeElement.classList.remove(
            'animate__animated',
            'animate__shakeX'
          );
        },
        { once: true }
      );
    }
  }

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel > this.wordLists.length) {
      this.showGameCompleted();
      this.checkBtn()!.nativeElement.textContent = 'Next Level';
      this.checkBtn()!.nativeElement.addEventListener('click', () => {
        this.router.navigateByUrl('/practices');
      });
      this.currentLevel = 1;
    }
    this.updateLevelDisplay();
    this.loadLevel();
  }

  showGameCompleted() {
    this.gameContainer()!.nativeElement.innerHTML = `
        <div class="text-center py-10 animate__animated animate__fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-yellow-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h2 class="text-3xl font-bold text-white mb-4">Congratulations!</h2>
            <p class="text-xl text-white/80 mb-8">You've completed all the levels and mastered ${this.wordsLearned} words!</p>
            <button id="restart-btn" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg">
                Play Again
            </button>
        </div>
    `;

    this.resetBtn()!.nativeElement.addEventListener('click', () => {
      window.location.reload();
    });

    this.feedback()!.nativeElement.innerHTML = '';
    this.nextLevelBtn()!.nativeElement.classList.add(
      'opacity-50',
      'pointer-events-none'
    );
  }

  shuffleArray(array: any) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}
