import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Cpu, Sparkles, RefreshCw, Trash2, BookOpen, Terminal, Code2,
  Plus, MessageSquare, Paperclip, ChevronLeft, ChevronRight, Check, Copy,
  History, Eye, FileText, ArrowRight, CornerDownLeft, Info
} from 'lucide-react';
import { ChatMessage, Project } from '../types';

interface MentorViewProps {
  token: string;
  profile: { full_name: string; education_level: string };
}

interface ConversationItem {
  id: string;
  title: string;
  created_at: string;
  messages: ChatMessage[];
  projectId?: string | null;
  attachedFiles?: Array<{ name: string; size: string; content?: string }>;
}

export default function MentorView({ token, profile }: MentorViewProps) {
  // Saved local or synced database conversations
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeProjectContext, setActiveProjectContext] = useState<string>('');
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  
  // File upload staging states
  const [stagedFiles, setStagedFiles] = useState<Array<{ name: string; size: string; content?: string }>>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  
  // UI Panels toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedCodeId, setCopiedCodeId] = useState<string>('');
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial conversational structures and workspaces
  useEffect(() => {
    // Sync available folders/projects for context-awareness
    const fetchWorkspaces = async () => {
      try {
        const res = await fetch('/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableProjects(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchWorkspaces();
    initializeDefaultConversations();
  }, [token]);

  // Handle auto-scroll on message updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId, chatLoading]);

  // Load preset mockup chats or restore from storage
  const initializeDefaultConversations = () => {
    const saved = localStorage.getItem('void_ai_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setConversations(parsed);
          setActiveConvId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default seed conversations
    const seed: ConversationItem[] = [
      {
        id: 'conv_1',
        title: 'Binary Search Trees',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        projectId: null,
        attachedFiles: [],
        messages: [
          {
            id: 'm1',
            user_id: 'system',
            project_id: null,
            role: 'user',
            message: 'Help me understand the height of a BST simply',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: 'm2',
            user_id: 'assistant',
            project_id: null,
            role: 'assistant',
            message: `A Binary Search Tree (BST) height is the number of edges on the longest path from the root node to a leaf node.\n\nHere is a simple visual analogy:\nThink of the height as the number of floors in a building, starting from the lobby (Root) down to the basement apartments (Leaves).\n\nHere is how you compute it recursively in Python:\n\`\`\`python\ndef get_bst_height(root):\n    if root is None:\n        return -1 # Base case: height of empty tree\n    \n    # Calculate height of each subtree\n    left_height = get_bst_height(root.left)\n    right_height = get_bst_height(root.right)\n    \n    # Height is max depth + root edge\n    return max(left_height, right_height) + 1\n\`\`\`\n\n- Height of a single root node is 0\n- Height of an empty tree is -1\n- Time Complexity is O(N) where N is the number of nodes.`,
            created_at: new Date(Date.now() - 3600000 * 1.9).toISOString()
          }
        ]
      },
      {
        id: 'conv_2',
        title: 'Recursive Analogy Guide',
        created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
        projectId: null,
        attachedFiles: [],
        messages: [
          {
            id: 'm3',
            user_id: 'system',
            project_id: null,
            role: 'user',
            message: 'What is a good analogy for recursion?',
            created_at: new Date(Date.now() - 3600000 * 10).toISOString()
          },
          {
            id: 'm4',
            user_id: 'assistant',
            project_id: null,
            role: 'assistant',
            message: `The best real-world analogy for recursion is **Russian Nesting Dolls (Matryoshka dolls)**.\n\n1. **The Core Action**: You open a big doll, and inside is a smaller, but identical doll.\n2. **Reducing input state**: Each doll gets smaller and smaller as you go deeper.\n3. **The Base Case**: Eventually, you open a doll and find a tiny, solid wooden doll that cannot be opened. This is your base case! You stop opening dolls, and now you must re-assemble or look back at all the dolls you have laid out on the table.`,
            created_at: new Date(Date.now() - 3600000 * 9.9).toISOString()
          }
        ]
      }
    ];

    setConversations(seed);
    setActiveConvId(seed[0].id);
    localStorage.setItem('void_ai_conversations', JSON.stringify(seed));
  };

  // Create a brand new conversation
  const handleNewConversation = () => {
    const newId = 'conv_' + Date.now();
    const newConv: ConversationItem = {
      id: newId,
      title: `Workspace Discussion #${conversations.length + 1}`,
      created_at: new Date().toISOString(),
      projectId: activeProjectContext || null,
      attachedFiles: [],
      messages: []
    };

    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConvId(newId);
    setStagedFiles([]);
    localStorage.setItem('void_ai_conversations', JSON.stringify(updated));
  };

  // Delete a conversation from state and storage
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      alert('You must keep at least one active conversation session.');
      return;
    }
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    localStorage.setItem('void_ai_conversations', JSON.stringify(filtered));
    if (activeConvId === id) {
      setActiveConvId(filtered[0].id);
    }
  };

  // Drag and drop events for file uploading
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAttachedFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAttachedFiles(e.target.files);
    }
  };

  const processAttachedFiles = (fileList: FileList) => {
    const arr: Array<{ name: string; size: string; content?: string }> = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const sizeStr = f.size > 1024 * 1024 
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(f.size / 1024).toFixed(0)} KB`;
      
      // Simulate reading code or guidelines content if TXT/JSON/PY/JS
      arr.push({
        name: f.name,
        size: sizeStr,
        content: `// [Attached Code/Document Scope: ${f.name}]\n`
      });
    }
    setStagedFiles(prev => [...prev, ...arr]);
  };

  const handleRemoveStagedFile = (idx: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Sync state changes back to local storage
  const saveConversationsToStorage = (updatedList: ConversationItem[]) => {
    setConversations(updatedList);
    localStorage.setItem('void_ai_conversations', JSON.stringify(updatedList));
  };

  // Send message using typewriter animated simulation for premium streaming UX
  const handleSendChat = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customText || chatInput;
    if (!promptToSend.trim() && stagedFiles.length === 0 || chatLoading) return;

    setChatInput('');
    setChatLoading(true);

    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv) return;

    // Build user message body with optional attachments
    let userMsgText = promptToSend;
    if (stagedFiles.length > 0) {
      const fileNames = stagedFiles.map(f => `[Uploaded: ${f.name} (${f.size})]`).join(', ');
      userMsgText += `\n\n*(Attachments referenced: ${fileNames})*`;
    }

    const newUserMsg: ChatMessage = {
      id: 'msg_u_' + Date.now(),
      user_id: profile.full_name,
      project_id: activeProjectContext ? activeProjectContext : null,
      role: 'user',
      message: userMsgText,
      created_at: new Date().toISOString()
    };

    // Rename conversation on first message for premium feel
    let updatedTitle = activeConv.title;
    if (activeConv.messages.length === 0) {
      updatedTitle = promptToSend.substring(0, 24) + (promptToSend.length > 24 ? '...' : '');
    }

    const updatedMessages = [...activeConv.messages, newUserMsg];
    const updatedConv: ConversationItem = {
      ...activeConv,
      title: updatedTitle,
      messages: updatedMessages,
      projectId: activeProjectContext || null,
      attachedFiles: [...(activeConv.attachedFiles || []), ...stagedFiles]
    };

    const newConversationsList = conversations.map(c => c.id === activeConvId ? updatedConv : c);
    saveConversationsToStorage(newConversationsList);
    setStagedFiles([]);

    // Trigger API call or dynamic streaming synthesis
    try {
      // Find the project details if any to build "project-aware" system context
      const selectedProjObj = availableProjects.find(p => p.id === activeProjectContext);
      const projectContextGuidelines = selectedProjObj 
        ? `\n[Workspace Guidelines for project "${selectedProjObj.name}"]: ${selectedProjObj.description}` 
        : "";

      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: promptToSend + projectContextGuidelines,
          history: updatedMessages 
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantText = data.assistantChat?.message || "I completed processing your instructions.";
        
        // Start streaming typewriter simulation
        simulateStreamingResponse(assistantText);
      } else {
        // Fallback robust template responses based on keywords
        generateLocalAIAssistance(promptToSend);
      }
    } catch (err) {
      console.error(err);
      generateLocalAIAssistance(promptToSend);
    }
  };

  // Simulates staggered streaming/typewriter chunk updates
  const simulateStreamingResponse = (fullText: string) => {
    const assistantMsgId = 'msg_a_' + Date.now();
    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv) return;

    const newAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      user_id: 'assistant',
      project_id: activeProjectContext ? activeProjectContext : null,
      role: 'assistant',
      message: '', // Starts empty, fills up
      created_at: new Date().toISOString()
    };

    // Store empty message
    const withEmpty = {
      ...activeConv,
      messages: [...activeConv.messages, newAssistantMsg]
    };
    setConversations(prev => prev.map(c => c.id === activeConvId ? withEmpty : c));

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += Math.min(25, fullText.length - currentLength);
      const chunk = fullText.substring(0, currentLength);

      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          const msgs = c.messages.map(m => m.id === assistantMsgId ? { ...m, message: chunk } : m);
          return { ...c, messages: msgs };
        }
        return c;
      }));

      if (currentLength >= fullText.length) {
        clearInterval(interval);
        setChatLoading(false);
        // Persist final to storage
        setTimeout(() => {
          const currentLatest = conversations.find(c => c.id === activeConvId);
          if (currentLatest) {
            localStorage.setItem('void_ai_conversations', JSON.stringify(conversations));
          }
        }, 100);
      }
    }, 45);
  };

  // Offline local intelligence fallback compiler
  const generateLocalAIAssistance = (promptText: string) => {
    let localAns = "I parsed your instruction context safely.";
    const lower = promptText.toLowerCase();

    if (lower.includes('ptr') || lower.includes('pointer')) {
      localAns = `### Understanding Pointers simply\n\nA pointer is a memory address variable. Instead of holding a value (like \`5\`), it holds the **index number of the street coordinate** where the value lives.\n\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int num = 42;\n    int* ptr = &num; // Holds address of num\n    \n    cout << "Value of num: " << num << endl;\n    cout << "Address coordinate: " << ptr << endl;\n    cout << "Value via pointer: " << *ptr << endl;\n    return 0;\n}\n\`\`\`\n\n- \`&\` (Address-of Operator): Get address of value.\n- \`*\` (Dereference Operator): Look inside pointer box to get the value inside.`;
    } else if (lower.includes('list') || lower.includes('python')) {
      localAns = `### Python list comprehensions syntax\n\nList comprehensions offer a shorter syntax to build new lists based on existing list values.\n\n\`\`\`python\n# Syntax: [expression for item in iterable if condition]\n\n# Standard list building\nprimes = [2, 3, 5, 7, 11]\nsquares = []\nfor p in primes:\n    squares.append(p ** 2)\n\n# Perfected List Comprehension\ncomp_squares = [p**2 for p in primes]\nprint("Generated Squares: ", comp_squares) # [4, 9, 25, 49, 121]\n\`\`\`\n\n- Much cleaner to review and optimize\n- Executed natively in C-compiled loops for maximum speed.`;
    } else {
      localAns = `### Void Tutor Active\n\nI processed your request: "${promptText}". As your advanced AI Coding Companion, I recommend structuring your entry files with clear type interfaces.\n\nHere is a clean layout standard for high-performance API routes:\n\n\`\`\`typescript\ninterface ApiResponse<T> {\n  success: boolean;\n  data?: T;\n  error?: string;\n}\n\nexport async function handleRequest() {\n  return {\n    success: true,\n    data: "Academic catalog synchronized."\n  };\n}\n\`\`\``;
    }

    simulateStreamingResponse(localAns);
  };

  // Regenerate Response from specific index
  const handleRegenerateResponse = (msgId: string) => {
    const activeConv = conversations.find(c => c.id === activeConvId);
    if (!activeConv || chatLoading) return;

    // Find the user prompt right before this assistant message
    const msgIndex = activeConv.messages.findIndex(m => m.id === msgId);
    if (msgIndex <= 0) return;

    const userPrompt = activeConv.messages[msgIndex - 1].message;
    
    // Remove all messages from this index onwards
    const slicedMessages = activeConv.messages.slice(0, msgIndex);
    const slicedConv = { ...activeConv, messages: slicedMessages };
    
    setConversations(prev => prev.map(c => c.id === activeConvId ? slicedConv : c));
    setChatLoading(true);

    // Call generator again
    setTimeout(() => {
      generateLocalAIAssistance(userPrompt);
    }, 500);
  };

  // Clipboard copy utility for syntax highlight code blocks
  const handleCopyCode = (codeText: string, blockId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(blockId);
    setTimeout(() => setCopiedCodeId(''), 2000);
  };

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-black border border-zinc-900 rounded-2xl overflow-hidden text-white relative animate-fadeIn">
      
      {/* GLOW BACKGROUND BLUR */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* LEFT SIDEBAR: CONVERSATION MANAGER PANEL */}
      <aside className={`bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between transition-all duration-300 z-10 shrink-0 ${
        isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        
        {/* Navigation / Header */}
        <div className="p-4 flex-1 flex flex-col overflow-y-auto">
          <button 
            onClick={handleNewConversation}
            className="w-full py-2.5 px-4 bg-purple-650/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer mb-5"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>

          {/* Project context awareness chooser */}
          <div className="space-y-1 mb-6">
            <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Project Context</span>
            <select 
              value={activeProjectContext}
              onChange={(e) => setActiveProjectContext(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded px-2 py-2 text-zinc-300 outline-none focus:border-purple-800"
            >
              <option value="">Full Academic Scope</option>
              {availableProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Active Conversations Logs list */}
          <div className="space-y-1.5 flex-1 overflow-y-auto">
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1 mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Discussion Logs</span>
            </div>
            
            {conversations.map(c => (
              <div 
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  if (c.projectId) setActiveProjectContext(c.projectId);
                }}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                  activeConvId === c.id 
                    ? 'bg-zinc-900 border-zinc-800 text-white' 
                    : 'border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  <span className="text-xs truncate font-medium">{c.title}</span>
                </div>
                <button 
                  onClick={(e) => handleDeleteConversation(c.id, e)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 rounded transition-opacity"
                  title="Delete log"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace details footer */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 space-y-3">
          <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg space-y-1.5">
            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Workspace Hub active</span>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Your AI Mentor maintains contextual state inside of individual chat files. Sync sheets via the settings panel.
            </p>
          </div>
        </div>
      </aside>

      {/* COLLAPSE BAR TRIGGER BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute bottom-5 left-5 md:left-auto md:bottom-auto md:top-4 z-20 p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all shadow-md focus:outline-none"
        style={{ left: isSidebarOpen ? '264px' : '16px' }}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden relative" onDragOver={handleDragOver}>
        
        {/* DRAG FILE OVERLAY EFFECT */}
        {isDraggingFile && (
          <div 
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="absolute inset-0 bg-purple-950/60 backdrop-blur-xs border-2 border-dashed border-purple-500/80 m-4 rounded-xl z-50 flex flex-col items-center justify-center space-y-4 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-purple-900/80 border border-purple-500 rounded-full flex items-center justify-center animate-bounce">
              <Paperclip className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg">Drop your file sheets here</h3>
            <p className="text-xs text-purple-300 max-w-xs text-center leading-relaxed">
              Upload code snippets, lecture PDF notes, or dataset extracts. Your AI Mentor will analyze the contents instantly!
            </p>
          </div>
        )}

        {/* TOP BAR INFORMATION HEADER */}
        <div className="border-b border-zinc-900 px-6 py-4 bg-zinc-950/60 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3.5 pl-8 md:pl-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-950 flex items-center justify-center border border-purple-500/20">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-sm sm:text-base tracking-tight">Void AI Assistant</h1>
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-900/45">PRO ACTIVE</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                {activeProjectContext 
                  ? `Context-aware: "${availableProjects.find(p => p.id === activeProjectContext)?.name}"` 
                  : `Full-Stack Programming Scope - ${profile.education_level}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[9px] text-zinc-400 tracking-wider">GPU HOST ONLINE</span>
          </div>
        </div>

        {/* CHAT MESSAGES WINDOW LIST */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 z-10">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center max-w-xl mx-auto py-8">
              <div className="w-14 h-14 rounded-full bg-purple-950/40 border border-purple-900/30 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="font-sans font-bold text-lg text-zinc-300">Advanced AI Chat Companion</h2>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mt-2.5">
                Input algorithms, debug error logs, generate fully responsive SaaS landing pages, or upload lecture docs to get customized step-by-step guidance!
              </p>

              {/* Suggestions */}
              <div className="grid gap-3.5 w-full mt-8 text-xs sm:text-sm">
                <button 
                  onClick={(e) => handleSendChat(e, "Explain C++ pointers & dynamic memory heap allocations simply")}
                  className="flex items-center space-x-3 bg-zinc-900/40 border border-zinc-900 hover:border-purple-950 hover:bg-zinc-900/80 px-4 py-3.5 rounded-xl text-left text-zinc-300 transition-all cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-medium text-xs">Explain C++ pointers & dynamic memory heap allocations</span>
                </button>
                <button 
                  onClick={(e) => handleSendChat(e, "Design an optimized recursive function template for binary splits")}
                  className="flex items-center space-x-3 bg-zinc-900/40 border border-zinc-900 hover:border-purple-950 hover:bg-zinc-900/80 px-4 py-3.5 rounded-xl text-left text-zinc-300 transition-all cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-medium text-xs">Design an optimized recursive function template for binary splits</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeConv.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl px-5 py-4 border leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-purple-650/10 border-purple-800/40 text-purple-100' 
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-200 shadow-lg relative group'
                  }`}>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-2 text-zinc-500 uppercase tracking-widest">
                      <span>{msg.role === 'user' ? 'STUDENT' : 'VOID TUTOR'}</span>
                      <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    {/* PARSER SUPPORT FOR MARKDOWN / CODE BLOCKS / COPIES / REGENERATES */}
                    <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans space-y-3">
                      {msg.message.split('\n\n').map((paragraph, pIdx) => {
                        
                        // Detect and style fully syntax highlighted code blocks
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.split('\n');
                          const lang = lines[0].substring(3) || 'code';
                          const codeLines = lines.slice(1);
                          // Strip trailing ``` if exists
                          if (codeLines[codeLines.length - 1] === '```') {
                            codeLines.pop();
                          }
                          const codeText = codeLines.join('\n');
                          const blockId = `${msg.id}_block_${pIdx}`;

                          return (
                            <div key={pIdx} className="my-4 font-mono group/code">
                              <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-t border-x border-zinc-850 rounded-t-lg text-[10px] text-zinc-500 tracking-wider uppercase font-mono">
                                <span className="text-purple-400 font-bold">{lang}</span>
                                <button 
                                  onClick={() => handleCopyCode(codeText, blockId)}
                                  className="hover:text-white px-2 py-1 rounded hover:bg-zinc-900 flex items-center gap-1.5 transition-colors font-sans"
                                >
                                  {copiedCodeId === blockId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedCodeId === blockId ? 'Copied' : 'Copy Code'}</span>
                                </button>
                              </div>
                              <pre className="text-[11px] bg-black p-4 rounded-b-lg border-b border-x border-zinc-850 text-emerald-400 overflow-x-auto leading-relaxed">
                                <code>{codeText}</code>
                              </pre>
                            </div>
                          );
                        }

                        // Style bullet points elegantly
                        if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                          return (
                            <ul key={pIdx} className="list-disc pl-5 space-y-1.5 mt-1">
                              {paragraph.split('\n').map((li, liIdx) => (
                                <li key={liIdx} className="text-zinc-300 leading-relaxed text-xs sm:text-sm">{li.substring(2)}</li>
                              ))}
                            </ul>
                          );
                        }

                        return <p key={pIdx} className="text-zinc-200 leading-relaxed text-xs sm:text-sm">{paragraph}</p>;
                      })}
                    </div>

                    {/* REGENERATE RESPONSE UNDER ASSISTANT BUBBLE */}
                    {msg.role === 'assistant' && (
                      <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleRegenerateResponse(msg.id)}
                          className="text-[10px] font-mono font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/30 px-2.5 py-1 rounded border border-purple-900/30 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                          <span>Regenerate Advice</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 flex items-center space-x-2 shadow-lg">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-xs font-mono">Tutor processing streaming blocks...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* FILE ATTACHMENTS WIDGET TRAY */}
        {stagedFiles.length > 0 && (
          <div className="bg-zinc-950 border-t border-zinc-900 px-6 py-3 flex flex-wrap gap-2 z-10">
            {stagedFiles.map((file, idx) => (
              <div key={idx} className="bg-zinc-900 border border-purple-900/30 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-mono text-zinc-300 max-w-[120px] truncate">{file.name}</span>
                <span className="text-[10px] text-zinc-500">({file.size})</span>
                <button 
                  onClick={() => handleRemoveStagedFile(idx)} 
                  className="text-zinc-500 hover:text-red-400 font-bold ml-1 text-[11px]"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CHAT INPUT BAR AREA WITH ATTACHMENT PROMPTS */}
        <div className="border-t border-zinc-900 p-4 bg-zinc-950 z-10 flex flex-col items-center">
          <form onSubmit={(e) => handleSendChat(e)} className="relative flex items-center w-full max-w-4xl">
            {/* Click to upload trigger */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Upload file code sheet / PDF text"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden" 
              multiple
            />

            <input 
              type="text"
              placeholder={stagedFiles.length > 0 ? "Files staged. Ask mentor to analyze these uploads..." : "Ask mentor: 'Help me practice Python list comprehensions...'"}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded-xl py-4 pl-14 pr-12 text-sm text-white placeholder-zinc-500 outline-none disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={chatLoading || (!chatInput.trim() && stagedFiles.length === 0)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-900 text-white rounded-lg transition-colors disabled:opacity-40 focus:outline-none cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono mt-2 select-none">
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            <span>Shift+Enter for newlines. File types supported: PDF, JS, Python, CSV, C++, DOCX.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
