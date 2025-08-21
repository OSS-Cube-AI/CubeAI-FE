import PaletteItem from './PaletteItem';
import Green from '@/assets/block/green.svg';
import Yellow from '@/assets/block/yellow.svg';
import Purple from '@/assets/block/purple.svg';
import Pink from '@/assets/block/pink.svg';
import InitBg from '@/assets/block/init.svg';

// 데이터 전처리 - 초록색
const PREPROCESSING_NODES: {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
  isString?: boolean;
  stringDefault?: string;
  isDropdown?: boolean;
  dropdownOptions?: string[];
  dropdownDefault?: string;
}[] = [
  {
    label: '데이터셋',
    type: 'pre',
    color: Green,
    isToggle: false,
    parameters: [],
    isString: false,
    stringDefault: '',
  },
  { label: '테스트 데이터셋 사용 여부', type: 'pre', color: Green, isToggle: true, parameters: [] },
  {
    label: '테스트 데이터셋',
    type: 'pre',
    color: Green,
    isToggle: false,
    parameters: [],
    isString: true,
    stringDefault: '',
  },
  { label: '테스트 비율', type: 'pre', color: Green, isToggle: false, parameters: [80] },
  { label: '결측치 제거', type: 'pre', color: Green, isToggle: true, parameters: [] },
  { label: '불량 데이터 제거', type: 'pre', color: Green, isToggle: true, parameters: [] },
  { label: '최소 라벨', type: 'pre', color: Green, isToggle: false, parameters: [0] },
  { label: '최대 라벨', type: 'pre', color: Green, isToggle: false, parameters: [9] },
  { label: 'X/Y 분할', type: 'pre', color: Green, isToggle: true, parameters: [] },
  { label: '리사이즈 크기', type: 'pre', color: Green, isToggle: false, parameters: [28] },
  {
    label: '증강 방법',
    type: 'pre',
    color: Green,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['rotate', 'hflip', 'vflip', 'translate'],
    dropdownDefault: 'rotate',
  },
  {
    label: '증강 파라미터',
    type: 'pre',
    color: Green,
    isToggle: false,
    parameters: [],
    isString: true,
    stringDefault: '10',
  },
  {
    label: '정규화',
    type: 'pre',
    color: Green,
    isToggle: false,
    parameters: [],
    isString: true,
    stringDefault: '0-1',
  },
];

// 모델설계 - 보라색
const MODEL_DESIGN_NODES: {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
  isString?: boolean;
  stringDefault?: string;
  isDropdown?: boolean;
  dropdownOptions?: string[];
  dropdownDefault?: string;
}[] = [
  { label: '입력 이미지 너비', type: 'model', color: Purple, isToggle: false, parameters: [28] },
  { label: '입력 이미지 높이', type: 'model', color: Purple, isToggle: false, parameters: [28] },
  { label: '입력 채널 수', type: 'model', color: Purple, isToggle: false, parameters: [1] },
  { label: 'Conv1 필터 수', type: 'model', color: Purple, isToggle: false, parameters: [32] },
  { label: 'Conv1 커널 크기', type: 'model', color: Purple, isToggle: false, parameters: [3] },
  {
    label: 'Conv1 패딩',
    type: 'model',
    color: Purple,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['same', 'valid'],
    dropdownDefault: 'valid',
  },
  {
    label: 'Conv1 활성함수',
    type: 'model',
    color: Purple,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['relu', 'sigmoid', 'tanh'],
    dropdownDefault: 'relu',
  },
  {
    label: 'Pool1 종류',
    type: 'model',
    color: Purple,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['max', 'avg'],
    dropdownDefault: 'max',
  },
  { label: 'Pool1 크기', type: 'model', color: Purple, isToggle: false, parameters: [2] },
  { label: 'Pool1 스트라이드', type: 'model', color: Purple, isToggle: false, parameters: [2] },
  { label: 'Conv2 사용 여부', type: 'model', color: Purple, isToggle: true, parameters: [] },
  { label: 'Conv2 필터 수', type: 'model', color: Purple, isToggle: false, parameters: [64] },
  { label: 'Conv2 커널 크기', type: 'model', color: Purple, isToggle: false, parameters: [3] },
  {
    label: 'Conv2 활성함수',
    type: 'model',
    color: Purple,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['relu', 'sigmoid', 'tanh'],
    dropdownDefault: 'relu',
  },
  { label: '드롭아웃 사용 여부', type: 'model', color: Purple, isToggle: true, parameters: [] },
  { label: '드롭아웃 비율', type: 'model', color: Purple, isToggle: false, parameters: [0.25] },
  {
    label: 'Dense 레이어 유닛 수',
    type: 'model',
    color: Purple,
    isToggle: false,
    parameters: [128],
  },
  {
    label: 'Dense 활성함수',
    type: 'model',
    color: Purple,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['relu', 'sigmoid', 'tanh', 'softmax'],
    dropdownDefault: 'relu',
  },
  { label: '출력 클래스 수', type: 'model', color: Purple, isToggle: false, parameters: [10] },
];

