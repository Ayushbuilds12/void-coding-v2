export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  education_level: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  title?: string; // Interchangeable with name
  description: string;
  status: 'active' | 'completed' | 'archived';
  prompt?: string;
  generated_code?: string;
  deployment_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  project_id: string | null; // null for general AI Mentor chat
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  content: string; // Markdown content containing code templates
  codeChallenge?: {
    problemStatement: string;
    starterCode: string;
    expectedOutput: string;
    testCases: Array<{ input: string; output: string }>;
  };
  quizzes?: QuizQuestion[];
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completion_percentage: number;
  completed_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'none';
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  created_at: string;
}

export interface BillingHistory {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  plan: string;
  status: 'success' | 'failed' | 'pending';
  invoice_id: string;
  payment_id: string;
  created_at: string;
}
