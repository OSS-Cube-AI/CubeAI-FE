import { useQuery } from '@tanstack/react-query';
import { convertByPost, type Stage } from '@/apis/blocksConvert';

async function fetchConvert(
  stage: Stage,
  fields: Record<string, unknown> = {},
  userId: string,
): Promise<string> {
  return await convertByPost(stage, fields, userId);
}

export function useConvertQuery(
  stage: Stage,
  fields: Record<string, unknown> = {},
  userId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['convert', stage, fields, userId],
    queryFn: () => fetchConvert(stage, fields, userId),
    enabled,
  });
}
