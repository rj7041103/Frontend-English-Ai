import { Component, OnDestroy, OnInit } from '@angular/core';
import { IaService } from '../../shared/ia/ia.service';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;

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

  constructor(private geminiService: IaService) {}

  ngOnInit(): void {
    this.setupSpeech();
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

  private setupSpeech(): void {
    if ('webkitSpeechRecognition' in window) {
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

    this.synthesis = window.speechSynthesis;
  }

  updateLanguage(): void {
    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
    }
  }

  toggleListening(): void {
    if (!this.recognition) {
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
    }
  }

  async processText(text: string) {
    if (text.trim() !== '') {
      // No envíes texto vacío a la API
      const resultText = await this.geminiService.generateContent(text);
      this.speak(resultText);
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
