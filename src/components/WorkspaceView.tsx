import { useState, useEffect, FormEvent } from 'react';
import { 
  HardDrive, Mail, GraduationCap, RefreshCw, Send, Plus, Trash2, Search, 
  FileText, CheckCircle, ExternalLink, Users, AlertCircle, Sparkles, 
  ArrowRight, Shield, Download, FileUp, ListFilter
} from 'lucide-react';
import { googleSignIn, getCachedAccessToken, clearCachedAccessToken } from '../lib/firebaseAuth';

interface WorkspaceViewProps {
  token: string; // our backend token
}

type WorkspaceTab = 'drive' | 'gmail' | 'classroom';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  size?: string;
  createdTime?: string;
}

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessageDetail {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  courseState?: string;
  alternateLink?: string;
}

interface ClassroomAnnouncement {
  id: string;
  text: string;
  creationTime: string;
}

interface ClassroomCourseWork {
  id: string;
  title: string;
  description?: string;
  alternateLink?: string;
  creationTime: string;
}

export default function WorkspaceView({ token }: WorkspaceViewProps) {
  const [googleToken, setGoogleToken] = useState<string | null>(getCachedAccessToken());
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTab>('drive');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveSearch, setDriveSearch] = useState('');
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileType, setNewFileType] = useState<'text' | 'doc'>('text');

  // Gmail state
  const [emails, setEmails] = useState<GmailMessageDetail[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Classroom state
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseAnnouncements, setCourseAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
  const [showPostAnnouncement, setShowPostAnnouncement] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  // Auto sign-in from cached token on mount
  useEffect(() => {
    const cached = getCachedAccessToken();
    if (cached) {
      setGoogleToken(cached);
    }
  }, []);

  // Fetch initial data when Google Token or active sub-tab changes
  useEffect(() => {
    if (googleToken) {
      fetchWorkspaceData();
    }
  }, [googleToken, activeSubTab]);

  const handleGoogleConnect = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleToken(result.accessToken);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDisconnect = () => {
    clearCachedAccessToken();
    setGoogleToken(null);
    setDriveFiles([]);
    setEmails([]);
    setCourses([]);
    setSelectedCourseId(null);
  };

  const fetchWorkspaceData = async () => {
    if (!googleToken) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      if (activeSubTab === 'drive') {
        await fetchDriveFiles();
      } else if (activeSubTab === 'gmail') {
        await fetchEmails();
      } else if (activeSubTab === 'classroom') {
        await fetchCourses();
      }
    } catch (err: any) {
      console.error(err);
      if (err?.status === 401) {
        handleGoogleDisconnect();
        setErrorMsg('Google authentication session expired. Please reconnect.');
      } else {
        setErrorMsg(err.message || 'Failed to sync Google Workspace data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- DRIVE ENDPOINTS ---
  const fetchDriveFiles = async (searchQuery?: string) => {
    let url = 'https://www.googleapis.com/drive/v3/files?pageSize=20&fields=files(id,name,mimeType,webViewLink,size,createdTime)';
    if (searchQuery) {
      const escapedQuery = encodeURIComponent(`name contains '${searchQuery}' and trashed = false`);
      url += `&q=${escapedQuery}`;
    } else {
      url += `&q=trashed+%3d+false`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${googleToken}` }
    });

    if (!res.ok) {
      throw { status: res.status, message: 'Google Drive sync failed.' };
    }

    const data = await res.json();
    setDriveFiles(data.files || []);
  };

  const handleCreateDriveFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    setLoading(true);
    try {
      // Create metadata
      const mimeType = newFileType === 'doc' 
        ? 'application/vnd.google-apps.document' 
        : 'text/plain';
      
      const metadata = {
        name: newFileType === 'doc' && !newFileName.endsWith('.docx') ? `${newFileName}.docx` : newFileName,
        mimeType
      };

      // We will perform a simple multipart upload or raw body upload
      // For simplicity and bulletproof performance in iframe browser,
      // creating metadata then updating content is highly reliable.
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });

      if (!createRes.ok) throw new Error('Failed to create Drive file schema.');
      const fileObj = await createRes.json();

      // If it is a text file and has content, upload content
      if (newFileType === 'text' && newFileContent.trim()) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileObj.id}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${googleToken}`,
            'Content-Type': 'text/plain'
          },
          body: newFileContent
        });
      }

      setShowCreateFileModal(false);
      setNewFileName('');
      setNewFileContent('');
      await fetchDriveFiles();
    } catch (err: any) {
      setErrorMsg(err.message || 'File creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriveFile = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(
      `CRITICAL CONFIRMATION:\nAre you sure you want to permanently delete "${fileName}" from your Google Drive? This action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${googleToken}` }
      });

      if (!res.ok) throw new Error('Delete operation failed.');
      await fetchDriveFiles();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete file.');
    } finally {
      setLoading(false);
    }
  };

  // --- GMAIL ENDPOINTS ---
  const fetchEmails = async () => {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
      headers: { Authorization: `Bearer ${googleToken}` }
    });

    if (!res.ok) {
      throw { status: res.status, message: 'Gmail message fetching failed.' };
    }

    const data = await res.json();
    const msgList = data.messages || [];
    
    // Fetch individual messages details in parallel safely
    const detailedList = await Promise.all(
      msgList.map(async (msg: { id: string }) => {
        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { Authorization: `Bearer ${googleToken}` }
        });
        if (!detailRes.ok) return null;
        const detail = await detailRes.json();
        
        // Extract Subject, From, Date headers
        const headers: GmailMessageHeader[] = detail.payload?.headers || [];
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
        const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: detail.id,
          threadId: detail.threadId,
          snippet: detail.snippet || '',
          subject,
          from,
          date
        };
      })
    );

    setEmails(detailedList.filter((m): m is GmailMessageDetail => m !== null));
  };

  const handleSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) return;

    const confirmed = window.confirm(
      `CONFIRM ACTION:\nYou are about to send an email to "${emailTo}" on behalf of your connected Google account. Would you like to proceed?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const emailContent = [
        `To: ${emailTo}`,
        `Subject: ${emailSubject}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        ``,
        emailBody
      ].join('\r\n');

      const base64Safe = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64Safe })
      });

      if (!res.ok) throw new Error('Gmail send request failed.');
      
      setShowComposeModal(false);
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
      await fetchEmails();
    } catch (err: any) {
      setErrorMsg(err.message || 'Email sending failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- CLASSROOM ENDPOINTS ---
  const fetchCourses = async () => {
    const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: { Authorization: `Bearer ${googleToken}` }
    });

    if (!res.ok) {
      throw { status: res.status, message: 'Google Classroom course fetching failed.' };
    }

    const data = await res.json();
    setCourses(data.courses || []);
  };

  const fetchCourseDetails = async (courseId: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Fetch announcements
      const annRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
        headers: { Authorization: `Bearer ${googleToken}` }
      });
      const annData = await annRes.json();
      setCourseAnnouncements(annData.announcements || []);

      // Fetch coursework
      const cwRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
        headers: { Authorization: `Bearer ${googleToken}` }
      });
      const cwData = await cwRes.json();
      setCourseWork(cwData.courseWork || []);

      setSelectedCourseId(courseId);
    } catch (err: any) {
      setErrorMsg('Failed to sync details for the selected Classroom Course.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !announcementText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourseId}/announcements`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: announcementText })
      });

      if (!res.ok) throw new Error('Posting announcement failed.');
      
      setAnnouncementText('');
      setShowPostAnnouncement(false);
      await fetchCourseDetails(selectedCourseId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post announcement.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER COMPONENT METHODS ---

  if (!googleToken) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-white animate-fadeIn">
        <div className="bg-zinc-950 border border-purple-950/40 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-950 border border-purple-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-950/40">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Connect Google Workspace</h1>
          <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Authorize Void Laboratory to seamlessly access your Google Drive files, Gmail mailboxes, and Google Classroom courses. Sync notes, upload boilerplate models, and send reports instantly.
          </p>

          <div className="mt-8 flex justify-center">
            {/* GOOGLE SIGN IN BUTTON */}
            <button 
              onClick={handleGoogleConnect}
              disabled={loading}
              className="inline-flex items-center space-x-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-6 py-3.5 rounded-xl shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>{loading ? 'Initializing Connection...' : 'Connect Workspace APIs'}</span>
            </button>
          </div>

          <p className="text-[10px] font-mono text-zinc-500 mt-6 tracking-wide">
            Your credentials and OAuth tokens are cached in-memory and never saved. Safe & Private.
          </p>

          {errorMsg && (
            <div className="mt-6 max-w-md mx-auto p-3 bg-red-950/15 border border-red-950 rounded-lg text-red-400 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Workspace Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span>Void Workspace Lab</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-900/30 font-bold uppercase tracking-widest">Connected</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Harness Google cloud files, mailing streams, and course structures directly in your development suite.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchWorkspaceData}
            disabled={loading}
            className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg transition-all text-zinc-400 hover:text-white cursor-pointer disabled:opacity-50"
            title="Sync Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleGoogleDisconnect}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-red-900 text-xs font-mono font-medium text-zinc-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
          >
            Disconnect Account
          </button>
        </div>
      </div>

      {/* API Selector SubTabs */}
      <div className="flex border-b border-zinc-900 text-xs font-mono">
        <button 
          onClick={() => { setActiveSubTab('drive'); setErrorMsg(null); }}
          className={`flex-1 py-3 border-b-2 text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none ${activeSubTab === 'drive' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <HardDrive className="w-4 h-4" />
          <span>GOOGLE DRIVE</span>
        </button>
        <button 
          onClick={() => { setActiveSubTab('gmail'); setErrorMsg(null); }}
          className={`flex-1 py-3 border-b-2 text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none ${activeSubTab === 'gmail' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Mail className="w-4 h-4" />
          <span>GMAIL MESSAGES</span>
        </button>
        <button 
          onClick={() => { setActiveSubTab('classroom'); setErrorMsg(null); }}
          className={`flex-1 py-3 border-b-2 text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none ${activeSubTab === 'classroom' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>CLASSROOM MODULES</span>
        </button>
      </div>

      {/* Errors Alert */}
      {errorMsg && (
        <div className="p-3.5 bg-red-950/15 border border-red-950 rounded-lg text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* --- SUB-TAB RENDERS --- */}

      {/* 1. GOOGLE DRIVE */}
      {activeSubTab === 'drive' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search Drive files..."
                value={driveSearch}
                onChange={(e) => {
                  setDriveSearch(e.target.value);
                  fetchDriveFiles(e.target.value);
                }}
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-purple-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none font-medium placeholder-zinc-600"
              />
            </div>
            {/* Create */}
            <button 
              onClick={() => setShowCreateFileModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Laboratory Document</span>
            </button>
          </div>

          {loading && driveFiles.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
              <p className="font-mono text-xs">Syncing Cloud Files...</p>
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl">
              <HardDrive className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-sm font-medium">No Drive Files Found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">Create a doc or upload code directly from Void Laboratory to cloud storage.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {driveFiles.map((file) => (
                <div key={file.id} className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-5 hover:border-purple-950/40 transition-all flex flex-col justify-between h-40">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 shrink-0 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                          <FileText className={`w-5 h-5 ${file.mimeType.includes('document') ? 'text-blue-400' : 'text-purple-400'}`} />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-sm text-zinc-200 truncate" title={file.name}>
                            {file.name}
                          </h3>
                          <p className="text-[10px] font-mono text-zinc-500 mt-0.5 truncate">
                            {file.mimeType.split('.').pop() || 'File'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteDriveFile(file.id, file.name)}
                        className="p-1.5 bg-zinc-900/40 hover:bg-red-950/30 border border-zinc-900 hover:border-red-900/40 rounded text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 mt-4">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : 'Unknown Date'}
                    </span>
                    {file.webViewLink && (
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Open Cloud</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. GMAIL MESSAGES */}
      {activeSubTab === 'gmail' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest">Inbox Transmissions</h2>
            <button 
              onClick={() => setShowComposeModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Compose Email</span>
            </button>
          </div>

          {loading && emails.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
              <p className="font-mono text-xs">Syncing Inbox...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl">
              <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-sm font-medium">No Email Messages Found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">Send system audit logs or lesson progress reports directly from Void dashboard.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {emails.map((email) => (
                <div key={email.id} className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-5 hover:border-purple-950/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-200">{email.subject}</h3>
                      <p className="text-xs text-zinc-500 font-medium mt-1">From: {email.from}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono sm:text-right shrink-0">
                      {email.date ? new Date(email.date).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                    {email.snippet}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. GOOGLE CLASSROOM */}
      {activeSubTab === 'classroom' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Courses Sidebar List */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5 h-fit space-y-4">
            <h2 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-3">
              <Users className="w-4.5 h-4.5" />
              <span>Active Curriculums</span>
            </h2>

            {loading && courses.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-purple-500" />
                <p className="font-mono text-[10px]">Loading Courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No active Classroom courses found.</p>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => fetchCourseDetails(course.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all font-sans cursor-pointer focus:outline-none ${selectedCourseId === course.id ? 'bg-purple-950/30 border-purple-800 text-white font-semibold' : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'}`}
                  >
                    <h3 className="text-xs truncate">{course.name}</h3>
                    {course.section && <p className="text-[9px] font-mono text-zinc-500 mt-0.5 truncate">{course.section}</p>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Course Hub Detail */}
          <div className="lg:col-span-3 space-y-6">
            {!selectedCourseId ? (
              <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-10 text-center">
                <GraduationCap className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-sm font-medium">No Curriculum Selected</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">Please select an active Google Classroom course from the panel to explore stream activities and assignments.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Course Header Options */}
                <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-sm text-zinc-200">
                      {courses.find(c => c.id === selectedCourseId)?.name}
                    </h2>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">COURSE REFERENCE: {selectedCourseId}</p>
                  </div>
                  <button 
                    onClick={() => setShowPostAnnouncement(true)}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-[11px] font-semibold rounded shadow-lg transition-all cursor-pointer"
                  >
                    Post Stream Update
                  </button>
                </div>

                {/* Course Activities & CourseWork lists */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* CourseWork Assignments */}
                  <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest border-b border-zinc-900 pb-2">Coursework Assignments</h3>
                    {courseWork.length === 0 ? (
                      <p className="text-[11px] text-zinc-500 font-mono py-4">No coursework assigned.</p>
                    ) : (
                      <div className="space-y-3">
                        {courseWork.slice(0, 5).map((cw) => (
                          <div key={cw.id} className="p-3 bg-zinc-900/30 rounded border border-zinc-900">
                            <h4 className="text-xs font-bold text-zinc-300 leading-relaxed">{cw.title}</h4>
                            <p className="text-[9px] font-mono text-zinc-500 mt-1">Added {new Date(cw.creationTime).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Announcement Stream */}
                  <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest border-b border-zinc-900 pb-2">Stream Announcements</h3>
                    {courseAnnouncements.length === 0 ? (
                      <p className="text-[11px] text-zinc-500 font-mono py-4">No announcements posted.</p>
                    ) : (
                      <div className="space-y-3">
                        {courseAnnouncements.slice(0, 5).map((ann) => (
                          <div key={ann.id} className="p-3 bg-zinc-900/30 rounded border border-zinc-900">
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{ann.text}</p>
                            <p className="text-[9px] font-mono text-zinc-500 mt-1.5">Posted {new Date(ann.creationTime).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FLOATING DIALOGS / MODALS --- */}

      {/* Create File Modal */}
      {showCreateFileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-900 max-w-lg w-full rounded-2xl p-6 space-y-5 animate-scaleUp">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Create Laboratory Document</h2>
              <p className="text-xs text-zinc-400 mt-1">Publish student boilerplates or laboratory code snippets directly into your Google account.</p>
            </div>

            <form onSubmit={handleCreateDriveFile} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Document Format Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewFileType('text')}
                    className={`py-2 px-3 border rounded font-mono text-center cursor-pointer ${newFileType === 'text' ? 'bg-purple-950/40 border-purple-500 text-purple-300' : 'bg-zinc-900/40 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'}`}
                  >
                    Raw text (.txt)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFileType('doc')}
                    className={`py-2 px-3 border rounded font-mono text-center cursor-pointer ${newFileType === 'doc' ? 'bg-purple-950/40 border-purple-500 text-purple-300' : 'bg-zinc-900/40 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'}`}
                  >
                    Google Doc (.docx)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">File Name</label>
                <input 
                  type="text" 
                  placeholder={newFileType === 'text' ? 'algorithm_notes.txt' : 'CS101_System_Report'}
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              {newFileType === 'text' && (
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">File Body Content</label>
                  <textarea 
                    rows={5}
                    placeholder="Write or paste code/notes content here..."
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-zinc-900/60 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateFileModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !newFileName.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white text-xs font-bold shadow-lg"
                >
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gmail Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-900 max-w-lg w-full rounded-2xl p-6 space-y-5 animate-scaleUp">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Compose Mail</h2>
              <p className="text-xs text-zinc-400 mt-1">Transmit system audits or laboratory logs safely to email targets.</p>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Recipient Address (To)</label>
                <input 
                  type="email" 
                  placeholder="professor@university.edu"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="Void CS Audit Log Submission"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Body Text Content</label>
                <textarea 
                  rows={6}
                  placeholder="Draft your mail body message content here..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-white outline-none font-sans leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-900/60 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !emailTo.trim() || !emailSubject.trim() || !emailBody.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white text-xs font-bold shadow-lg"
                >
                  Send Transmission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Classroom Announcement Modal */}
      {showPostAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-900 max-w-lg w-full rounded-2xl p-6 space-y-5 animate-scaleUp">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Post Stream Announcement</h2>
              <p className="text-xs text-zinc-400 mt-1">Publish assignments, update streams, or resource links directly onto Google Classroom.</p>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Announcement Message Body</label>
                <textarea 
                  rows={5}
                  placeholder="Write your curriculum update or homework reference link here..."
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-white outline-none font-sans leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-900/60 pt-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPostAnnouncement(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !announcementText.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white text-xs font-bold shadow-lg"
                >
                  Publish Stream Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
