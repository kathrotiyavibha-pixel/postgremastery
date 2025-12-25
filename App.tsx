
import React, { useState, useMemo, useRef, useEffect } from 'react';
/* Renamed conflicting import alias 'BookOpenIcon' to 'LucideBookOpen' */
import { Menu, X, Database, Check, Star, ShieldCheck, Mail, MapPin, ArrowRight, BookOpen as LucideBookOpen, Quote, Terminal, ChevronDown, ChevronRight, Briefcase, HelpCircle, Send, Trophy, TrendingUp, Twitter, Linkedin, Facebook, Sparkles, FileText } from 'lucide-react';
import { COURSES, TESTIMONIALS, FAQS } from './constants.ts';
import { BookSyllabus } from './components/BookSyllabus.tsx';
import { CourseCard } from './components/CourseCard.tsx';
import { PostgresShellQuiz } from './components/PostgresShellQuiz.tsx';
import { BlogPage } from './components/BlogPage.tsx';
import { PurchaseTerminal } from './components/PurchaseTerminal.tsx';
import { Course } from './types.ts';

// Helper to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Custom Multi-Select Dropdown Component
const SqlMultiSelect = ({ 
  selectedLevels, 
  onChange 
}: { 
  selectedLevels: string[], 
  onChange: (levels: string[]) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLevel = (level: string) => {
    if (level === 'ALL') {
      onChange(['ALL']);
      setIsOpen(false);
      return;
    }

    let newLevels = [...selectedLevels];
    
    // Remove ALL if it exists
    if (newLevels.includes('ALL')) {
      newLevels = [];
    }

    if (newLevels.includes(level)) {
      newLevels = newLevels.filter(l => l !== level);
    } else {
      newLevels.push(level);
    }

    // If nothing selected, revert to ALL
    if (newLevels.length === 0) {
      newLevels = ['ALL'];
    }

    onChange(newLevels);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format display text for SQL
  const getDisplayText = () => {
    if (selectedLevels.includes('ALL')) return "= 'ALL'";
    if (selectedLevels.length === 1) return `= '${selectedLevels[0]}'`;
    return `IN ('${selectedLevels.join("', '")}')`;
  };

  return (
    <div className="relative inline-block mx-1" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative"
      >
         {/* Terminal Text Style Input */}
         <span className="text-green-400 font-bold font-mono border-b border-dashed border-slate-700 hover:border-green-400 transition-colors">
            {getDisplayText()}
         </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-slate-700 rounded shadow-2xl z-50 p-2 min-w-[200px]">
           <div className="flex flex-row gap-2">
              {['ALL', 'L1', 'L2', 'L3', 'L4'].map((level) => {
                const isSelected = selectedLevels.includes(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`
                      px-3 py-1 rounded-sm text-xs font-bold font-mono transition-all border
                      ${isSelected 
                        ? 'bg-green-900/50 text-green-400 border-green-700' 
                        : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'}
                    `}
                  >
                    {level}
                  </button>
                );
              })}
           </div>
           <div className="mt-2 text-[10px] text-slate-500 text-center font-mono">
             -- Select levels to filter --
           </div>
        </div>
      )}
    </div>
  );
};


