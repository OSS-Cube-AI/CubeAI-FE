import { useMutation } from '@tanstack/react-query';
import { postConvert, type Stage, type ConvertFields } from '@/apis/blocks/DTO/blockdata';

export type ConvertArgs = {
  stage: Stage;
  fields: ConvertFields;
};

export function useConvertMutation() {
  return useMutation({
    mutationFn: async ({ stage, fields }: ConvertArgs) => {
      return await postConvert({ stage, fields });
    },
  });
}
