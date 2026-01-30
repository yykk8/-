import React, { useState, useEffect } from 'react';
import { Camera, BookOpen, Map, Heart, Menu, X, ChevronRight, Upload, Info, CheckCircle, Search, User, Filter, Home, Image, PenTool, Folder, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react';

/* Trip Notes - High School Field Trip Archive
   Theme: Tokyo Urban x Yamanashi Nature
   Update: Images reset. Added Shibuya, Tokyo Tower, and Mt. Fuji.
*/

// --- Mock Data ---

const INITIAL_POSTS = [
  { id: 1, class: '2-1', author: '匿名', title: 'SDGsと都市開発', content: '東京の再開発地域における緑化率の高さに驚いた。ただビルを建てるだけでなく、風の通り道やヒートアイランド対策が...', likes: 24, date: '2025.10.15', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600' },
  { id: 2, class: '2-3', author: '匿名', title: '山梨の観光資源とデザイン', content: 'フルーツ公園でのフィールドワーク。観光客を呼ぶための「映え」スポット作りと、地元農家との連携について学んだ。', likes: 18, date: '2025.10.16', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600' },
  { id: 3, class: '2-2', author: '匿名', title: '伝統工芸の今', content: '江戸切子の体験。職人さんの「伝統は革新の連続」という言葉が印象に残った。', likes: 32, date: '2025.10.15', image: 'https://images.unsplash.com/photo-1596500965776-88d407336746?auto=format&fit=crop&q=80&w=600' },
  { id: 4, class: '2-5', author: '匿名', title: 'チームビルディング', content: '自由行動でのトラブル。迷子が出た時にどう動くか。計画通りにいかない時の対応力が鍛えられた。', likes: 15, date: '2025.10.17', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600' },
];

const GALLERY_PHOTOS = [
  { id: 101, category: 'scenery', src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600', caption: '東京タワー', likes: 120 },
  { id: 102, category: 'scenery', src: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=600', caption: '東京の街並み', likes: 95 },
  { id: 104, category: 'scenery', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600', caption: '富士山絶景', likes: 112 },
  { id: 105, category: 'smiles', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600', caption: '班別行動！', likes: 67 },
  { id: 109, category: 'scenery', src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=600', caption: '渋谷の夜景', likes: 42 },
];

// --- Styles ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap');
    
    body {
      font-family: 'Noto Sans JP', sans-serif;
      background-color: #f8fafc;
    }
    .font-rounded {
      font-family: 'M PLUS Rounded 1c', sans-serif;
    }
    .glass-panel {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .text-shadow {
      text-shadow: 0 2px 10px rgba(0,0,0,0.4);
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out forwards;
    }
  `}</style>
);

// --- Components ---

const Header = ({ setView, view }) => (
  <header className="fixed top-0 w-full z-50 transition-all duration-300">
    <div className="glass-panel w-full border-b border-white/20">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="font-rounded font-extrabold text-xl tracking-tight text-slate-800 cursor-pointer flex items-center gap-2 group"
          onClick={() => setView('home')}
        >
          <div className="relative">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center text-white text-[10px] shadow-lg group-hover:scale-105 transition-transform font-bold">TN</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Trip Notes</span>
        </div>

        <nav className="hidden md:flex space-x-2">
          {['home', 'archive', 'gallery', 'guide'].map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`px-4 py-2 rounded-full text-sm font-bold font-rounded transition-all ${
                view === item 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-500 hover:bg-white hover:text-cyan-600'
              }`}
            >
              {item === 'home' ? 'ホーム' : item === 'archive' ? '学び' : item === 'gallery' ? '写真' : '旅の軌跡'}
            </button>
          ))}
        </nav>
        
        <button className="p-2 text-slate-400 hover:text-slate-600 bg-white/50 rounded-full">
           <User size={20} />
        </button>
      </div>
    </div>
  </header>
);

const BottomNav = ({ view, setView }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'ホーム' },
    { id: 'archive', icon: PenTool, label: '学び' },
    { id: 'gallery', icon: Image, label: '写真' },
    { id: 'guide', icon: Map, label: '軌跡' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="glass-panel rounded-full shadow-2xl shadow-indigo-900/10 p-2 flex justify-between items-center px-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              view === item.id 
              ? 'text-white bg-slate-800 transform -translate-y-4 shadow-lg ring-4 ring-white' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={20} strokeWidth={view === item.id ? 2.5 : 2} />
            {view !== item.id && <span className="text-[9px] mt-0.5 font-bold">{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { src: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=1600", label: "SHIBUYA", spot: "渋谷スクランブル交差点" },
    { src: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&q=80&w=1600", label: "TOKYO TOWER", spot: "青空に映える東京タワー" },
    { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600", label: "MT. FUJI", spot: "山梨・河口湖からの富士山" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[80vh] md:h-[700px] w-full overflow-hidden rounded-b-[3.5rem] shadow-2xl bg-slate-900">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={slide.src}
            className="w-full h-full object-cover transform scale-100"
            alt={slide.label}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/5" />
        </div>
      ))}
      
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-28 md:pb-24 text-white">
        <div className="max-w-4xl mx-auto animate-fade-in-up text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
             <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold tracking-widest text-white border border-white/30">
               CLASS OF 2025
             </span>
             <div className="h-[1px] w-8 bg-white/30 hidden md:block"></div>
             <span className="text-[10px] md:text-xs font-bold tracking-widest text-white/90 drop-shadow">
               {slides[currentSlide].spot}
             </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-rounded font-extrabold leading-tight mb-6 text-shadow">
            自分たちで作る<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300">
              世界一の修学旅行
            </span>
          </h1>
          <p className="text-slate-100 text-sm md:text-xl max-w-lg mb-8 font-medium leading-relaxed drop-shadow-md opacity-90 mx-auto md:mx-0">
            都会のエネルギー、歴史の息吹、そして自然の静寂。<br/>
            私たちの特別な3日間を振り返る。
          </p>
          
          <div className="flex justify-center md:justify-start gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionTitle = ({ en, jp, color="text-slate-800" }) => (
  <div className="mb-6 px-2">
    <h2 className="text-xs font-bold text-cyan-600 tracking-wider uppercase mb-1 flex items-center gap-2">
      <span className="w-8 h-[1px] bg-cyan-400"></span>
      {en}
    </h2>
    <h3 className={`text-2xl font-rounded font-extrabold ${color}`}>{jp}</h3>
  </div>
);

// --- Page Views ---

const HomeView = ({ setView, posts }) => (
  <div className="animate-fade-in">
    <Hero />
    
    <div className="px-4 max-w-4xl mx-auto space-y-20 -mt-12 relative z-10 pb-32">
      
      {/* 導入 */}
      <section className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden border-white/50">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-rounded font-bold text-slate-800 mb-6 leading-relaxed">
            最高の思い出を、<br/>一生モノの記録に。
          </h3>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            東京・横浜・山梨を巡った修学旅行のデジタルアーカイブ。<br/>
            自分たちが感じたこと、学んだことを自由に綴っています。
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold text-slate-500">
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm"><BookOpen size={20}/></div>
               <span>探究</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm"><Camera size={20}/></div>
               <span>記録</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm"><Map size={20}/></div>
               <span>軌跡</span>
             </div>
          </div>
        </div>
      </section>

      {/* 新着投稿 */}
      <section>
        <div className="flex justify-between items-end mb-4">
           <SectionTitle en="Discover" jp="みんなの発見" />
           <button onClick={() => setView('archive')} className="text-xs font-bold text-blue-600 bg-white shadow-sm border border-slate-100 px-4 py-2 mb-6 rounded-full flex items-center gap-1 hover:bg-blue-50 transition-all">
             もっと読む <ChevronRight size={14} />
           </button>
        </div>
        
        <div className="flex overflow-x-auto gap-5 pb-6 hide-scrollbar -mx-4 px-4">
          {posts.slice(0, 4).map(post => (
            <div key={post.id} onClick={() => setView('archive')} className="min-w-[280px] md:min-w-[320px] bg-white rounded-3xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="relative h-40 w-full mb-4 rounded-2xl overflow-hidden bg-slate-100">
                 <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt=""/>
                 <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-bold text-white bg-blue-600/80 backdrop-blur px-2.5 py-1 rounded-lg">Class {post.class}</span>
                 </div>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-slate-400 block mb-2">{post.date}</span>
                <h4 className="font-bold text-base text-slate-800 leading-snug line-clamp-2 mb-4 h-12">{post.title}</h4>
                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                   <span className="text-xs font-medium text-slate-400">by {post.author}</span>
                   <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                      <Heart size={14} className={post.likes > 20 ? "text-pink-500 fill-pink-500" : ""} /> {post.likes}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ギャラリーハイライト */}
      <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
         <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
         
         <div className="relative z-10 text-center mb-10">
            <h3 className="font-rounded font-extrabold text-3xl mb-3 flex items-center justify-center gap-3">
              <Camera className="text-blue-400" size={32} /> 
              Highlights
            </h3>
            <p className="text-slate-400 text-sm md:text-base">伝統ある下町の風景と、大自然の調和。</p>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-10">
            {GALLERY_PHOTOS.slice(0, 4).map((photo, i) => (
               <div key={photo.id} className={`rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105 ${i === 0 ? 'row-span-2 aspect-[3/4.5]' : 'aspect-square'}`}>
                  <img src={photo.src} className="w-full h-full object-cover" alt="" />
               </div>
            ))}
         </div>

         <button 
           onClick={() => setView('gallery')}
           className="w-full bg-white text-slate-900 font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 text-lg"
         >
           ギャラリーを開く <ArrowRight size={22} />
         </button>
      </section>
    </div>
  </div>
);

const ArchiveView = ({ posts }) => {
  const [filterClass, setFilterClass] = useState('ALL');

  return (
    <div className="animate-fade-in pt-24 px-4 pb-32 max-w-4xl mx-auto">
      <SectionTitle en="Archive" jp="活動の記録" />
      
      <div className="flex overflow-x-auto gap-2 pb-6 hide-scrollbar mb-6">
        <button
           onClick={() => setFilterClass('ALL')}
           className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${filterClass === 'ALL' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
        >
          <Folder size={16} /> すべて
        </button>
        {['2-1', '2-2', '2-3', '2-4', '2-5', '2-6'].map(cls => (
          <button
            key={cls}
            onClick={() => setFilterClass(cls)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shrink-0 ${filterClass === cls ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
          >
             {cls}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.filter(p => filterClass === 'ALL' || p.class === filterClass).map(post => (
          <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all">
             <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Class {post.class}</span>
                <span className="text-[10px] font-medium text-slate-400">{post.date}</span>
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug">{post.title}</h3>
             <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">{post.content}</p>
             
             <div className="w-full h-40 rounded-2xl bg-slate-50 overflow-hidden mb-4">
                <img src={post.image} className="w-full h-full object-cover" alt="" />
             </div>

             <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <span className="text-xs font-medium text-slate-500">by {post.author}</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-full">
                   <Heart size={14} className={post.likes > 20 ? "text-pink-500 fill-pink-500" : ""} /> 
                   <span>{post.likes}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryView = ({ photos }) => {
  const [filterCat, setFilterCat] = useState('all');

  const categories = [
    { id: 'all', label: 'すべて', icon: Image },
    { id: 'scenery', label: '景色', icon: Map },
    { id: 'learning', label: '活動', icon: BookOpen },
    { id: 'smiles', label: '思い出', icon: User },
  ];

  const filtered = filterCat === 'all' ? photos : photos.filter(p => p.category === filterCat);

  return (
    <div className="animate-fade-in pt-24 px-4 pb-32 max-w-5xl mx-auto">
      <SectionTitle en="Gallery" jp="旅の風景" />
      
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCat(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-bold border transition-all ${
              filterCat === cat.id 
              ? 'bg-slate-800 text-white border-transparent shadow-lg' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
            }`}
          >
            {cat.icon && <cat.icon size={14} />}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map(photo => (
          <div key={photo.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-100">
            <img src={photo.src} alt={photo.caption} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white text-xs font-bold">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GuideView = () => (
  <div className="animate-fade-in pt-24 px-4 pb-32 max-w-3xl mx-auto">
    <SectionTitle en="Timeline" jp="旅のルート" />
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 mb-8">
      <div className="space-y-10 relative before:absolute before:left-[15px] before:top-2 before:h-[85%] before:w-[2px] before:bg-slate-100 before:rounded-full">
         {[
           { day: 'Day 1', title: 'Urban Discovery', desc: '東京スカイツリー・浅草・班別研修', color: 'bg-blue-500' },
           { day: 'Day 2', title: 'Art & Science', desc: '国立科学博物館・伝統工芸体験', color: 'bg-indigo-500' },
           { day: 'Day 3', title: 'Nature Connection', desc: '富士山フィールドワーク・山梨', color: 'bg-cyan-500' }
         ].map((item, i) => (
           <div key={i} className="relative pl-12 group">
              <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white shadow-lg ${item.color} z-10`}></div>
              <div className="bg-slate-50 p-5 rounded-2xl group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-slate-100">
                <h4 className="font-black text-slate-400 text-xs mb-1 tracking-widest">{item.day}</h4>
                <p className="font-rounded font-extrabold text-slate-800 text-lg mb-2">{item.title}</p>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-16 px-6 pb-32 md:pb-16 text-xs border-t border-slate-800">
    <div className="max-w-6xl mx-auto text-center">
      <div className="font-rounded font-extrabold text-white text-2xl mb-4 flex items-center justify-center gap-3">
         <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[10px] shadow-lg font-bold">TN</span>
         Trip Notes
      </div>
      <p className="text-slate-500 mb-10 max-w-sm mx-auto tracking-wide">私たちが歩いた、3日間の特別な記録。</p>
      <div className="border-t border-slate-800 pt-10 text-slate-600 font-medium tracking-widest">
        © 2025 Trip Notes Project.
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <FontStyles />
      <Header setView={setView} view={view} />
      
      <main className="min-h-screen bg-[#f8fafc]">
        {view === 'home' && <HomeView setView={setView} posts={INITIAL_POSTS} />}
        {view === 'archive' && <ArchiveView posts={INITIAL_POSTS} />}
        {view === 'gallery' && <GalleryView photos={GALLERY_PHOTOS} />}
        {view === 'guide' && <GuideView />}
      </main>

      <Footer />
      <BottomNav view={view} setView={setView} />
    </div>
  );
}
