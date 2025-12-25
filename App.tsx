
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Menu, X, Database, Check, Star, ShieldCheck, Mail, MapPin, 
  ArrowRight, BookOpen as LucideBookOpen, Quote, Terminal, 
  ChevronDown, ChevronRight, Briefcase, HelpCircle, Send, 
  Trophy, Twitter, Linkedin, Facebook, Sparkles, FileText 
} from 'lucide-react';
import { COURSES, TESTIMONIALS, FAQS } from './constants';
import { BookSyllabus } from './components/BookSyllabus';
import { CourseCard } from './components/CourseCard';
import { PostgresShellQuiz } from './components/PostgresShellQuiz';
import { BlogPage } from './components/BlogPage';
import { PurchaseTerminal } from './components/PurchaseTerminal';
import { Course } from './types';

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
    if (newLevels.includes('ALL')) newLevels = [];
    if (newLevels.includes(level)) {
      newLevels = newLevels.filter(l => l !== level);
    } else {
      newLevels.push(level);
    }
    if (newLevels.length === 0) newLevels = ['ALL'];
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

  const getDisplayText = () => {
    if (selectedLevels.includes('ALL')) return "= 'ALL'";
    if (selectedLevels.length === 1) return `= '${selectedLevels[0]}'`;
    return `IN ('${selectedLevels.join("', '")}')`;
  };

  return (
    <div className="relative inline-block mx-1" ref={containerRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="group relative">
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
                    className={`px-3 py-1 rounded-sm text-xs font-bold font-mono transition-all border ${isSelected ? 'bg-green-900/50 text-green-400 border-green-700' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'}`}
                  >
                    {level}
                  </button>
                );
              })}
           </div>
        </div>
      )}
    </div>
  );
};


