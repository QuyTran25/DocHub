import React, { useState, useEffect } from 'react';
import { 
  Folder, Users, Clock, Trash2, Search, Filter, UploadCloud, 
  MoreVertical, Download, Link as LinkIcon, FileText, 
  Image as ImageIcon, LayoutGrid, List, X, ShieldCheck, User, LogOut,
  Eye, EyeOff, Mail, Lock, Share2, AlertCircle, Bell, Settings
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
];

// --- MOCK DATA ---
const mockFiles =[
  { id: 1, name: 'Giáo trình Cloud Computing.pdf', type: 'pdf', size: '2.4 MB', date: '2026-03-21', status: 'private', tags: ['#CloudComputing', '#AWS'], owner: 'akhoa' },
  { id: 2, name: 'Kiến trúc hệ thống.docx', type: 'docx', size: '1.1 MB', date: '2026-03-20', status: 'private', tags: ['#Architecture', '#Design'], owner: 'akhoa' },
  { id: 3, name: 'Mô hình AWS Topology.png', type: 'image', size: '4.5 MB', date: '2026-03-18', status: 'public', tags: ['#AWS', '#Infrastructure'], owner: 'qtran' },
  { id: 4, name: 'Best Practices React.pdf', type: 'pdf', size: '800 KB', date: '2026-03-15', status: 'public', tags: ['#React', '#Frontend'], owner: 'qtran' },
];

// --- MOCK SHARED FILES (Được chia sẻ với tôi) ---
// Những file được chia sẻ riêng (không public) thông qua Signed URL hoặc email invite
const mockSharedFiles = [
  { id: 101, name: 'Đề cương ôn thi môn Cloud.pdf', type: 'pdf', size: '3.2 MB', date: '2026-03-20', status: 'private', tags: ['#Ôn thi', '#Cloud'], owner: 'qtran', sharedBy: 'Q Trân', sharedDate: '2026-03-20' },
  { id: 102, name: 'Slide bài 5 - Docker & Kubernetes.pptx', type: 'docx', size: '5.7 MB', date: '2026-03-18', status: 'private', tags: ['#Docker', '#Kubernetes'], owner: 'qtran', sharedBy: 'Q Trân', sharedDate: '2026-03-19' },
  { id: 103, name: 'Báo cáo Nhóm 3 - AWS Project.docx', type: 'docx', size: '2.1 MB', date: '2026-03-19', status: 'private', tags: ['#GroupProject', '#AWS'], owner: 'akhoa', sharedBy: 'Ạ Khoa', sharedDate: '2026-03-19' },
];

// --- COMPONENTS ---

