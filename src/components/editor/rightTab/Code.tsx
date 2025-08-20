import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { AI_BACKEND_URL } from '@/constants/api';
import Toast from '@/components/common/Toast';

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
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

    try {
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
        // TODO: 실행 상태를 UI에 표시 (로딩, 성공, 실패 등)
      } else {
        console.error('실행 실패:', result.error);
      }
    } catch (error) {
      console.error('코드 실행 중 오류:', error);
    }
  };

  const CODE_BUTTONS = [
    { icon: CodeRunIcon, alt: 'Run', onclick: handleRun },
    { icon: CodeCopyIcon, alt: 'Copy', onclick: handleCopy },
    { icon: CodeDownloadIcon, alt: 'Download', onclick: handleDownload },
  ];

  return (
    <>
      <div className="w-full h-full">
        <section className="w-full h-15 border-b-2px border-[#C3CCD9] flex items-center justify-start gap-5 pl-5">
          {CODE_BUTTONS.map(data => (
            <button
              key={data.alt}
              onClick={data.onclick}
              className="p-2 rounded-2xl hover:bg-[#f0f0f0] flex justify-center items-center transition-colors duration-200"
              title={data.alt}
            >
              <img src={data.icon} alt={data.alt} />
            </button>
          ))}
        </section>
        <section className="w-full h-full text-[12px] bg-[#272a36] overflow-auto">
          <SyntaxHighlighter language="python" style={dracula}>
            {codeString}
          </SyntaxHighlighter>
        </section>
      </div>

      <Toast
        message="코드가 클립보드에 복사되었습니다!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </>
  );
}
