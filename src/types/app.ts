export type AppStep = 
  | 'landing'
  | 'lead-form'
  | 'title-selection'
  | 'payment'
  | 'chapter-writing';

export type Chapter = 
  | 'bab-1'
  | 'bab-2'
  | 'bab-3'
  | 'bab-4'
  | 'bab-5'
  | 'daftar-pustaka';

export interface LeadFormData {
  fakultas: string;
  jurusan: string;
  peminatan?: string;
  email: string;
}

export interface TitleIdea {
  id: string;
  title: string;
}

export interface ChapterContent {
  chapter: Chapter;
  content: string;
  revisionsRemaining: number;
  isComplete: boolean;
  chapterId?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  paymentDate: string;
  expiryDate: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fakultas?: string;
  jurusan?: string;
  peminatan?: string;
  subscription?: Subscription;
}

export interface RevisionPurchase {
  chapterId: string;
  amount: number;
  revisionsAdded: number;
  transactionId?: string;
}

export interface AppState {
  step: AppStep;
  leadData: LeadFormData | null;
  titleIdeas: TitleIdea[];
  selectedTitle: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed';
  chapters: Record<Chapter, ChapterContent>;
  currentChapter: Chapter | null;
  isGenerating: boolean;
  userId?: string;
  subscription?: Subscription;
  thesisId?: string;
}
