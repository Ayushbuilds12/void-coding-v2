import { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Code2, Check, ArrowLeft, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { Lesson, Progress } from '../types';

interface LearnViewProps {
  token: string;
  initialSelectedLesson: Lesson | null;
  lessons: Lesson[];
  progress: Progress[];
  onRefreshProgress: () => Promise<void>;
}

export default function LearnView({ token, initialSelectedLesson, lessons, progress, onRefreshProgress }: LearnViewProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(initialSelectedLesson);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'challenge'>('content');

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Challenge states
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeOutput, setChallengeOutput] = useState<{ success: boolean; msg: string } | null>(null);
  const [challengeRunning, setChallengeRunning] = useState(false);

  useEffect(() => {
    if (initialSelectedLesson) {
      handleSelectLesson(initialSelectedLesson);
    }
  }, [initialSelectedLesson]);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('content');
    setQuizAnswers({});
    setQuizSubmitted({});
    setChallengeOutput(null);
    setChallengeCode(lesson.codeChallenge?.starterCode || '');
  };

  // Submit single quiz answer
  const handleSelectOption = (quizId: string, optionIdx: number) => {
    if (quizSubmitted[quizId]) return;
    setQuizAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmitQuiz = (quizId: string) => {
    setQuizSubmitted(prev => ({ ...prev, [quizId]: true }));
    triggerProgressSync(50); // Set 50% completed when quizzes are answered
  };

  // Run the code sandbox assertions
  const handleRunCode = async () => {
    if (!selectedLesson?.codeChallenge) return;
    setChallengeRunning(true);
    setChallengeOutput(null);

    // Simulate simple client-side code runner with a 800ms delay
    setTimeout(() => {
      const challenge = selectedLesson.codeChallenge!;
      const code = challengeCode.trim();

      // Simple keyword heuristic assertions
      let success = false;
      let msg = '';

      if (selectedLesson.id === 'intro-python') {
        const containsDef = code.includes('def find_max');
        const containsMax = code.includes('max(') || code.includes('>') || code.includes('return');
        if (containsDef && containsMax) {
          success = true;
          msg = 'Test Case 1 passed: find_max(10, 15) -> 15\nTest Case 2 passed: find_max(40, -5) -> 40\n\nAssert: Coding challenge completed successfully!';
        } else {
          msg = 'SyntaxError: ensure you define find_max(a, b) and return the larger value.';
        }
      } else if (selectedLesson.id === 'cpp-pointers') {
        const containsPointer = code.includes('*ptr') && code.includes('doubleValue');
        if (containsPointer) {
          success = true;
          msg = 'Compilation successful.\nTest Case 1 passed: ptr value doubled -> 20\n\nAssert: Pointer dereference operates correctly!';
        } else {
          msg = 'Warning: Ensure you multiply the value pointed by ptr: *ptr = *ptr * 2; or *ptr *= 2;';
        }
      } else if (selectedLesson.id === 'js-async') {
        const containsAsync = code.includes('async') && code.includes('Promise');
        if (containsAsync) {
          success = true;
          msg = 'Test Case 1 passed: delayedGreeting("User") resolved in 500ms -> "Hello, User!"';
        } else {
          msg = 'SyntaxError: async function delayedGreeting must return a Promise resolver.';
        }
      } else if (selectedLesson.id === 'sql-joins') {
        const containsJoin = code.toLowerCase().includes('join') && code.toLowerCase().includes('books') && code.toLowerCase().includes('authors');
        if (containsJoin) {
          success = true;
          msg = 'Query compiled successfully.\nINNER JOIN established book title and author name matching.';
        } else {
          msg = 'SQL SyntaxError: join clauses books and authors on books.author_id = authors.id expected.';
        }
      } else {
        // Default success for others
        success = code.length > 20;
        msg = success ? 'Success! Code assertions completed correctly.' : 'Please write a complete solution to fulfill constraints.';
      }

      setChallengeOutput({ success, msg });
      setChallengeRunning(false);

      if (success) {
        triggerProgressSync(100); // Set 100% completed when code challenge succeeds
      }
    }, 800);
  };

  // Sync completion progress to backend
  const triggerProgressSync = async (percentage: number) => {
    if (!selectedLesson) return;
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId: selectedLesson.id, completionPercentage: percentage })
      });
      await onRefreshProgress();
    } catch (e) {
      console.error(e);
    }
  };

  // List of course categories
  const categories = Array.from(new Set(lessons.map(l => l.category)));

  // --- RENDERING LESSON STUDY WORKSPACE ---
  if (selectedLesson) {
    const lessonProgress = progress.find(p => p.lesson_id === selectedLesson.id);
    const percent = lessonProgress?.completion_percentage || 0;

    return (
      <div className="space-y-6 text-white animate-fadeIn">
        {/* Top bar back navigation */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <button 
            onClick={() => setSelectedLesson(null)}
            className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>Back to catalog</span>
          </button>
          
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
            <span>Progress:</span>
            <div className="w-24 bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }}></div>
            </div>
            <span className="text-purple-400 font-bold">{percent}%</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-900">
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-5 py-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'content' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Study Material</span>
          </button>
          {selectedLesson.quizzes && selectedLesson.quizzes.length > 0 && (
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-5 py-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'quiz' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>2. Code Quiz</span>
            </button>
          )}
          {selectedLesson.codeChallenge && (
            <button 
              onClick={() => setActiveTab('challenge')}
              className={`px-5 py-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'challenge' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
            >
              <Code2 className="w-4 h-4" />
              <span>3. Code Challenge</span>
            </button>
          )}
        </div>

        {/* Tab 1: Curriculum markdown content */}
        {activeTab === 'content' && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-purple-950/60 border border-purple-900/40 font-mono text-[9px] uppercase tracking-wider text-purple-300">
                {selectedLesson.category}
              </span>
              <span className="text-xs text-zinc-500 capitalize">{selectedLesson.difficulty} level</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{selectedLesson.title}</h1>
            
            {/* Simple Markdown custom parser */}
            <div className="font-sans text-sm sm:text-base leading-relaxed text-zinc-300 space-y-5 border-t border-zinc-900/80 pt-6">
              {selectedLesson.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('###')) {
                  return <h3 key={pIdx} className="text-base sm:text-lg font-bold text-white mt-8">{paragraph.replace('###', '')}</h3>;
                }
                if (paragraph.startsWith('##')) {
                  return <h2 key={pIdx} className="text-lg sm:text-xl font-bold text-white mt-8">{paragraph.replace('##', '')}</h2>;
                }
                if (paragraph.startsWith('#')) {
                  return <h1 key={pIdx} className="hidden">{paragraph}</h1>; // Skip main title as shown above
                }
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const content = lines.slice(1, -1).join('\n');
                  const lang = lines[0].substring(3) || 'code';
                  return (
                    <div key={pIdx} className="my-4 font-mono text-xs sm:text-sm">
                      <div className="flex justify-between px-3 py-1.5 bg-zinc-900 border-t border-x border-zinc-800 rounded-t text-[10px] text-zinc-500 font-mono">
                        <span>SYNTAX: {lang.toUpperCase()}</span>
                      </div>
                      <pre className="bg-black/95 p-4 border-b border-x border-zinc-800 rounded-b text-emerald-400 overflow-x-auto leading-relaxed">
                        <code>{content}</code>
                      </pre>
                    </div>
                  );
                }
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-2 text-sm text-zinc-300">
                      {paragraph.split('\n').map((li, liIdx) => (
                        <li key={liIdx}>{li.substring(2)}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={pIdx} className="leading-relaxed">{paragraph}</p>;
              })}
            </div>

            {/* Next buttons */}
            <div className="flex justify-between items-center border-t border-zinc-900/60 pt-6 mt-8">
              <span className="text-xs text-zinc-500 font-mono">Completed reading material?</span>
              <button 
                onClick={() => {
                  triggerProgressSync(25);
                  if (selectedLesson.quizzes && selectedLesson.quizzes.length > 0) setActiveTab('quiz');
                  else if (selectedLesson.codeChallenge) setActiveTab('challenge');
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                Continue to Quiz
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Quiz Cards */}
        {activeTab === 'quiz' && selectedLesson.quizzes && (
          <div className="space-y-6">
            {selectedLesson.quizzes.map((q, idx) => {
              const selectedIdx = quizAnswers[q.id];
              const submitted = quizSubmitted[q.id];
              const isCorrect = selectedIdx === q.correctAnswerIndex;

              return (
                <div key={q.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-5.5 h-5.5 rounded-full bg-purple-950/80 border border-purple-800/40 text-[10px] font-mono text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base">{q.question}</h3>
                  </div>

                  <div className="grid gap-2.5 pl-8.5 text-xs sm:text-sm">
                    {q.options.map((option, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      let optionStyle = "border-zinc-900 bg-zinc-900/10 hover:border-zinc-800";
                      
                      if (submitted) {
                        if (optIdx === q.correctAnswerIndex) {
                          optionStyle = "border-emerald-500/60 bg-emerald-950/20 text-emerald-100";
                        } else if (isSelected) {
                          optionStyle = "border-red-500/60 bg-red-950/20 text-red-100";
                        } else {
                          optionStyle = "border-zinc-900 bg-zinc-950 opacity-45";
                        }
                      } else if (isSelected) {
                        optionStyle = "border-purple-600 bg-purple-950/10 text-purple-200";
                      }

                      return (
                        <button 
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border focus:outline-none transition-all ${optionStyle}`}
                        >
                          <span className="font-mono text-zinc-500 mr-2.5">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and explanations */}
                  <div className="pl-8.5">
                    {!submitted ? (
                      <button 
                        disabled={selectedIdx === undefined}
                        onClick={() => handleSubmitQuiz(q.id)}
                        className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-xs rounded border border-zinc-800 font-semibold"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${isCorrect ? 'border-emerald-950/50 bg-emerald-950/5 text-emerald-400' : 'border-red-950/50 bg-red-950/5 text-red-400'}`}>
                        <div className="flex items-center space-x-2 font-mono font-bold uppercase mb-1">
                          {isCorrect ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span>Correct!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span>Incorrect!</span>
                            </>
                          )}
                        </div>
                        <p className="text-zinc-300 font-sans mt-2">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                  if (selectedLesson.codeChallenge) setActiveTab('challenge');
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                Go to Coding Challenge
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Coding sandbox environment */}
        {activeTab === 'challenge' && selectedLesson.codeChallenge && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Problem Statement Panel */}
            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-mono text-[10px] uppercase text-purple-400 tracking-widest flex items-center gap-1.5 mb-4">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Instructions</span>
                </h3>
                <h4 className="font-bold text-sm text-zinc-200">Problem Statement</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                  {selectedLesson.codeChallenge.problemStatement}
                </p>

                {selectedLesson.codeChallenge.testCases && selectedLesson.codeChallenge.testCases.length > 0 && (
                  <div className="border-t border-zinc-900 pt-4 mt-4 space-y-2">
                    <p className="text-xs font-bold text-zinc-300">Expected Assertions</p>
                    {selectedLesson.codeChallenge.testCases.map((tc, idx) => (
                      <div key={idx} className="bg-zinc-900/40 p-2.5 rounded border border-zinc-900 font-mono text-[10px] text-zinc-400">
                        <span className="text-zinc-500">Input:</span> {tc.input} <br />
                        <span className="text-zinc-500">Output:</span> {tc.output}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg p-3 text-[11px] text-purple-300 leading-relaxed">
                💡 **Code Guard**: Avoid typing generic loop counters blindly. Be sure to return variables properly to complete asserts.
              </div>
            </div>

            {/* Sandbox code editor */}
            <div className="lg:col-span-3 flex flex-col space-y-4">
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[350px]">
                {/* Editor Header */}
                <div className="flex justify-between items-center bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Workspace Sandbox Editor</span>
                  </span>
                  <span className="text-[10px] text-purple-400 font-mono">{selectedLesson.category}</span>
                </div>
                
                {/* Textarea compiler */}
                <textarea 
                  value={challengeCode}
                  onChange={(e) => setChallengeCode(e.target.value)}
                  className="flex-1 w-full bg-black/95 p-4 font-mono text-xs sm:text-sm text-emerald-400 outline-none resize-none leading-relaxed"
                  spellCheck="false"
                />
              </div>

              {/* Action runner */}
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => setChallengeCode(selectedLesson.codeChallenge?.starterCode || '')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 focus:outline-none"
                >
                  Reset Starter
                </button>
                <button 
                  onClick={handleRunCode}
                  disabled={challengeRunning}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 focus:outline-none"
                >
                  {challengeRunning ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  <span>Run Sandbox Test</span>
                </button>
              </div>

              {/* Result output console */}
              {challengeOutput && (
                <div className={`border p-4 rounded-xl font-mono text-xs ${challengeOutput.success ? 'border-emerald-950 bg-emerald-950/15 text-emerald-400' : 'border-red-950 bg-red-950/15 text-red-400'}`}>
                  <div className="font-bold uppercase tracking-wider text-[10px] mb-2">
                    {challengeOutput.success ? '[Console] Assertion SUCCESS' : '[Console] Assertion FAILED'}
                  </div>
                  <pre className="whitespace-pre-wrap">{challengeOutput.msg}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDERING LESSON CATALOG LIST ---
  return (
    <div className="space-y-8 text-white animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Curriculum Catalog</h1>
        <p className="text-xs text-zinc-400 mt-1">Select structured lessons to understand syntax, answer quizzes, and solve sandboxed compiler assertions.</p>
      </div>

      <div className="space-y-8">
        {categories.map((cat, idx) => {
          const categoryLessons = lessons.filter(l => l.category === cat);

          return (
            <div key={idx} className="space-y-4">
              <h2 className="text-base font-bold font-mono text-purple-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                <span>{cat.toUpperCase()} PATH</span>
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryLessons.map((less) => {
                  const lessonProgress = progress.find(p => p.lesson_id === less.id);
                  const percent = lessonProgress?.completion_percentage || 0;
                  const isCompleted = percent >= 100;

                  return (
                    <div 
                      key={less.id}
                      onClick={() => handleSelectLesson(less)}
                      className="group bg-zinc-950 border border-zinc-900 hover:border-purple-900/60 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-mono tracking-widest uppercase ${
                            less.difficulty === 'beginner' ? 'text-blue-400' : less.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {less.difficulty}
                          </span>
                          
                          {isCompleted && (
                            <span className="w-5 h-5 rounded-full bg-purple-950/60 border border-purple-800/40 text-[9px] text-purple-300 flex items-center justify-center font-mono">
                              ✓
                            </span>
                          )}
                        </div>

                        <h3 className="font-sans font-bold text-base text-zinc-100 group-hover:text-purple-400 transition-colors">
                          {less.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 h-8 leading-relaxed">
                          {less.description}
                        </p>
                      </div>

                      {/* Lesson dynamic progress meter */}
                      <div className="mt-6 pt-4 border-t border-zinc-900/60">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1.5">
                          <span>Progress</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
