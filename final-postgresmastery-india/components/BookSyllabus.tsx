import React, { useState, useEffect } from 'react';
import { SYLLABUS, COURSES } from '../constants.ts';
import { Course } from '../types.ts';
import { ChevronLeft, ChevronRight, Layers, Hash, X, CheckCircle2, ArrowLeft } from 'lucide-react';

interface BookSyllabusProps {
  selectedLevel: string | null;
  onClose: () => void;
  onSelectLevel: (level: string) => void;
  onEnroll: (course: Course) => void;
}

// Map Course Levels (L1, L2) to Syllabus Levels (Beginner, Intermediate)
const LEVEL_MAP: Record<string, string> = {
  'L1': 'Beginner',
  'L2': 'Intermediate',
  'L3': 'Advanced',
  'L4': 'Expert'
};

const SYLLABUS_LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// Improved Postgres Elephant (Slonik) Silhouette
const SlonikWatermark = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M19.7,3.6c-0.3-0.8-0.9-1.4-1.7-1.8c-1.3-0.6-3-0.2-4.1,0.5c-0.6,0.4-1.1,0.9-1.5,1.5C12.2,4,12,4.1,11.8,4.3
	c-1.3-1.2-3.1-1.8-5-1.5C5,3.1,3.4,4,2.3,5.5c-0.6,0.9-0.9,1.9-0.8,3c0.1,2.5,2,4.6,4.5,4.9c0.4,0,0.7,0,1.1-0.1
	c0.6,1.4,1.8,2.4,3.3,2.8c-0.6,0.7-1.4,1.2-2.3,1.3c-1.1,0.1-2.2-0.3-3-1c-0.1-0.1-0.3-0.1-0.4,0c-0.1,0.1-0.1,0.3,0,0.4
	c1,0.9,2.4,1.4,3.7,1.2c1.3-0.1,2.4-0.9,3.1-2c0.7,1.1,1.9,1.8,3.2,1.9c0.1,0,0.2,0,0.3,0c1.3,0,2.6-0.6,3.4-1.6
	c1.1-1.3,1.4-3.1,0.9-4.7C20.9,7.6,20.6,5.5,19.7,3.6z M6.4,12.4c-1.9-0.3-3.4-1.9-3.4-3.9c-0.1-0.8,0.2-1.6,0.6-2.3
	C4.5,5,5.7,4.3,7,4.3c1.4-0.2,2.8,0.2,3.8,1.2c0,0,0,0.1,0,0.1C10.6,6.5,9.7,8,8.1,9c-0.2,0.1-0.3,0.3-0.2,0.5
	c0.1,0.2,0.3,0.3,0.5,0.2c1.8-1.2,2.8-2.9,2.9-4c0.2,0.3,0.4,0.6,0.5,0.9c0.2,0.5,0.2,1,0.2,1.5C11.6,11.2,9.1,12.8,6.4,12.4z"/>
  </svg>
);

