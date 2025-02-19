import { Component, ElementRef, viewChild } from '@angular/core';
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
export class IAComponent {
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

  private async initSpeech() {
    await this.chatGptService.initModel();
    await this.setupAudioRecorder();
    this.setupChannel();
    await this.chatGptService.chatGPTResponse(this.pc);
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
      //console.log(e);
    });
  }
  updateLanguage(): void {
    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
    }
  }

  toggleListening(): void {
    this.initSpeech();
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
}
