import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { AI_BACKEND_URL } from '@/constants/api';
import Toast from '@/components/common/Toast';
import { hasEndBlock } from '@/hooks/dragDrop/blocksStore';
import FinalResultDialog from '@/components/editor/dialog/FinalResultDialog';
import { useResultStatus } from '@/apis/sidebar/quries/useResultQuery';

import CodeRunIcon from '@/assets/icons/code-run.svg';
import CodeCopyIcon from '@/assets/icons/code-copy.svg';
import CodeDownloadIcon from '@/assets/icons/code-download.svg';

interface CodeProps {
  codeString: string;
  currentStage?: 'pre' | 'model' | 'train' | 'eval';
}

export default function Code({ codeString, currentStage = 'pre' }: CodeProps) {
  const userId = useUserStore(state => state.userId);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');
  const [isRunning, setIsRunning] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  // 평가 결과 준비 상태 폴링 훅 (필요 시 수동 호출로 전환 가능)
  const { data: resultStatus } = useResultStatus({ user_id: userId });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setToastMessage('코드가 클립보드에 복사되었습니다!');
      setToastType('success');
      setShowToast(true);
      console.log('코드가 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      // fallback: textarea 사용
      const textarea = document.createElement('textarea');
      textarea.value = codeString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setToastMessage('코드가 클립보드에 복사되었습니다! (fallback)');
      setToastType('success');
      setShowToast(true);
      console.log('코드가 클립보드에 복사되었습니다. (fallback)');
    }
  };

  const handleDownload = () => {
    if (!codeString || codeString.trim() === '') {
      console.warn('다운로드할 코드가 없습니다.');
      return;
    }

    // 현재 stage에 따라 파일명 결정
    const stageToFilename: Record<string, string> = {
      pre: 'preprocessing.py',
      model: 'model.py',
      train: 'training.py',
      eval: 'evaluation.py',
    };

    const filename = stageToFilename[currentStage] || 'code.py';

    // Blob 생성 및 다운로드
    const blob = new Blob([codeString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRun = async () => {
    if (!codeString || codeString.trim() === '') {
      console.warn('실행할 코드가 없습니다.');
      return;
    }

    if (!userId) {
      console.error('사용자 ID가 필요합니다.');
      return;
    }

    if (isRunning) {
      // 이미 실행 중이면 5초간 실행 중 토스트 표시
      setToastMessage('실행 중입니다...');
      setToastType('info');
      setShowToast(true);
      return;
    }

    // end 블럭이 있는지 확인
    if (!hasEndBlock(currentStage as any)) {
      setToastMessage('실행 종료 블럭을 삽입해야 합니다!');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      setIsRunning(true);

      const formData = new FormData();
      formData.append('user_id', userId);

      const response = await fetch(`${AI_BACKEND_URL}/run/${currentStage}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`실행 실패: ${errorText}`);
      }

      const result = await response.json();
      if (result.ok) {
        console.log(`실행 시작됨, PID: ${result.pid}`);
        // 실행 성공 토스트 표시
        setToastMessage('실행했습니다!');
        setToastType('info');
        setShowToast(true);

        // 평가 단계라면 결과 준비를 폴링 후 자동으로 모달 표시
        if (currentStage === 'eval') {
          // 2초 간격으로 최대 60회(약 2분) 상태 확인
          let attempts = 0;
          const interval = window.setInterval(async () => {
            attempts += 1;
            try {
              const res = await fetch(
                `${AI_BACKEND_URL}/result/status?user_id=${encodeURIComponent(userId)}`,
              );
              if (res.ok) {
                const data = await res.json();
                if (data?.ready) {
                  window.clearInterval(interval);
                  setShowFinal(true);
                }
              }
            } catch (e) {
              // ignore
            }
            if (attempts >= 60) {
              window.clearInterval(interval);
            }
          }, 2000);
        }

        // 5초간 실행 중 상태 유지
        setTimeout(() => {
          setIsRunning(false);
        }, 5000);
      } else {
        console.error('실행 실패:', result.error);
        setIsRunning(false);
      }
    } catch (error) {
      console.error('코드 실행 중 오류:', error);
      setIsRunning(false);
    }
  };

  const CODE_BUTTONS = [
    { icon: CodeRunIcon, alt: 'Run', onclick: handleRun, disabled: isRunning, loading: isRunning },
    { icon: CodeCopyIcon, alt: 'Copy', onclick: handleCopy },
    { icon: CodeDownloadIcon, alt: 'Download', onclick: handleDownload },
  ];

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <section className="w-full h-15 border-b-2px border-[#C3CCD9] flex items-center justify-start gap-5 pl-5 shrink-0">
          {CODE_BUTTONS.map(data => (
            <button
              key={data.alt}
              onClick={data.onclick}
              disabled={data.disabled}
              className={`p-2 rounded-2xl transition-all duration-200 flex justify-center items-center relative ${
                data.disabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-100'
                  : 'hover:bg-[#f0f0f0] hover:scale-105 active:scale-95'
              }`}
              title={data.disabled ? '실행 중입니다...' : data.alt}
            >
              <img
                src={data.icon}
                alt={data.alt}
                className={`${data.loading ? 'opacity-50' : ''}`}
              />
              {data.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          ))}
        </section>
        <section className="w-full flex-1 text-[12px] bg-[#272a36] overflow-auto min-h-0">
          <SyntaxHighlighter language="python" style={dracula}>
            {codeString}
          </SyntaxHighlighter>
        </section>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={toastType === 'info' ? 5000 : 2000}
        type={toastType}
      />

      {showFinal && <FinalResultDialog />}
    </>
  );
}
