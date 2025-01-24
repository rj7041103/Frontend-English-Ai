import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
@Injectable({
  providedIn: 'root',
})
export class IaService {
  async generateContent(text: string): Promise<string> {
    // Access your API key as an environment variable (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI(
      'AIzaSyCcWUYKD_tXpAe7Y2esa70RSp_AUS0swHQ'
    );

    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.0-flash-exp',
    });

    /* const imageResp = await fetch(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/2560px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg"
).then((response) => response.arrayBuffer()); */

    const result = await model.generateContent(text);
    return result.response.text();
  }
}
