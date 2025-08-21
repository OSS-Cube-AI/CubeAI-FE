import { useMutation } from '@tanstack/react-query';
import { postConvert, type Stage, type ConvertFields } from '@/apis/blocks/DTO/blockdata';

export type ConvertArgs = {
  stage: Stage;
  fields: ConvertFields;
  userId: string;
};

export function useConvertMutation() {
  return useMutation({
    mutationFn: async ({ stage, fields, userId }: ConvertArgs) => {
      return await postConvert({ stage, fields, userId });
    },
  });
}
