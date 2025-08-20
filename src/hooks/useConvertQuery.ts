import { useQuery } from '@tanstack/react-query';
import { convertByPost, type Stage } from '@/apis/blocksConvert';

async function fetchConvert(stage: Stage, fields: Record<string, unknown> = {}): Promise<string> {
  return await convertByPost(stage, fields);
}

export function useConvertQuery(
  stage: Stage,
  fields: Record<string, unknown> = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ['convert', stage, fields],
    queryFn: () => fetchConvert(stage, fields),
    enabled,
  });
}
