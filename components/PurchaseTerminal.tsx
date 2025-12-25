import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal, ChevronRight, Check, Send, Database, ShieldCheck } from 'lucide-react';
import { Course } from '../types.ts';

interface PurchaseTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
}

type Step = 'intro' | 'details' | 'confirm' | 'success';

export const PurchaseTerminal: React.FC<PurchaseTerminalProps> = ({ isOpen, onClose, selectedCourse }) => {
  const [step, setStep] = useState<Step>('intro');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [history, setHistory] = useState<string[]>([]);
  const [transactionId, setTransactionId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ADMIN_NUMBER = '918019753301';
  
  /**
   * CONFIGURATION: 
   * Replace the string below with your Google Apps Script "Web App URL"
   */
  const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxamm8mdp9cVb8CVKgtKp7qrlmnLPt_f9JQjiBsMnxug_A-ab-nPRFpilCY3ITDJdw/exec';

  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setTransactionId('');
      setFormData({ name: '', email: '', phone: '' });
      setHistory(['-- Initializing Secure Enrollment Protocol...', '-- Target Database: pg_mastery_admissions']);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, step]);

  const addHistory = (line: string) => setHistory(prev => [...prev, line]);

  const handleBegin = () => {
    addHistory('postgres=# BEGIN;');
    addHistory('BEGIN');
    setStep('details');
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    // Strict 10-digit phone validation
    if (formData.phone.length !== 10) {
      addHistory('-- ERROR: invalid input for column "phone"');
      addHistory('-- DETAIL: Phone must be exactly 10 digits.');
      return;
    }

    const courseTitle = selectedCourse?.title.replace('\n', ' ') || 'Unknown Course';
    
    addHistory(`postgres=# INSERT INTO enrollment (name, email, phone, course) `);
    addHistory(`postgres-# VALUES ('${formData.name}', '${formData.email}', '${formData.phone}', '${courseTitle}');`);
    addHistory('INSERT 0 1');
    setStep('confirm');
  };

  const syncToGoogleSheets = async (syncData: any) => {
    if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL.includes('PASTE_YOUR')) {
      console.warn('Google Sheets URL not configured.');
      return false;
    }

    try {
      // Use no-cors for Google Apps Script to avoid preflight issues
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData),
      });
      return true;
    } catch (error) {
      console.error('Sheet Sync Error:', error);
      return false;
    }
  };

  const handleCommit = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    // Generate stable ID for both Sheet and WhatsApp
    const newId = `PGM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setTransactionId(newId);

    const courseTitle = selectedCourse?.title.replace('\n', ' ') || 'Unknown Course';
    
    addHistory('postgres=# COMMIT;');
    addHistory('-- Synchronizing with Remote Master Sheet...');

    // 1. Send data to Google Sheets
    const syncData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      course: courseTitle,
      transactionHash: newId
    };
    
    const syncSuccess = await syncToGoogleSheets(syncData);
    
    if (syncSuccess) {
      addHistory('-- Cloud Sync: SUCCESS');
    } else {
      addHistory('-- Cloud Sync: PENDING (Admin will verify manually)');
    }

    // 2. Prepare WhatsApp message
    const whatsappMsg = `*NEW ENROLLMENT REQUEST*\n\n` +
      `*Course:* ${courseTitle}\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*TransHash:* ${newId}\n\n` +
      `_Sent via PostgresMastery Enrollment Shell_`;
    
    const whatsappUrl = `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

    addHistory('COMMIT -- Transaction Successful');
    addHistory(`-- Redirecting to Secure WhatsApp Gateway...`);

    // Direct browser trigger
    window.open(whatsappUrl, '_blank');

    setIsSyncing(false);
    setStep('success');
  };

  if (!isOpen) return null;

  const courseTitle = selectedCourse?.title.replace('\n', ' ') || 'Unknown Course';
  const whatsappMsg = `*NEW ENROLLMENT REQUEST*\n\n` +
    `*Course:* ${courseTitle}\n` +
    `*Name:* ${formData.name}\n` +
    `*Email:* ${formData.email}\n` +
    `*Phone:* ${formData.phone}\n` +
    `*TransHash:* ${transactionId}\n\n` +
    `_Sent via PostgresMastery Enrollment Shell_`;
  const whatsappUrl = `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0c0c0c] rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[550px] font-mono">
        
        {/* Header */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <Terminal size={14} className="text-slate-500" />
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Enrollment_Shell_v1.0</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto text-sm space-y-3 no-scrollbar" ref={scrollRef}>
          {history.map((line, i) => (
            <div key={i} className={`${line.startsWith('postgres') ? 'text-postgres-400 font-bold' : line.startsWith('-- ERROR') ? 'text-red-500 font-bold' : line.startsWith('--') ? 'text-slate-600 italic' : 'text-slate-300'}`}>
              {line}
            </div>
          ))}

          {step === 'intro' && (
            <div className="pt-4 animate-fade-in">
              <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg mb-6">
                 <div className="flex items-center text-postgres-400 mb-2">
                    <Database size={16} className="mr-2" />
                    <span className="font-bold">Requested: {courseTitle}</span>
                 </div>
                 <p className="text-slate-400 text-xs leading-relaxed">
                    You are about to initiate a secure enrollment transaction. 
                    Your details will be synced to our Google Sheet and sent to Karthik via WhatsApp.
                 </p>
              </div>
              <button 
                onClick={handleBegin}
                className="group flex items-center px-5 py-2.5 bg-postgres-600 hover:bg-postgres-500 text-white rounded font-bold transition-all"
              >
                <span>\connect admission_db</span>
                <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleInputSubmit} className="pt-4 space-y-4 animate-fade-in">
               <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                     <span className="text-slate-500 text-right">NAME |</span>
                     <input 
                        autoFocus
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent border-b border-slate-700 outline-none text-white focus:border-postgres-500 transition-colors py-1"
                        placeholder="e.g. John Doe"
                     />
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                     <span className="text-slate-500 text-right">EMAIL |</span>
                     <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="bg-transparent border-b border-slate-700 outline-none text-white focus:border-postgres-500 transition-colors py-1"
                        placeholder="john@example.com"
                     />
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                     <span className="text-slate-500 text-right">PHONE |</span>
                     <input 
                        required
                        type="text" 
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phone}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({...formData, phone: val});
                        }}
                        className="bg-transparent border-b border-slate-700 outline-none text-white focus:border-postgres-500 transition-colors py-1"
                        placeholder="10-digit number"
                     />
                  </div>
               </div>
               <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-xs font-bold">
                    Validate Input
                  </button>
               </div>
            </form>
          )}

          {step === 'confirm' && (
            <div className="pt-4 animate-fade-in space-y-6">
              <div className="text-yellow-500/80 text-xs italic">
                -- Transaction is currently UNCOMMITTED.
              </div>
              <div className="flex gap-4">
                <button 
                  disabled={isSyncing}
                  onClick={handleCommit}
                  className={`flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold flex items-center justify-center shadow-lg shadow-green-900/20 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSyncing ? (
                    <span className="flex items-center"><Database size={18} className="mr-2 animate-spin" /> SYNCING...</span>
                  ) : (
                    <span className="flex items-center"><Check size={18} className="mr-2" /> COMMIT;</span>
                  )}
                </button>
                <button 
                  disabled={isSyncing}
                  onClick={() => { addHistory('postgres=# ROLLBACK;'); addHistory('ROLLBACK'); setStep('intro'); }}
                  className="px-4 py-3 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 transition-colors"
                >
                  ROLLBACK;
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="pt-6 animate-fade-in text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Transaction ID: {transactionId}</h3>
               <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">
                  Enrollment data has been archived. If the WhatsApp window didn't open automatically, please click the button below.
               </p>
               
               <div className="space-y-3 px-6">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all shadow-xl shadow-green-900/40 group"
                  >
                    <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Open WhatsApp Chat
                  </a>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Official Support: +{ADMIN_NUMBER}</p>
               </div>
            </div>
          )}

          {(step !== 'success' && !isSyncing) && (
            <div className="mt-4 flex items-center text-postgres-400 font-bold animate-pulse">
               postgres=# <span className="w-2.5 h-5 bg-postgres-400 ml-2"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};