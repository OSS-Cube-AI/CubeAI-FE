import { useEffect, useMemo, useState } from 'react';
import { getBlocks, subscribe, type BlockItem } from '@/hooks/dragDrop/blocksStore';
import { blocksToParams } from '@/hooks/dragDrop/blocksToParams';
import { useConvertQuery, type Stage } from '@/apis/blocks/queries/useConvert';

export function useStoreConvertQuery(stage: Stage, options?: { enabled?: boolean }) {
  const [blocks, setBlocks] = useState<BlockItem[]>(() => getBlocks());

  useEffect(() => {
    const unsub = subscribe(setBlocks);
    return () => unsub();
  }, []);

  const filtered = useMemo(
    () => blocks.filter(b => b.type !== 'init_fixed' && b.type !== 'end'),
    [blocks],
  );

  const params = useMemo(() => blocksToParams(filtered), [filtered]);

  return useConvertQuery({ stage, params, enabled: options?.enabled ?? true });
}
