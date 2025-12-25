import React, { useState, useMemo } from 'react';
import { INITIAL_BLOGS } from '../constants.ts';
import { BlogPost } from '../types.ts';
import { ArrowLeft, PenTool, Code, Copy, X, Check, Terminal, ChevronRight, Hash, Moon, Sun, ChevronDown } from 'lucide-react';

interface BlogPageProps {
  onBack: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBack }) => {
  const [blogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to Dark Mode
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Editor State
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [editAuthor, setEditAuthor] = useState('Karthik Katrotiya');
  const [editLevel, setEditLevel] = useState('L1');

  // Code Generation State
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Derived Data
  const categories = useMemo(() => {
    const cats = new Set(blogs.map(b => b.category));
    return ['ALL', ...Array.from(cats)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    // 1. Filter
    let result = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // 2. Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [blogs, searchQuery, selectedCategory, sortOrder]);

  const handleGenerateCode = () => {
    const newBlog: BlogPost = {
      id: Date.now().toString(),
      title: editTitle || 'Untitled Post',
      excerpt: editExcerpt || 'No description provided.',
      content: editContent,
      author: editAuthor,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      category: editCategory,
      tags: editTags.split(',').map(t => t.trim()).filter(t => t),
      level: editLevel, 
    };

    const codeString = `
  {
    id: '${newBlog.id}',
    title: '${newBlog.title.replace(/'/g, "\\'")}',
    excerpt: '${newBlog.excerpt.replace(/'/g, "\\'")}',
    content: \`
${newBlog.content.replace(/`/g, "\\`")}
    \`,
    author: '${newBlog.author}',
    date: '${newBlog.date}',
    readTime: '${newBlog.readTime}',
    category: '${newBlog.category}',
    tags: ${JSON.stringify(newBlog.tags)},
    level: '${newBlog.level}'
  },`;

    setGeneratedCode(codeString);
    setShowCodeModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Helper to get level badge color
  const getLevelColor = (level: string, isDark: boolean) => {
    switch(level) {
      case 'L1': return isDark ? 'bg-green-900/40 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
      case 'L2': return isDark ? 'bg-blue-900/40 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'L3': return isDark ? 'bg-purple-900/40 text-purple-400 border-purple-800' : 'bg-purple-100 text-purple-700 border-purple-200';
      case 'L4': return isDark ? 'bg-red-900/40 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200';
      default: return isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600';
    }
  };

  // --- EDITOR VIEW (Kept Standard for Usability) ---
  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 font-sans text-slate-900">
        {/* Code Generation Modal */}
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                   <h3 className="font-bold flex items-center text-slate-800">
                      <Code className="mr-2 text-postgres-600" size={20}/> 
                      Generated Code for constants.ts
                   </h3>
                   <button onClick={() => setShowCodeModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={24} />
                   </button>
                </div>
                
                <div className="p-6 bg-slate-50 overflow-auto flex-grow">
                   <p className="text-slate-600 text-sm mb-4">
                      Copy the code below and paste it into the <code className="bg-slate-200 px-1 rounded text-orange-600">INITIAL_BLOGS</code> array in <code className="bg-slate-200 px-1 rounded text-orange-600">constants.ts</code>.
                   </p>
                   <pre className="text-xs sm:text-sm font-mono text-slate-700 whitespace-pre-wrap break-all bg-white p-4 rounded border border-slate-200 shadow-inner">
                      {generatedCode}
                   </pre>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                   <button 
                     onClick={copyToClipboard}
                     className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all shadow-sm ${copied ? 'bg-green-600 text-white' : 'bg-postgres-600 hover:bg-postgres-700 text-white'}`}
                   >
                      {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                      {copied ? 'Copied!' : 'Copy Code'}
                   </button>
                </div>
             </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-postgres-600 flex items-center font-bold">
              <ArrowLeft size={16} className="mr-2" /> Back to Terminal
            </button>
            <div className="text-xs text-postgres-600 font-mono bg-postgres-50 px-3 py-1 rounded border border-postgres-100">
               MODE: Static Generator
            </div>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Write New Article</h2>
          
          <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-postgres-500 outline-none font-serif text-lg"
                    placeholder="Enter title..."
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Author</label>
                  <input 
                    type="text" 
                    value={editAuthor} 
                    onChange={e => setEditAuthor(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-postgres-500 outline-none"
                  />
               </div>
             </div>
             
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Excerpt</label>
                <textarea 
                  value={editExcerpt} 
                  onChange={e => setEditExcerpt(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-postgres-500 outline-none h-20"
                  placeholder="Summary..."
                />
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                   <select 
                      value={editCategory} 
                      onChange={e => setEditCategory(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg bg-white"
                   >
                      <option>Performance</option>
                      <option>Architecture</option>
                      <option>DevOps</option>
                      <option>Tutorial</option>
                      <option>General</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Level</label>
                   <select 
                      value={editLevel} 
                      onChange={e => setEditLevel(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg bg-white"
                   >
                      <option value="L1">L1 (Foundation)</option>
                      <option value="L2">L2 (Intermediate)</option>
                      <option value="L3">L3 (Advanced)</option>
                      <option value="L4">L4 (Expert)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Tags</label>
                   <input 
                     type="text" 
                     value={editTags} 
                     onChange={e => setEditTags(e.target.value)}
                     className="w-full p-3 border border-slate-200 rounded-lg"
                     placeholder="SQL, Tuning..."
                   />
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Content (HTML)</label>
                <textarea 
                   value={editContent} 
                   onChange={e => setEditContent(e.target.value)}
                   className="w-full p-4 focus:outline-none h-96 font-mono text-sm resize-y border border-slate-200 rounded-lg"
                   placeholder="<p>Write content...</p>"
                />
             </div>

             <div className="flex justify-end pt-6">
                <button 
                  onClick={handleGenerateCode}
                  className="bg-postgres-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-postgres-700 flex items-center shadow-lg"
                >
                   <Code size={18} className="mr-2" /> Generate Code
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SINGLE POST VIEW ---
  if (selectedBlog) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 animate-fade-in font-mono transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-800'}`}>
         <div className="max-w-4xl mx-auto">
            
            {/* Control Bar */}
            <div className="flex justify-between items-center mb-4">
               <button onClick={() => setSelectedBlog(null)} className="flex items-center hover:opacity-70 font-bold transition-opacity">
                   <ArrowLeft size={16} className="mr-2" /> Back to List
               </button>
               <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
               >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>
            </div>

            {/* Terminal Window */}
            <div className={`border-2 rounded-lg overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#0c0c0c] border-slate-700 shadow-2xl' : 'bg-white border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)]'}`}>
               
               {/* Title Bar */}
               <div className={`border-b-2 p-3 flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-[#1a1a1a] border-slate-700' : 'bg-slate-100 border-slate-900'}`}>
                  <div className="flex space-x-2">
                     <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600" onClick={() => setSelectedBlog(null)}></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className={`text-xs font-bold flex items-center uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>
                     <Terminal size={12} className="mr-2" />
                     psql — expanded display
                  </div>
                  <div className="w-10"></div>
               </div>

               {/* Content Area */}
               <div className={`p-8 md:p-12 min-h-[80vh] ${isDarkMode ? 'bg-[#0c0c0c]' : 'bg-white'}`}>
                  
                  {/* Query Simulation */}
                  <div className="mb-8 font-bold text-sm md:text-base">
                     <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-slate-500">postgres=#</span>
                        <span className="text-purple-600 dark:text-purple-400">SELECT</span> <span className="mx-1">*</span> <span className="text-purple-600 dark:text-purple-400">FROM</span> articles <span className="text-purple-600 dark:text-purple-400">WHERE</span> id <span className="mx-1">=</span> <span className="text-green-600 dark:text-green-400">'{selectedBlog.id}'</span>;
                     </div>
                     <div className="text-slate-500 italic font-normal text-xs mb-4">Expanded display is on.</div>
                  </div>

                  {/* Record Display */}
                  <div className="space-y-1 text-sm md:text-base">
                     <div className={`border-b pb-1 mb-4 ${isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}`}>-[ RECORD 1 ]-------------------------</div>
                     
                     <div className="grid grid-cols-[100px_1fr] gap-4 mb-2">
                        <div className="text-slate-500 text-right">title |</div>
                        <div className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedBlog.title}</div>
                     </div>
                     
                     <div className="grid grid-cols-[100px_1fr] gap-4 mb-2">
                        <div className="text-slate-500 text-right">level |</div>
                        <div>
                           <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getLevelColor(selectedBlog.level, isDarkMode)}`}>
                              {selectedBlog.level}
                           </span>
                        </div>
                     </div>

                     <div className="grid grid-cols-[100px_1fr] gap-4 mb-2">
                        <div className="text-slate-500 text-right">author |</div>
                        <div>{selectedBlog.author}</div>
                     </div>

                     <div className="grid grid-cols-[100px_1fr] gap-4 mb-2">
                        <div className="text-slate-500 text-right">date |</div>
                        <div>{selectedBlog.date}</div>
                     </div>

                     <div className="grid grid-cols-[100px_1fr] gap-4 mb-2">
                        <div className="text-slate-500 text-right">tags |</div>
                        <div className="text-blue-500 dark:text-blue-400">{"{" + selectedBlog.tags.join(',') + "}"}</div>
                     </div>

                     <div className="grid grid-cols-[100px_1fr] gap-4 mt-6">
                        <div className="text-slate-500 text-right">content |</div>
                        
                        {/* Article Content */}
                        <div className={`border-l-2 pl-6 py-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                           <article 
                              className={`prose max-w-none 
                              ${isDarkMode ? 'prose-invert' : 'prose-slate'}
                              prose-headings:font-bold prose-headings:font-mono
                              prose-p:font-serif prose-p:leading-loose
                              prose-code:px-1 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                              prose-table:border-collapse prose-table:w-full prose-table:my-4 prose-table:text-sm
                              prose-th:border prose-th:border-slate-600 prose-th:p-2 prose-th:text-left
                              prose-td:border prose-td:border-slate-700 prose-td:p-2`}
                              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 text-slate-500 text-sm font-bold">
                     (1 row)<br/><br/>
                     <div className="flex items-center">
                        <span className="text-slate-500 mr-2">postgres=#</span>
                        <span className={`animate-pulse w-2.5 h-5 block ${isDarkMode ? 'bg-slate-400' : 'bg-slate-900'}`}></span>
                     </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-16 flex justify-end">
                     <button 
                        onClick={() => setSelectedBlog(null)} 
                        className={`flex items-center px-6 py-3 font-bold rounded-sm shadow-lg transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                     >
                        <ChevronRight size={16} className="mr-2" /> \q (Quit to List)
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 font-mono transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-800'}`}>
       <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-6">
             <div>
                <button onClick={onBack} className={`flex items-center font-bold mb-2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                   <ArrowLeft size={16} className="mr-2" /> logout
                </button>
                <div className="text-xs text-slate-500 opacity-70">Last login: {new Date().toLocaleDateString()} on ttys001</div>
             </div>
             
             <div className="flex gap-4">
               <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all border-2 ${isDarkMode ? 'bg-slate-800 border-slate-600 text-yellow-400 hover:border-yellow-400' : 'bg-white border-slate-900 text-slate-600 hover:bg-slate-100'}`}
                  title="Toggle Theme"
               >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>

               <button 
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center px-4 py-2 border-2 transition-all text-sm font-bold active:translate-y-[2px] active:shadow-none
                     ${isDarkMode 
                        ? 'bg-slate-800 border-slate-600 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:border-postgres-400' 
                        : 'bg-white border-slate-900 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'}`}
               >
                  <PenTool size={14} className="mr-2" /> INSERT blog
               </button>
             </div>
          </div>

          {/* Terminal Window */}
          <div className={`border-2 rounded-lg overflow-hidden min-h-[600px] transition-all duration-300 ${isDarkMode ? 'bg-[#0c0c0c] border-slate-700 shadow-2xl' : 'bg-white border-slate-900 shadow-2xl'}`}>
             
             {/* Terminal Header */}
             <div className={`border-b-2 p-3 flex items-center justify-between ${isDarkMode ? 'bg-[#1a1a1a] border-slate-700' : 'bg-slate-100 border-slate-900'}`}>
                <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>karthik@postgres-mastery: ~</div>
                <div className="w-10"></div>
             </div>

             {/* Terminal Body */}
             <div className="p-6 md:p-8">
                {/* Intro Text */}
                <div className="mb-6 text-sm text-slate-500">
                   PostgreSQL 16.2 documentation (blog_db)<br/>
                   Type "help" for help.
                </div>

                {/* Integrated Query and Filters Visualization */}
                <div className={`mb-8 font-bold text-sm md:text-base leading-relaxed p-6 rounded-lg border shadow-inner transition-colors duration-300 relative z-10 ${isDarkMode ? 'bg-[#151515] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                   
                   {/* Line 1 */}
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-slate-500 select-none">postgres=#</span>
                      <span className="text-purple-600 dark:text-purple-400">SELECT</span>
                      <span className="text-blue-500 dark:text-blue-300">id,</span>
                      <span className="text-blue-500 dark:text-blue-300">level,</span>
                      <span className="text-blue-500 dark:text-blue-300">category,</span>
                      <span className="text-blue-500 dark:text-blue-300">title,</span>
                      <span className="text-blue-500 dark:text-blue-300">date</span>
                   </div>

                   {/* Line 2 */}
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pl-12">
                      <span className="text-purple-600 dark:text-purple-400">FROM</span>
                      <span className="text-yellow-600 dark:text-yellow-300">posts</span>
                   </div>

                   {/* Line 3: WHERE with Inline Category Filter */}
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pl-12 relative z-20">
                      <span className="text-purple-600 dark:text-purple-400">WHERE</span>
                      <span className="text-blue-500 dark:text-blue-300">category</span>
                      <span className={`dark:text-white text-slate-900`}>=</span>
                      
                      <div className="relative inline-block group">
                        <select 
                           value={selectedCategory}
                           onChange={(e) => setSelectedCategory(e.target.value)}
                           className={`appearance-none bg-transparent font-bold border-b border-dashed cursor-pointer focus:outline-none pr-8 py-0 transition-colors 
                           ${isDarkMode 
                              ? 'text-green-400 border-slate-600 hover:text-green-300 hover:border-green-400' 
                              : 'text-green-600 border-slate-400 hover:text-green-700 hover:border-green-600'}`}
                        >
                           {categories.map(cat => (
                              <option key={cat} value={cat} className={isDarkMode ? "bg-slate-900 text-slate-300" : "bg-white text-slate-800"}>
                                 '{cat}'
                              </option>
                           ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                   </div>

                   {/* Line 4: AND with Inline Title Search */}
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pl-12 relative z-20">
                      <span className="text-purple-600 dark:text-purple-400">AND</span>
                      <span className="text-blue-500 dark:text-blue-300">title</span>
                      <span className="text-purple-600 dark:text-purple-400">ILIKE</span>
                      <div className={`flex items-center font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                         <span>'%</span>
                         <input 
                            type="text" 
                            maxLength={20}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: `${Math.max(searchQuery.length, 10)}ch` }}
                            className={`bg-transparent border-b border-dashed outline-none font-bold transition-all px-0 mx-0.5 text-center min-w-[80px]
                            ${isDarkMode 
                               ? 'border-slate-600 text-green-400 placeholder-green-400/30 focus:border-green-400' 
                               : 'border-slate-400 text-green-600 placeholder-green-600/30 focus:border-green-600'}`}
                            placeholder="filter_title"
                         />
                         <span>%'</span>
                      </div>
                   </div>

                   {/* Line 5 */}
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pl-12">
                      <span className="text-purple-600 dark:text-purple-400">ORDER BY</span>
                      <span className="text-blue-500 dark:text-blue-300">date</span>
                      
                      <div className="relative inline-block group">
                        <select 
                           value={sortOrder}
                           onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                           className={`appearance-none bg-transparent font-bold border-b border-dashed cursor-pointer focus:outline-none pr-6 py-0 transition-colors 
                           ${isDarkMode 
                              ? 'text-purple-400 border-slate-600 hover:text-purple-300 hover:border-purple-400' 
                              : 'text-purple-600 border-slate-400 hover:text-purple-700 hover:border-purple-600'}`}
                        >
                           <option value="DESC" className={isDarkMode ? "bg-slate-900 text-slate-300" : "bg-white text-slate-800"}>DESC</option>
                           <option value="ASC" className={isDarkMode ? "bg-slate-900 text-slate-300" : "bg-white text-slate-800"}>ASC</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>

                      <span className="text-slate-500">;</span>
                      <span className={`w-2.5 h-5 animate-pulse ml-2 ${isDarkMode ? 'bg-slate-400' : 'bg-slate-900'}`}></span>
                   </div>
                </div>

                {/* Table Header */}
                <div className={`hidden md:grid grid-cols-12 gap-4 border-b-2 pb-2 mb-2 font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-900 text-slate-500'}`}>
                   <div className="col-span-1">id</div>
                   <div className="col-span-1">level</div>
                   <div className="col-span-2">category</div>
                   <div className="col-span-6">title</div>
                   <div className="col-span-2 text-right">date</div>
                </div>

                {/* Table Rows (Blog Items) */}
                <div className="space-y-1">
                   {filteredBlogs.length > 0 ? filteredBlogs.map((blog, idx) => (
                      <div 
                        key={blog.id}
                        onClick={() => setSelectedBlog(blog)}
                        className="group relative cursor-pointer"
                      >
                         {/* Hover Highlight */}
                         <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity -mx-4 px-4 rounded-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                         
                         {/* Desktop Row */}
                         <div className={`hidden md:grid grid-cols-12 gap-4 py-3 relative z-10 items-center text-sm border-b group-hover:border-transparent ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="col-span-1 text-slate-500 font-bold">{blog.id}</div>
                            <div className="col-span-1">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelColor(blog.level, isDarkMode)}`}>
                                  {blog.level}
                               </span>
                            </div>
                            <div className="col-span-2">
                               <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>{blog.category}</span>
                            </div>
                            <div className={`col-span-6 font-bold truncate pr-4 ${isDarkMode ? 'text-slate-300 group-hover:text-postgres-400' : 'text-slate-900 group-hover:text-postgres-700'}`}>
                               {blog.title}
                            </div>
                            <div className="col-span-2 text-right text-slate-500 text-xs">
                               {blog.date}
                            </div>
                         </div>

                         {/* Mobile Card (Fallback) */}
                         <div className={`md:hidden py-4 border-b relative z-10 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelColor(blog.level, isDarkMode)}`}>
                                    {blog.level}
                                 </span>
                                 <span className={`text-xs px-2 py-0.5 rounded font-bold ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-800'}`}>{blog.category}</span>
                               </div>
                               <span className="text-xs text-slate-500">{blog.date}</span>
                            </div>
                            <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{blog.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2">{blog.excerpt}</p>
                         </div>
                      </div>
                   )) : (
                      <div className="py-8 text-center text-slate-500 italic">
                         No results found. (0 rows)
                      </div>
                   )}
                </div>

                {/* Footer Status */}
                <div className="mt-8 text-sm font-bold flex items-center">
                   <span className="text-slate-500">({filteredBlogs.length} rows)</span>
                </div>
                
                <div className="mt-4 flex items-center font-bold">
                   <span className="text-slate-500 mr-2">postgres=#</span>
                   <span className={`w-2.5 h-5 animate-pulse ${isDarkMode ? 'bg-slate-400' : 'bg-slate-900'}`}></span>
                </div>

             </div>
          </div>
       </div>
    </div>
  );
}