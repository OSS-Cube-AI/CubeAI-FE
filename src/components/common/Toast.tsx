import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'info' | 'warning';
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 2000,
  type = 'success',
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  // 타입에 따른 스타일 결정
  const getToastStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'success':
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'success':
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div
        className={`${getToastStyles()} px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300`}
      >
        <div className="w-8 h-8">{getIcon()}</div>
        <span className="text-lg font-medium">{message}</span>
      </div>
    </div>
  );
}
