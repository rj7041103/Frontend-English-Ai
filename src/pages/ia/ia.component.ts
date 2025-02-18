import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { IaService } from '../../shared/ia/ia.service';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ia',
  imports: [FormsModule, CommonModule],
  templateUrl: './ia.component.html',
  styleUrl: './ia.component.css',
})
export class IAComponent implements OnInit, OnDestroy {
  private recognition: any;
  private synthesis: any;
  isListening = false;
  private readonly destroy$ = new Subject<void>();
  selectedLanguage = 'es-VE';
  languages = [
    { code: 'es-VE', name: 'Español (Venezuela)' },
    { code: 'en-US', name: 'Inglés (EE.UU.)' },
  ];
  responseText: string = ''; // Para almacenar la respuesta de la API
  finalTranscript = '';

  // Create a peer connection
  pc = new RTCPeerConnection();

  //Audio Element
  audioEl = viewChild<ElementRef<HTMLAudioElement>>('audio');
  constructor(private chatGptService: IaService) {}

  async ngOnInit() {
    //this.setupSpeech();\
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.recognition) {
      this.recognition.abort();
    }
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  private async setupSpeech() {
    /* if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    } else {
      console.error(
        'La API de reconocimiento de voz no está soportada en este navegador.'
      );
      return;
    }

    this.recognition.lang = this.selectedLanguage;
    this.recognition.continuous = true;
    this.recognition.interimResults = true; // Agrega esto para transcribir en tiempo real

    this.synthesis = window.speechSynthesis; */
    const Ephemeral_Token = await this.chatGptService.initModel();
    this.pc.ontrack = (e) =>
      (this.audioEl()!.nativeElement.srcObject = e.streams[0]);
    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.pc.addTrack(ms.getTracks()[0]);
    // Set up data channel for sending and receiving events
    const dc = this.pc.createDataChannel('oai-events');
    dc.addEventListener('message', (e) => {
      // Realtime server events appear here!
      console.log(e);
      // Evento cuando la IA envía audio
      if (e.type === 'response.audio.done') {
        console.log('Audio de la IA listo:', e);
        // El audio ya se reproduce automáticamente vía ontrack
      }

      // Evento de transcripción del usuario
      if (e.type === 'response.audio_transcript.done') {
        console.log('Transcripción final:');
      }
    });

    // Start the session using the Session Description Protocol (SDP)
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    const baseUrl = 'https://api.openai.com/v1/realtime';
    const model = 'gpt-4o-realtime-preview-2024-12-17';
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${Ephemeral_Token}`,
        'Content-Type': 'application/sdp',
      },
    });

    const answer: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: await sdpResponse.text(),
    };
    await this.pc.setRemoteDescription(answer);
  }

  updateLanguage(): void {
    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
    }
  }

  toggleListening(): void {
    this.setupSpeech();
    /* if (!this.recognition) {
      console.error(
        'La API de reconocimiento de voz no está soportada en este navegador.'
      );
      return;
    }

    this.isListening = !this.isListening;
    if (this.isListening) {
      this.finalTranscript = '';
      this.recognition.start();

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        console.log(interimTranscript);
        this.responseText = interimTranscript;
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          //this.recognition.start();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en la reconocimiento de voz:', event);
      };
    } else {
      console.log('Este es el final: ', this.finalTranscript);
      this.processText(this.finalTranscript);
      this.recognition.stop();
      this.recognition.abort();
    } */
  }

  //Speak function
  async processText(text: string) {
    if (text.trim() !== '') {
      // No envíes texto vacío a la API
      //const resultText = await this.geminiService.generateContent(text);
      //this.speak(resultText);
    }
  }
  private speak(text: string): void {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      this.synthesis.speak(utterance);
    } else {
      console.error(
        'La API de síntesis de voz no está soportada en este navegador.'
      );
    }
  }
}
