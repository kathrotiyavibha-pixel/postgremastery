
import React from 'react';
import { Course } from '../types.ts';
import { Clock, CheckCircle, Trophy, IndianRupee, BookOpen, Terminal, ShoppingCart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onViewSyllabus: () => void;
  onTakeQuiz: () => void;
  onEnroll: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onViewSyllabus, onTakeQuiz, onEnroll }) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 h-full">
      {/* Header - Fixed height only for Title and Level to ensure clean alignment */}
      <div className={`${course.color} p-6 text-white relative overflow-hidden h-[140px] flex flex-col justify-center`}>
         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Trophy size={60} />
         </div>
         
         <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-semibold mb-2 tracking-widest uppercase backdrop-blur-sm">
                {course.level} COURSE
            </span>
            <h3 className="text-xl md:text-2xl font-bold leading-tight whitespace-pre-line break-words">
              {course.title}
            </h3>
         </div>
      </div>
      
      {/* Body Area */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Target Audience - Refined styling with 'Ideal for:' and no uppercase */}
        <div className="h-[48px] mb-4 flex items-start">
           <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2">
             <span className="text-slate-800 font-bold">Ideal for:</span> {course.targetAudience}
           </p>
        </div>

        <div className="flex items-center mb-6">
          <IndianRupee className="text-slate-800" size={20} />
          <span className="text-2xl md:text-3xl font-bold text-slate-800 ml-1">{course.price.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-500 ml-2 font-bold uppercase bg-green-100 text-green-700 px-2 py-1 rounded">Great Value</span>
        </div>

        {/* Description - Fixed height for alignment */}
        <p className="text-slate-600 text-sm mb-6 leading-relaxed h-[60px] line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center text-slate-500 text-xs md:text-sm mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
           <Clock size={16} className="mr-2 text-postgres-500" />
           <span className="font-medium">{course.duration}</span>
        </div>

        <div className="mb-6">
           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Modules</h4>
           <ul className="space-y-2">
             {course.skills.slice(0, 3).map((skill, idx) => (
               <li key={idx} className="flex items-start text-xs md:text-sm text-slate-700">
                 <CheckCircle size={14} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                 <span className="truncate">{skill}</span>
               </li>
             ))}
           </ul>
        </div>

        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onViewSyllabus}
              className={`w-full py-3 rounded-xl font-bold text-white transition-colors flex items-center justify-center ${course.color.replace('bg-', 'bg-').replace('600', '700')} hover:opacity-90 shadow-md text-xs`}
            >
              <BookOpen size={14} className="mr-1.5" />
              Syllabus
            </button>
            <button 
              onClick={onEnroll}
              className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-black transition-colors flex items-center justify-center shadow-md text-xs"
            >
              <ShoppingCart size={14} className="mr-1.5" />
              Enroll
            </button>
          </div>
          
          <button 
            onClick={onTakeQuiz}
            className="w-full py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center text-xs"
          >
            <Terminal size={16} className="mr-2 text-slate-500" />
            Take Skill Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
