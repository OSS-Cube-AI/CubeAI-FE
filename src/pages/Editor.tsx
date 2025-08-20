import { useState, useEffect } from 'react';
import { useTab } from '@/hooks/useTab';
import Workspace from '@/components/layout/dragDrop/workspace';
import NodePalette from '@/hooks/dragDrop/NodePalette';
import { DragProvider } from '@/hooks/dragDrop/DragContext';
import DragPreview from '@/hooks/dragDrop/DragPreview';
import Header from '@/components/layout/Header';
import { useLogStore } from '@/stores/useLogStore';
import SSEComponent from '@/components/common/SSEComponent';
import AiChatButton from '@/components/editor/AiChatButton';
import Code from '@/components/editor/rightTab/Code';
import Data from '@/components/editor/rightTab/Data';
import Training from '@/components/editor/rightTab/Training';

import CurrentStepInfo from '@/components/editor/CurrentStepInfo';
import { useUserStore } from '@/stores/useUserStore';
import WelcomeDialog from '@/components/editor/dialog/WelcomeDialog';

import type { editorStep } from '@/types/editor';
import { useStoreConvertQuery } from '@/apis/blocks/queries/useStoreConvert';
import { AI_BACKEND_URL } from '@/constants/api';

const leftTabsConfig: {
  value: '데이터 전처리' | '모델 설계' | '학습하기' | '평가하기';
  label: string;
  step: editorStep;
}[] = [
  { value: '데이터 전처리', label: '데이터\n전처리', step: 'pre' as editorStep },
  { value: '모델 설계', label: '모델 설계', step: 'model' as editorStep },
  { value: '학습하기', label: '학습하기', step: 'train' as editorStep },
  { value: '평가하기', label: '평가하기', step: 'eval' as editorStep },
];

// 단계의 순서를 명확하게 정의할 배열
const stepOrder: editorStep[] = ['pre', 'model', 'train', 'eval'];

export default function EditorPage() {
  const [editorStep, setEditorStep] = useState<editorStep>('pre');
  const { data: convertedCode = '', isPending: isConverting } = useStoreConvertQuery(editorStep, {
    enabled: true,
  });

  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const addLog = useLogStore(state => state.addLog);
  const clearLogs = useLogStore(state => state.clearLogs);
  const userId = useUserStore(state => state.userId);
  const setUserId = useUserStore(state => state.setUserId);

  useEffect(() => {
    const storedUserId = localStorage.getItem('demo-user-id');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsIdModalOpen(false);
    } else {
      setIsIdModalOpen(true);
    }
  }, [userId, setUserId]);

  const {
    TabsList: LeftTabList,
    TabTrigger: LeftTabTrigger,
    TabsContainer: LeftTabsContainer,
    TabContent: LeftTabContent,
  } = useTab<'데이터 전처리' | '모델 설계' | '학습하기' | '평가하기'>(
    '데이터 전처리',
    'activeTab-left',
  );

  const {
    TabsList: RightTabList,
    TabTrigger: RightTabTrigger,
    TabsContainer: RightTabsContainer,
    TabContent: RightTabContent,
  } = useTab<'코드' | '데이터' | '학습'>('코드', 'activeTab-right');

  const handleNewLog = (newLog: string) => {
    addLog(editorStep, newLog);
  };

  const currentStepIndex = stepOrder.indexOf(editorStep);

  // 다음 단계로 진행하는 함수 (테스트용)
  const handleCompleteAndNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentStepIndex + 1];
      clearLogs(nextStep);
      setEditorStep(nextStep);
    }
  };

  const handleBackStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = stepOrder[currentStepIndex - 1];
      setEditorStep(prevStep);
    }
  };

  const handleOpenIdModal = () => {
    setIsIdModalOpen(true);
  };

  const handleCloseIdModal = () => {
    setIsIdModalOpen(false);
  };

  return (
    <>
      {isIdModalOpen && <WelcomeDialog isOpen={isIdModalOpen} onClose={handleCloseIdModal} />}
      <DragProvider>
        <div className="flex flex-col h-screen">
          <Header onOpenIdModal={handleOpenIdModal} />

          {/* ───── 상단 탭 바 ───── */}
          <section className="flex justify-between items-end min-h-[105px] bg-[#EEF6FF] border-b-[2px] border-[#C3CCD9]">
            <div className="w-100 font-bold text-2xl text-center">
              <LeftTabList>
                {leftTabsConfig.map(tab => {
                  const tabStepIndex = stepOrder.indexOf(tab.step);
                  const isDisabled = tabStepIndex > currentStepIndex;

                  return (
                    <LeftTabTrigger
                      key={tab.value}
                      value={tab.value}
                      disabled={isDisabled} // disabled 속성 전달
                    >
                      {tab.label}
                    </LeftTabTrigger>
                  );
                })}
              </LeftTabList>
            </div>

            <CurrentStepInfo
              editorStep={editorStep}
              currentStepIndex={currentStepIndex}
              stepOrder={stepOrder}
              handleBackStep={handleBackStep}
              handleCompleteAndNextStep={handleCompleteAndNextStep}
            />

            {/* 오른쪽 탭 */}
            <div className="w-100 font-bold text-2xl text-center">
              <RightTabList>
                <RightTabTrigger value="코드">코드</RightTabTrigger>
                <RightTabTrigger value="데이터">데이터</RightTabTrigger>
                <RightTabTrigger value="학습">학습</RightTabTrigger>
              </RightTabList>
            </div>
          </section>

          <section className="flex justify-between flex-1">
            {/* 왼쪽 사이드바 */}
            <aside className="flex w-100 border-r-[2px] border-[#C3CCD9] font-bold text-2xl text-center">
              <LeftTabsContainer>
                <LeftTabContent value="데이터 전처리">
                  {/* 드래그 가능한 노드 팔레트 */}
                  <NodePalette selectedTab="데이터 전처리" />
                </LeftTabContent>
                <LeftTabContent value="모델 설계">
                  <NodePalette selectedTab="모델 설계" />
                </LeftTabContent>
                <LeftTabContent value="학습하기">
                  <NodePalette selectedTab="학습하기" />
                </LeftTabContent>
                <LeftTabContent value="평가하기">
                  <NodePalette selectedTab="평가하기" />
                </LeftTabContent>
              </LeftTabsContainer>
            </aside>

            {/* 여기에 DND 요소 ㄱㄱ */}
            <section className="flex-1 w-full">
              {/* 중앙 캔버스 영역 (드롭 지점) */}
              <Workspace editorStep={editorStep} />
            </section>

            {/* 오른쪽 사이드바 */}
            <aside className="flex w-100 h-full font-bold text-2xl text-center border-l-[2px] border-[#C3CCD9]">
              <RightTabsContainer>
                <RightTabContent value="코드">
                  {/* 변환 결과 표시 */}
                  <Code codeString={isConverting ? '# Generating…' : convertedCode} />
                </RightTabContent>
                <RightTabContent value="데이터">
                  <Data />
                </RightTabContent>
                <RightTabContent value="학습">
                  <Training currentStage={editorStep} />
                </RightTabContent>
              </RightTabsContainer>
            </aside>
          </section>

          {/* 드래그 중인 요소 미리보기 */}
          <DragPreview />
        </div>
      </DragProvider>
      <AiChatButton />
      {/* SSEComponent를 렌더링하여 로그 스트리밍을 시작합니다. */}
      <SSEComponent
        url={`${AI_BACKEND_URL}/logs/stream?stage=${editorStep}`}
        onMessage={handleNewLog}
      />
    </>
  );
}
