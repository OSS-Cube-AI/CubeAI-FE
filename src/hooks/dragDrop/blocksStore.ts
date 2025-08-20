import type { editorStep } from '@/types/editor';

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

// 각 stage별로 별도의 블록 배열 관리
const stageBlocks: Record<editorStep, BlockItem[]> = {
  pre: [],
  model: [],
  train: [],
  eval: [],
};

// 기존 호환성을 위한 전체 블록 배열 (모든 stage의 블록을 합친 것)
const allBlocks: BlockItem[] = [];

// 기존 리스너들 (전체 블록 변경 시)
const listeners = new Set<Listener>();

// stage별 리스너들
const stageListeners = new Set<StageListener>();

function notify() {
  // 모든 stage의 블록을 합쳐서 전체 블록 배열 업데이트
  allBlocks.length = 0;
  Object.values(stageBlocks).forEach(blocks => {
    allBlocks.push(...blocks);
  });

  // 기존 리스너들에게 전체 블록 알림
  const snapshot = [...allBlocks];
  listeners.forEach(fn => fn(snapshot));
}

function notifyStage(stage: editorStep) {
  const snapshot = [...stageBlocks[stage]];
  stageListeners.forEach(fn => fn(stage, snapshot));
  notify(); // 전체 블록도 업데이트
}

// Stage별 블록 관리 함수들
export function getBlocksForStage(stage: editorStep): BlockItem[] {
  return [...stageBlocks[stage]];
}

export function addBlockToStage(stage: editorStep, block: BlockItem) {
  const blockWithStage = { ...block, stage };
  stageBlocks[stage].push(blockWithStage);
  notifyStage(stage);
}

export function removeBlockFromStage(stage: editorStep, id: string) {
  const idx = stageBlocks[stage].findIndex(b => b.id === id);
  if (idx !== -1) {
    stageBlocks[stage].splice(idx, 1);
    notifyStage(stage);
  }
}

export function clearBlocksForStage(stage: editorStep) {
  if (stageBlocks[stage].length) {
    stageBlocks[stage].splice(0, stageBlocks[stage].length);
    notifyStage(stage);
  }
}

export function mutateBlocksForStage(stage: editorStep, mutator: (draft: BlockItem[]) => void) {
  mutator(stageBlocks[stage]);
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
  return [...allBlocks];
}

export function addBlock(block: BlockItem) {
  // stage가 지정되지 않은 경우 기본값으로 'pre' 사용
  const stage = block.stage || 'pre';
  addBlockToStage(stage, block);
}

export function removeBlock(id: string) {
  // 모든 stage에서 해당 ID의 블록 찾아서 제거
  Object.keys(stageBlocks).forEach(stage => {
    removeBlockFromStage(stage as editorStep, id);
  });
}

export function clearBlocks() {
  Object.keys(stageBlocks).forEach(stage => {
    clearBlocksForStage(stage as editorStep);
  });
}

export function mutateBlocks(mutator: (draft: BlockItem[]) => void) {
  // 전체 블록 배열에 대해 뮤테이션 수행
  mutator(allBlocks);

  // 각 stage별로 블록 재분배 (기존 stage 정보 기반)
  Object.keys(stageBlocks).forEach(stage => {
    stageBlocks[stage as editorStep] = allBlocks.filter(b => b.stage === stage);
  });

  // 모든 리스너에게 알림
  listeners.forEach(fn => fn([...allBlocks]));
  stageListeners.forEach(fn => {
    Object.keys(stageBlocks).forEach(stage => {
      fn(stage as editorStep, [...stageBlocks[stage as editorStep]]);
    });
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
  return stageBlocks[stage].length;
}

// 모든 stage의 블록 개수 조회
export function getAllStageBlockCounts(): Record<editorStep, number> {
  return {
    pre: stageBlocks.pre.length,
    model: stageBlocks.model.length,
    train: stageBlocks.train.length,
    eval: stageBlocks.eval.length,
  };
}
