import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/icons/logo.png';
import { useUserStore } from '@/stores/useUserStore';

interface HeaderProps {
  onOpenIdModal?: () => void;
}

export default function Header({ onOpenIdModal }: HeaderProps) {
  const [isIdClicked, setIsIdClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useUserStore(state => state.userId);
  const setUserId = useUserStore(state => state.setUserId);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleDeleteId = () => {
    if (confirm('임시 ID를 정말로 삭제하시겠습니까?')) {
      setUserId(null);
      localStorage.removeItem('demo-user-id');
      if (onOpenIdModal) onOpenIdModal();
    }
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
          {userId ? (
            !isIdClicked ? (
              <button
                onClick={() => setIsIdClicked(true)}
                className="flex items-center gap-2 hover:bg-white/20 rounded-xl px-4 py-2 duration-200 transition"
              >
                <span className="text-sm font-normal text-white bg-gray-500 rounded-2xl px-2 py-1 mr-1">
                  임시 ID:
                </span>
                <strong className="text-white/90">{userId}</strong>
              </button>
            ) : (
              <div
                className="flex items-center gap-4 hover:bg-white/20 rounded-xl px-8 py-4 duration-200 transition"
                onClick={() => setIsIdClicked(false)}
              >
                <button
                  onClick={e => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (onOpenIdModal) {
                      onOpenIdModal();
                    }
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded text-base hover:bg-green-600 transition-colors duration-200"
                >
                  ID 수정
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    handleDeleteId();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded text-base hover:bg-red-600 transition-colors duration-200"
                >
                  ID 삭제
                </button>
              </div>
            )
          ) : (
            <button
              onClick={onOpenIdModal}
              className="h-[72px] px-4 text-white/80 hover:text-white hover:border-b-2 hover:border-white/60 transition-all duration-200"
            >
              로그인
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
