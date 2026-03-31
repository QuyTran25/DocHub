import React, { useState, useEffect } from 'react';
import { 
  Folder, Users, Clock, Trash2, Search, Filter, UploadCloud, 
  MoreVertical, Download, Link as LinkIcon, Activity, FileText, 
  Image as ImageIcon, LayoutGrid, List, X, ShieldCheck, User, LogOut,
  Eye, EyeOff, Mail, Lock, Share2, AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// --- MOCK ACCOUNTS ---
const mockAccounts = [
  { id: 1, username: 'akhoa', password: '2110', email: 'akhoa@university.edu', fullName: 'Ạ Khoa', role: 'user' },
  { id: 2, username: 'qtran', password: '2506', email: 'qtran@university.edu', fullName: 'Q Trân', role: 'user' },
  { id: 3, username: 'admin', password: 'admin123', email: 'admin@university.edu', fullName: 'Quản trị viên', role: 'admin' },
];

// --- MOCK DATA ---
const mockFiles =[
  { id: 1, name: 'Giáo trình Cloud Computing.pdf', type: 'pdf', size: '2.4 MB', date: '2026-03-21', status: 'private', tags: ['#CloudComputing', '#AWS'], owner: 'akhoa' },
  { id: 2, name: 'Kiến trúc hệ thống.docx', type: 'docx', size: '1.1 MB', date: '2026-03-20', status: 'private', tags: ['#Architecture', '#Design'], owner: 'akhoa' },
  { id: 3, name: 'Mô hình AWS Topology.png', type: 'image', size: '4.5 MB', date: '2026-03-18', status: 'public', tags: ['#AWS', '#Infrastructure'], owner: 'qtran' },
  { id: 4, name: 'Best Practices React.pdf', type: 'pdf', size: '800 KB', date: '2026-03-15', status: 'public', tags: ['#React', '#Frontend'], owner: 'qtran' },
  { id: 5, name: 'Bài tập thực hành.docx', type: 'docx', size: '1.5 MB', date: '2026-03-19', status: 'private', tags: ['#Bài tập', '#Thực hành'], owner: 'admin' },
];

// --- MOCK SHARED FILES (Được chia sẻ với tôi) ---
// Những file được chia sẻ riêng (không public) thông qua Signed URL hoặc email invite
const mockSharedFiles = [
  { id: 101, name: 'Đề cương ôn thi môn Cloud.pdf', type: 'pdf', size: '3.2 MB', date: '2026-03-20', status: 'private', tags: ['#Ôn thi', '#Cloud'], owner: 'qtran', sharedBy: 'Q Trân', sharedDate: '2026-03-20' },
  { id: 102, name: 'Slide bài 5 - Docker & Kubernetes.pptx', type: 'docx', size: '5.7 MB', date: '2026-03-18', status: 'private', tags: ['#Docker', '#Kubernetes'], owner: 'admin', sharedBy: 'Quản trị viên', sharedDate: '2026-03-19' },
  { id: 103, name: 'Báo cáo Nhóm 3 - AWS Project.docx', type: 'docx', size: '2.1 MB', date: '2026-03-19', status: 'private', tags: ['#GroupProject', '#AWS'], owner: 'akhoa', sharedBy: 'Ạ Khoa', sharedDate: '2026-03-19' },
  { id: 104, name: 'Code mẫu - Lambda Functions.zip', type: 'pdf', size: '1.8 MB', date: '2026-03-17', status: 'private', tags: ['#Code', '#Lambda'], owner: 'admin', sharedBy: 'Quản trị viên', sharedDate: '2026-03-18' },
];

// --- COMPONENTS ---

// 1. Auth Screen - IMPROVED
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const account = mockAccounts.find(acc => acc.username === username && acc.password === password);
    
    if (account) {
      onLogin(account);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (username.length < 3) {
      setError('Tên đăng nhập phải ít nhất 3 ký tự');
      return;
    }
    // Giả lập đăng ký
    alert('Tài khoản đã được tạo. Vui lòng đăng nhập!');
    setIsLogin(true);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <UploadCloud size={32} strokeWidth={2.5} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Cloud Doc Hub</h1>
          </div>
          
          <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">
            {isLogin ? 'Đâu là tài khoản của bạn?' : 'Tạo tài khoản mới'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên đăng nhập</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50" 
                  placeholder="akhoa hoặc qtran" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50" 
                    placeholder="••••••••" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Thử với: <span className="font-mono">akhoa/2110, qtran/2506, admin/admin123</span></p>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 mt-6"
              >
                Đăng nhập
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50" 
                  placeholder="Nguyễn Văn A" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50" 
                  placeholder="name@university.edu" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên đăng nhập</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50" 
                  placeholder="username" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 mt-6"
              >
                Đăng ký
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }} 
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Upload Modal
const UploadModal = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    let interval;
    if (isUploading && progress < 100) {
      interval = setInterval(() => setProgress(p => Math.min(p + 10, 100)), 300);
    } else if (progress === 100) {
      setTimeout(() => { 
        onClose(); 
        setProgress(0); 
        setIsUploading(false);
        setSelectedFile(null);
        setTopic('');
        setHashtags('');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUploading, progress, onClose]);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFile({
        name: file.name,
        size: sizeInMB,
        type: file.type
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="font-bold text-lg text-slate-800">📤 Tải lên tài liệu</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Hidden File Input */}
          <input 
            ref={fileInputRef}
            type="file" 
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          />

          {/* Drag & Drop Area */}
          <div 
            onClick={handleInputClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <UploadCloud size={40} className={`mb-3 transition-colors ${
              isDragActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
            }`} />
            <p className="font-medium text-slate-700">
              {isDragActive ? '📥 Thả file vào đây' : 'Kéo thả file vào đây'}
            </p>
            <p className="text-sm text-slate-500">hoặc click để chọn file</p>
            <p className="text-xs text-slate-400 mt-2">(PDF, Word, Image)</p>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg flex items-center gap-3">
              <FileText className="text-green-600 flex-shrink-0" size={24} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-900">✓ File đã chọn</p>
                <p className="text-sm text-green-700 truncate">{selectedFile.name} ({selectedFile.size} MB)</p>
              </div>
              <button 
                onClick={() => setSelectedFile(null)}
                className="text-green-600 hover:text-green-700 text-lg flex-shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          {/* Topic & Hashtags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Môn học / Chủ đề</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                placeholder="VD: Cloud Computing..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hashtag</label>
              <input 
                type="text" 
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                placeholder="#AWS, #Frontend..." 
              />
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">🔐 Chế độ chia sẻ</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="visibility" 
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">🔒 Riêng tư</p>
                  <p className="text-xs text-slate-500">Chỉ chia sẻ qua link riêng</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="visibility" 
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="w-4 h-4 text-green-600"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">🌐 Công khai</p>
                  <p className="text-xs text-slate-500">Hiển thị trên mục Cộng đồng</p>
                </div>
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">⏳ Đang tải lên...</span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-700">Vui lòng chờ, file đang được đẩy lên AWS S3...</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
          <button 
            onClick={onClose} 
            disabled={isUploading}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={() => setIsUploading(true)} 
            disabled={!selectedFile || isUploading}
            className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <UploadCloud size={16} /> {isUploading ? 'Đang xử lý...' : 'Lưu vào Cloud'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Share Modal (Signed URL)
const ShareModal = ({ isOpen, onClose, file }) => {
  const [access, setAccess] = useState('private');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={20} /> Cấu hình chia sẻ
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <FileText className="text-slate-500" size={24} />
            <div className="truncate flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{file?.name}</p>
              <p className="text-xs text-slate-500">{file?.size}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors border-slate-200">
              <input type="radio" name="access" checked={access === 'public'} onChange={() => setAccess('public')} className="mt-1 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="font-medium text-slate-800">Công khai cộng đồng (StuDocu)</p>
                <p className="text-sm text-slate-500">Mọi người trong hệ thống đều có thể tìm thấy và tải xuống.</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors border-blue-200 bg-blue-50/50">
              <input type="radio" name="access" checked={access === 'private'} onChange={() => setAccess('private')} className="mt-1 text-blue-600 focus:ring-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-slate-800">Riêng tư qua Signed URL (AWS S3)</p>
                <p className="text-sm text-slate-500 mb-2">Chỉ những ai có link bảo mật mới có thể xem.</p>
                {access === 'private' && (
                  <select className="w-full text-sm p-2 border border-slate-300 rounded-md focus:ring-blue-500 outline-none">
                    <option>Hết hạn sau 1 giờ</option>
                    <option>Hết hạn sau 24 giờ</option>
                    <option>Hết hạn sau 7 ngày</option>
                  </select>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <LinkIcon size={16} /> Tạo Link Shared
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Admin Dashboard (CloudWatch Clone)
const AdminDashboard = () => {
  const lineData = {
    labels:['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets:[{
      label: 'Lượt tải xuống',
      data:[120, 190, 300, 250, 400, 450, 600],
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const barData = {
    labels:['PDF', 'Docx', 'Images', 'Others'],
    datasets: [{
      label: 'Dung lượng S3 (GB)',
      data:[45, 20, 85, 10],
      backgroundColor:['#3b82f6', '#10b981', '#f59e0b', '#64748b'],
      borderRadius: 4
    }]
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Admin Monitoring (CloudWatch)</h2>
        <p className="text-slate-500">Giám sát tài nguyên hệ thống và S3 Bucket</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Activity size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tổng API Calls</p>
            <p className="text-2xl font-bold text-slate-800">12,450</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><UploadCloud size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Dung lượng S3 đã dùng (Free Tier)</p>
            <p className="text-2xl font-bold text-slate-800">4.8 GB / 5 GB</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Users</p>
            <p className="text-2xl font-bold text-slate-800">842</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Traffic tải xuống (7 ngày qua)</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Phân bổ S3 Storage theo định dạng</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

// 5. User Management Component (Admin only)
const UserManagement = () => {
  const users = [
    { id: 1, username: 'akhoa', email: 'akhoa@university.edu', fullName: 'Ạ Khoa', joined: '2026-03-15', storage: '1.2 GB', role: 'user' },
    { id: 2, username: 'qtran', email: 'qtran@university.edu', fullName: 'Q Trân', joined: '2026-03-18', storage: '0.8 GB', role: 'user' },
    { id: 3, username: 'admin', email: 'admin@university.edu', fullName: 'Quản trị viên', joined: '2026-03-01', storage: '2.8 GB', role: 'admin' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Quản lý Người dùng</h2>
        <p className="text-slate-500 mt-1">Theo dõi tài khoản và dung lượng lưu trữ của người dùng</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng người dùng</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
            </div>
            <Users size={40} className="text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Dung lượng đã dùng</p>
              <p className="text-3xl font-bold text-green-600 mt-2">4.8 GB</p>
            </div>
            <UploadCloud size={40} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Còn trống (Free Tier)</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">0.2 GB</p>
            </div>
            <Activity size={40} className="text-purple-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Danh sách người dùng hệ thống</h3>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-b border-slate-200">
              <th className="px-6 py-4 text-left font-bold">Tên người dùng</th>
              <th className="px-6 py-4 text-left font-bold">Email</th>
              <th className="px-6 py-4 text-left font-bold">Ngày tham gia</th>
              <th className="px-6 py-4 text-left font-bold">Dung lượng sử dụng</th>
              <th className="px-6 py-4 text-left font-bold">Quyền</th>
              <th className="px-6 py-4 text-right font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, idx) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-red-500 to-red-600'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.fullName}</p>
                      <p className="text-xs text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.joined}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        user.storage.includes('2.8') ? 'bg-red-500 w-11/12' : 
                        user.storage.includes('1.2') ? 'bg-blue-500 w-1/4' : 'bg-green-500 w-1/6'
                      }`}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-12">{user.storage}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 6. Main Application
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('my-docs');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [trashFiles, setTrashFiles] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  const [permissionChange, setPermissionChange] = useState(null);

  const handleLogin = (account) => {
    setCurrentUser(account);
    setIsAuthenticated(true);
    setActiveTab('my-docs');
  };

  const handleLogout = () => {
    setLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('my-docs');
    setLogoutConfirm(false);
  };

  const handleDeleteFile = (file) => {
    setDeleteConfirm(file);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setTrashFiles([...trashFiles, { ...deleteConfirm, deletedAt: new Date() }]);
      setDeleteConfirm(null);
    }
  };

  const handleViewFile = (file) => {
    setFileToView(file);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="text-red-500" size={24} />;
      case 'docx': return <FileText className="text-blue-500" size={24} />;
      case 'image': return <ImageIcon className="text-green-500" size={24} />;
      default: return <FileText className="text-slate-500" size={24} />;
    }
  };

  // Navigation items - Admin có quyền thêm Admin Dashboard
  const navItems = currentUser?.role === 'admin' ? [
    { id: 'my-docs', icon: Folder, label: 'Tài liệu của tôi' },
    { id: 'community', icon: Users, label: 'Cộng đồng' },
    { id: 'shared', icon: Share2, label: 'Được chia sẻ với tôi' },
    { id: 'recent', icon: Clock, label: 'Gần đây' },
    { id: 'trash', icon: Trash2, label: 'Thùng rác' },
    { id: 'users', icon: Users, label: '👥 Quản lý User' },
    { id: 'admin', icon: Activity, label: '🎛️ Quản trị', color: 'text-red-600' },
  ] : [
    { id: 'my-docs', icon: Folder, label: 'Tài liệu của tôi' },
    { id: 'community', icon: Users, label: 'Cộng đồng' },
    { id: 'shared', icon: Share2, label: 'Được chia sẻ với tôi' },
    { id: 'recent', icon: Clock, label: 'Gần đây' },
    { id: 'trash', icon: Trash2, label: 'Thùng rác' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 hidden md:flex flex-col text-white">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg">
            <UploadCloud size={24} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">DocHub</span>
            <p className="text-xs text-slate-400">Cloud Storage</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <button onClick={() => setIsUploadOpen(true)} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            <UploadCloud size={18} /> Tải lên
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-white border-l-4 border-blue-400' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-blue-300' : 'text-slate-400'} />
              <span className="truncate">{item.label}</span>
              {item.id === 'admin' && currentUser?.role === 'admin' && (
                <span className="ml-auto bg-red-600 text-xs px-2 py-0.5 rounded-full font-bold">ADMIN</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="text-sm">
            <p className="font-semibold text-white">{currentUser?.fullName}</p>
            <p className="text-xs text-slate-400">{currentUser?.email}</p>
            {currentUser?.role === 'admin' && (
              <span className="inline-block mt-1 bg-red-600/20 text-red-300 text-xs px-2 py-1 rounded font-semibold">Quản trị viên</span>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-red-600/50 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex-1 max-w-2xl flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu, hashtag..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-2 text-sm font-medium hover:text-slate-900 transition-colors">
              <Filter size={16} /> Lọc
            </button>
          </div>

          <div className="flex items-center gap-4 border-l border-slate-200 pl-6 ml-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser?.role === 'admin' ? '👨‍💼 Quản trị viên' : '👤 Người dùng'}</p>
            </div>
            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-bold border-2 ${
              currentUser?.role === 'admin' 
                ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-300'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300'
            }`}>
              {currentUser?.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {currentUser?.role === 'admin' && (activeTab === 'admin' || activeTab === 'users') ? (
            activeTab === 'admin' ? <AdminDashboard /> : <UserManagement />
          ) : (
            <div className="p-6 max-w-7xl mx-auto">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 capitalize">
                    {navItems.find(i => i.id === activeTab)?.label}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Quản lý và chia sẻ tài liệu học tập của bạn</p>
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')} 
                    className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              {/* File Render */}
              {(() => {
                // Lọc files dựa trên activeTab
                let filesToDisplay = [];
                
                if (activeTab === 'shared') {
                  filesToDisplay = mockSharedFiles;
                } else if (activeTab === 'community') {
                  filesToDisplay = mockFiles.filter(f => f.status === 'public');
                } else if (activeTab === 'my-docs') {
                  filesToDisplay = mockFiles.filter(f => f.owner === currentUser.username);
                } else if (activeTab === 'recent') {
                  filesToDisplay = mockFiles.slice(0, 2); // Giả lập recent
                } else if (activeTab === 'trash') {
                  filesToDisplay = []; // Thùng rác trống
                }

                return (
                  <>
                    {filesToDisplay.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Folder size={48} className="mb-3 opacity-30" />
                        <p className="text-lg font-medium">Không có tài liệu</p>
                        <p className="text-sm">Hãy {activeTab === 'shared' ? 'yêu cầu chia sẻ' : 'tải lên tài liệu'} của bạn</p>
                      </div>
                    ) : (
                      viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filesToDisplay.map(file => (
                    <div key={file.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all group overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                        {getFileIcon(file.type)}
                        <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-800 truncate mb-1 line-clamp-2" title={file.name}>{file.name}</h3>
                        <p className="text-xs text-slate-500 mb-3">{file.size} • {file.date}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {file.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            file.status === 'public' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {file.status === 'public' ? '🌐 Công khai' : '🔒 Riêng tư'}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 flex-wrap">
                          <button onClick={() => handleViewFile(file)} className="flex-1 min-w-12 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 py-2 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200 hover:border-blue-300">
                            <Eye size={12} /> Xem
                          </button>
                          <button onClick={() => setShareFile(file)} className="flex-1 min-w-12 bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 py-2 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200 hover:border-green-300">
                            <LinkIcon size={12} /> Chia sẻ
                          </button>
                          <button onClick={() => setPermissionChange(file)} className="flex-1 min-w-12 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 py-2 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200 hover:border-purple-300">
                            <ShieldCheck size={12} /> Quyền
                          </button>
                          <button onClick={() => handleDeleteFile(file)} className="flex-1 min-w-12 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 py-2 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200 hover:border-red-300">
                            <Trash2 size={12} /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-bold">Tên file</th>
                        <th className="px-6 py-4 font-bold">Kích thước</th>
                        <th className="px-6 py-4 font-bold">Ngày tạo</th>
                        <th className="px-6 py-4 font-bold">Trạng thái</th>
                        <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                          {filesToDisplay.map(file => (
                            <tr key={file.id} className="hover:bg-blue-50/50 transition-colors group">
                              <td className="px-6 py-4 flex items-center gap-3">
                                {getFileIcon(file.type)}
                                <div>
                                  <p className="font-semibold text-slate-800">{file.name}</p>
                                  <p className="text-xs text-slate-500">{file.tags?.join(' ')}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium">{file.size}</td>
                              <td className="px-6 py-4 text-sm">{file.date}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  file.status === 'public' 
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {file.status === 'public' ? '🌐' : '🔒'} {file.status === 'public' ? 'Công khai' : 'Riêng tư'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleViewFile(file)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem"><Eye size={18} /></button>
                                  <button onClick={() => setShareFile(file)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Chia sẻ"><LinkIcon size={18} /></button>
                                  <button onClick={() => setPermissionChange(file)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Quyền"><ShieldCheck size={18} /></button>
                                  <button onClick={() => handleDeleteFile(file)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa"><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                      )
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <ShareModal isOpen={!!shareFile} onClose={() => setShareFile(null)} file={shareFile} />
      
      {/* Logout Confirmation Modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Xác nhận đăng xuất?</h3>
              <p className="text-slate-600">Bạn có chắc muốn đăng xuất khỏi hệ thống không?</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
              <button 
                onClick={() => setLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Xóa tài liệu?</h3>
              <p className="text-slate-600">Tài liệu "<strong>{deleteConfirm.name}</strong>" sẽ được chuyển vào thùng rác</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Chuyển vào thùng rác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {fileToView && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">{fileToView.name}</h3>
              <button onClick={() => setFileToView(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 bg-slate-50 min-h-96 flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                {fileToView.type === 'pdf' ? (
                  <>
                    <FileText size={64} className="text-red-500 mx-auto" />
                    <p className="text-slate-600">📄 PDF Document</p>
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Download size={16} /> Mở trong tab mới
                    </a>
                  </>
                ) : fileToView.type === 'image' ? (
                  <>
                    <ImageIcon size={64} className="text-green-500 mx-auto" />
                    <p className="text-slate-600">💬 Image</p>
                    <a 
                      href="#" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download size={16} /> Xem ảnh
                    </a>
                  </>
                ) : (
                  <>
                    <FileText size={64} className="text-blue-500 mx-auto" />
                    <p className="text-slate-600">📄 Document</p>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download size={16} /> Tải xuống
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Change Modal */}
      {permissionChange && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Thay đổi quyền</h3>
              <button onClick={() => setPermissionChange(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">File: <strong>{permissionChange.name}</strong></p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="radio" name="perm" defaultChecked={permissionChange.status === 'private'} className="w-4 h-4" />
                  <div>
                    <p className="font-medium text-slate-800">🔒 Riêng tư</p>
                    <p className="text-xs text-slate-500">Chỉ bạn xem được</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="radio" name="perm" defaultChecked={permissionChange.status === 'public'} className="w-4 h-4" />
                  <div>
                    <p className="font-medium text-slate-800">🌐 Công khai</p>
                    <p className="text-xs text-slate-500">Mọi người xem được</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
              <button 
                onClick={() => setPermissionChange(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button 
                onClick={() => setPermissionChange(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}