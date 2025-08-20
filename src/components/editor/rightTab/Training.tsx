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

  const logs = useLogStore(state => state.logsByStage[currentStage] || []);

  useEffect(() => {
    setSelectedStage(currentStage);
  }, [currentStage]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-xl font-bold text-gray-800">터미널 로그</h2>
        {/* 7. 각 단계의 로그를 선택할 수 있는 버튼 그룹을 추가합니다. */}
        <div className="flex items-center gap-2">
          {LOG_STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={twMerge(
                'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
                selectedStage === stage
                  ? 'bg-blue-500 text-white' // 활성화된 버튼 스타일
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300', // 비활성화된 버튼 스타일
              )}
            >
              {editorStepKor[stage]}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={logContainerRef}
        className="bg-gray-900 text-white p-4 rounded-lg overflow-y-auto h-full font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500">{selectedStage} 단계의 로그가 없습니다.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap">
              <span className="text-green-400 mr-2">{`>`}</span>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
