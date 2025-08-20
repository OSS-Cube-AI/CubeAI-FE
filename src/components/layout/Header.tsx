import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/icons/logo.png';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-sky-500">
      <div className="mx-auto max-w-100% px-6 py-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="큐브 AI 로고"
            className="h-4 w-20 object-contain cursor-pointer"
            onClick={() => handleNavigation('/')}
          />
        </div>
        <nav className="hidden md:flex items-center gap-[57px] text-white text-xl font-bold">
          <button
            onClick={() => handleNavigation('/')}
            className={`h-[72px] px-4 transition-all duration-200 ${
              isActive('/')
                ? 'text-white border-b-2 border-white'
                : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/60'
            }`}
          >
            커리큘럼
          </button>
          <button
            onClick={() => handleNavigation('/editor')}
            className={`h-[72px] px-4 transition-all duration-200 ${
              isActive('/editor')
                ? 'text-white border-b-2 border-white'
                : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/60'
            }`}
          >
            프로젝트
          </button>
          <button className="h-[72px] px-4 text-white/80 hover:text-white hover:border-b-2 hover:border-white/60 transition-all duration-200">
            로그인
          </button>
        </nav>
      </div>
    </header>
  );
}
