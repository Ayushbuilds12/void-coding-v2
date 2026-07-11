import fs from 'fs';
import path from 'path';
import { Profile, Project, ChatMessage, Lesson, Progress, Subscription, BillingHistory } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface AuthUser {
  id: string;
  email: string;
  passwordHash: string; // Stored securely
}

interface DBState {
  users: AuthUser[];
  profiles: Profile[];
  projects: Project[];
  chats: ChatMessage[];
  lessons: Lesson[];
  progress: Progress[];
  subscriptions: Subscription[];
  billingHistory: BillingHistory[];
}

// Default seeded curriculum
const DEFAULT_LESSONS: Lesson[] = [
  {
    id: 'intro-python',
    title: 'Getting Started with Python',
    description: 'Learn Python syntax, variables, types, and standard input/output.',
    difficulty: 'beginner',
    category: 'Python',
    content: `# Welcome to Python!

Python is a versatile, high-level, and easy-to-learn programming language. Let\'s understand the core fundamentals of Python.

## Variables and Basic Types
In Python, you don\'t need to declare types explicitly. The interpreter infers them dynamically:
\`\`\`python
name = "Student"      # String
age = 20              # Integer
grade = 9.5           # Float
is_learning = True    # Boolean
\`\`\`

## Conditional Statements
Control the flow of your program using \`if\`, \`elif\`, and \`else\`:
\`\`\`python
score = 85
if score >= 90:
    print("Grade A")
elif score >= 80:
    print("Grade B")
else:
    print("Grade C")
\`\`\`

Let\'s try to write a simple program that returns the maximum of two numbers!`,
    codeChallenge: {
      problemStatement: 'Write a function `find_max(a, b)` that takes two numbers and returns the larger of the two. If they are equal, return either.',
      starterCode: 'def find_max(a, b):\n    # Write your code here\n    pass',
      expectedOutput: '15',
      testCases: [
        { input: '10, 15', output: '15' },
        { input: '40, -5', output: '40' }
      ]
    },
    quizzes: [
      {
        id: 'py-q1',
        question: 'Which of the following is NOT a valid variable declaration in Python?',
        options: [
          'x = 10',
          'int x = 10',
          'name = "Alice"',
          'is_valid = False'
        ],
        correctAnswerIndex: 1,
        explanation: 'Python is dynamically typed; you do not declare variable types explicitly using keywords like "int".'
      },
      {
        id: 'py-q2',
        question: 'What is the output of print(type(3.14)) in Python?',
        options: [
          '<class \'int\'>',
          '<class \'str\'>',
          '<class \'float\'>',
          '<class \'double\'>'
        ],
        correctAnswerIndex: 2,
        explanation: 'Real numbers are represented as the float class in Python.'
      }
    ]
  },
  {
    id: 'cpp-pointers',
    title: 'Pointers & Memory Management in C++',
    description: 'Understand pointers, dereferencing, dynamic allocation, and the stack vs heap.',
    difficulty: 'advanced',
    category: 'C++',
    content: `# C++ Pointers and Memory Management

Pointers are one of the most powerful and critical features of C++. They allow direct access and manipulation of memory addresses.

## What is a Pointer?
A pointer is a variable that stores the memory address of another variable.
\`\`\`cpp
int x = 10;
int* ptr = &x; // ptr now holds the address of x
\`\`\`

## Dereferencing
To access or change the value stored in the address represented by a pointer, use the dereference operator \`*\`:
\`\`\`cpp
std::cout << *ptr; // Outputs 10
*ptr = 20;         // x is now 20
\`\`\`

## Dynamic Memory Allocation
Use the \`new\` keyword to allocate memory on the heap, and \`delete\` to release it to prevent memory leaks:
\`\`\`cpp
int* dptr = new int(100);
// Use it...
delete dptr; // ALWAYS clean up!
\`\`\``,
    codeChallenge: {
      problemStatement: 'Write a C++ function `void doubleValue(int* ptr)` that doubles the value of the integer pointed to by `ptr`.',
      starterCode: '#include <iostream>\n\nvoid doubleValue(int* ptr) {\n    // Write your code here\n}',
      expectedOutput: '20',
      testCases: [
        { input: '10', output: '20' },
        { input: '0', output: '0' }
      ]
    },
    quizzes: [
      {
        id: 'cpp-q1',
        question: 'What operator is used to retrieve the address of a variable in C++?',
        options: [
          '*',
          '&',
          '->',
          '#'
        ],
        correctAnswerIndex: 1,
        explanation: 'The address-of operator (&) returns the memory address of a variable.'
      }
    ]
  },
  {
    id: 'js-async',
    title: 'Asynchronous JavaScript & Promises',
    description: 'Master async code using Promises, .then(), and ES6 async/await syntax.',
    difficulty: 'intermediate',
    category: 'JavaScript',
    content: `# JavaScript Promises and Async/Await

JavaScript is single-threaded, but can handle asynchronous tasks like API requests and timers efficiently using the event loop, Promises, and Async/Await syntax.

## What is a Promise?
A \`Promise\` is an object representing the eventual completion or failure of an asynchronous operation.
\`\`\`javascript
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data loaded successfully!");
  }, 1000);
});
\`\`\`

## Async / Await
The modern \`async\` and \`await\` syntax makes asynchronous code look synchronous:
\`\`\`javascript
async function loadUserData() {
  try {
    const data = await fetchData;
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
\`\`\``,
    codeChallenge: {
      problemStatement: 'Write an asynchronous function `delayedGreeting(name)` that returns a greeting string after 500ms: "Hello, [name]!".',
      starterCode: 'async function delayedGreeting(name) {\n    // Write your code here\n}',
      expectedOutput: 'Hello, User!',
      testCases: [
        { input: '"User"', output: 'Hello, User!' }
      ]
    },
    quizzes: [
      {
        id: 'js-q1',
        question: 'Which of the following keywords is used to wait for a promise to resolve inside an async function?',
        options: [
          'wait',
          'await',
          'hold',
          'promise'
        ],
        correctAnswerIndex: 1,
        explanation: 'The "await" keyword is placed before a Promise to pause execution until that promise fulfills or rejects.'
      }
    ]
  },
  {
    id: 'sql-joins',
    title: 'SQL Database Joins',
    description: 'Learn how to query multiple tables using INNER JOIN, LEFT JOIN, and RIGHT JOIN.',
    difficulty: 'intermediate',
    category: 'SQL',
    content: `# SQL Joins Explained

In relational databases, data is split across multiple tables. To combine rows from two or more tables based on a related column, we use **JOINS**.

## Core Types of Joins
1. **INNER JOIN**: Returns records that have matching values in both tables.
2. **LEFT JOIN**: Returns all records from the left table, and the matched records from the right table.
3. **RIGHT JOIN**: Returns all records from the right table, and the matched records from the left table.

## Inner Join Example
\`\`\`sql
SELECT orders.id, customers.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
\`\`\``,
    codeChallenge: {
      problemStatement: 'Write a SQL query that selects the `title` of books and the `name` of their authors by joining the `books` table and `authors` table on `books.author_id = authors.id`.',
      starterCode: 'SELECT books.title, authors.name\nFROM books\n-- Write join clause here',
      expectedOutput: 'Book Title, Author Name',
      testCases: []
    },
    quizzes: [
      {
        id: 'sql-q1',
        question: 'Which SQL join returns all rows from the left table even if there are no matches in the right table?',
        options: [
          'INNER JOIN',
          'LEFT JOIN',
          'RIGHT JOIN',
          'CROSS JOIN'
        ],
        correctAnswerIndex: 1,
        explanation: 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table plus any matched records from the right.'
      }
    ]
  },
  {
    id: 'dsa-binary-search',
    title: 'Binary Search Algorithm',
    description: 'Master binary search in O(log n) time complexity, and implement recursive and iterative versions.',
    difficulty: 'intermediate',
    category: 'Algorithms',
    content: `# Binary Search Algorithm

Binary search is an extremely efficient algorithm for finding an item from a **sorted** list of items.

## How it works
It works by repeatedly dividing in half the portion of the list that could contain the item, until you\'ve narrowed down the possible locations to just one.

## Time Complexity
- **Worst-case**: O(log n)
- **Best-case**: O(1)
- **Space complexity**: O(1) for iterative implementations.

## Iterative Implementation in Python
\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\``,
    codeChallenge: {
      problemStatement: 'Implement binary search in Python: `binary_search(arr, target)` returning the index of `target` in sorted array `arr`, or -1 if not found.',
      starterCode: 'def binary_search(arr, target):\n    # Write your code here\n    pass',
      expectedOutput: '3',
      testCases: [
        { input: '[1, 3, 5, 7, 9, 11], 7', output: '3' },
        { input: '[1, 3, 5, 7, 9, 11], 4', output: '-1' }
      ]
    },
    quizzes: [
      {
        id: 'dsa-q1',
        question: 'What is the absolute prerequisite for performing a binary search on an array?',
        options: [
          'The array must contain only integers.',
          'The array must be sorted.',
          'The array must have an even number of elements.',
          'The array must be dynamic.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Binary search requires the elements to be in sorted order so it can make decisions on which half to eliminate.'
      }
    ]
  }
];

class DBService {
  private state: DBState;

  constructor() {
    this.state = {
      users: [],
      profiles: [],
      projects: [],
      chats: [],
      lessons: DEFAULT_LESSONS,
      progress: [],
      subscriptions: [],
      billingHistory: []
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.state = {
          users: parsed.users || [],
          profiles: parsed.profiles || [],
          projects: parsed.projects || [],
          chats: parsed.chats || [],
          lessons: parsed.lessons && parsed.lessons.length > 0 ? parsed.lessons : DEFAULT_LESSONS,
          progress: parsed.progress || [],
          subscriptions: parsed.subscriptions || [],
          billingHistory: parsed.billingHistory || []
        };
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error initializing database file:', e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database state:', e);
    }
  }

  // --- Auth & Profile ---
  public signup(email: string, fullName: string, passwordHash: string, educationLevel: string): { user: AuthUser; profile: Profile } | null {
    const trimmedEmail = email.toLowerCase().trim();
    const exists = this.state.users.find(u => u.email === trimmedEmail);
    if (exists) return null;

    const id = Math.random().toString(36).substring(2, 11);
    const user: AuthUser = { id, email: trimmedEmail, passwordHash };
    const profile: Profile = {
      id,
      email: trimmedEmail,
      full_name: fullName,
      avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(fullName)}`,
      education_level: educationLevel,
      created_at: new Date().toISOString()
    };

    // Auto-create free subscription
    const subscription: Subscription = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: id,
      plan: 'free',
      status: 'active',
      razorpay_customer_id: null,
      razorpay_subscription_id: null,
      created_at: new Date().toISOString()
    };

    this.state.users.push(user);
    this.state.profiles.push(profile);
    this.state.subscriptions.push(subscription);
    this.save();

    return { user, profile };
  }

  public login(email: string, passwordHash: string): { user: AuthUser; profile: Profile } | null {
    const trimmedEmail = email.toLowerCase().trim();
    const user = this.state.users.find(u => u.email === trimmedEmail && u.passwordHash === passwordHash);
    if (!user) return null;

    const profile = this.state.profiles.find(p => p.id === user.id);
    if (!profile) return null;

    return { user, profile };
  }

  public getProfile(userId: string): Profile | null {
    return this.state.profiles.find(p => p.id === userId) || null;
  }

  public updateProfile(userId: string, fullName: string, educationLevel: string): Profile | null {
    const profileIndex = this.state.profiles.findIndex(p => p.id === userId);
    if (profileIndex === -1) return null;

    this.state.profiles[profileIndex].full_name = fullName;
    this.state.profiles[profileIndex].education_level = educationLevel;
    this.state.profiles[profileIndex].avatar_url = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(fullName)}`;
    this.save();
    return this.state.profiles[profileIndex];
  }

  // --- Projects ---
  public getProjects(userId: string): Project[] {
    return this.state.projects.filter(p => p.user_id === userId);
  }

  public createProject(userId: string, name: string, description: string, title?: string, prompt?: string, generatedCode?: string, deploymentUrl?: string): Project {
    const project: Project = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      name,
      title: title || name,
      description,
      status: 'active',
      prompt,
      generated_code: generatedCode,
      deployment_url: deploymentUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.state.projects.push(project);
    this.save();
    return project;
  }

  public updateProject(
    userId: string,
    projectId: string,
    name?: string,
    description?: string,
    status?: 'active' | 'completed' | 'archived',
    title?: string,
    prompt?: string,
    generatedCode?: string,
    deploymentUrl?: string
  ): Project | null {
    const projIndex = this.state.projects.findIndex(p => p.id === projectId && p.user_id === userId);
    if (projIndex === -1) return null;

    if (name !== undefined) this.state.projects[projIndex].name = name;
    if (title !== undefined) {
      this.state.projects[projIndex].title = title;
      if (name === undefined) this.state.projects[projIndex].name = title;
    }
    if (description !== undefined) this.state.projects[projIndex].description = description;
    if (status !== undefined) this.state.projects[projIndex].status = status;
    if (prompt !== undefined) this.state.projects[projIndex].prompt = prompt;
    if (generatedCode !== undefined) this.state.projects[projIndex].generated_code = generatedCode;
    if (deploymentUrl !== undefined) this.state.projects[projIndex].deployment_url = deploymentUrl;
    
    this.state.projects[projIndex].updated_at = new Date().toISOString();
    this.save();
    return this.state.projects[projIndex];
  }

  public deleteProject(userId: string, projectId: string): boolean {
    const lengthBefore = this.state.projects.length;
    this.state.projects = this.state.projects.filter(p => !(p.id === projectId && p.user_id === userId));
    const isDeleted = this.state.projects.length < lengthBefore;
    if (isDeleted) {
      // Also delete associate chats
      this.state.chats = this.state.chats.filter(c => c.project_id !== projectId);
      this.save();
    }
    return isDeleted;
  }

  // --- Chats ---
  public getChats(userId: string, projectId: string | null): ChatMessage[] {
    return this.state.chats.filter(c => c.user_id === userId && c.project_id === projectId);
  }

  public addChatMessage(userId: string, projectId: string | null, role: 'user' | 'assistant', message: string): ChatMessage {
    const chat: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      project_id: projectId,
      role,
      message,
      created_at: new Date().toISOString()
    };
    this.state.chats.push(chat);
    this.save();
    return chat;
  }

  public clearChats(userId: string, projectId: string | null): void {
    this.state.chats = this.state.chats.filter(c => !(c.user_id === userId && c.project_id === projectId));
    this.save();
  }

  // --- Lessons & Progress ---
  public getLessons(): Lesson[] {
    return this.state.lessons;
  }

  public getLesson(lessonId: string): Lesson | null {
    return this.state.lessons.find(l => l.id === lessonId) || null;
  }

  public getProgress(userId: string): Progress[] {
    return this.state.progress.filter(p => p.user_id === userId);
  }

  public updateProgress(userId: string, lessonId: string, completionPercentage: number): Progress {
    const index = this.state.progress.findIndex(p => p.user_id === userId && p.lesson_id === lessonId);
    const now = new Date().toISOString();
    if (index !== -1) {
      // Keep highest completion percentage
      if (completionPercentage > this.state.progress[index].completion_percentage) {
        this.state.progress[index].completion_percentage = completionPercentage;
        if (completionPercentage >= 100) {
          this.state.progress[index].completed_at = now;
        }
      }
      this.save();
      return this.state.progress[index];
    } else {
      const newProgress: Progress = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: userId,
        lesson_id: lessonId,
        completion_percentage: completionPercentage,
        completed_at: completionPercentage >= 100 ? now : undefined
      };
      this.state.progress.push(newProgress);
      this.save();
      return newProgress;
    }
  }

  // --- Subscriptions & Billing ---
  public getSubscription(userId: string): Subscription | null {
    return this.state.subscriptions.find(s => s.user_id === userId) || null;
  }

  public updateSubscription(userId: string, plan: 'free' | 'pro', status: 'active' | 'cancelled' | 'none', razorpaySubId?: string): Subscription {
    const index = this.state.subscriptions.findIndex(s => s.user_id === userId);
    const now = new Date().toISOString();
    if (index !== -1) {
      this.state.subscriptions[index].plan = plan;
      this.state.subscriptions[index].status = status;
      if (razorpaySubId) {
        this.state.subscriptions[index].razorpay_subscription_id = razorpaySubId;
        this.state.subscriptions[index].razorpay_customer_id = `cust_${Math.random().toString(36).substring(2, 11)}`;
      }
      this.save();
      return this.state.subscriptions[index];
    } else {
      const newSub: Subscription = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: userId,
        plan,
        status,
        razorpay_customer_id: razorpaySubId ? `cust_${Math.random().toString(36).substring(2, 11)}` : null,
        razorpay_subscription_id: razorpaySubId || null,
        created_at: now
      };
      this.state.subscriptions.push(newSub);
      this.save();
      return newSub;
    }
  }

  public getBillingHistory(userId: string): BillingHistory[] {
    return this.state.billingHistory.filter(b => b.user_id === userId);
  }

  public addBillingHistory(userId: string, amount: number, plan: string, paymentId: string): BillingHistory {
    const invoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const history: BillingHistory = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      amount,
      currency: 'INR',
      plan,
      status: 'success',
      invoice_id: invoiceId,
      payment_id: paymentId,
      created_at: new Date().toISOString()
    };
    this.state.billingHistory.push(history);
    this.save();
    return history;
  }

  // --- GDPR COMPLIANCE EXPORT & PURGE ENGINE ---
  public deleteUser(userId: string): boolean {
    const userIndex = this.state.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    // Remove all traces of user data from internal state
    this.state.users = this.state.users.filter(u => u.id !== userId);
    this.state.profiles = this.state.profiles.filter(p => p.id !== userId);
    this.state.projects = this.state.projects.filter(p => p.user_id !== userId);
    this.state.chats = this.state.chats.filter(c => c.user_id !== userId);
    this.state.progress = this.state.progress.filter(pr => pr.user_id !== userId);
    this.state.subscriptions = this.state.subscriptions.filter(s => s.user_id !== userId);
    this.state.billingHistory = this.state.billingHistory.filter(bh => bh.user_id !== userId);

    this.save();
    return true;
  }

  public exportUserData(userId: string): any {
    const profile = this.getProfile(userId);
    if (!profile) return null;

    return {
      profile,
      projects: this.getProjects(userId),
      chats: this.state.chats.filter(c => c.user_id === userId),
      progress: this.getProgress(userId),
      subscription: this.getSubscription(userId),
      billingHistory: this.getBillingHistory(userId),
      exportDate: new Date().toISOString(),
      legalNotice: "This archive represents all active database structures connected to your account under GDPR Article 15."
    };
  }
}

export const db = new DBService();
export type { AuthUser };
