import { useQuery } from '@tanstack/react-query';
import { convertByPost, type Stage } from '@/apis/blocksConvert';

export type ConvertQueryArgs = {
  stage: Stage;
  params?: Record<string, unknown>;
  userId: string;
  enabled?: boolean;
};

async function fetchConvert(
  stage: Stage,
  params: Record<string, unknown> | undefined,
  userId: string,
): Promise<string> {
  return await convertByPost(stage, params ?? {}, userId);
}

export function useConvertQuery({ stage, params, userId, enabled = true }: ConvertQueryArgs) {
  return useQuery({
    queryKey: ['convert', stage, params, userId],
    queryFn: () => fetchConvert(stage, params, userId),
    enabled,
  });
}