const App = () => {
  const [activeView, setActiveView] = useState<'home' | 'blog'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBookLevel, setSelectedBookLevel] = useState<string | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStartLevel, setQuizStartLevel] = useState('L1');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseCourse, setPurchaseCourse] = useState<Course | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['ALL']);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const filteredCourses = useMemo(() => {
    let result = [...COURSES];
    if (!selectedLevels.includes('ALL')) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }
    result.sort((a, b) => sortOrder === 'ASC' ? a.price - b.price : b.price - a.price);
    return result;
  }, [selectedLevels, sortOrder]);

  const handleOpenCourse = (level: string) => {
    setActiveView('home');
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

  const scrollToSectionId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveView('home');
    setIsMobileMenuOpen(false);
    setTimeout(() => scrollToSectionId(id), 50);
  };

  const switchToBlog = () => {
    setActiveView('blog');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SQL_SNIPPETS = [
    "SELECT * FROM career_growth WHERE speed = 'FAST';",
    "UPDATE skills SET mastery = true;",
    "CREATE INDEX idx_success ON students(salary);",
    "VACUUM FULL ANALYZE confidence_boost;",
    "COMMIT; -- Career upgrade complete",
    "ALTER TABLE lifestyle ADD COLUMN remote_work BOOLEAN;"
  ];

  if (activeView === 'blog') {
    return <BlogPage onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative text-slate-900 antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blink-sharp {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes marquee-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ripple { animation: ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite; }
        .animate-blink-sharp { animation: blink-sharp 1s step-end infinite; }
        .animate-marquee-infinite { animation: marquee-infinite 60s linear infinite; }
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-2000 { perspective: 2000px; }
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

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-postgres-50 p-2 rounded-lg"><Database className="h-6 w-6 text-postgres-600" /></div>
              <span className="ml-3 text-xl font-bold tracking-tight">Postgres<span className="text-postgres-600">Mastery</span></span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="text-slate-600 hover:text-postgres-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-postgres-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#syllabus" onClick={(e) => handleNavClick(e, 'syllabus')} className="text-slate-600 hover:text-indigo-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Syllabus
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </a>
              <button onClick={switchToBlog} className="text-slate-600 hover:text-purple-600 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </button>
              <a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')} className="text-slate-600 hover:text-amber-500 font-bold transition-all text-sm uppercase tracking-widest relative group py-2">
                Reviews
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </a>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600"><Menu /></button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-32 lg:pb-44 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-postgres-50 text-postgres-800 text-sm font-semibold mb-8 border border-postgres-100 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-postgres-600 mr-2 animate-pulse"></span>
            India's #1 PostgreSQL Learning Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter px-4">
            Master the World's Most<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-postgres-600 via-indigo-600 to-purple-600">Advanced Database</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed px-4 font-medium">
            From architecture deep-dives to high-stakes DBA optimization. 
            The only curriculum in India designed for production-scale engineering.
          </p>
          
          {/* Action Hub - Redesigned for perfect vertical alignment */}
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
            
            {/* Primary Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-4">
              <a href="#courses" onClick={(e) => handleNavClick(e, 'courses')} className="w-full sm:w-auto px-12 py-5 bg-postgres-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-postgres-600/30 hover:bg-postgres-700 transition-all hover:-translate-y-1 flex items-center justify-center">
                View Courses
              </a>
              <a href="#syllabus" onClick={(e) => handleNavClick(e, 'syllabus')} className="w-full sm:w-auto px-12 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-xl hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-lg">
                <LucideBookOpen className="mr-3 h-7 w-7" />
                See Syllabus
              </a>
            </div>

            {/* Discovery Lures - Now perfectly aligned and larger */}
            <div className="w-full px-4 mt-4">
              <div className="flex flex-col md:flex-row items-stretch justify-center bg-white/50 backdrop-blur-xl rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
                
                {/* Blog Lure */}
                <button 
                  onClick={switchToBlog}
                  className="flex-1 group flex items-center p-8 md:p-10 hover:bg-purple-50/50 transition-all duration-300 text-left"
                >
                  <div className="relative w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mr-6 transition-colors duration-500 overflow-visible">
                    <div className="absolute inset-0 bg-purple-400 rounded-2xl animate-ripple opacity-0 group-hover:opacity-100"></div>
                    <FileText size={28} className="text-purple-600 group-hover:text-purple-700 transition-colors z-10" />
                  </div>
                  <div>
                    <div className="flex items-center text-purple-600 font-black text-xs uppercase tracking-[0.25em] mb-2">
                       Engineering Blog <ChevronRight size={14} className="ml-1" />
                    </div>
                    <p className="text-lg md:text-xl font-black text-slate-800 leading-tight">Check out our latest insights</p>
                  </div>
                </button>

                {/* Quiz Lure */}
                <button 
                  onClick={() => handleOpenQuiz('L1')}
                  className="flex-1 group flex items-center p-8 md:p-10 hover:bg-postgres-50/50 transition-all duration-300 text-left"
                >
                  <div className="relative w-16 h-16 rounded-2xl bg-postgres-100 flex items-center justify-center mr-6 transition-colors duration-500 overflow-visible">
                     <div className="absolute inset-0 bg-postgres-400 rounded-2xl animate-ripple opacity-0 group-hover:opacity-100"></div>
                     <Sparkles size={28} className="text-postgres-600 group-hover:text-postgres-700 transition-colors z-10" />
                  </div>
                  <div>
                    <div className="flex items-center text-postgres-600 font-black text-xs uppercase tracking-[0.25em] mb-2">
                       Skill Assessment <ChevronRight size={14} className="ml-1" />
                    </div>
                    <p className="text-lg md:text-xl font-black text-slate-800 leading-tight">
                      <span className="animate-blink-sharp">Test your knowledge now</span>
                    </p>
                  </div>
                </button>

              </div>
            </div>
          </div>
          
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-xs md:text-sm text-slate-500 font-bold px-4 opacity-75">
            <div className="flex items-center bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm"><ShieldCheck className="h-5 w-5 mr-2 text-postgres-600"/> Trusted by Corporate DBAs</div>
            <div className="flex items-center bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm"><Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500"/> 4.4/5 Average Rating</div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-slate-50 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-postgres-600 font-bold tracking-wider uppercase text-sm mb-2 block">Career Paths</span>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">Choose Your Level</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
                <CourseCard 
                  course={course} 
                  onViewSyllabus={() => handleOpenCourse(course.level)}
                  onTakeQuiz={() => handleOpenQuiz(course.level)}
                  onEnroll={() => handleOpenPurchase(course)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus Book Section */}
      <section id="syllabus" className="bg-slate-900 py-20 scroll-mt-24">
        <BookSyllabus 
          selectedLevel={selectedBookLevel} 
          onClose={() => setSelectedBookLevel(null)}
          onSelectLevel={handleOpenCourse}
          onEnroll={handleOpenPurchase}
        />
      </section>

      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-sm font-bold text-white mb-4">&copy; {new Date().getFullYear()} PostgresMastery India. Professional Grade Training.</p>
           <p className="text-xs opacity-50">Designed for DBAs by DBAs.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
