import { useTab } from "@/hooks/useTab";
import Workspace from "@/components/layout/dragDrop/workspace";
import NodePalette from "@/hooks/dragDrop/NodePalette";
import { DragProvider } from "@/hooks/dragDrop/DragContext";
import DragPreview from "@/hooks/dragDrop/DragPreview";
import Header from "@/components/layout/Header";

export default function EditorPage() {
  const {
    TabsList: LeftTabList,
    TabTrigger: LeftTabTrigger,
    TabsContainer: LeftTabsContainer,
    TabContent: LeftTabContent,
  } = useTab<'데이터 전처리' | '모델 설계' | '학습하기' | '평가하기'>('데이터 전처리', 'activeTab-left');

  const {
    TabsList: RightTabList,
    TabTrigger: RightTabTrigger,
    TabsContainer: RightTabsContainer,
    TabContent: RightTabContent,
  } = useTab<'코드' | '데이터' | '학습'>('코드', 'activeTab-right');

  return (
    <DragProvider>
      <div className="flex flex-col h-screen">
        <Header />

        {/* ───── 상단 탭 바 ───── */}
        <section className="flex justify-between items-end h-[105px] bg-[#EEF6FF] border-b-[2px] border-[#C3CCD9]">
          <div className="w-[376px] font-bold text-2xl text-center">
            <LeftTabList>
              <LeftTabTrigger value="데이터 전처리">{"데이터\n전처리"}</LeftTabTrigger>
              <LeftTabTrigger value="모델 설계">모델 설계</LeftTabTrigger>
              <LeftTabTrigger value="학습하기">학습하기</LeftTabTrigger>
              <LeftTabTrigger value="평가하기">평가하기</LeftTabTrigger>
            </LeftTabList>
          </div>

          {/* 오른쪽 탭 */}
          <div className="w-[376px] font-bold text-2xl text-center">
            <RightTabList>
              <RightTabTrigger value="코드">코드</RightTabTrigger>
              <RightTabTrigger value="데이터">데이터</RightTabTrigger>
              <RightTabTrigger value="학습">학습</RightTabTrigger>
            </RightTabList>
          </div>
        </section>
        
        <section className="flex justify-between flex-1">
            {/* 왼쪽 사이드바 */}
            <aside className="w-[376px] border-r-[2px] border-[#C3CCD9] font-bold text-2xl text-center">
              <LeftTabsContainer>
                <LeftTabContent value="데이터 전처리">
                  {/* 드래그 가능한 노드 팔레트 */}
                  <NodePalette />
                </LeftTabContent>
                <LeftTabContent value="모델 설계">Content B</LeftTabContent>
                <LeftTabContent value="학습하기">Content C</LeftTabContent>
                <LeftTabContent value="평가하기">Content D</LeftTabContent>
              </LeftTabsContainer>
            </aside>

          {/* 여기에 DND 요소 ㄱㄱ */}
          <section className="w-full">
            {/* 중앙 캔버스 영역 (드롭 지점) */}
            <Workspace />
          </section>

          
          {/* 오른쪽 사이드바 */}
          <div className="w-[376px] font-bold text-2xl text-center">
            <RightTabsContainer>
              <RightTabContent value="코드">설정 내용 A</RightTabContent>
              <RightTabContent value="데이터">설정 내용 B</RightTabContent>
              <RightTabContent value="학습">설정 내용 C</RightTabContent>
            </RightTabsContainer>
          </div>
        </section>

        {/* 드래그 중인 요소 미리보기 */}
        <DragPreview />
      </div>
    </DragProvider>
  );
}
