import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { IaService } from '../../shared/ia/ia.service';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import Typed from 'typed.js';
import { AppStore } from '../../store/store';

@Component({
  selector: 'app-ia',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './ia.component.html',
  styleUrls: ['./ia.component.css'], // Corregido a styleUrls
})
export class IAComponent {
  private recognition: any;
  private synthesis: any;
  private readonly destroy$ = new Subject<void>();
  selectedLanguage = 'es-VE';
  languages = [
    { code: 'es-VE', name: 'Español (Venezuela)' },
    { code: 'en-US', name: 'Inglés (EE.UU.)' },
  ];

  // Almacenar transcripción para mostrarla en el HTML
  transcriptText = signal('');
  // Create a peer connection
  pc = new RTCPeerConnection();
  //Html Elements
  sphere = viewChild<ElementRef<SVGElement>>('sphere');
  particlesContainer =
    viewChild<ElementRef<HTMLDivElement>>('particlescontainer');
  soundWavesContainer = viewChild<ElementRef<HTMLDivElement>>(
    'soundwavescontainer'
  );
  button = viewChild<ElementRef<HTMLButtonElement>>('speakbutton');
  timer = viewChild<ElementRef<HTMLSpanElement>>('timer');
  timerContainer = viewChild<ElementRef<HTMLDivElement>>('timerContainer');
  //Audio Element
  audioEl = viewChild<ElementRef<HTMLAudioElement>>('audio');

  // Variables
  isListening = signal(false);
  private animationTimeline!: gsap.core.Timeline;
  private particles: gsap.core.Tween[] = [];
  private soundWaves: gsap.core.Tween[] = [];
  private isSpeaking = false;
  private timerInterval: any = null;
  private timeLeft = 20 * 60;
  appStore = inject(AppStore);

  constructor(private chatGptService: IaService) {
    afterNextRender(() => {
      gsap.set(this.sphere()!.nativeElement, { scale: 1 });
    });
    effect(() => {
      if (this.isListening()) {
        this.button()!.nativeElement.textContent = 'Detener';
        this.startAnimation();
      } else {
        this.stopAnimation();
        this.button()!.nativeElement.textContent = 'Hablar';
      }
    });
  }

  ngAfterViewInit() {
    this.loadInstruction();
  }

  loadInstruction() {
    let typed = new Typed('.typed', {
      strings: [
        '<span class="text-white">Click and Wait 5 seconds</span>',
        '<span class="text-white">Say "what is your purpose?"</span>',
        '<span class="text-white">Say "Repeat the sentences"</span>',
        '<span class="text-white"></span>',
      ],
      stringsElement: '#container-text',
      typeSpeed: 75,
      startDelay: 300,
      backSpeed: 75,
      smartBackspace: true,
      shuffle: false,
      showCursor: false,
      backDelay: 1500,
      loop: false,
    });
  }

  private startAnimation() {
    // Animación de la esfera
    this.animationTimeline = gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(this.sphere()!.nativeElement, {
        duration: 0.5,
        scale: 1.05,
        ease: 'power2.inOut',
      });

    // Crear partículas y ondas de sonido
    this.createParticles();
    this.createSoundWaves();
  }

  private stopAnimation() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.animationTimeline?.kill();
    gsap.to(this.sphere()!.nativeElement, {
      duration: 0.3,
      scale: 1,
      ease: 'power1.inOut',
    });