const App = () => {
  const [activeView, setActiveView] = useState<'home' | 'blog'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State to manage which book is currently active in the syllabus section
  const [selectedBookLevel, setSelectedBookLevel] = useState<string | null>(null);

  // State for Quiz
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStartLevel, setQuizStartLevel] = useState('L1');

  // State for Purchase Terminal
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseCourse, setPurchaseCourse] = useState<Course | null>(null);

  // Filter States - Now supports multiple levels
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['ALL']);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Filter Logic
  const filteredCourses = useMemo(() => {
    let result = [...COURSES];
    
    // Filter by Level
    if (!selectedLevels.includes('ALL')) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }
    
    // Sort by Price
    result.sort((a, b) => {
      if (sortOrder === 'ASC') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    
    return result;
  }, [selectedLevels, sortOrder]);

  const handleOpenCourse = (level: string) => {
    setActiveView('home');
    // Allow state update to propagate
    setTimeout(() => {
      setSelectedBookLevel(level);
      scrollToSectionId('syllabus');
    }, 100);
  };

  const handleOpenQuiz = (level: string) => {
    setQuizStartLevel(level);
    setIsQuizOpen(true);
  };

  const handleOpenPurchase = (course: Course) => {
    setPurchaseCourse(course);
    setIsPurchaseOpen(true);
  };

  const handleRecommendedCourse = (level: string) => {
    setIsQuizOpen(false);
    handleOpenCourse(level);
  };

  const handleCloseBook = () => {
    setSelectedBookLevel(null);
  };

  const scrollToSectionId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveView('home');
    setIsMobileMenuOpen(false);
    
    // Small delay to ensure view switches back to home before scrolling
    setTimeout(() => {
      scrollToSectionId(id);
    }, 50);
  };

  const switchToBlog = () => {
    setActiveView('blog');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SQL Snippets for Background Animation
  const SQL_SNIPPETS = [
    "SELECT * FROM career_growth WHERE speed = 'FAST';",
    "UPDATE skills SET mastery = true;",
    "CREATE INDEX idx_success ON students(salary);",
    "INSERT INTO companies (name) VALUES ('Google'), ('Amazon');",
    "VACUUM FULL ANALYZE confidence_boost;",
    "GRANT ALL PRIVILEGES TO hard_work;",
    "COMMIT; -- Career upgrade complete",
    "SELECT name, salary_hike FROM placements ORDER BY hike DESC;",
    "ALTER TABLE lifestyle ADD COLUMN remote_work BOOLEAN;",
    "DROP TABLE financial_worries;",
    "BEGIN TRANSACTION; -- Start Learning",
    "EXPLAIN ANALYZE SELECT future FROM dreams;",
    "checkpoint_completion_target = 0.9;"
  ];

  if (activeView === 'blog') {
    return <BlogPage onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative text-slate-900 antialiased">
      
      {/* CSS Injection for Marquees, Beams & Waterfall Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes marquee-horizontal {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.1; }
          80% { opacity: 0.1; }
          100% { transform: translateY(-40px) rotate(10deg); opacity: 0; }
        }
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 15px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes waterfall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes beam-h-ltr {
          0% { left: -20%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes beam-h-rtl {
          0% { right: -20%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { right: 120%; opacity: 0; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes blink-sharp {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
        .animate-beam-h-ltr {
          animation: beam-h-ltr 10s linear infinite;
        }
        .animate-beam-h-rtl {
          animation: beam-h-rtl 10s linear infinite;
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 40s linear infinite;
        }
        .animate-marquee-horizontal {
          animation: marquee-horizontal 20s linear infinite;
        }
        .animate-marquee-infinite {
          animation: marquee-infinite 60s linear infinite;
        }
        .animate-blink-sharp {
          animation: blink-sharp 1s infinite;
        }
        .animate-float {
           animation: float 15s ease-in-out infinite;
        }
        .animate-drift {
           animation: drift 15s ease-in-out infinite;
        }
        .animate-waterfall {
           animation: waterfall 25s linear infinite;
        }
        .animate-ripple {
          animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />

      <PostgresShellQuiz 
         isOpen={isQuizOpen}
         initialLevel={quizStartLevel}
         onClose={() => setIsQuizOpen(false)}
         onRecommendedCourse={handleRecommendedCourse}
      />

      <PurchaseTerminal 
         isOpen={isPurchaseOpen}
         onClose={() => setIsPurchaseOpen(false)}
         selectedCourse={purchaseCourse}
      />

      {/* Floating Enrollment Trigger */}
      <div className="fixed bottom-6 right-6 z-[100] hidden md:block">
          <button 
            onClick={() => handleOpenPurchase(COURSES[0])}
            className="group relative flex items-center justify-center w-14 h-14 bg-postgres-600 text-white rounded-full shadow-2xl shadow-postgres-600/40 hover:w-48 hover:rounded-xl transition-all duration-300 overflow-hidden"
          >
             <div className="absolute left-4">
                <Send size={24} />
             </div>
             <span className="ml-8 opacity-0 group-hover:opacity-100 whitespace-nowrap font-bold text-sm">Initiate Enrollment</span>
          </button>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-postgres-50 p-2 rounded-lg group-hover:bg-postgres-100 transition-colors">
                 <Database className="h-6 w-6 text-postgres-600" />
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">Postgres<span className="text-postgres-600">Mastery</span></span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="text-slate-600 hover:text-postgres-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Courses<span className="animate-blink-sharp font-mono ml-0.5">_</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-postgres-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#syllabus" onClick={(e) => handleNavClick(e, 'syllabus')} className="text-slate-600 hover:text-indigo-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Syllabus<span className="animate-blink-sharp font-mono ml-0.5">_</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </a>
              <button onClick={switchToBlog} className="text-slate-600 hover:text-purple-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Blog<span className="animate-blink-sharp font-mono ml-0.5">_</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </button>
              <a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')} className="text-slate-600 hover:text-amber-500 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Reviews<span className="animate-blink-sharp font-mono ml-0.5">_</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#instructor" onClick={(e) => handleNavClick(e, 'instructor')} className="text-slate-600 hover:text-emerald-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                About<span className="animate-blink-sharp font-mono ml-0.5">_</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-postgres-600 transition-colors">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-lg absolute w-full z-50">
             <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="block text-slate-600 hover:text-postgres-600 hover:bg-postgres-50 px-4 py-3 rounded-lg font-bold transition-colors uppercase text-sm tracking-widest">Courses<span className="animate-blink-sharp font-mono ml-0.5">_</span></a>
             <a href="#syllabus" onClick={(e) => handleNavClick(e, 'syllabus')} className="block text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg font-bold transition-colors uppercase text-sm tracking-widest">Syllabus<span className="animate-blink-sharp font-mono ml-0.5">_</span></a>
             <button onClick={switchToBlog} className="block text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-lg font-bold transition-colors uppercase text-sm tracking-widest w-full text-left">Blog<span className="animate-blink-sharp font-mono ml-0.5">_</span></button>
             <a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')} className="block text-slate-600 hover:text-amber-500 hover:bg-amber-50 px-4 py-3 rounded-lg font-bold transition-colors uppercase text-sm tracking-widest">Reviews<span className="animate-blink-sharp font-mono ml-0.5">_</span></a>
             <a href="#instructor" onClick={(e) => handleNavClick(e, 'instructor')} className="block text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-lg font-bold transition-colors uppercase text-sm tracking-widest">About<span className="animate-blink-sharp font-mono ml-0.5">_</span></a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-28 lg:pb-36 bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
           
           {/* Vertical Beams */}
           <div className="absolute left-[15%] w-[1px] h-32 bg-gradient-to-b from-transparent via-postgres-400 to-transparent animate-beam opacity-0" style={{ animationDuration: '4s', animationTimingFunction: 'ease-in-out' }}></div>
           <div className="absolute left-[35%] w-[1px] h-48 bg-gradient-to-b from-transparent via-indigo-300 to-transparent animate-beam opacity-0" style={{ animationDuration: '7s', animationTimingFunction: 'ease-in-out' }}></div>
           <div className="absolute left-[60%] w-[1px] h-24 bg-gradient-to-b from-transparent via-purple-300 to-transparent animate-beam opacity-0" style={{ animationDuration: '5s', animationTimingFunction: 'ease-in-out' }}></div>
           <div className="absolute left-[85%] w-[1px] h-64 bg-gradient-to-b from-transparent via-postgres-300 to-transparent animate-beam opacity-0" style={{ animationDuration: '6s', animationTimingFunction: 'ease-in-out' }}></div>

           {/* Horizontal Beams */}
           <div className="absolute top-[20%] h-[1px] w-64 bg-gradient-to-r from-transparent via-postgres-400 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '7s', animationDelay: '0.5s' }}></div>
           <div className="absolute top-[35%] h-[1px] w-48 bg-gradient-to-l from-transparent via-indigo-400 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
           <div className="absolute top-[50%] h-[1px] w-80 bg-gradient-to-l from-transparent via-indigo-400 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
           <div className="absolute top-[65%] h-[1px] w-40 bg-gradient-to-r from-transparent via-postgres-500 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '6s', animationDelay: '0s' }}></div>
           <div className="absolute top-[80%] h-[1px] w-48 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '11s', animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-postgres-50 text-postgres-800 text-sm font-semibold mb-8 animate-fade-in-up border border-postgres-100 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-postgres-600 mr-2 animate-pulse"></span>
            India's #1 PostgreSQL Learning Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter px-4">
            Master the World's Most<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-postgres-600 via-indigo-600 to-purple-600 animate-gradient-x">Advanced Database</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed px-4 font-medium">
            From architecture deep-dives to high-stakes DBA optimization. 
            The only curriculum in India designed for production-scale engineering.
          </p>
          
          {/* Main CTAs Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-8 mb-10 animate-fade-in-up">
            <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="w-full sm:w-auto px-10 py-5 bg-postgres-600 text-white rounded-full font-black text-lg shadow-2xl shadow-postgres-600/30 hover:bg-postgres-700 transition-all hover:-translate-y-1 flex items-center justify-center">
              View Courses
            </a>
            <a href="#syllabus" onClick={(e) => handleNavClick(e, 'syllabus')} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-full font-black text-lg hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-lg">
              <LucideBookOpen className="mr-2 h-6 w-6" />
              See Syllabus
            </a>
          </div>

          {/* Discovery Lures - Now with ripples and blinks */}
          <div className="max-w-4xl mx-auto px-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-stretch justify-center bg-white/40 backdrop-blur-xl rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Blog Lure */}
              <button 
                onClick={switchToBlog}
                className="flex-1 group flex items-center p-8 hover:bg-purple-50/50 transition-all duration-300 text-left"
              >
                <div className="relative w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mr-6 transition-colors duration-500 overflow-visible">
                  <div className="absolute inset-0 bg-purple-400 rounded-2xl animate-ripple opacity-0 group-hover:opacity-100"></div>
                  <FileText size={24} className="text-purple-600 group-hover:text-purple-700 transition-colors z-10" />
                </div>
                <div>
                  <div className="flex items-center text-purple-600 font-black text-[11px] uppercase tracking-[0.25em] mb-1.5">
                     Engineering Blog <ChevronRight size={12} className="ml-1" />
                  </div>
                  <p className="text-base md:text-lg font-black text-slate-800 leading-tight">Check out our latest insights</p>
                </div>
              </button>

              {/* Quiz Lure */}
              <button 
                onClick={() => handleOpenQuiz('L1')}
                className="flex-1 group flex items-center p-8 hover:bg-postgres-50/50 transition-all duration-300 text-left"
              >
                <div className="relative w-14 h-14 rounded-2xl bg-postgres-100 flex items-center justify-center mr-6 transition-colors duration-500 overflow-visible">
                   <div className="absolute inset-0 bg-postgres-400 rounded-2xl animate-ripple opacity-0 group-hover:opacity-100"></div>
                   <Sparkles size={24} className="text-postgres-600 group-hover:text-postgres-700 transition-colors z-10" />
                </div>
                <div>
                  <div className="flex items-center text-postgres-600 font-black text-[11px] uppercase tracking-[0.25em] mb-1.5">
                     Skill Test <ChevronRight size={12} className="ml-1" />
                  </div>
                  <p className="text-base md:text-lg font-black text-slate-800 leading-tight">
                    <span className="animate-blink-sharp">Test your knowledge now</span>
                  </p>
                </div>
              </button>

            </div>
          </div>
          
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-xs md:text-sm text-slate-500 font-bold px-4">
            <div className="flex items-center bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm"><ShieldCheck className="h-5 w-5 mr-2 text-postgres-600"/> Trusted by Corporate DBAs</div>
            <div className="flex items-center bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm"><Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500"/> 4.4/5 Average Rating</div>
          </div>
        </div>
        
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-postgres-100/30 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-slate-50 relative scroll-mt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]"></div>
           
           {/* Dense Horizontal Beams for Dynamic Feel */}
           <div className="absolute top-[8%] h-[1px] w-64 bg-gradient-to-r from-transparent via-postgres-400 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '6s', animationDelay: '0s' }}></div>
           <div className="absolute top-[15%] h-[1px] w-56 bg-gradient-to-l from-transparent via-postgres-500 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
           <div className="absolute top-[22%] h-[1px] w-48 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
           <div className="absolute top-[35%] h-[1px] w-40 bg-gradient-to-l from-transparent via-indigo-300 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '11s', animationDelay: '5s' }}></div>
           <div className="absolute top-[45%] h-[1px] w-80 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
           <div className="absolute top-[55%] h-[1px] w-72 bg-gradient-to-l from-transparent via-slate-400 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
           <div className="absolute top-[65%] h-[1px] w-56 bg-gradient-to-r from-transparent via-postgres-400 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
           <div className="absolute top-[75%] h-[1px] w-64 bg-gradient-to-l from-transparent via-purple-500 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '13s', animationDelay: '0s' }}></div>
           <div className="absolute top-[85%] h-[1px] w-96 bg-gradient-to-r from-transparent via-indigo-600 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '14s', animationDelay: '5s' }}></div>
           <div className="absolute top-[92%] h-[1px] w-80 bg-gradient-to-l from-transparent via-postgres-300 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
           <div className="absolute top-[40%] h-[1px] w-56 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-beam-h-ltr opacity-0" style={{ animationDuration: '11s', animationDelay: '6s' }}></div>
           <div className="absolute top-[60%] h-[1px] w-72 bg-gradient-to-l from-transparent via-indigo-500 to-transparent animate-beam-h-rtl opacity-0" style={{ animationDuration: '12s', animationDelay: '7s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-postgres-600 font-bold tracking-wider uppercase text-sm mb-2 block">Career Paths</span>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">Choose Your Level</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Structured learning paths tailored for every stage of your database engineering career.</p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-16 transform hover:scale-[1.005] transition-transform duration-300 relative z-20 font-mono text-sm sm:text-base">
            <div className="bg-[#0c0c0c] text-slate-300 rounded-lg shadow-2xl border border-slate-700/50 p-6 overflow-visible relative">
              <div className="mb-4 text-slate-500 text-xs leading-relaxed opacity-75 select-none">
                PostgreSQL 16.2 (PostgresMastery v1.0) on x86_64-pc-linux-gnu<br/>
                Type "help" for help.<br/>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center leading-relaxed">
                  <span className="text-postgres-500 font-bold mr-3 select-none">postgres=#</span>
                  <span className="text-purple-400 font-bold mr-2">SELECT</span> 
                  <span className="text-blue-300 mr-2">reason</span> 
                  <span className="text-purple-400 font-bold mr-2">FROM</span> 
                  <span className="text-yellow-300">choices</span>
                </div>
                <div className="flex flex-wrap items-center leading-relaxed">
                  <span className="text-postgres-500 font-bold mr-3 select-none">postgres-#</span>
                  <span className="text-purple-400 font-bold mr-2">WHERE</span> 
                  <span className="text-white mr-2">platform</span>
                  <span className="text-white mr-2">=</span>
                  <span className="text-green-400 mr-2">'PostgresMastery'</span>
                </div>
                <div className="flex flex-wrap items-center leading-relaxed">
                  <span className="text-postgres-500 font-bold mr-3 select-none">postgres-#</span>
                  <span className="text-purple-400 font-bold mr-2">AND</span>
                  <span className="text-blue-300 mr-2">level</span> 
                  <SqlMultiSelect selectedLevels={selectedLevels} onChange={setSelectedLevels} />
                </div>
                <div className="flex flex-wrap items-center leading-relaxed">
                  <span className="text-postgres-500 font-bold mr-3 select-none">postgres-#</span>
                  <span className="text-purple-400 font-bold mr-2">ORDER BY</span> 
                  <span className="text-blue-300 mr-2">price</span> 
                  <div className="relative group inline-block">
                    <select 
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                      className="appearance-none bg-transparent text-orange-400 font-bold border-b border-dashed border-slate-700 cursor-pointer focus:outline-none focus:border-postgres-500 hover:text-orange-300 transition-colors py-0 px-1 ml-1"
                    >
                      <option value="ASC" className="bg-slate-900 text-slate-300">ASC</option>
                      <option value="DESC" className="bg-slate-900 text-slate-300">DESC</option>
                    </select>
                  </div>
                  <span className="text-slate-400 ml-1">;</span>
                  <span className="w-2.5 h-5 bg-slate-400 ml-2 animate-pulse inline-block align-middle"></span>
                </div>
              </div>
              <div className="mt-4 text-slate-500 text-xs italic opacity-60">({filteredCourses.length} rows)</div>
              <div className="mt-2 text-green-400 text-xs font-bold animate-pulse tracking-[0.1em] uppercase">&gt; Click on parameters to refine search</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 min-h-[500px]">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                <div key={course.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] animate-fade-in-up">
                  <CourseCard 
                    course={course} 
                    onViewSyllabus={() => handleOpenCourse(course.level)}
                    onTakeQuiz={() => handleOpenQuiz(course.level)}
                    onEnroll={() => handleOpenPurchase(course)}
                  />
                </div>
            )) : (
              <div className="w-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed">
                <Database className="text-slate-400 mb-4" size={32} />
                <h3 className="text-lg font-bold text-slate-900">No courses found</h3>
                <button 
                  onClick={() => { setSelectedLevels(['ALL']); setSortOrder('ASC'); }}
                  className="mt-6 text-postgres-600 font-semibold hover:underline"
                >
                  Reset Query
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Book Syllabus Section */}
      <section id="syllabus" className="bg-slate-900 text-white border-y border-slate-800 scroll-mt-24 relative overflow-hidden py-16">
         {/* Infinite Horizontal Scrolling Book Names - Watermark Style */}
         <div className="absolute inset-0 flex flex-col justify-around select-none pointer-events-none z-0 overflow-hidden py-8">
            {[0, 1, 2, 3].map((row) => (
              <div 
                key={row} 
                className={`flex whitespace-nowrap animate-marquee-infinite`} 
                style={{ 
                  animationDuration: `${30 + row * 10}s`,
                  animationDirection: row % 2 === 0 ? 'normal' : 'reverse',
                  opacity: 0.3
                }}
              >
                {/* Repetitive Course Titles - Repeated 15 times per row for seamless loop */}
                {[...Array(15)].map((_, i) => {
                  // Cycle through all courses, starting from a different one for each row
                  const courseIndex = (i + row) % COURSES.length;
                  const course = COURSES[courseIndex];
                  return (
                    <span key={i} className={`text-[6vw] md:text-[8rem] font-black tracking-tighter mx-16 uppercase italic flex-shrink-0 transition-colors ${row % 2 === 0 ? 'text-slate-700' : 'text-slate-800'}`}>
                      {course.title.replace('\n', ' ')}
                    </span>
                  );
                })}
              </div>
            ))}
            
            {/* Top and Bottom Fades for Seamless Look */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900 z-10"></div>
         </div>

         <div className="relative z-20">
            <BookSyllabus 
                selectedLevel={selectedBookLevel} 
                onClose={handleCloseBook}
                onSelectLevel={handleOpenCourse}
                onEnroll={handleOpenPurchase}
            />
         </div>
      </section>

      {/* Why Us */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="animate-fade-in-up">
                <span className="text-postgres-600 font-bold tracking-wider uppercase text-sm mb-4 block">The PostgresMastery Difference</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Precision-engineered for Database Careers</h2>
                
                <div className="space-y-8">
                  <div className="flex group">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-[24px] bg-white text-postgres-600 shadow-xl shadow-slate-200/50 border border-slate-100 group-hover:scale-110 group-hover:bg-postgres-600 group-hover:text-white transition-all duration-300">
                        <Database className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold text-slate-900">Production-Grade Curriculum</h4>
                      <p className="mt-2 text-slate-600 leading-relaxed font-medium">Most courses teach you "how". We teach you "why". Learn the internals that actually matter in production environments.</p>
                    </div>
                  </div>
                  <div className="flex group">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-[24px] bg-white text-postgres-600 shadow-xl shadow-slate-200/50 border border-slate-100 group-hover:scale-110 group-hover:bg-postgres-600 group-hover:text-white transition-all duration-300">
                        <Check className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold text-slate-900">Hinglish Mentorship</h4>
                      <p className="mt-2 text-slate-600 leading-relaxed font-medium">Complex topics like MVCC and WAL are hard. Our localized explanation style ensures you actually understand them.</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="relative group perspective-2000">
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-700 hover:rotate-y-[-5deg] group-hover:shadow-postgres-200/50">
                   <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Students learning" className="w-full h-auto object-cover aspect-[4/3] scale-105 group-hover:scale-110 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                </div>
                
                {/* RE-VAMPED SUPPORT OVERLAY - FROSTED GLASS & EXTENDED SUPPORT */}
                <div className="absolute bottom-10 left-6 right-6 p-8 bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/40 shadow-2xl animate-fade-in-up transform transition-all duration-500 group-hover:translate-y-[-8px]">
                   <div className="flex items-center gap-5 mb-6">
                      <div className="flex-shrink-0 bg-postgres-600 p-4 rounded-2xl text-white shadow-xl shadow-postgres-500/30">
                         <Trophy size={24} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-2xl tracking-tight">Extended Support</h3>
                   </div>
                   
                   <p className="text-slate-600 text-[15px] leading-relaxed font-black mb-8">
                      Our curriculum is precision-tuned to map directly to corporate DBA requirements at top firms.
                   </p>
                   
                   <div className="flex items-center justify-between pt-6 border-t border-slate-900/10">
                      <div className="flex items-center -space-x-3">
                        {[1,2,3].map(i => (
                          <div key={i} className={`h-11 w-11 rounded-full border-[3px] border-white bg-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shadow-sm transition-transform hover:scale-110 hover:z-10`}>
                            {i === 1 ? 'RS' : i === 2 ? 'PP' : i === 2 ? 'AS' : 'AS'}
                          </div>
                        ))}
                        <div className="h-11 w-11 rounded-full border-[3px] border-white bg-postgres-600 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-postgres-200 relative z-20 hover:scale-110 transition-transform">
                          +50
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-sky-50 text-sky-600 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] border border-sky-100 shadow-sm">
                         <ShieldCheck size={14} className="stroke-[3.5]" /> 
                         <span>Expert Mentorship</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="reviews" className="py-20 relative overflow-hidden bg-slate-900 scroll-mt-24">
        {/* Background Marquee */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex justify-between px-8">
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900 z-10"></div>
           
           {[0, 1, 2].map((col) => (
             <div key={col} className="animate-marquee-vertical flex flex-col gap-6 p-4 opacity-[0.07] items-center flex-1">
                {[...SQL_SNIPPETS, ...SQL_SNIPPETS, ...SQL_SNIPPETS].map((snippet, idx) => (
                    <div key={idx} className="flex items-center font-mono text-sm text-postgres-400 whitespace-nowrap">
                       <span className="text-slate-700 mr-4 select-none w-8 text-right opacity-40">{(idx + 1) * 10}</span>
                       <span>{snippet}</span>
                    </div>
                ))}
             </div>
           ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-12">
           <div className="text-center">
             <div className="inline-flex items-center justify-center p-2 bg-slate-800/50 rounded-full mb-4 border border-slate-700/50 backdrop-blur-sm shadow-lg">
                <Terminal className="text-postgres-400 mr-2" size={14} />
                <span className="text-postgres-200 text-xs font-mono flex items-center">
                  postgres_mastery=# SELECT * FROM reviews;<span className="ml-1 w-2 h-4 bg-postgres-400 animate-pulse"></span>
                </span>
             </div>
             <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
               Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-postgres-400 to-indigo-400">Success Stories</span>
             </h2>
             <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
               Don't just take our word for it. See how our curriculum is executing career upgrades across India.
             </p>
           </div>
        </div>

        {/* Marquee */}
        <div className="relative z-20 w-full overflow-x-auto no-scrollbar custom-scrollbar px-4 pb-8">
            <div className="flex space-x-8 animate-marquee-infinite pause-on-hover py-4 min-w-max">
                 {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
                    <div 
                       key={`${item.id}-${idx}`}
                       className="w-[300px] md:w-[450px] flex-shrink-0 group relative bg-slate-800/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-700/50 transition-all duration-300 hover:bg-slate-800/60 hover:border-postgres-500/30 flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-postgres-900/50"
                    >
                       <div className="absolute -top-4 -right-4 text-slate-700/50 group-hover:text-postgres-900/50 transition-colors duration-500">
                          <Quote fill="currentColor" size={120} strokeWidth={0} />
                       </div>
                       <div className="flex space-x-1 mb-6 text-amber-400 relative z-10">
                          {[...Array(5)].map((_, i) => <Star fill="currentColor" key={i} size={16} />)}
                       </div>
                       <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 flex-grow relative z-10 font-medium font-serif italic">
                         "{item.content}"
                       </p>
                       <div className="flex items-center pt-6 border-t border-slate-700/50 relative z-10 mt-auto">
                          <div className="relative">
                            {/* Avatar */}
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center bg-gradient-to-br from-postgres-600 to-indigo-600 text-white font-bold text-base md:text-lg border-2 border-slate-600 group-hover:border-postgres-400 transition-colors relative z-10 shadow-lg">
                               {getInitials(item.name)}
                            </div>
                            <div className="absolute inset-0 bg-postgres-500 rounded-full blur-sm opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                          </div>
                          <div className="ml-4">
                             <h4 className="font-bold text-white text-sm md:text-base">{item.name}</h4>
                             <div className="text-[10px] md:text-xs font-bold text-postgres-400 uppercase tracking-wide">{item.role}</div>
                             <div className="text-[10px] md:text-xs text-slate-500 font-medium flex items-center mt-1">
                                <Briefcase className="mr-1" size={10} />
                                {item.company}
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
            </div>
        </div>
           
        <div className="max-w-7xl mx-auto px-4 relative z-20 text-center">
           <div className="text-postgres-400 text-[10px] font-mono mt-8 flex justify-center items-center opacity-80 animate-pulse tracking-widest uppercase">
              &gt; Hover to pause or manually scroll for more stories_
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(2,132,199,0.05),transparent_70%)]"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-postgres-200/20 rounded-full blur-3xl animate-drift"></div>
           <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-drift" style={{ animationDelay: '-10s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
           <div className="max-w-3xl mx-auto mb-12 transform hover:scale-[1.005] transition-transform duration-300 relative z-20 font-mono text-sm sm:text-base text-left">
              <span className="text-postgres-600 font-bold tracking-wider uppercase text-sm mb-4 block text-center">Frequently Asked Questions</span>
              <div className="bg-[#0c0c0c] text-slate-300 rounded-lg shadow-2xl border border-slate-700/50 p-6 relative">
                 <div className="flex flex-wrap items-center leading-relaxed">
                   <span className="text-postgres-500 font-bold mr-3 select-none">postgres=#</span>
                   <span className="text-purple-400 font-bold mr-2">SELECT</span> 
                   <span className="text-blue-300 mr-2">question, answer</span> 
                   <span className="text-purple-400 font-bold mr-2">FROM</span> 
                   <span className="text-yellow-300">faqs</span>
                 </div>
                 <div className="flex flex-wrap items-center leading-relaxed">
                   <span className="text-postgres-500 font-bold mr-3 select-none">postgres-#</span>
                   <span className="text-purple-400 font-bold mr-2">WHERE</span> 
                   <span className="text-blue-300 mr-2">status</span> 
                   <span className="text-white mr-2">=</span>
                   <span className="text-green-400 mr-2">'active'</span>
                   <span className="text-slate-400 ml-1">;</span>
                   <span className="w-2.5 h-5 bg-slate-400 ml-2 animate-pulse inline-block align-middle"></span>
                 </div>
              </div>
           </div>
           <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="group border border-slate-200 rounded-xl p-6 hover:border-postgres-300 hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm">
                   <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-start">
                     <HelpCircle className="text-postgres-500 mr-3 mt-0.5 flex-shrink-0" size={20} /> 
                     {faq.question}
                   </h3>
                   <p className="text-slate-600 pl-8 leading-relaxed text-sm md:text-base">{faq.answer}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Instructor Bio */}
      <section id="instructor" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-24">
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center relative z-20">Meet Your Instructor</h2>
            <div className="relative flex justify-center items-end select-none transform scale-[0.6] sm:scale-75 md:scale-100 origin-center py-12 md:py-20">
               <span className="text-[18vw] md:text-[14rem] font-black text-slate-800 leading-[0.75] tracking-tighter relative z-0">KARTH</span>
               <div className="flex flex-col items-center -mx-2 md:-mx-6 relative z-10">
                  <div className="w-[18vw] h-[18vw] md:w-44 md:h-44 rounded-full border-4 border-postgres-500 overflow-hidden shadow-2xl shadow-postgres-500/50 z-20 relative">
                     <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Instructor" className="object-cover w-full h-full" />
                  </div>
                  <div className="w-[3.5vw] md:w-10 h-[10vw] md:h-52 bg-slate-800 mt-2 md:mt-6 rounded-sm"></div>
               </div>
               <span className="text-[18vw] md:text-[14rem] font-black text-slate-800 leading-[0.75] tracking-tighter relative z-0">K</span>
            </div>
            <div className="relative z-20 flex flex-col items-center text-center -mt-16 md:-mt-32 px-4">
               <h3 className="text-2xl md:text-5xl font-bold mb-2 tracking-[0.2em] uppercase text-white drop-shadow-lg">Katrotiya</h3>
               <p className="text-postgres-400 font-bold mb-8 tracking-wide uppercase text-xs md:text-base">9+ Years of Corporate Experience (PostgreSQL DBA)</p>
               <blockquote className="text-base md:text-2xl text-slate-300 leading-relaxed max-w-3xl italic font-serif relative">
                 "I have empowered learners to move beyond theory and thrive in high-stakes production environments. My approach is simple: demystify the complex, focus on the concepts, and help you build the confidence to adminstrate the PostgreSQL database system."
               </blockquote>
            </div>
         </div>
      </section>

      {/* Footer - 4 Column Layout */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
             
             {/* Column 1: Brand */}
             <div>
                <div className="flex items-center text-white font-bold text-xl mb-6">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800 mr-2">
                     <Database className="h-5 w-5 text-postgres-500" /> 
                  </div>
                  PostgresMastery
                </div>
                <p className="mb-6 leading-relaxed text-slate-500">
                   Empowering Admins with world-class database education. Learn the concepts, upgrade your skills.
                </p>
                <div className="flex space-x-4">
                   <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                   <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                   <a href="#" className="text-slate-500 hover:text-white transition-colors"><Facebook size={20} /></a>
                </div>
             </div>
             
             {/* Column 2: Courses */}
             <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Our Courses</h4>
                <ul className="space-y-3">
                   <li><a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="hover:text-postgres-400 flex items-center"><ArrowRight size={12} className="mr-2 opacity-50"/> Foundation (L1)</a></li>
                   <li><a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="hover:text-postgres-400 flex items-center"><ArrowRight size={12} className="mr-2 opacity-50"/> Intermediate (L2)</a></li>
                   <li><a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="hover:text-postgres-400 flex items-center"><ArrowRight size={12} className="mr-2 opacity-50"/> Advanced (L3)</a></li>
                   <li><a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="hover:text-postgres-400 flex items-center"><ArrowRight size={12} className="mr-2 opacity-50"/> Expert (L4)</a></li>
                </ul>
             </div>
             
             {/* Column 3: Platform (Fills the gap) */}
             <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Platform</h4>
                <ul className="space-y-3">
                   <li><a href="#syllabus" onClick={(e) => handleNavClick(e, 'syllabus')} className="hover:text-postgres-400">Interactive Syllabus</a></li>
                   <li><button onClick={switchToBlog} className="hover:text-postgres-400 text-left">Engineering Blog</button></li>
                   <li><a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')} className="hover:text-postgres-400">Success Stories</a></li>
                </ul>
             </div>
             
             {/* Column 4: Contact & Legal */}
             <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact & Legal</h4>
                <ul className="space-y-4">
                   <li className="flex items-start">
                      <MapPin size={18} className="mr-3 text-postgres-600 flex-shrink-0 mt-0.5"/> 
                      <span>HSR Layout, Sector 4,<br/>Bangalore, KA 560102</span>
                   </li>
                   <li className="flex items-center">
                      <Mail size={18} className="mr-3 text-postgres-600 flex-shrink-0"/> 
                      <a href="mailto:support@postgresmastery.in" className="hover:text-white">support@postgresmastery.in</a>
                   </li>
                   <li className="pt-4 border-t border-slate-900 flex flex-col space-y-2 text-xs">
                   </li>
                </ul>
             </div>
          </div>
          
          <div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-xs flex flex-col md:flex-row justify-between items-center">
             <p>&copy; {new Date().getFullYear()} PostgresMastery India. All rights reserved.</p>
             <p className="mt-2 md:mt-0">Made with ❤️ in PostgreSQL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
