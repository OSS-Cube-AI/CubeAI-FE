import { useEffect, useRef, useState } from 'react';
import { useDragCtx } from '@/hooks/dragDrop/DragContext';
import {
  addBlock,
  getBlocks,
  subscribe,
  type BlockItem,
  removeBlock,
  mutateBlocks,
} from '@/hooks/dragDrop/blocksStore';
import InitBg from '@/assets/block/init.svg';

// 좌표 계산 유틸리티 함수
function getAccurateCoordinates(
  clientX: number,
  clientY: number,
  targetElement: HTMLElement,
): { x: number; y: number } {
  const rect = targetElement.getBoundingClientRect();

  // 스크롤 오프셋
  const scrollLeft = document.documentElement.scrollLeft;
  const scrollTop = document.documentElement.scrollTop;

  // 기본 좌표 계산
  let x = clientX - rect.left + scrollLeft;
  let y = clientY - rect.top + scrollTop;

  // CSS transform 고려 (부모 요소들의 transform 체크)
  let currentElement: HTMLElement | null = targetElement.parentElement;
  while (currentElement) {
    const style = window.getComputedStyle(currentElement);
    const transform = style.transform;

    if (transform && transform !== 'none') {
      // transform matrix 파싱 (간단한 버전)
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
        if (values.length >= 6) {
          // translate 값 추출
          const translateX = values[4] || 0;
          const translateY = values[5] || 0;
          x -= translateX;
          y -= translateY;
        }
      }
    }

    currentElement = currentElement.parentElement;
  }

  return { x, y };
}

// 블록 간격을 고려한 스마트 스냅핑 (그리드 스냅핑 제거, 40px 겹침 허용)
function smartSnapToGrid(
  x: number,
  y: number,
  blockWidth: number = 336,
  blockHeight: number = 112,
  existingBlocks: BlockItem[] = [],
): { x: number; y: number } {
  // 블록 중심점으로 조정
  let snappedX = x - blockWidth / 2;
  let snappedY = y - blockHeight / 2;

  // 기존 블록과의 겹침 방지 (40px 겹침 허용)
  const minDistance = 1; // 최소 간격 1px
  const overlapDistance = 40; // 겹침 허용 거리

  for (const block of existingBlocks) {
    const distanceX = Math.abs(snappedX - block.x);
    const distanceY = Math.abs(snappedY - block.y);

    // 가로 겹침 체크
    if (distanceX < blockWidth + minDistance && distanceY < blockHeight - overlapDistance) {
      // 겹치는 경우 가장 가까운 빈 공간으로 조정
      if (distanceX < blockWidth + minDistance) {
        if (snappedX < block.x) {
          snappedX = block.x - blockWidth - minDistance;
        } else {
          snappedX = block.x + blockWidth + minDistance;
        }
      }

      if (distanceY < blockHeight - overlapDistance) {
        if (snappedY < block.y) {
          snappedY = block.y + overlapDistance; // 40px 겹침으로 배치
        } else {
          snappedY = block.y + blockHeight - overlapDistance; // 40px 겹침으로 배치
        }
      }
    }
  }

  return { x: snappedX, y: snappedY };
}

function reflowChain(blocksDraft: BlockItem[]) {
  const blockHeight = 112;
  const overlapDistance = 40;
  const init = blocksDraft.find(b => b.type === 'init_fixed');
  if (!init) return;

  const endBlocks = blocksDraft.filter(b => b.type === 'end');
  const middle = blocksDraft
    .filter(b => b.type !== 'init_fixed' && b.type !== 'end')
    .sort((a, b) => a.y - b.y);

  // 시작 위치는 init 바로 아래
  let currentX = init.x;
  let currentY = init.y + blockHeight - overlapDistance;

  // 중간 블록들 재배치
  for (const m of middle) {
    m.x = currentX;
    m.y = currentY;
    currentY = m.y + blockHeight - overlapDistance;
  }

  // end 블록들 재배치: 항상 마지막에 배치
  for (const e of endBlocks) {
    e.x = currentX;
    e.y = currentY;
    currentY = e.y + blockHeight - overlapDistance;
  }
}

