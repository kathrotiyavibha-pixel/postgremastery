import React, { useState, useEffect, useRef } from 'react';
import { QUIZZES, COURSES } from '../constants.ts';
import { X, RefreshCcw, ArrowRight, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

interface PostgresShellQuizProps {
  initialLevel: string;
  isOpen: boolean;
  onClose: () => void;
  onRecommendedCourse: (level: string) => void;
}

export const PostgresShellQuiz: React.FC<PostgresShellQuizProps> = ({ 
  initialLevel, 
  isOpen, 
  onClose,
  onRecommendedCourse
}) => {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [quizState, setQuizState] = useState<'intro' | 'question' | 'result'>('intro');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentLevel(initialLevel);
      resetQuiz(initialLevel);
    }
  }, [isOpen, initialLevel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, quizState, qIndex]);

  const resetQuiz = (level: string) => {
    setCurrentLevel(level);
    setQIndex(0);
    setScore(0);
    setQuizState('intro');
    setHistory([]);
  };

  const currentQuiz = QUIZZES.find(q => q.level === currentLevel);
  const totalQuestions = currentQuiz?.questions.length || 0;

  const handleStart = () => {
    setQuizState('question');
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuiz) return;
    
    const question = currentQuiz.questions[qIndex];
    const isCorrect = question.correctAnswer === optionIndex;
    
    // Add to terminal history
    setHistory(prev => [
      ...prev,
      {
        type: 'qa',
        question: question.question,
        selected: question.options[optionIndex],
        isCorrect: isCorrect,
        correctText: question.options[question.correctAnswer]
      }
    ]);

    if (isCorrect) setScore(s => s + 1);

    if (qIndex < totalQuestions - 1) {
      setQIndex(q => q + 1);
    } else {
      setQuizState('result');
    }
  };

  const getNextLevel = (current: string) => {
    const levels = ['L1', 'L2', 'L3', 'L4'];
    const idx = levels.indexOf(current);
    if (idx < levels.length - 1) return levels[idx + 1];
    return null;
  };

  // Determine Pass/Fail
  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 80;
  const nextLevel = getNextLevel(currentLevel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0c0c0c] rounded-lg shadow-2xl border border-slate-700 flex flex-col h-[600px] overflow-hidden font-mono text-sm md:text-base">
        
        {/* Terminal Header */}
        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Terminal size={16} className="text-slate-400" />
            <span className="text-slate-300 font-bold">postgres@{currentLevel.toLowerCase()}:~</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-red-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-grow p-6 overflow-y-auto text-slate-300 space-y-4 scroll-smooth" ref={scrollRef}>
          
          <div className="text-slate-500 mb-6">
            PostgreSQL Shell (psql 16.2)<br/>
            Type "help" for help.<br/>
          </div>

          {/* History */}
          {history.map((item, idx) => (
            <div key={idx} className="mb-4 border-b border-slate-800 pb-2">
              <div className="text-postgres-300 font-bold mb-1">postgres=# <span className="text-slate-400 font-normal">-- Question {idx + 1}</span></div>
              <div className="text-white mb-2">{item.question}</div>
              <div className="flex items-center">
                 <span className="text-emerald-400 mr-2">➜</span>
                 <span className={item.isCorrect ? "text-green-400" : "text-red-400"}>
                    {item.selected}
                 </span>
                 {item.isCorrect ? (
                    <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded border border-green-800">OK</span>
                 ) : (
                    <span className="ml-2 text-xs text-slate-500">(Correct: {item.correctText})</span>
                 )}
              </div>
            </div>
          ))}

          {/* INTRO STATE */}
          {quizState === 'intro' && (
            <div className="animate-fade-in">
               <div className="text-postgres-400 font-bold mb-2">postgres=# SELECT * FROM skill_assessment WHERE level = '{currentLevel}';</div>
               <div className="bg-[#111] p-4 border-l-2 border-postgres-500 my-4 text-slate-300">
                  <table className="w-full text-left">
                     <tbody>
                        <tr><td className="pr-4 py-1 text-slate-500">Target Level:</td><td className="text-white font-bold">{currentLevel}</td></tr>
                        <tr><td className="pr-4 py-1 text-slate-500">Pass Criteria:</td><td className="text-white">80% (4/5 Correct)</td></tr>
                        <tr><td className="pr-4 py-1 text-slate-500">Status:</td><td className="text-yellow-400 blink">Ready...</td></tr>
                     </tbody>
                  </table>
               </div>
               <button 
                  onClick={handleStart}
                  className="mt-4 px-4 py-2 bg-postgres-700 hover:bg-postgres-600 text-white font-bold rounded flex items-center group"
               >
                  <span className="mr-2">\connect quiz_db</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          )}

          {/* QUESTION STATE */}
          {quizState === 'question' && currentQuiz && (
            <div className="animate-fade-in pt-4">
               <div className="flex items-center text-postgres-300 font-bold mb-2">
                  postgres=# <span className="ml-2 text-slate-100">-- Question {qIndex + 1} of {totalQuestions}</span>
               </div>
               
               {/* SQL Comment Style Question */}
               <div className="text-white text-lg font-medium mb-6">
                 /* {currentQuiz.questions[qIndex].question} */
               </div>

               {/* Options as Selectable Rows */}
               <div className="space-y-2">
                 {currentQuiz.questions[qIndex].options.map((opt, idx) => (
                    <button
                       key={idx}
                       onClick={() => handleAnswer(idx)}
                       className="w-full text-left flex items-center p-3 rounded hover:bg-slate-800 border border-transparent hover:border-slate-600 transition-all group"
                    >
                       <span className="font-mono text-slate-500 mr-4 w-6">{(idx + 1)})</span>
                       <span className="text-slate-300 group-hover:text-white font-mono">{opt}</span>
                    </button>
                 ))}
               </div>
            </div>
          )}

          {/* RESULT STATE */}
          {quizState === 'result' && (
             <div className="animate-fade-in pt-4 pb-12">
                <div className="text-postgres-400 font-bold mb-2">postgres=# SELECT result, recommendation FROM quiz_results;</div>
                
                <div className={`mt-6 border-2 ${passed ? 'border-green-500/50 bg-green-900/10' : 'border-red-500/50 bg-red-900/10'} rounded-lg p-6 relative overflow-hidden`}>
                   
                   {/* ASCII Art Decor based on Pass/Fail */}
                   <div className="absolute top-0 right-0 opacity-10 pointer-events-none p-4">
                      {passed ? <CheckCircle2 size={120} /> : <AlertTriangle size={120} />}
                   </div>

                   <div className="relative z-10">
                      <div className="text-xs font-bold uppercase tracking-widest mb-1 text-slate-500">Output</div>
                      <h3 className={`text-3xl font-bold mb-4 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                         {passed ? 'PASSED' : 'FAILED'} 
                         <span className="ml-4 text-white text-xl">{score}/{totalQuestions} ({percentage}%)</span>
                      </h3>
                      
                      <div className="space-y-4 mb-8">
                         <div>
                            <span className="text-slate-400 block text-xs uppercase tracking-wide mb-1">Analysis</span>
                            <p className="text-slate-200">
                               {passed 
                                 ? `Excellent work! You have demonstrated strong knowledge of ${currentLevel} concepts.` 
                                 : `You missed a few key concepts in ${currentLevel}. We recommend strengthening your foundation.`}
                            </p>
                         </div>
                         
                         <div>
                            <span className="text-slate-400 block text-xs uppercase tracking-wide mb-1">Recommendation</span>
                            <div className="bg-black/30 p-3 rounded border border-white/10 flex items-center">
                               {passed ? (
                                  nextLevel ? (
                                    <>
                                       <span className="text-green-400 font-bold mr-2">NEXT STEP:</span>
                                       <span className="text-slate-300">Proceed to Level {nextLevel.replace('L','')} Assessment.</span>
                                    </>
                                  ) : (
                                    <>
                                       <span className="text-purple-400 font-bold mr-2">EXPERT:</span>
                                       <span className="text-slate-300">You have mastered the curriculum! Enroll in L4 to get certified.</span>
                                    </>
                                  )
                               ) : (
                                  <>
                                     <span className="text-red-400 font-bold mr-2">ACTION:</span>
                                     <span className="text-slate-300">Enroll in <span className="font-bold text-white">{COURSES.find(c => c.level === currentLevel)?.title}</span>.</span>
                                  </>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         {passed && nextLevel ? (
                            <button 
                               onClick={() => resetQuiz(nextLevel)}
                               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded flex items-center shadow-lg hover:shadow-green-500/20 transition-all"
                            >
                               <span className="mr-2">\c {nextLevel.toLowerCase()}_db</span>
                               <ArrowRight size={18} />
                            </button>
                         ) : passed && !nextLevel ? (
                            <button 
                               onClick={() => { onClose(); onRecommendedCourse(currentLevel); }}
                               className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded flex items-center shadow-lg"
                            >
                               View Course Details
                            </button>
                         ) : (
                            <button 
                               onClick={() => { onClose(); onRecommendedCourse(currentLevel); }}
                               className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center shadow-lg hover:shadow-red-500/20 transition-all"
                            >
                               Enroll in {currentLevel}
                            </button>
                         )}
                         
                         <button 
                            onClick={() => resetQuiz(currentLevel)}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded flex items-center"
                         >
                            <RefreshCcw size={18} className="mr-2" /> Retry
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* Cursor */}
          {quizState !== 'result' && (
             <div className="mt-4 flex items-center text-postgres-300 font-bold animate-pulse">
                postgres=# <span className="w-2.5 h-5 bg-postgres-400 ml-2"></span>
             </div>
          )}
          
        </div>
      </div>
    </div>
  );
};