    // Limpiar animaciones
    this.particles.forEach((tween) => tween.kill());
    this.soundWaves.forEach((tween) => tween.kill());
    this.particles = [];
    this.soundWaves = [];
    this.particlesContainer()!.nativeElement.innerHTML = '';
    this.soundWavesContainer()!.nativeElement.innerHTML = '';
  }

  updateTimer() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timer()!.nativeElement.textContent = `${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (this.timeLeft <= 0) {
      // Completar nivel 3 (1 tarea)
      this.appStore.completeTask(3);
      //se guarda el progreso en localStorage
      this.appStore.saveProgressTasks();
      this.appStore.saveProgressEnglishLevel();
      if (this.timerInterval !== null) {
        this.isListening.set(false);
        clearInterval(this.timerInterval);
      }
      if (this.isSpeaking) {
        this.isSpeaking = false;
        this.button()!.nativeElement.textContent = 'Hablar / Speak';
        this.stopAnimation();
      }
    } else {
      this.timeLeft--;
    }
  }
  private createParticles() {
    const numParticles = 20;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute rounded-full';
      particle.style.cssText = `
          width: 5px;
          height: 5px;
          background-color: #8B5CF6;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;

      this.particlesContainer()!.nativeElement.appendChild(particle);

      const tween = gsap.to(particle, {
        duration: Math.random() * 1 + 0.5,
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
        opacity: 0,
        scale: Math.random() * 2,
        ease: 'power1.out',
        repeat: -1,
        yoyo: true,
        delay: Math.random(),
      });

      this.particles.push(tween);
    }
  }

  private createSoundWaves() {
    const numBars = 32; // Número de barras del espectro
    const containerWidth = 300; // Ancho del contenedor
    const barWidth = 8; // Ancho de cada barra
    const spacing = 4; // Espacio entre barras

    // Limpiar contenedor antes de crear nuevas ondas
    this.soundWavesContainer()!.nativeElement.innerHTML = '';

    // Crear efecto de barras de espectro animadas
    for (let i = 0; i < numBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'audio-bar';

      // Posicionamiento horizontal
      const xPosition = i * (barWidth + spacing) - containerWidth / 2;

      bar.style.cssText = `
          width: ${barWidth}px;
          height: 20px;
          background: linear-gradient(to top, #8B5CF6, #6366F1);
          position: absolute;
          left: 50%;
          margin-left: ${xPosition}px;
          bottom: 50%;
          transform-origin: bottom;
          border-radius: 3px 3px 0 0;
          opacity: 0.8;
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        `;

      this.soundWavesContainer()!.nativeElement.appendChild(bar);

      // Animación con variación aleatoria similar a un ecualizador
      const tween = gsap.to(bar, {
        duration: 0.4 + Math.random() * 0.4,
        scaleY: () => 0.2 + Math.random() * 2.5, // Altura aleatoria dinámica
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 0.5,
      });

      this.soundWaves.push(tween);
    }
  }

  private async initSpeech() {
    await this.chatGptService.initModel();
    await this.setupAudioRecorder();
    this.setupChannel();
    await this.chatGptService.chatGPTResponse(this.pc);
    this.isSpeaking = !this.isSpeaking;
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  async setupAudioRecorder() {
    this.pc.ontrack = (e) =>
      (this.audioEl()!.nativeElement.srcObject = e.streams[0]);
    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.pc.addTrack(ms.getTracks()[0]);
  }

  // Set up data channel for sending and receiving events
  setupChannel() {
    const dc = this.pc.createDataChannel('oai-events');
    dc.addEventListener('message', (e) => {
      try {
        // Intenta parsear el JSON recibido
        const message = JSON.parse(e.data);

        // Verifica si 'part' existe antes de intentar acceder a 'transcript'
        if (message && message.part && message.part.transcript) {
          this.transcriptText.set(message.part.transcript);
        }
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      }
    });
  }

  updateLanguage(): void {
    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
    }
  }

  async toggleListening() {
    if (this.isListening()) {
      // Detener la función de habla
      this.stopListening();
    } else {
      // Iniciar la función de habla
      this.startListening();
    }
  }

  private async startListening() {
    this.isListening.set(true);
    this.timeLeft = 20 * 60; // Resetear a 20 minutos
    this.timer()!.nativeElement.textContent = '20:00'; // Actualizar visualmente
    await this.initSpeech();
  }

  private async stopListening() {
    this.isListening.set(false);
    this.timeLeft = 20 * 60; // Resetear el contador
    this.timer()!.nativeElement.textContent = '20:00'; // Actualizar UI
    // Cerrar la conexión WebRTC
    this.pc.close();
    this.pc = new RTCPeerConnection();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAnimation();
    if (this.recognition) {
      this.recognition.abort();
    }
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    // Cerrar la conexión WebRTC al destruir el componente
    this.pc.close();
  }
}
