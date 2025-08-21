import type { editorStep } from '@/types/editor';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BlockItem = {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
  color?: string;
  isToggle?: boolean;
  toggleOn?: boolean;
  parameters: number[];
  isString?: boolean;
  stringValue?: string;
  isMultiSelect?: boolean;
  selectedOptions?: string[];
  isDropdown?: boolean;
  dropdownValue?: string;
  deletable?: boolean;
  stage?: editorStep; // 블록이 속한 stage 추가
};

type Listener = (blocks: BlockItem[]) => void;
type StageListener = (stage: editorStep, blocks: BlockItem[]) => void;

type BlocksState = {
  stageBlocks: Record<editorStep, BlockItem[]>;
};

// Zustand 기반 저장 (로컬 스토리지에 지속)
const useBlocksState = create<BlocksState>()(
  persist<BlocksState>(
    () => ({
      stageBlocks: {
        pre: [] as BlockItem[],
        model: [] as BlockItem[],
        train: [] as BlockItem[],
        eval: [] as BlockItem[],
      },
    }),
    { name: 'blocks-stage-storage' },
  ),
);

// 기존 호환성을 위한 전체 블록 배열 (모든 stage의 블록을 합친 것)
const allBlocks: BlockItem[] = [];

// 기존 리스너들 (전체 블록 변경 시)
const listeners = new Set<Listener>();

// stage별 리스너들
const stageListeners = new Set<StageListener>();

function notify() {
  // 모든 stage의 블록을 합쳐서 전체 블록 배열 업데이트 (Zustand 상태 기반)
  const state = useBlocksState.getState();
  allBlocks.length = 0;
  (Object.keys(state.stageBlocks) as editorStep[]).forEach(s => {
    allBlocks.push(...state.stageBlocks[s]);
  });

  // 기존 리스너들에게 전체 블록 알림
  const snapshot = [...allBlocks];
  listeners.forEach(fn => fn(snapshot));
}

function notifyStage(stage: editorStep) {
  const state = useBlocksState.getState();
  const snapshot = [...state.stageBlocks[stage]];
  stageListeners.forEach(fn => fn(stage, snapshot));
  notify(); // 전체 블록도 업데이트
}

// Stage별 블록 관리 함수들
export function getBlocksForStage(stage: editorStep): BlockItem[] {
  const state = useBlocksState.getState();
  return [...state.stageBlocks[stage]];
}

export function addBlockToStage(stage: editorStep, block: BlockItem) {
  const blockWithStage = { ...block, stage };
  const state = useBlocksState.getState();
  const next = [...state.stageBlocks[stage], blockWithStage];
  useBlocksState.setState({
    stageBlocks: { ...state.stageBlocks, [stage]: next },
  });
  notifyStage(stage);
}

export function removeBlockFromStage(stage: editorStep, id: string) {
  const state = useBlocksState.getState();
  const next = state.stageBlocks[stage].filter(b => b.id !== id);
  useBlocksState.setState({
    stageBlocks: { ...state.stageBlocks, [stage]: next },
  });
  notifyStage(stage);
}

export function clearBlocksForStage(stage: editorStep) {
  const state = useBlocksState.getState();
  if (state.stageBlocks[stage].length) {
    useBlocksState.setState({
      stageBlocks: { ...state.stageBlocks, [stage]: [] },
    });
    notifyStage(stage);
  }
}

export function mutateBlocksForStage(stage: editorStep, mutator: (draft: BlockItem[]) => void) {
  const state = useBlocksState.getState();
  // 불변 업데이트: shallow copy 후 mutator 적용
  const draft = state.stageBlocks[stage].map(b => ({ ...b }));
  mutator(draft);
  useBlocksState.setState({
    stageBlocks: { ...state.stageBlocks, [stage]: draft },
  });
  notifyStage(stage);
}

export function subscribeToStage(fn: StageListener) {
  stageListeners.add(fn);
  return () => {
    stageListeners.delete(fn);
  };
}

// 기존 호환성 함수들 (전체 블록 기준)
export function getBlocks(): BlockItem[] {
  // 최신 상태에서 조립
  const state = useBlocksState.getState();
  const merged: BlockItem[] = [];
  (Object.keys(state.stageBlocks) as editorStep[]).forEach(s =>
    merged.push(...state.stageBlocks[s]),
  );
  return merged;
}

export function addBlock(block: BlockItem) {
  // stage가 지정되지 않은 경우 기본값으로 'pre' 사용
  const stage = block.stage || 'pre';
  addBlockToStage(stage, block);
}

export function removeBlock(id: string) {
  // 모든 stage에서 해당 ID의 블록 찾아서 제거
  const state = useBlocksState.getState();
  (Object.keys(state.stageBlocks) as editorStep[]).forEach(stage => {
    removeBlockFromStage(stage, id);
  });
}

export function clearBlocks() {
  const state = useBlocksState.getState();
  (Object.keys(state.stageBlocks) as editorStep[]).forEach(stage => {
    clearBlocksForStage(stage);
  });
}

export function mutateBlocks(mutator: (draft: BlockItem[]) => void) {
  // 전체 블록 배열에 대해 뮤테이션 수행 (Zustand 상태 기반)
  const state = useBlocksState.getState();
  const merged: BlockItem[] = [];
  (Object.keys(state.stageBlocks) as editorStep[]).forEach(s =>
    merged.push(...state.stageBlocks[s]),
  );

  mutator(merged);

  // 각 stage별로 블록 재분배 (기존 stage 정보 기반)
  const next: Record<editorStep, BlockItem[]> = {
    pre: [] as BlockItem[],
    model: [] as BlockItem[],
    train: [] as BlockItem[],
    eval: [] as BlockItem[],
  };
  for (const b of merged) {
    const s = (b.stage || 'pre') as editorStep;
    next[s].push(b);
  }

  useBlocksState.setState({ stageBlocks: next });

  // 모든 리스너에게 알림
  listeners.forEach(fn => fn([...merged]));
  stageListeners.forEach(fn => {
    (Object.keys(next) as editorStep[]).forEach(s => fn(s, [...next[s]]));
  });
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Stage별 블록 개수 조회
export function getBlockCountForStage(stage: editorStep): number {
  const state = useBlocksState.getState();
  return state.stageBlocks[stage].length;
}

// end 블럭이 있는지 확인하는 함수
export function hasEndBlock(stage: editorStep): boolean {
  const state = useBlocksState.getState();
  return state.stageBlocks[stage].some(block => block.type === 'end');
}

// 모든 stage의 블록 개수 조회
export function getAllStageBlockCounts(): Record<editorStep, number> {
  const state = useBlocksState.getState();
  return {
    pre: state.stageBlocks.pre.length,
    model: state.stageBlocks.model.length,
    train: state.stageBlocks.train.length,
    eval: state.stageBlocks.eval.length,
  };
}
