import { useEffect, useMemo, useState } from 'react';
import { getBlocks, subscribe, type BlockItem } from '@/hooks/dragDrop/blocksStore';
import { blocksToParams } from '@/hooks/dragDrop/blocksToParams';
import { useConvertQuery } from '@/apis/blocks/queries/useConvert';
import { useUserStore } from '@/stores/useUserStore';
import type { Stage } from '@/apis/blocksConvert';

export function useStoreConvertQuery(stage: Stage, options?: { enabled?: boolean }) {
  const [blocks, setBlocks] = useState<BlockItem[]>(() => getBlocks());
  const userId = useUserStore(state => state.userId);

  useEffect(() => {
    const unsub = subscribe(setBlocks);
    return () => unsub();
  }, []);

  const filtered = useMemo(
    () => blocks.filter(b => b.type !== 'init_fixed' && b.type !== 'end'),
    [blocks],
  );

  const params = useMemo(() => blocksToParams(filtered), [filtered]);

  return useConvertQuery({
    stage,
    params,
    userId: userId || 'anonymous',
    enabled: options?.enabled ?? true,
  });
}
