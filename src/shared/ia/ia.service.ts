import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class IaService {
  Ephemeral_Token: string = '';
  // Create a peer connection
  async initModel(): Promise<void> {
    const tokenResponse = await fetch('http://localhost:3000/session');
    const data = await tokenResponse.json();
    this.Ephemeral_Token = data.client_secret.value;
  }

  async chatGPTResponse(pc: RTCPeerConnection): Promise<void> {
    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const baseUrl = 'https://api.openai.com/v1/realtime';
    const model = 'gpt-4o-realtime-preview-2024-12-17';
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${this.Ephemeral_Token}`,
        'Content-Type': 'application/sdp',
      },
    });

    const answer: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: await sdpResponse.text(),
    };
    await pc.setRemoteDescription(answer);
  }
}
