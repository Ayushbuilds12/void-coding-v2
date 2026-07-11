import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderPlus, Plus, Search, Trash2, Edit2, ArrowLeft, Send, Sparkles, 
  ChevronRight, Terminal, RefreshCw, FolderClosed, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { Project, ChatMessage } from '../types';

interface ProjectsViewProps {
  token: string;
  initialSelectedProject: Project | null;
  onRefreshProjects: () => Promise<Project[]>;
  projects: Project[];
}

export default function ProjectsView({ token, initialSelectedProject, onRefreshProjects, projects }: ProjectsViewProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(initialSelectedProject);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Forms states
  const [isCreating, setIsCreating] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  
  const [isEditing, setIsEditing] = useState<Project | null>(null);
  const [editProjName, setEditProjName] = useState('');
  const [editProjDesc, setEditProjDesc] = useState('');
  const [editProjStatus, setEditProjStatus] = useState<'active' | 'completed' | 'archived'>('active');

  // Chat panel states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSelectedProject) {
      handleOpenProject(initialSelectedProject);
    }
  }, [initialSelectedProject]);

  // Open project and load chat history
  const handleOpenProject = async (project: Project) => {
    setActiveProject(project);
    setChatMessages([]);
    setChatLoading(true);
    
    try {
      const res = await fetch(`/api/chats?projectId=${project.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const history = await res.json();
        setChatMessages(history);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Create workspace
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newProjName, description: newProjDesc })
      });

      if (res.ok) {
        setNewProjName('');
        setNewProjDesc('');
        setIsCreating(false);
        const updated = await onRefreshProjects();
        // Auto open the newly created project assistant
        const newest = updated.find(p => p.name === newProjName);
        if (newest) handleOpenProject(newest);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Edit workspace
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing || !editProjName.trim()) return;

    try {
      const res = await fetch(`/api/projects/${isEditing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editProjName, description: editProjDesc, status: editProjStatus })
      });

      if (res.ok) {
        setIsEditing(null);
        await onRefreshProjects();
        // Sync active state
        if (activeProject?.id === isEditing.id) {
          const updated = await res.json();
          setActiveProject(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete workspace
  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you absolutely sure you want to delete this workspace and its full AI instruction log?')) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        if (activeProject?.id === projectId) {
          setActiveProject(null);
        }
        await onRefreshProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Clear workspace instructions log
  const handleClearProjectChats = async () => {
    if (!activeProject) return;
    if (!confirm('Clear all conversation instruction history for this workspace assistant?')) return;

    try {
      const res = await fetch(`/api/chats?projectId=${activeProject.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setChatMessages([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send instruction prompt to project AI assistant
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeProject || chatLoading) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatLoading(true);

    // Append user message instantly for seamless UX
    const tempUserMsg: ChatMessage = {
      id: 'temp_u_' + Date.now(),
      user_id: activeProject.user_id,
      project_id: activeProject.id,
      role: 'user',
      message: userMessage,
      created_at: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`/api/projects/${activeProject.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (res.ok) {
        const data = await res.json();
        // Sync the fully stored database chat messages
        setChatMessages(prev => {
          // Remove temp message and append server synced ones
          const filtered = prev.filter(m => !m.id.startsWith('temp_u_'));
          return [...filtered, data.userChat, data.assistantChat];
        });
      } else {
        const err = await res.json();
        const tempErrorMsg: ChatMessage = {
          id: 'temp_e_' + Date.now(),
          user_id: activeProject.user_id,
          project_id: activeProject.id,
          role: 'assistant',
          message: `⚠️ **API Error**: ${err.error || 'Failed to sync message.'}`,
          created_at: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, tempErrorMsg]);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtering workspaces
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDERING WORKSPACE LIST ---
  if (!activeProject) {
    return (
      <div className="space-y-6 text-white animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Active Workspaces</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage modular assignment catalogs and structured files with AI.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-sm font-medium rounded-lg flex items-center gap-2 shadow transition-colors shrink-0"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Searching and filters */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search active folder titles or overviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 focus:border-purple-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-colors"
          />
        </div>

        {/* Create Workspace Modal Trigger */}
        {isCreating && (
          <div className="bg-zinc-950 border border-purple-900/30 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800/5 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" />
              <span>Configure New Workspace</span>
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Project/Assignment Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Binary Tree Operations"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800/60 rounded px-3 py-2 text-sm outline-none font-sans"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Brief Description / Objective</label>
                <textarea 
                  placeholder="Describe your course, goal, or framework guidelines..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800/60 rounded px-3 py-2 text-sm outline-none font-sans h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded font-medium text-white shadow-lg"
                >
                  Build Directory
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workspace Listings */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
            <FolderClosed className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <h3 className="font-sans font-bold text-base text-zinc-400">No projects found</h3>
            <p className="text-zinc-500 text-xs mt-1.5 max-w-sm mx-auto">Create a coding workspace to organize compiler files, and invoke the AI assistant for structural boilerplates.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleOpenProject(p)}
                className="group bg-zinc-950 border border-zinc-900 hover:border-purple-900/60 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 uppercase tracking-wider">
                      {p.status}
                    </span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(p);
                          setEditProjName(p.name);
                          setEditProjDesc(p.description);
                          setEditProjStatus(p.status);
                        }}
                        className="p-1 text-zinc-400 hover:text-white rounded"
                        title="Edit details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteProject(p.id, e)}
                        className="p-1 text-zinc-400 hover:text-red-400 rounded"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-base mt-4 text-white group-hover:text-purple-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2 h-8 leading-relaxed">
                    {p.description || "No project guidelines specified."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Synced: {new Date(p.updated_at).toLocaleDateString()}</span>
                  <span className="text-purple-400 font-semibold inline-flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Assistant</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Workspace Settings Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl max-w-md w-full p-6 relative">
              <h3 className="font-bold text-lg text-white">Modify Workspace Profile</h3>
              <form onSubmit={handleUpdateProject} className="space-y-4 mt-4 text-sm">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Title</label>
                  <input 
                    type="text" 
                    value={editProjName}
                    onChange={(e) => setEditProjName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white outline-none focus:border-purple-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Guidelines Description</label>
                  <textarea 
                    value={editProjDesc}
                    onChange={(e) => setEditProjDesc(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white outline-none focus:border-purple-800 h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={editProjStatus}
                    onChange={(e) => setEditProjStatus(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white outline-none focus:border-purple-800"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 text-xs pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(null)}
                    className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded font-medium text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDERING DUAL-PANE IDE PROJECT ASSISTANT ---
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col text-white animate-fadeIn">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveProject(null)}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight">{activeProject.name}</h1>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 uppercase tracking-widest border border-purple-900/40">ASSISTANT ACTIVE</span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{activeProject.description || "Step-by-step code guidance is running."}</p>
          </div>
        </div>
        <button 
          onClick={handleClearProjectChats}
          className="text-xs font-mono text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 border border-zinc-900 hover:border-red-950 rounded bg-zinc-950"
        >
          Clear Logs
        </button>
      </div>

      {/* Dual Pane split layout */}
      <div className="flex-1 grid lg:grid-cols-5 gap-4 overflow-hidden">
        {/* Left Side: Directory Structure / AI Guide Outline */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="font-mono text-[10px] uppercase text-purple-400 tracking-widest mb-4 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Workspace Architect</span>
            </h3>
            
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-3 space-y-4">
              <div>
                <p className="text-xs font-bold text-zinc-300">Workspace Tree Pattern</p>
                <p className="text-[11px] text-zinc-500 mt-1">Ask the assistant to generate folder trees or file structures suited for this assignment.</p>
                
                {/* Visual directory structure mock */}
                <pre className="font-mono text-[10px] text-zinc-400 bg-black/60 p-3 rounded border border-zinc-900 mt-3 leading-relaxed">
{`${activeProject.name.toLowerCase().replace(/\s+/g, '_')}/
├── src/
│   ├── main.py        # Entrypoint script
│   ├── tests.py       # Validation cases
│   └── helpers.py     # Utility functions
└── README.md          # Assignment Docs`}
                </pre>
              </div>

              <div className="border-t border-zinc-900 pt-3">
                <p className="text-xs font-bold text-zinc-300">Suggested Milestones</p>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Configure directory folder (Done)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                    <span>Generate entrypoint boilerplates</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="w-4 h-4 rounded-full border border-zinc-800 flex items-center justify-center text-[9px] font-mono">3</span>
                    <span>Explain execution flow step-by-step</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg p-3 text-[11px] text-purple-300 leading-relaxed mt-4">
            💡 **Pro Tip**: Paste assignment guidelines or syllabus topics directly in the chat! The architect will design structured code that fulfills academic constraints.
          </div>
        </div>

        {/* Right Side: AI Assistant Chat interface */}
        <div className="lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <Sparkles className="w-10 h-10 text-purple-800 animate-pulse mb-3" />
                <h4 className="font-bold text-zinc-400 text-sm">Workspace Assistant Engaged</h4>
                <p className="text-xs max-w-xs mx-auto mt-1">Hello! I am ready to help you plan, structure, and code **${activeProject.name}**. What framework or language are we coding in?</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 border ${
                    msg.role === 'user' 
                      ? 'bg-purple-650/10 border-purple-800/40 text-purple-100' 
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-200'
                  }`}>
                    {/* Simplified markdown formatter for lists and codes */}
                    <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans space-y-2">
                      {msg.message.split('\n\n').map((paragraph, pIdx) => {
                        // Check if paragraph is code block
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.split('\n');
                          const content = lines.slice(1, -1).join('\n');
                          return (
                            <pre key={pIdx} className="font-mono text-[11px] bg-black/90 p-3 rounded-lg border border-zinc-900 text-emerald-400 overflow-x-auto my-2">
                              <code>{content}</code>
                            </pre>
                          );
                        }
                        // Check if list item
                        if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                          return (
                            <ul key={pIdx} className="list-disc pl-5 space-y-1">
                              {paragraph.split('\n').map((li, liIdx) => (
                                <li key={liIdx}>{li.substring(2)}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={pIdx}>{paragraph}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-xs font-mono">Tutor processing structure...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendChat} className="border-t border-zinc-900 p-3 bg-zinc-950">
            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder={`Ask Assistant regarding folder boilerplates or debug guides...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                className="w-full bg-zinc-900 border border-zinc-800/80 focus:border-purple-800/80 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-900 text-white rounded-lg transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