export default function Workspace() {
  const { dragging, setDragging } = useDragCtx();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<BlockItem[]>(() => getBlocks());

  useEffect(() => {
    const unsub = subscribe(setBlocks);
    return () => unsub();
  }, []);

  // 최초 고정 블록 시드(존재하지 않을 때만 추가)
  useEffect(() => {
    const current = getBlocks();
    const hasInit = current.some(b => b.type === 'init_fixed');
    if (!hasInit) {
      // Editor.tsx에서의 Workspace 컴포넌트의 실제 width 계산
      const blockWidth = 336; // 블록 너비

      // Editor.tsx 레이아웃 구조:
      // - 왼쪽 사이드바: w-100 (100px)
      // - Workspace: flex-1 (남은 공간)
      // - 오른쪽 사이드바: w-100 (100px)
      // 따라서 Workspace는 (전체 너비 - 700px)의 공간을 차지
      const workspaceWidth = window.innerWidth - 700; // 700px = 좌우 사이드바 + 여백
      const centerX = (workspaceWidth - blockWidth) / 2; // Workspace 중앙
      const centerY = 100; // 상단에서 적당한 거리

      addBlock({
        id: crypto.randomUUID(),
        type: 'init_fixed',
        x: centerX,
        y: centerY,
        label: '실행시작',
        color: InitBg as unknown as string,
        isToggle: false,
        toggleOn: false,
        parameters: [],
        deletable: false,
      });
    }
  }, []);

  // 그리드 렌더링 함수 제거
  const renderGrid = () => null;

  const addBlockAt = (clientX: number, clientY: number) => {
    if (!dragging || !surfaceRef.current) return;

    // 정확한 좌표 계산 (스크롤, transform 등 모든 요소 고려)
    const { x, y } = getAccurateCoordinates(clientX, clientY, surfaceRef.current);

    // 블록 크기 정의
    const blockWidth = 336; // 블록 너비
    const blockHeight = 112; // 블록 높이를 112px로 복원

    // 실행시작 블록 찾기
    const initBlock = blocks.find(b => b.type === 'init_fixed');

    let finalX: number;
    let finalY: number;

    if (initBlock) {
      // 실행시작 블록이 있으면 그 아래에 배치
      finalX = initBlock.x; // 같은 x 좌표 (세로로 정렬)
      finalY = initBlock.y + blockHeight - 40; // 실행시작 블록 아래 40px 겹침

      // 기존 블록들과 겹치지 않도록 조정 (40px 겹침 허용)
      let adjustedY = finalY;
      for (const block of blocks) {
        if (
          block.type !== 'init_fixed' &&
          Math.abs(block.x - finalX) < blockWidth + 1 &&
          Math.abs(block.y - adjustedY) < blockHeight - 40
        ) {
          // 40px 겹침 허용
          adjustedY = block.y + blockHeight - 40; // 40px 겹침으로 배치
        }
      }
      finalY = adjustedY;
    } else {
      // 실행시작 블록이 없으면 원래 로직 사용
      const { x: snappedX, y: snappedY } = smartSnapToGrid(x, y, blockWidth, blockHeight, blocks);
      finalX = snappedX;
      finalY = snappedY;
    }

    const meta = (dragging.meta as any) || {};
    const label: string = meta.label ?? dragging.type;
    const color: string | undefined = meta.color;
    const isToggle: boolean = !!meta.isToggle;
    const toggleOn: boolean = !!meta.toggleOn;
    const parameters: number[] = Array.isArray(meta.parameters) ? meta.parameters : [];
    const isString: boolean = !!meta.isString;
    const stringValue: string = meta.stringValue || '';
    const isMultiSelect: boolean = !!meta.isMultiSelect;
    const selectedOptions: string[] = Array.isArray(meta.selectedOptions)
      ? meta.selectedOptions
      : [];
    const isDropdown: boolean = !!meta.isDropdown;
    const dropdownValue: string = meta.dropdownValue || '';

    const block: BlockItem = {
      id: crypto.randomUUID(),
      type: dragging.type,
      x: finalX,
      y: finalY,
      label,
      color,
      isToggle,
      toggleOn,
      parameters,
      isString,
      stringValue,
      isMultiSelect,
      selectedOptions,
      isDropdown,
      dropdownValue,
      deletable: true,
    };

    // 블록 추가
    addBlock(block);

    // 체인 재정렬: 항상 'end'가 마지막이 되도록, 중간은 붙어서 쌓이도록
    mutateBlocks(draft => {
      reflowChain(draft);
    });

    setDragging(null);
  };

  useEffect(() => {
    if (!dragging) return;
    const onUp = (e: PointerEvent) => addBlockAt(e.clientX, e.clientY);
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [dragging]);

  const handleRemoveBlock = (id: string) => {
    removeBlock(id);
    mutateBlocks(draft => {
      reflowChain(draft);
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    addBlockAt(e.clientX, e.clientY);
  };

  return (
    <div ref={surfaceRef} className="relative flex-1 bg-white" onPointerUp={handlePointerUp}>
      {renderGrid()}
      {blocks.map(b => (
        // 이거 z-index 너무 높으면 모달창을 뚫어버려서 낮춤
        <div key={b.id} className="absolute z-[30]" style={{ left: b.x, top: b.y }}>
          <div className="flex w-[336px] my-2 text-white text-xl select-none">
            {b.color && (
              <img
                src={b.color}
                alt="bg"
                className="absolute inset-0 w-[336px] h-28 object-contain pointer-events-none select-none z-0"
                draggable={false}
              />
            )}
            <div className="flex items-center w-full h-28 justify-end relative px-4">
              <div className="flex items-center justify-start w-full h-full text-center">
                {b.label}
              </div>
              {/* 파라미터 값들 렌더링 (숫자) */}
              {!b.isString &&
                b.parameters.map((p, i) => (
                  <div
                    key={`param-${i}`}
                    className="w-14 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center"
                  >
                    <div className="w-full text-center text-black text-sm">{p}</div>
                  </div>
                ))}

              {/* 문자열 값 렌더링 */}
              {b.isString && b.stringValue && (
                <div
                  key="string-value"
                  className="w-28 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center"
                >
                  <div className="w-full text-center text-black text-sm px-2 truncate">
                    {b.stringValue}
                  </div>
                </div>
              )}

              {/* 드롭다운 값 렌더링 */}
              {b.isDropdown && b.dropdownValue && (
                <div
                  key="dropdown-value"
                  className="w-24 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center"
                >
                  <div className="w-full text-center text-black text-xs px-2 truncate">
                    {b.dropdownValue}
                  </div>
                </div>
              )}

              {/* 다중 선택 값 렌더링 */}
              {b.isMultiSelect && b.selectedOptions && b.selectedOptions.length > 0 && (
                <div
                  key="multiselect-value"
                  className="w-24 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center"
                >
                  <div className="w-full text-center text-black text-xs px-2 truncate">
                    {b.selectedOptions.length}개 선택
                  </div>
                </div>
              )}

              {b.isToggle && (
                <div className="ml-[80px] mt-[5px]">
                  <div
                    className={`relative w-12 h-9 rounded-[30px] overflow-hidden ${b.toggleOn ? 'bg-sky-300' : 'bg-neutral-200 border border-zinc-200'}`}
                  >
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow ${b.toggleOn ? 'left-[3px] translate-x-[22px]' : 'left-[3px]'} `}
                    />
                  </div>
                </div>
              )}
              {b.deletable !== false && (
                <button
                  className="absolute top-1 right-1 z-[1000] size-4 leading-4 text-center rounded-full bg-white/30 text-zinc-700 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-60 hover:opacity-100 text-xs"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveBlock(b.id);
                  }}
                  title="Remove"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
