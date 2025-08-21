import { useEffect, useMemo, useState } from 'react';
import { getBlocksForStage, subscribeToStage, type BlockItem } from '@/hooks/dragDrop/blocksStore';
import { blocksToParams } from '@/hooks/dragDrop/blocksToParams';
import { useConvertQuery } from '@/apis/blocks/queries/useConvert';
import { useUserStore } from '@/stores/useUserStore';
import type { editorStep } from '@/types/editor';

export function useStoreConvertQuery(stage: editorStep, options?: { enabled?: boolean }) {
  const [blocks, setBlocks] = useState<BlockItem[]>(() => getBlocksForStage(stage));
  const userId = useUserStore(state => state.userId);

  useEffect(() => {
    // 현재 stage의 블록들로 초기화
    setBlocks(getBlocksForStage(stage));

    // 현재 stage의 블록 변경사항 구독
    const unsub = subscribeToStage((currentStage, stageBlocks) => {
      if (currentStage === stage) {
        setBlocks([...stageBlocks]);
      }
    });

    return () => unsub();
  }, [stage]);

  const filtered = useMemo(
    () => blocks.filter(b => b.type !== 'init_fixed' && b.type !== 'end'),
    [blocks],
  );

  const params = useMemo(() => blocksToParams(filtered), [filtered]);

  // userId가 있을 때만 convert query 실행
  const isEnabled = options?.enabled ?? true;
  const hasUserId = !!userId;
  const shouldExecute = isEnabled && hasUserId;

  return useConvertQuery({
    stage,
    params,
    userId: userId || '',
    enabled: shouldExecute,
  });
}
