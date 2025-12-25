
export interface Course {
  id: string;
  level: string;
  title: string;
  price: number;
  description: string;
  duration: string;
  targetAudience: string;
  skills: string[];
  color: string;
  features: string[];
}

export interface SyllabusTopic {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
}

export interface LevelQuiz {
  level: string; // L1, L2, etc
  questions: QuizQuestion[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown text
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  level: string; // L1, L2, L3, L4
  image?: string;
}