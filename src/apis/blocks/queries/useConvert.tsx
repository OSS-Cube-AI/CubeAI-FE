import { useQuery } from '@tanstack/react-query';
import { convertByPost, type Stage } from '@/apis/blocksConvert';

export type ConvertQueryArgs = {
  stage: Stage;
  params?: Record<string, unknown>;
  enabled?: boolean;
};

async function fetchConvert(stage: Stage, params?: Record<string, unknown>): Promise<string> {
  return await convertByPost(stage, params ?? {});
}

export function useConvertQuery({ stage, params, enabled = true }: ConvertQueryArgs) {
  return useQuery({
    queryKey: ['convert', stage, params],
    queryFn: () => fetchConvert(stage, params),
    enabled,
  });
}
