import { useMutation } from '@tanstack/react-query';
import { convertByPost, type Stage } from '@/apis/blocksConvert';

export type ConvertArgs = {
  stage: Stage;
  fields: Record<string, unknown>;
};

export function useConvertMutation() {
  return useMutation({
    mutationFn: async ({ stage, fields }: ConvertArgs) => {
      return await convertByPost(stage, fields);
    },
  });
}