// 학습하기 - 노란색
const TRAINING_NODES: {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
  isString?: boolean;
  stringDefault?: string;
  isDropdown?: boolean;
  dropdownOptions?: string[];
  dropdownDefault?: string;
}[] = [
  {
    label: '손실함수',
    type: 'train',
    color: Yellow,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['CrossEntropy', 'MSE'],
    dropdownDefault: 'CrossEntropy',
  },
  {
    label: '옵티마이저',
    type: 'train',
    color: Yellow,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['Adam', 'SGD', 'RMSprop'],
    dropdownDefault: 'Adam',
  },
  { label: '학습률', type: 'train', color: Yellow, isToggle: false, parameters: [0.0001] },
  { label: '에폭 수', type: 'train', color: Yellow, isToggle: false, parameters: [10] },
  { label: '배치 크기', type: 'train', color: Yellow, isToggle: false, parameters: [64] },
  { label: '학습 조기 종료', type: 'train', color: Yellow, isToggle: false, parameters: [3] },
];

// 평가하기 - 핑크색
const EVALUATION_NODES: {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
  isString?: boolean;
  stringDefault?: string;
  isMultiSelect?: boolean;
  multiSelectOptions?: string[];
  multiSelectDefaults?: string[];
  isDropdown?: boolean;
  dropdownOptions?: string[];
  dropdownDefault?: string;
}[] = [
  {
    label: '평가 메트릭',
    type: 'eval',
    color: Pink,
    isToggle: false,
    parameters: [],
    isMultiSelect: true,
    multiSelectOptions: ['accuracy', 'precision', 'recall', 'f1', 'auc'],
    multiSelectDefaults: ['accuracy'],
  },
  {
    label: '평균 방식',
    type: 'eval',
    color: Pink,
    isToggle: false,
    parameters: [],
    isDropdown: true,
    dropdownOptions: ['macro', 'micro', 'weighted'],
    dropdownDefault: 'macro',
  },
  { label: 'Top-K 값', type: 'eval', color: Pink, isToggle: false, parameters: [3] },
  { label: '분류 리포트 출력', type: 'eval', color: Pink, isToggle: true, parameters: [] },
  { label: '혼동 행렬 출력', type: 'eval', color: Pink, isToggle: true, parameters: [] },
  { label: '혼동 행렬 정규화', type: 'eval', color: Pink, isToggle: true, parameters: [] },
  { label: '시각화할 예측 샘플 수', type: 'eval', color: Pink, isToggle: false, parameters: [10] },
  { label: '시각화할 오분류 샘플 수', type: 'eval', color: Pink, isToggle: false, parameters: [5] },
  { label: '평가 배치 크기', type: 'eval', color: Pink, isToggle: false, parameters: [128] },
  { label: '클래스 수', type: 'eval', color: Pink, isToggle: false, parameters: [10] },
  {
    label: '클래스 이름',
    type: 'eval',
    color: Pink,
    isToggle: false,
    parameters: [],
    isString: true,
    stringDefault: '0,1,2,3,4,5,6,7,8,9',
  },
  { label: 'CPU 강제 사용', type: 'eval', color: Pink, isToggle: true, parameters: [] },
];

interface NodePaletteProps {
  selectedTab: '데이터 전처리' | '모델 설계' | '학습하기' | '평가하기';
}

export default function NodePalette({ selectedTab }: NodePaletteProps) {
  // 선택된 탭에 따라 해당 노드들만 반환
  const getNodesForTab = () => {
    switch (selectedTab) {
      case '데이터 전처리':
        return PREPROCESSING_NODES;
      case '모델 설계':
        return MODEL_DESIGN_NODES;
      case '학습하기':
        return TRAINING_NODES;
      case '평가하기':
        return EVALUATION_NODES;
      default:
        return PREPROCESSING_NODES;
    }
  };

  const currentNodes = getNodesForTab();

  return (
    <div className="flex flex-col gap-4 p-4 items-center">
      <div className="space-y-2 w-[336px] flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700">블록 선택하기</h3>
        <div className="grid grid-cols-1 gap-2 w-full items-center h-[600px] overflow-y-auto pr-1 pb-28 relative z-0 isolate">
          {currentNodes.map(n => (
            <div
              key={n.type + n.label}
              className="relative grid w-[336px] h-28 place-items-center px-4 py-2"
            >
              <img
                src={n.color}
                alt={n.label}
                className="absolute inset-0 w-full h-full object-contain -z-10 pointer-events-none"
              />
              <PaletteItem {...n} />
            </div>
          ))}
        </div>
        {/* 실행 종료 블록 (스크롤 영역 하단 고정 노출) */}
        <div key="exec_end" className="sticky bottom-0 z-10 bg-white">
          <div className="relative grid w-[336px] h-28 place-items-center px-4 py-2 border-t border-gray-200">
            <img
              src={InitBg as unknown as string}
              alt="실행 종료"
              className="absolute inset-0 w-full h-full object-contain -z-10 pointer-events-none"
            />
            <PaletteItem
              label="실행 종료"
              type="end"
              color={InitBg as unknown as string}
              isToggle={false}
              parameters={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
