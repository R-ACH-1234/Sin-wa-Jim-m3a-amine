import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { CATEGORIES } from '../data/initialQuestions';
import { soundEffects } from '../utils/audio';
import { Question } from '../types';
import { 
  Database, 
  PlusCircle, 
  Trash2, 
  Edit, 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle, 
  HelpCircle,
  Eye,
  Sliders,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPage() {
  const navigate = useNavigate();
  const { 
    questions, 
    theme, 
    soundEnabled, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    bulkUploadQuestions 
  } = useQuizStore();

  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'upload' | 'stats'>('add');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add/Edit question form fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanationText, setExplanationText] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [stageNumber, setStageNumber] = useState(1);

  // Bulk Upload state
  const [rawJson, setRawJson] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean; msg?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setQuestionText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setCorrectAnswer('');
    setExplanationText('');
    setCategoryId(CATEGORIES[0].id);
    setStageNumber(1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !opt1.trim() || !opt2.trim() || !opt3.trim() || !opt4.trim() || !correctAnswer.trim()) return;

    const optionsArray = [opt1, opt2, opt3, opt4];
    if (!optionsArray.includes(correctAnswer)) {
      if (soundEnabled) soundEffects.playWrong();
      alert('الجواب الصحيح يجب أن يماثل أحد الخيارات الأربعة تماماً!');
      return;
    }

    const payload = {
      question: questionText.trim(),
      options: optionsArray,
      correctAnswer: correctAnswer.trim(),
      explanation: explanationText.trim(),
      category: categoryId,
      stage: Number(stageNumber) || 1
    };

    if (editingId) {
      updateQuestion({ id: editingId, ...payload });
      if (soundEnabled) soundEffects.playFanfare();
      alert('تم تعديل السؤال بنجاح! 💾');
    } else {
      addQuestion(payload);
      if (soundEnabled) soundEffects.playFanfare();
      alert('تمت إضافة السؤال الجديد بنجاح! 🎉');
    }

    resetForm();
    setActiveTab('list');
  };

  const startEditQuestion = (q: Question) => {
    if (soundEnabled) soundEffects.playClick();
    setEditingId(q.id);
    setQuestionText(q.question);
    setOpt1(q.options[0] || '');
    setOpt2(q.options[1] || '');
    setOpt3(q.options[2] || '');
    setOpt4(q.options[3] || '');
    setCorrectAnswer(q.correctAnswer);
    setExplanationText(q.explanation || '');
    setCategoryId(q.category);
    setStageNumber(q.stage || 1);
    
    setActiveTab('add');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('هل أنت متأكد تماماً من رغبتك في حذف هذا السؤال الثقافي؟')) {
      deleteQuestion(id);
      if (soundEnabled) soundEffects.playClick();
    }
  };

  // Drag and Drop handles for JSON uploading
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      readFile(file);
    }
  };

  const fileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawJson(content);
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = () => {
    if (!rawJson.trim()) return;
    const res = bulkUploadQuestions(rawJson);
    if (res.success) {
      if (soundEnabled) soundEffects.playFanfare();
      setUploadStatus({ success: true, msg: `مبارك! تم دمج ورفع عدد ${res.count} سؤال بنجاح لجولات المسابقة.` });
      setRawJson('');
    } else {
      if (soundEnabled) soundEffects.playWrong();
      setUploadStatus({ success: false, msg: res.error || 'صيغة ملف الـ JSON غير مقبولة!' });
    }
  };

  // Sample JSON placeholder for copy paste
  const SAMPLE_JSON = `[
  {
    "question": "كم عدد جهات المملكة المغربية حسب التقسيم الإداري الجديد؟",
    "options": ["12 جهة", "16 جهة", "10 جهات", "14 جهة"],
    "correctAnswer": "12 جهة",
    "explanation": "تم اعتماد تقسيم إداري جديد للمملكة المغربية سنة 2015 يقلص عدد الجهات من 16 إلى 12 جهة ترابية لتنمية اللامركزية.",
    "category": "morocco",
    "stage": 3
  }
]`;

  // Filtered List calculation
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-4 select-none pb-12 text-right">
      
      {/* 1. SECTION HUD TITLE */}
      <div className="flex items-center justify-between border-b border-dashed border-slate-500/20 pb-2">
        <button
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate('/');
          }}
          className="text-xs text-amber-500 hover:text-amber-400 font-bold"
        >
          خروج للرئيسية
        </button>
        <div className="text-right">
          <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>لوحة تحكم أمين الإدارية</h2>
          <p className="text-[10px] opacity-75 mt-0.5">صلاحيات كاملة لإضافة، تصفية ورفع الأسئلة بمصفوفات JSON.</p>
        </div>
      </div>

      {/* 2. ADMIN TAB BAR NAVIGATION */}
      <div className="flex bg-slate-500/5 rounded-xl p-1 gap-1">
        {[
          { tab: 'add', label: 'إضافة سؤال', icon: PlusCircle },
          { tab: 'list', label: 'كل الأسئلة', icon: Database },
          { tab: 'upload', label: 'رفع مصفوفة', icon: Upload },
          { tab: 'stats', label: 'إحصائيات', icon: Sliders }
        ].map((item, i) => {
          const isSelected = activeTab === item.tab;
          const TabIcon = item.icon;
          return (
            <button
               key={i}
               onClick={() => {
                 if (soundEnabled) soundEffects.playClick();
                 setActiveTab(item.tab as any);
               }}
               className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-black text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                 isSelected
                   ? 'bg-amber-500 text-slate-950 shadow'
                   : 'text-slate-400 hover:bg-slate-500/5 hover:text-white'
               }`}
            >
              <TabIcon className="w-3.5 h-3.5 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONDITIONAL TABS CONTENT */}
      <div className="space-y-4 pt-1">
        
        {/* TABS A: ADD OR EDIT QUESTION FORM */}
        {activeTab === 'add' && (
          <form onSubmit={handleFormSubmit} className={`p-4 rounded-2xl border-2 space-y-4 ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-900' : 'bg-white border-slate-150 shadow'
          }`}>
            <h3 className="text-xs font-black text-amber-500">
              {editingId ? 'تحرير السؤال المحدد ✏️' : 'إضافة سؤال ثقافي جديد ➕'}
            </h3>

            {/* Category of question */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-right">
                <label className="block text-[10px] font-bold mb-1 opacity-75">المرحلة (رقم صحيح):</label>
                <input 
                  type="number" 
                  min={1} 
                  required
                  value={stageNumber}
                  onChange={(e) => setStageNumber(Math.max(1, Number(e.target.value)))}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-amber-500 ${
                    theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="text-right">
                <label className="block text-[10px] font-bold mb-1 opacity-75">القسم / التصنيف:</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full p-2.5 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500 leading-tight ${
                    theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-amber-300' : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-right">
              <label className="block text-[10px] font-bold mb-1 opacity-75">نص السؤال الثقافي:</label>
              <textarea 
                required
                rows={3}
                placeholder="مثال: أين يقع قصر البديع التاريخي؟"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className={`w-full p-3 rounded-xl text-xs font-bold font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 select-text ${
                  theme === 'dark'
                    ? 'bg-slate-900 border border-slate-800 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Answers options */}
            <div className="space-y-2.5 text-right">
              <label className="block text-[10px] font-bold opacity-75 leading-none">الخيارات الأربعة (مع تحديد الجائز الصحيح):</label>
              
              {[
                { label: 'الخيار الأول (أ)', setter: setOpt1, val: opt1 },
                { label: 'الخيار الثاني (ب)', setter: setOpt2, val: opt2 },
                { label: 'الخيار الثالث (ج)', setter: setOpt3, val: opt3 },
                { label: 'الخيار الرابع (د)', setter: setOpt4, val: opt4 }
              ].map((f, i) => (
                <div key={i} className="flex space-x-2 space-x-reverse items-center">
                  <input 
                    type="text" 
                    required
                    placeholder={f.label}
                    value={f.val}
                    onChange={(e) => f.setter(e.target.value)}
                    className={`flex-1 p-2.5 rounded-lg text-xs leading-none select-text focus:ring-2 focus:ring-amber-500 ${
                      theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEffects.playTick();
                      setCorrectAnswer(f.val);
                    }}
                    title="عيّن كإجابة صحيحة رئيسية"
                    className={`py-2.5 px-3 rounded-lg text-[10px] font-bold flex items-center space-x-1 space-x-reverse cursor-pointer ${
                      correctAnswer === f.val && f.val !== ''
                        ? 'bg-emerald-500 text-white'
                        : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>صحيحة</span>
                    {correctAnswer === f.val && f.val !== '' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Explanation text */}
            <div className="text-right">
              <label className="block text-[10px] font-bold mb-1 opacity-75">الشرح والتوضيح بعد الإجابة:</label>
              <textarea 
                rows={2}
                placeholder="مثال: يقع قصر البديع الأثري بقلب المدينة العريقة لمراكش الحمراء وبني بطلب من السعديين."
                value={explanationText}
                onChange={(e) => setExplanationText(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs font-bold leading-normal focus:outline-none focus:ring-2 focus:ring-amber-500 select-text ${
                  theme === 'dark'
                    ? 'bg-slate-900 border border-slate-800 text-slate-300'
                    : 'bg-slate-50 border border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex space-x-2 space-x-reverse pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-xl text-xs shadow hover:scale-[1.01] transition-all cursor-pointer"
              >
                {editingId ? 'حفظ تعديلات السؤال' : 'إدخال السؤال لقاعدة البيانات'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </form>
        )}

        {/* TABS B: LIST OF QUESTIONS TABLE CRUD */}
        {activeTab === 'list' && (
          <div className="space-y-3.5">
            {/* Search and filters bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="ابحث بالنص أو الأجوبة الصحيحة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pr-10 pl-3 py-3.5 rounded-xl text-xs font-bold leading-none select-text ${
                    theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
                  }`}
                />
                <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>

              <div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`w-full p-3.5 rounded-xl text-xs font-bold ${
                    theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-amber-300' : 'bg-white border border-slate-200 text-slate-950'
                  }`}
                >
                  <option value="all">كل الأقسام والمواضيع</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions count review */}
            <div className="text-slate-400 text-[10px] font-bold opacity-80 pl-1.5">
              تم العثور على عدد {filteredQuestions.length} سؤال من أصل {questions.length} مجموع أسئلة الكويز بالكامل.
            </div>

            {/* List scrolling board */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-10 opacity-60 text-xs">لا توجد أسئلة تطابق معايير البحث والفرز.</div>
              ) : (
                filteredQuestions.map((q) => (
                  <div 
                    key={q.id}
                    className={`p-3 rounded-xl border flex flex-col space-y-2 text-right ${
                      theme === 'dark' ? 'bg-slate-950/40 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-1.5 space-x-reverse">
                        <button
                          onClick={() => startEditQuestion(q)}
                          title="تعديل هذا السؤال"
                          className="p-1.5 rounded-md bg-slate-500/10 text-amber-500 hover:bg-slate-500/15 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          title="حذف هذا السؤال"
                          className="p-1.5 rounded-md bg-slate-500/10 text-rose-500 hover:bg-[#ef4444]/15 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[9px] opacity-75 font-black uppercase text-amber-400">
                        {CATEGORIES.find(c => c.id === q.category)?.name || q.category} | مرحلة {q.stage}
                      </div>
                    </div>

                    <p className={`text-[11px] font-extrabold font-sans leading-relaxed ${theme === 'dark' ? 'text-amber-100/90' : 'text-slate-950'}`}>
                      {q.question}
                    </p>

                    <div className="text-[10px] font-black opacity-80 flex space-x-1.5 space-x-reverse pr-0.5">
                      <span className="text-emerald-500">الجواب الجائز:</span>
                      <span>{q.correctAnswer}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TABS C: BULK JSON FILE UPLOADER */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            
            {/* Drag drop interactive box */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-slate-500/5 ${
                theme === 'dark' ? 'border-amber-500/20 bg-slate-950/20 text-slate-100' : 'border-emerald-600/30 bg-slate-50/50 text-slate-800'
              }`}
            >
              <Upload className="w-10 h-10 text-slate-400 animate-bounce mx-auto mb-3" />
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".json"
                onChange={fileSelected}
                className="hidden"
              />
              <h4 className="text-xs font-black">اسحب أو حدد ملف JSON للأسئلة الثنائية</h4>
              <p className="text-[9px] opacity-75 mt-1 leading-relaxed max-w-xs mx-auto">
                يدعم التطبيق دمج الأسئلة بالجملة لتوفر أكثر من 1000 كويز ثقافي دفعة واحدة.
              </p>
            </div>

            {/* Content text preview & manual edit text area */}
            <div className="text-right space-y-1.5">
              <label className="block text-[10px] font-bold opacity-75">أو قم بلصق مصفوفة الـ JSON مباشرة بشكل يدوي:</label>
              <textarea 
                rows={6}
                placeholder={SAMPLE_JSON}
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                className={`w-full p-2.5 rounded-xl font-mono text-[10px] select-text tracking-wide whitespace-pre focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  theme === 'dark' ? 'bg-black text-amber-200 border border-slate-800' : 'bg-slate-100 text-slate-900 border border-slate-200'
                }`}
              />
            </div>

            <button
              onClick={handleBulkUpload}
              disabled={!rawJson.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs shadow cursor-pointer"
            >
              دمج ورفع مصفوفة الأسئلة
            </button>

            {/* Display success/error log results */}
            {uploadStatus && (
              <div className={`p-3 rounded-xl border flex items-center space-x-2 space-x-reverse text-right text-xs font-semibold ${
                uploadStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {uploadStatus.success ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <p>{uploadStatus.msg}</p>
              </div>
            )}

            {/* Help instructions block */}
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <div className="flex items-center space-x-1.5 space-x-reverse mb-1.5 text-amber-500">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black">الشروط وصيغة الـ JSON المطلوبة:</span>
              </div>
              <p className="text-[9px] leading-relaxed opacity-80 text-right">
                تأكد أن بنية الأسئلة مطابقة للنموذج التالي ليتم قبول رفعها:
                <br />
                - <strong>question:</strong> نص حقل السؤال الكلي.
                <br />
                - <strong>options:</strong> مصفوفة من أربع خيارات تماماً.
                <br />
                - <strong>correctAnswer:</strong> الخيار المتطابق حرفياً مع الجواب الجائز.
                <br />
                - <strong>category:</strong> يماثل أحد رموز الأقسام (مثال: morocco، general، islamic، sports...).
                <br />
                - <strong>stage:</strong> رقم المرحلة (رقم صحيح: 1، 2...).
              </p>
            </div>

          </div>
        )}

        {/* TABS D: STATISTICAL HEALTH OVERVIEW */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            
            <div className={`p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-black text-right mb-3">حسابات التوزيع للأقسام</h3>
              
              <div className="space-y-2">
                {CATEGORIES.map(cat => {
                  const catQ = questions.filter(q => q.category === cat.id);
                  const stageCount = Array.from(new Set(catQ.map(q => q.stage))).length;

                  return (
                    <div key={cat.id} className="flex justify-between text-xs font-semibold border-b border-slate-500/5 pb-2">
                      <span className="text-slate-400 font-mono font-bold">
                        {catQ.length} أسئلة | {stageCount} مراحل
                      </span>
                      <span className="font-bold">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50'
            }`}>
              <BookOpen className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold mb-1">حجم قاعدة البيانات الحالية</h4>
              <p className="text-[10px] opacity-75">
                تضم الداتابيز الحالية المختزنة بـ LocalStorage ما مجموعه {questions.length} سؤال موزع عبر {CATEGORIES.length} قسماً ثقافياً مختلفاً.
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
