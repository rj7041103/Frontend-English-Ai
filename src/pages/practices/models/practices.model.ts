export interface PracticeTest {
  id?: string;
  question: string;
  options: string[];
  answer: string;
  userAnswer?: string;
  english_level: string;
}