// 1. Landing Page - Trang chủ
const LandingPage = ({ onGetStarted, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-indigo-900/60 backdrop-blur-sm"
        style={{ backgroundColor: '#120368' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">DocHub</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#23A0E3] hover:text-white"
            >
              Đăng nhập
            </button>
            <button
              onClick={onGetStarted}
              className="rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#23A0E3] hover:text-white"
            >
              Tạo tài khoản
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-slate-900">
              Chia sẻ tài liệu <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #120368, #120368)' }}>một cách dễ dàng</span>
            </h1>
            <p className="text-xl text-slate-600">
              DocHub giúp bạn lưu trữ, quản lý và chia sẻ tài liệu trên cloud. An toàn, nhanh chóng và hiệu quả.
            </p>
            <div className="flex gap-4">
              <button onClick={onGetStarted} className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white hover:shadow-lg transition" style={{ background: '#120368' }}>
                Bắt đầu miễn phí
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition">
                Xem demo
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-xl shadow-blue-100/60">
              <img
                src="/images/cloud-doc-hub-intro.png"
                alt="Minh họa hệ thống cloud chia sẻ tài liệu"
                className="h-auto w-full max-w-sm rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Tính năng nổi bật</h2>
            <p className="mt-2 text-slate-600">Một thứ bạn cần để quản lý tài liệu học tập quả</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '☁️', title: 'Lưu trữ trên Cloud', desc: 'Lưu trữ không giới hạn với bảo mật AWS S3' },
              { icon: '🔒', title: 'Bảo mật hàng đầu', desc: 'Mã hóa end-to-end và kiểm soát truy cập' },
              { icon: '🔗', title: 'Chia sẻ dễ dàng', desc: 'Chia sẻ với link bảo mật hoặc công khai' },
              { icon: '👥', title: 'Quản lý quyền hạn', desc: 'Kiểm soát chính xác ai có thể xem gì' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Định giá đơn giản</h2>
          <p className="mt-2 text-slate-600">Chọn gói phù hợp với nhu cầu của bạn</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { name: 'Miễn phí', price: '$0', features: ['5GB dung lượng', 'Chia sẻ với 5 người', 'Hộ trợ cơ bản'] },
            { name: 'Pro', price: '$9.99', popular: true, features: ['100GB dung lượng', 'Chia sẻ không giới hạn', 'Hộ trợ ưu tiên', 'Truy cập'] },
            { name: 'Enterprise', price: 'Liên hệ', features: ['Dung lượng không giới hạn', 'Hộ trợ 24/7', 'Tính năng tùy chỉnh'] },
          ].map((plan, i) => (
            <div key={i} className={`rounded-2xl border-2 p-8 ${plan.popular ? 'border-blue-600 bg-gradient-to-b from-blue-50 to-white' : 'border-slate-200 bg-white'}`}>
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-3 text-3xl font-bold text-slate-900">{plan.price}<span className="text-lg text-slate-500">/tháng</span></div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-blue-600">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full rounded-lg py-2.5 font-semibold transition ${plan.popular ? 'text-white hover:opacity-90' : 'border border-slate-300 text-slate-900 hover:bg-slate-50'}`} style={plan.popular ? { background: '#120368' } : {}}>
                {plan.name === 'Enterprise' ? 'Liên hệ' : 'Bắt đầu'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 py-16 text-white" style={{ background: '#120368' }}>
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold">Sẵn sàng bắt đầu?</h2>
          <p className="mt-4">Tạo tải khoản miễn phí ngay hôm nay và bắt đầu chia sẻ tài liệu</p>
          <button onClick={onGetStarted} className="mt-6 rounded-lg bg-white px-8 py-3 font-semibold hover:bg-slate-100 transition" style={{ color: '#120368' }}>
            Tạo tài khoản
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-600">
          <p>© 2026 DocHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

// 2. Auth Screen - Split Screen Login/Register
const AuthScreen = ({ onLogin, onBackHome, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(initialMode !== 'register');
  }, [initialMode]);

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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left - Form */}
      <div className="flex bg-white flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <button
            type="button"
            onClick={onBackHome}
            className="mb-6 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-2xl font-black text-[#120368] transition hover:bg-slate-50"
          >
            ←
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#23A0E3] text-white font-bold text-lg">
              D
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">DocHub</p>
              <h1 className="text-2xl font-bold text-slate-900">Cloud Storage</h1>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-slate-900">
            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            {isLogin ? 'Quản lý và chia sẻ tài liệu của bạn để đăng' : 'Bắt đầu quản lý tài liệu của bạn ngay hôm nay'}
          </p>

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
                <p className="text-xs text-slate-500 mt-1">Thử: akhoa/2110 hoặc qtran/2506</p>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>Nhớ mật khẩu</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Quên mật khẩu?</a>
              </div>
              <button 
                type="submit" 
                className="mt-6 w-full rounded-lg bg-[#23A0E3] py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90"
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
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng và Chính sách bảo mật</a></span>
              </label>
              <button 
                type="submit" 
                className="mt-6 w-full rounded-lg bg-[#23A0E3] py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90"
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

      {/* Right - Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-12">
        <div className="text-center space-y-6 max-w-md">
          <img
            src="/images/auth-cloud-illustration.png"
            alt="Minh họa hạ tầng cloud"
            className="mx-auto h-auto w-full max-w-sm"
          />
          <h3 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Chia sẻ tài liệu dễ dàng' : 'Bắt đầu miễn phí'}
          </h3>
          <p className="text-slate-600">
            {isLogin 
              ? 'Lưu trữ, chia sẻ và quản lý tài liệu của bạn trên cloud một cách an toàn và hiệu quả.'
              : 'Không cần thẻ tín dụng. Tạo tài khoản ngay và bắt đầu chia sẻ kiến thức cùng nhóm.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. Upload Modal
const UploadModal = ({ isOpen, onClose, onUploaded, currentUser }) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    let interval;
    if (isUploading && progress > 0 && progress < 100) {
      interval = setInterval(() => setProgress(p => Math.min(p + 10, 100)), 300);
    } else if (progress === 100) {
      setTimeout(() => { 
        onClose(); 
        setProgress(0); 
        setIsUploading(false);
        setSelectedFile(null);
        setTopic('');
        setHashtags('');
        setUploadError('');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUploading, progress, onClose]);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFile({
        rawFile: file,
        name: file.name,
        size: sizeInMB,
        type: file.type
      });
      setUploadError('');
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

  const formatSize = (sizeInBytes) => {
    if (!sizeInBytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
  };

  const handleUpload = async () => {
    if (!selectedFile?.rawFile) {
      setUploadError('Vui lòng chọn file trước khi tải lên');
      return;
    }

    try {
      setUploadError('');
      setIsUploading(true);
      setProgress(10);

      const formData = new FormData();
      formData.append('file', selectedFile.rawFile);
      formData.append('isPublic', String(isPublic));
      formData.append('topic', topic);
      formData.append('hashtags', hashtags);
      if (currentUser?.id) {
        formData.append('ownerId', String(currentUser.id));
      }

      const response = await fetch('http://localhost:8080/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(80);

      const rawBody = await response.text();
      let responseBody = {};
      if (rawBody) {
        try {
          responseBody = JSON.parse(rawBody);
        } catch {
          responseBody = { message: rawBody };
        }
      }

      if (!response.ok) {
        throw new Error(responseBody?.message || 'Upload thất bại');
      }

      setProgress(100);

      const normalizedFile = {
        id: responseBody.id,
        name: responseBody.fileName,
        type: responseBody.fileType,
        size: formatSize(responseBody.fileSize),
        date: responseBody.createdAt ? responseBody.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        status: responseBody.isPublic ? 'public' : 'private',
        tags: responseBody.hashtags
          ? responseBody.hashtags.split(',').map(tag => tag.trim()).filter(Boolean)
          : [],
        ownerId: responseBody.ownerId,
        owner: currentUser?.username,
      };
      onUploaded?.(normalizedFile);
    } catch (error) {
      setIsUploading(false);
      setProgress(0);
      setUploadError(error.message || 'Không thể tải lên file');
    }
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
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group`}
            style={isDragActive ? { borderColor: '#120368', background: '#E0EAFA' } : { borderColor: 'rgb(203, 213, 225)', background: 'transparent' }}
          >
            <UploadCloud size={40} className="mb-3 transition-colors" style={isDragActive ? { color: '#120368' } : { color: 'rgb(148, 163, 184)' }} />
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

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {uploadError}
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
                  className="h-3 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%`, background: '#120368' }}
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
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 transition-all"
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
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-\[#120368\] rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <LinkIcon size={16} /> Tạo Link Shared
          </button>
        </div>
      </div>
    </div>
  );
};



// 6. Main Application
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [activeTab, setActiveTab] = useState('my-docs');
  const [viewMode, setViewMode] = useState('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [trashFiles, setTrashFiles] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  const [permissionChange, setPermissionChange] = useState(null);
  const [files, setFiles] = useState([]);

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

  const handleViewFile = async (file) => {
    if (!file?.id) {
      alert('Không thể mở file này vì thiếu mã định danh (id).');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/documents/${file.id}/preview-url`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không lấy được link xem file.');
      }

      const body = await response.json();
      if (!body?.url) {
        throw new Error('Backend không trả về URL xem file hợp lệ.');
      }

      window.open(body.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      alert(`Mở file thất bại: ${error.message}. Vui lòng khởi động lại backend để cập nhật API mới rồi thử lại.`);
    }
  };

  const handleUploadedFile = (newFile) => {
    setFiles((prevFiles) => [newFile, ...prevFiles]);
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      return;
    }

    const toDisplayFile = (doc) => {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = doc.fileSize || 0;
      let unitIndex = 0;
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
      }

      return {
        id: doc.id,
        name: doc.fileName,
        type: doc.fileType || 'unknown',
        size: `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`,
        date: doc.createdAt ? doc.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        status: doc.isPublic ? 'public' : 'private',
        tags: doc.hashtags ? doc.hashtags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        ownerId: doc.ownerId,
        owner: doc.ownerId === currentUser.id ? currentUser.username : `user-${doc.ownerId}`,
      };
    };

    const loadDocuments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/documents');
        if (!response.ok) {
          throw new Error('Cannot load documents');
        }
        const docs = await response.json();
        setFiles(Array.isArray(docs) ? docs.map(toDisplayFile) : []);
      } catch {
        setFiles(mockFiles);
      }
    };

    loadDocuments();
  }, [isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    if (authMode) {
      return <AuthScreen onLogin={handleLogin} onBackHome={() => setAuthMode(null)} initialMode={authMode} />;
    }
    return <LandingPage onGetStarted={() => setAuthMode('register')} onLoginClick={() => setAuthMode('login')} />;
  }

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="text-red-500" size={24} />;
      case 'docx': return <FileText className="text-blue-500" size={24} />;
      case 'image': return <ImageIcon className="text-green-500" size={24} />;
      default: return <FileText className="text-slate-500" size={24} />;
    }
  };

  // Navigation items
  const navItems = [
    { id: 'my-docs', icon: Folder, label: 'Tài liệu của tôi' },
    { id: 'community', icon: Users, label: 'Cộng đồng' },
    { id: 'shared', icon: Share2, label: 'Được chia sẻ với tôi' },
    { id: 'recent', icon: Clock, label: 'Gần đây' },
    { id: 'trash', icon: Trash2, label: 'Thùng rác' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white hidden md:flex flex-col text-slate-800 border-r border-slate-200">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200">
          <div className="rounded-lg" style={{ background: '#120368' }}>
            <UploadCloud size={24} strokeWidth={2.5} className="text-white p-2" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">DocHub</span>
            <p className="text-xs text-slate-500">Cloud Storage</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <button onClick={() => setIsUploadOpen(true)} className="w-full text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all" style={{ background: '#120368' }}>
            <UploadCloud size={18} /> Tải lên
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all border-l-4"
              style={activeTab === item.id ? { background: '#E0EAFA', borderLeftColor: '#120368', color: '#120368' } : { borderLeftColor: 'transparent', color: 'rgb(75, 85, 99)' }}
            >
              <item.icon size={18} style={activeTab === item.id ? { color: '#120368' } : { color: '#9CA3AF' }} />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="text-sm">
            <p className="font-semibold text-slate-900">{currentUser?.fullName}</p>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: '#120368' }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Welcome back,</p>
            <p className="text-2xl font-bold text-slate-900">{currentUser?.fullName}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-80 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu, hashtag..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-\[#120368\] focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg hover:text-slate-900 transition-colors" title="Notifications">
                <Bell size={20} />
              </button>
              <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg hover:text-slate-900 transition-colors" title="Settings">
                <Settings size={20} />
              </button>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold border-2`} style={{ background: '#120368', borderColor: '#E0EAFA' }}>
                {currentUser?.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-full mx-auto">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 capitalize">
                    {navItems.find(i => i.id === activeTab)?.label}
                  </h1>
                  <p className="text-sm text-slate-600 mt-2">Quản lý và chia sẻ tài liệu học tập của bạn</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-2.5 rounded-md transition-all ${viewMode === 'grid' ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                style={viewMode === 'grid' ? { background: '#120368' } : {}}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')} 
                    className={`p-2.5 rounded-md transition-all ${viewMode === 'table' ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                style={viewMode === 'table' ? { background: '#120368' } : {}}
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
                  filesToDisplay = files.filter(f => f.status === 'public');
                } else if (activeTab === 'my-docs') {
                  filesToDisplay = files.filter(f => (f.ownerId && f.ownerId === currentUser.id) || f.owner === currentUser.username);
                } else if (activeTab === 'recent') {
                  filesToDisplay = files.slice(0, 2);
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filesToDisplay.map(file => (
                    <div key={file.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-\[#120368\] transition-all group overflow-hidden">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                        {getFileIcon(file.type)}
                        <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-slate-900 truncate mb-2 line-clamp-2" title={file.name}>{file.name}</h3>
                        <p className="text-sm text-slate-600 mb-4">{file.size} • {file.date}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {file.tags?.slice(0, 2).map(tag => (
                            <span className={`text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium`} style={{ background: '#E0EAFA', color: '#120368' }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full`} style={{
                            background: file.status === 'public' ? '#E0EAFA' : 'rgb(243, 244, 246)',
                            color: file.status === 'public' ? '#120368' : 'rgb(55, 65, 81)'
                          }}>
                            {file.status === 'public' ? '🌐 Công khai' : '🔒 Riêng tư'}
                          </span>
                          <span className="text-xs text-slate-500">24 downloads</span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 flex-wrap">
                          <button onClick={() => handleViewFile(file)} className="flex-1 min-w-12 bg-slate-50 py-2.5 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200" style={{ color: '#120368' }} onMouseEnter={(e) => e.currentTarget.style.background = '#E0EAFA'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgb(248, 250, 252)'}>
                            <Eye size={12} /> Xem
                          </button>
                          <button onClick={() => setShareFile(file)} className="flex-1 min-w-12 bg-slate-50 py-2.5 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200" style={{ color: '#120368' }} onMouseEnter={(e) => e.currentTarget.style.background = '#E0EAFA'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgb(248, 250, 252)'}>
                            <LinkIcon size={12} /> Chia sẻ
                          </button>
                          <button onClick={() => setPermissionChange(file)} className="flex-1 min-w-12 bg-slate-50 py-2.5 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200" style={{ color: '#120368' }} onMouseEnter={(e) => e.currentTarget.style.background = '#E0EAFA'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgb(248, 250, 252)'}>
                            <ShieldCheck size={12} /> Quyền
                          </button>
                          <button onClick={() => handleDeleteFile(file)} className="flex-1 min-w-12 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 py-2.5 rounded text-xs font-medium flex justify-center items-center gap-1 transition-colors border border-slate-200 hover:border-red-300">
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
        </div>
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={handleUploadedFile}
        currentUser={currentUser}
      />
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
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
                style={{ background: '#120368' }}
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
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: '#E0EAFA' }}>
                <Trash2 size={24} style={{ color: '#120368' }} />
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
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
                style={{ background: '#120368' }}
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
                className="px-4 py-2 text-sm font-medium text-white bg-\[#120368\] rounded-lg hover:bg-teal-700"
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