export const BookSyllabus: React.FC<BookSyllabusProps> = ({ selectedLevel, onClose, onSelectLevel, onEnroll }) => {
  // -1 means Closed Book (Cover Visible)
  // 0 to N-1 means Open Book (Specific Topic Visible)
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isAutoClosing, setIsAutoClosing] = useState(false);
  const [activeTopics, setActiveTopics] = useState(SYLLABUS);
  const [activeCourse, setActiveCourse] = useState(COURSES[0]);

  // When selectedLevel changes, set up the book
  useEffect(() => {
    if (selectedLevel) {
      const course = COURSES.find(c => c.level === selectedLevel);
      const mappedLevel = LEVEL_MAP[selectedLevel];
      
      // Cumulative Syllabus Logic
      const levelIdx = SYLLABUS_LEVEL_ORDER.indexOf(mappedLevel);
      const allowedLevels = SYLLABUS_LEVEL_ORDER.slice(0, levelIdx + 1);
      const topics = SYLLABUS.filter(t => allowedLevels.includes(t.level));
      
      if (course) setActiveCourse(course);
      setActiveTopics(topics);
      
      // FORCE RESET ALL STATE
      setIsAutoClosing(false);
      setCurrentIndex(-1);
      
      const timer = setTimeout(() => {
        openBook();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [selectedLevel]);

  // Handle auto-closing animation
  useEffect(() => {
    if (isAutoClosing) {
      if (currentIndex > -1) {
        // Riffle closing effect: fast decrement
        const timer = setTimeout(() => {
          setCurrentIndex(prev => prev - 1);
        }, 20); 
        return () => clearTimeout(timer);
      } else {
        setIsAutoClosing(false); // Animation complete
        onClose(); // Notify parent that book is fully closed
      }
    }
  }, [isAutoClosing, currentIndex, onClose]);

  const nextTopic = () => {
    if (isAutoClosing) return;

    if (currentIndex < activeTopics.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // User is on the last page and clicked next -> Close the book with animation
      closeBook();
    }
  };

  const prevTopic = () => {
    if (currentIndex > -1 && !isAutoClosing) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const openBook = () => {
    setCurrentIndex(0);
  };

  const closeBook = () => {
    setIsAutoClosing(true);
  };

  const isBookClosed = currentIndex === -1;

  // Custom style for z-index management during flips
  const getPageStyle = (pageIndex: number, zIndex: number, isFlipped: boolean) => {
    const duration = isAutoClosing ? '500ms' : '700ms';
    const zDelay = isAutoClosing ? '250ms' : '350ms'; 

    return {
      zIndex: zIndex,
      transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
      transition: `transform ${duration} ease-in-out, z-index 0ms ${zDelay}` 
    };
  };

  // --- RENDER SHELF VIEW (If no book selected) ---
  if (!selectedLevel) {
    return (
      <div className="w-full max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-postgres-400 font-semibold tracking-wider uppercase text-sm">Interactive Syllabus</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Explore the Curriculum Books</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Select a course book below to open it and flip through the detailed syllabus pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 perspective-2000 px-4 md:px-0">
          {COURSES.map((course, idx) => (
            <div 
              key={course.id} 
              className="group relative cursor-pointer transform transition-transform duration-500 hover:scale-105"
              onClick={() => onSelectLevel(course.level)}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* 3D Book on Shelf */}
              <div className="relative w-full aspect-[3/4.2] preserve-3d group-hover:rotate-y-[-15deg] transition-transform duration-500 ease-out shadow-2xl">
                
                {/* Front Cover */}
                <div className={`absolute -inset-[2px] ${course.color} z-30 flex flex-col items-center text-center shadow-lg text-white overflow-hidden rounded-r-xl rounded-l-[2px]`}>
                   {/* Gradient Shine */}
                   <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
                   
                   {/* Elephant Watermark */}
                   <div className="absolute -bottom-16 -right-16 w-80 h-80 text-black opacity-[0.08] transform rotate-12 pointer-events-none mix-blend-multiply">
                      <SlonikWatermark />
                   </div>
                   
                   <div className="relative z-10 w-full flex flex-col h-full items-center pt-8">
                     {/* Elegant Top Badge */}
                     <div className="mb-8 w-full border-b border-white/20 pb-2">
                        <span className="text-xs font-serif italic tracking-widest text-white/80">PostgresMastery Series</span>
                     </div>

                     {/* Clean Serif Title */}
                     <h3 className="text-2xl font-serif font-bold leading-snug text-white drop-shadow-sm mb-4 px-3 whitespace-pre-line">
                       {course.title.replace('PostgreSQL', 'Postgres')}
                     </h3>
                     
                     {/* Decorative Separator */}
                     <div className="flex items-center space-x-2 opacity-60">
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-8 h-px bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                     </div>
                     
                     {/* Elegant Volume Number */}
                     <div className="absolute bottom-4 left-0 w-full flex flex-col items-center">
                        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/70 mb-0">Level</span>
                        <div className="relative inline-block">
                           <span className="text-6xl font-serif font-bold text-white drop-shadow-md block leading-none">
                              {course.level.replace('L', '')}
                           </span>
                           <span className="absolute top-1 -right-6 text-[9px] font-bold border border-white/40 rounded px-1 leading-tight tracking-widest">VOL</span>
                        </div>
                     </div>
                     
                     <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-1/2">
                       <span className="text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 border border-white/30 rounded-sm bg-black/10 backdrop-blur-sm uppercase">
                          Open Book
                       </span>
                     </div>
                   </div>
                </div>
                
                {/* Book Thickness (Right Side - Pages) */}
                <div 
                   className="absolute top-1 bottom-1 right-2 w-5 bg-orange-50 origin-right z-10"
                   style={{ transform: 'rotateY(90deg) translateX(0px)' }}
                >
                   {/* Page lines effect */}
                   <div className="h-full w-full bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px)] bg-[size:2px_100%] opacity-20"></div>
                   <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent"></div>
                </div>

                {/* Pages (Top) */}
                <div 
                   className="absolute top-1 left-1 right-1 h-5 bg-orange-50 origin-top z-10"
                   style={{ transform: 'rotateX(90deg) translateY(0px)' }}
                >
                   <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
                </div>
                
                {/* Pages (Bottom) */}
                <div 
                   className="absolute bottom-1 left-1 right-1 h-5 bg-orange-50 origin-bottom z-10"
                   style={{ transform: 'rotateX(-90deg) translateY(0px)' }}
                >
                   <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

              </div>

              {/* Shelf Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/40 blur-xl rounded-[100%] group-hover:w-[90%] transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- READER VIEW (Big Book) ---
  const totalTopics = activeTopics.length;
  const progressPercentage = Math.min(100, Math.max(0, ((currentIndex + 1) / totalTopics) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4">
      
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 animate-fade-in-up">
        <button 
           onClick={closeBook}
           className="flex items-center text-slate-400 hover:text-postgres-400 transition-colors mb-4 md:mb-0 font-bold"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Bookshelf
        </button>
        <div className="text-center w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white whitespace-pre-line">{activeCourse.title} <span className="text-postgres-400">Syllabus</span></h2>
            
            {/* Progress Bar Container */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                <span>{isBookClosed ? "Start" : `Module ${currentIndex + 1}`}</span>
                <span>{Math.round(progressPercentage)}% Completed</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-postgres-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
        </div>
        <div className="w-24 hidden md:block"></div> {/* Spacer for centering */}
      </div>

      {/* Desktop 3D Book Container */}
      <div className={`hidden md:flex justify-center items-center perspective-2000 relative h-[650px] w-full select-none transition-transform duration-1000 ${isBookClosed ? '-translate-x-[225px]' : 'translate-x-0'}`}>
        
        {/* Navigation Buttons */}
        {!isBookClosed && (
          <>
            <button 
              onClick={prevTopic}
              disabled={isAutoClosing}
              className={`absolute left-0 lg:-left-12 z-50 p-4 rounded-full bg-white shadow-xl border border-slate-200 transition-all hover:scale-110 hover:text-postgres-600 ${currentIndex === -1 ? 'opacity-0 pointer-events-none' : 'text-slate-700'}`}
              title="Previous Page"
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              onClick={nextTopic}
              disabled={isAutoClosing}
              className={`absolute right-0 lg:-right-12 z-50 p-4 rounded-full bg-white shadow-xl border border-slate-200 transition-all hover:scale-110 hover:text-postgres-600 ${isAutoClosing ? 'opacity-30 cursor-not-allowed' : 'text-slate-700'}`}
              title={currentIndex === totalTopics - 1 ? "Finish & Close" : "Next Topic"}
            >
              {currentIndex === totalTopics - 1 ? <CheckCircle2 size={32} /> : <ChevronRight size={32} />}
            </button>
          </>
        )}

        {/* The Book Spine/Container */}
        <div className="relative w-[900px] h-[550px]">
           
           {/* STATIC BASE (Right Side - Last Page) */}
           <div className="absolute top-0 right-0 w-[calc(50%+1px)] h-full bg-[#fdfbf7] border border-slate-200 rounded-r-2xl shadow-2xl flex flex-col p-10 z-0">
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
              <div className="flex-grow ml-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Course Completed</h4>
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 size={64} className="text-green-500 mb-4" />
                    <h3 className="text-2xl font-serif font-bold text-slate-800">Ready to Enroll?</h3>
                    <p className="text-slate-600 mt-2 mb-6">You've reviewed the entire curriculum for {activeCourse.level}.</p>
                    <button 
                      onClick={() => onEnroll(activeCourse)}
                      className="px-8 py-3 bg-postgres-600 text-white rounded-full font-bold hover:bg-postgres-700 transition-colors shadow-lg"
                    >
                      Get Started Now
                    </button>
                  </div>
              </div>
           </div>

           {/* SHEET 0: THE COVER */}
           <div 
              className={`absolute top-0 left-1/2 w-1/2 h-full preserve-3d origin-left shadow-2xl`}
              style={getPageStyle(0, currentIndex === -1 ? 1000 : 0, currentIndex > -1)}
           >
              {/* FRONT OF COVER - CLEAN & SOLID */}
              <div className={`absolute -inset-[2px] backface-hidden ${activeCourse.color} p-10 flex flex-col items-center justify-center text-center overflow-hidden rounded-r-2xl rounded-l-[4px]`}>
                 <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-10"></div>
                 
                 {/* Large Watermark for Open View */}
                 <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] pointer-events-none opacity-10 text-black transform rotate-12">
                      <SlonikWatermark />
                 </div>

                 <div className="w-full h-full flex flex-col justify-between relative z-10">
                    <div className="text-white pt-6">
                        <div className="font-serif italic text-white/90 mb-8 tracking-wide">Standard Curriculum</div>
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight drop-shadow-sm whitespace-pre-line">{activeCourse.title}</h1>
                        <div className="w-16 h-px bg-white/60 mx-auto my-6"></div>
                        <p className="font-medium opacity-90 text-lg tracking-wide font-serif">Volume {activeCourse.level.replace('L', '')}</p>
                    </div>

                    <div className="mt-4 pb-8" onClick={() => isBookClosed && openBook()}>
                        <span className={`inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-full text-sm shadow-xl hover:scale-105 transition-transform uppercase tracking-wider ${isBookClosed ? 'cursor-pointer' : ''}`}>
                            {isBookClosed ? "Explore" : "Start Reading"}
                        </span>
                    </div>
                 </div>
              </div>

              {/* BACK OF COVER (Left Page for Topic 1) */}
              <div 
                 className="absolute inset-0 backface-hidden bg-[#fdfbf7] border border-slate-200 rounded-l-2xl p-10 flex flex-col"
                 style={{ transform: 'rotateY(180deg)' }}
              >
                  <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
                  
                  {activeTopics.length > 0 && (
                    <div className="flex-grow mr-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wide text-slate-500`}>
                              {activeTopics[0].level}
                            </span>
                            <span className="text-slate-300 font-serif text-6xl font-black opacity-20">01</span>
                        </div>
                        
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-slate-800 leading-tight">{activeTopics[0].title}</h3>
                            <div className="w-16 h-1 bg-postgres-500 mt-6 mb-6"></div>
                        </div>

                        <div className="text-slate-400 text-sm font-medium flex items-center">
                            <Hash size={14} className="mr-2" /> Module 1 of {totalTopics}
                        </div>
                    </div>
                  )}
              </div>
           </div>

           {/* DYNAMIC SHEETS (1 to N-1) */}
           {activeTopics.slice(0, -1).map((topic, idx) => {
             const sheetIndex = idx + 1;
             const frontContent = activeTopics[idx];
             const backTitle = activeTopics[idx + 1];
             const isFlipped = currentIndex >= sheetIndex;
             const zIndex = isFlipped ? sheetIndex : (totalTopics - sheetIndex);

             return (
                <div 
                  key={sheetIndex}
                  className={`absolute top-0 left-1/2 w-1/2 h-full preserve-3d origin-left shadow-sm`}
                  style={getPageStyle(sheetIndex, zIndex, isFlipped)}
                >
                  {/* FRONT FACE (Right Page Content) */}
                  <div className="absolute inset-0 backface-hidden bg-[#fdfbf7] border border-slate-200 rounded-r-xl p-10 flex flex-col">
                     <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                     <div className="flex-grow ml-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Topic Overview</h4>
                        <p className="text-xl text-slate-700 leading-relaxed font-serif">
                          {frontContent.description}
                        </p>
                        <div className="mt-8 space-y-3">
                          <div className="flex items-center text-slate-600 text-sm">
                             <Layers size={18} className="mr-3 text-postgres-500" />
                             <span>Includes practical labs</span>
                          </div>
                        </div>
                     </div>
                     <div className="mt-auto border-t border-slate-100 pt-6 flex justify-between items-center ml-4">
                        <span className="text-xs text-slate-400">PostgresMastery</span>
                        <span className="text-sm font-bold text-slate-800">{sheetIndex}</span>
                     </div>
                  </div>

                  {/* BACK FACE (Left Page Title for Next Topic) */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-[#fdfbf7] border border-slate-200 rounded-l-xl p-10 flex flex-col"
                    style={{ transform: 'rotateY(180deg)' }} 
                  >
                     <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
                     <div className="flex-grow mr-4 flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                            <span className="text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wide text-slate-500">
                                {backTitle.level}
                            </span>
                            <span className="text-slate-300 font-serif text-6xl font-black opacity-20">
                                {(sheetIndex + 1).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-slate-800 leading-tight">{backTitle.title}</h3>
                            <div className="w-16 h-1 bg-postgres-500 mt-6 mb-6"></div>
                        </div>
                        <div className="text-slate-400 text-sm font-medium flex items-center">
                            <Hash size={14} className="mr-2" /> Module {sheetIndex + 1} of {totalTopics}
                        </div>
                     </div>
                  </div>
                </div>
             );
           })}
        </div>
      </div>

      {/* Mobile Card View (Reader Mode Only) */}
      <div className="md:hidden space-y-6">
        {isBookClosed ? (
           <div className="text-center py-10">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-postgres-600 mx-auto"></div>
             <p className="mt-4 text-slate-500">Opening Syllabus...</p>
           </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase text-slate-500">
                    {activeTopics[currentIndex]?.level || activeCourse.level}
                 </span>
                 <button onClick={closeBook} className="text-slate-400 hover:text-red-500">
                    <X size={20} />
                 </button>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{activeTopics[currentIndex]?.title}</h3>
              <div className="w-12 h-1 bg-postgres-500 mb-6"></div>
              
              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  {activeTopics[currentIndex]?.description}
              </p>
              
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  <button 
                      onClick={prevTopic}
                      disabled={currentIndex === 0}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-postgres-600 hover:bg-postgres-50'}`}
                  >
                      <ChevronLeft size={18} className="mr-1"/> Previous
                  </button>
                  <span className="text-xs text-slate-400 font-medium">{currentIndex + 1} / {totalTopics}</span>
                  <button 
                      onClick={nextTopic}
                      disabled={isAutoClosing}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isAutoClosing ? 'text-slate-300 cursor-not-allowed' : 'text-postgres-600 hover:bg-postgres-50'}`}
                  >
                      {currentIndex === totalTopics - 1 ? 'Close' : 'Next'} 
                      {currentIndex === totalTopics - 1 ? <CheckCircle2 size={18} className="ml-1" /> : <ChevronRight size={18} className="ml-1"/>}
                  </button>
              </div>
          </div>
        )}
      </div>

    </div>
  );
};
