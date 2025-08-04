import { useTab } from "@/hooks/useTab";

export default function EditorPage() {
  const {
    TabsList: LeftTabList,
    TabTrigger: LeftTabTrigger,
    TabsContainer: LeftTabsContainer,
    TabContent: LeftTabContent,
  } = useTab<'데이터 전처리' | '모델 설계' | '학습하기' | '평가하기'>('데이터 전처리');

  const {
    TabsList: RightTabList,
    TabTrigger: RightTabTrigger,
    TabsContainer: RightTabsContainer,
    TabContent: RightTabContent,
  } = useTab<'코드' | '데이터' | '학습'>('코드');

  return (
    <div className="flex gap-8">
      {/* 왼쪽 영역 */}
      <div className="w-1/2 font-bold text-2xl text-center">
        <LeftTabList>
          <LeftTabTrigger value="데이터 전처리">데이터 전처리</LeftTabTrigger>
          <LeftTabTrigger value="모델 설계">모델 설계</LeftTabTrigger>
          <LeftTabTrigger value="학습하기">학습하기</LeftTabTrigger>
          <LeftTabTrigger value="평가하기">평가하기</LeftTabTrigger>
        </LeftTabList>
        <LeftTabsContainer>
          <LeftTabContent value="데이터 전처리">Content A</LeftTabContent>
          <LeftTabContent value="모델 설계">Content B</LeftTabContent>
          <LeftTabContent value="학습하기">Content C</LeftTabContent>
          <LeftTabContent value="평가하기">Content D</LeftTabContent>
        </LeftTabsContainer>
      </div>

      {/* 오른쪽 영역 */}
      <div className="w-1/2 font-bold text-2xl text-center">
        <RightTabList>
          <RightTabTrigger value="코드">코드</RightTabTrigger>
          <RightTabTrigger value="데이터">데이터</RightTabTrigger>
          <RightTabTrigger value="학습">학습</RightTabTrigger>
        </RightTabList>
        <RightTabsContainer>
          <RightTabContent value="코드">설정 내용 A</RightTabContent>
          <RightTabContent value="데이터">설정 내용 B</RightTabContent>
          <RightTabContent value="학습">설정 내용 C</RightTabContent>
        </RightTabsContainer>
      </div>
    </div>
  );
}
