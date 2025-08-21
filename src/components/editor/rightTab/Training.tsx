import { useEffect, useState, useRef } from 'react';
import { editorStep, editorStepKor } from '@/types/editor';
import { useLogStore } from '@/stores/useLogStore';
import { twMerge } from 'tailwind-merge';

interface TrainingProps {
  currentStage: editorStep;
}

const LOG_STAGES: editorStep[] = ['pre', 'model', 'train', 'eval'];

export default function Training({ currentStage }: TrainingProps) {
  const [selectedStage, setSelectedStage] = useState<editorStep>(currentStage);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const logs = useLogStore(state => state.logsByStage[currentStage] || []);

  useEffect(() => {
    setSelectedStage(currentStage);
  }, [currentStage]);

  // 자동 스크롤 처리
  useEffect(() => {
    if (logContainerRef.current && autoScroll) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // 스크롤 위치 감지하여 자동 스크롤 상태 관리
  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px 여유
      setAutoScroll(isAtBottom);
    }
  };

  // 수동으로 맨 아래로 스크롤
  const scrollToBottom = () => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      setAutoScroll(true);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] min-h-0">
      {/* 헤더 영역 - 고정 높이 */}
      <div className="flex justify-between items-center p-4 shrink-0 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">터미널 로그</h2>

        {/* 스테이지 선택 버튼 */}
        <div className="flex items-center gap-2">
          {LOG_STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={twMerge(
                'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
                selectedStage === stage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
              )}
            >
              {editorStepKor[stage]}
            </button>
          ))}
        </div>

        {/* 스크롤 컨트롤 */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToBottom}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
            title="맨 아래로 스크롤"
          >
            ↓
          </button>
          <span className="text-xs text-gray-500">{autoScroll ? '자동' : '수동'}</span>
        </div>
      </div>

      {/* 로그 컨테이너 - 남은 공간 모두 차지 */}
      <div
        ref={logContainerRef}
        onScroll={handleScroll}
        className="flex-1 bg-gray-900 text-white p-4 overflow-y-auto font-mono text-sm relative min-h-0"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {selectedStage} 단계의 로그가 없습니다.
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap break-words">
                <span className="text-green-400 mr-2 select-none">{`>`}</span>
                <span className="text-gray-300">{log}</span>
              </div>
            ))}
          </div>
        )}

        {/* 자동 스크롤 표시기 */}
        {!autoScroll && (
          <div className="sticky bottom-0 left-0 right-0 bg-yellow-600 text-white text-xs px-2 py-1 text-center">
            새 로그가 있습니다. ↓ 버튼을 클릭하세요.
          </div>
        )}
      </div>
    </div>
  );
}
