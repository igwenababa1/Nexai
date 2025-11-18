
export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'ordering';

export const ALL_QUESTION_TYPES: QuestionType[] = ['multiple-choice', 'true-false', 'fill-blank', 'matching', 'ordering'];

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice
  stems?: string[]; // For matching
  responses?: string[]; // For matching
  items?: string[]; // For ordering
  answer: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  topic: string;
  difficulty: string;
  numQuestions: number;
  questions: Question[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

// New types for Study Guide feature
export type GuideDepth = 'summary' | 'in-depth' | 'expert';
export type GuideFormat = 'key-points' | 'q-and-a' | 'concept-map';

export interface StudyGuideData {
    title: string;
    topic: string;
    depth: GuideDepth;
    format: GuideFormat;
    content: string; // Markdown content
}

// Type for the quiz generation form data
export interface QuizFormData {
    topic: string;
    sourceText: string;
    explanationGuidelines: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionTypes: QuestionType[];
    numQuestions: number;
}

// New type for Quiz Bookmarks
export interface QuizBookmark {
    id: number; // Unique ID, e.g., timestamp
    name: string; // Quiz title
    config: QuizFormData;
}