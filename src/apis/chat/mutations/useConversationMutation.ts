import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstance } from "@/apis/instance";
import { ConversationResponse } from "../dto";
import { queryKeys } from "@/apis/query-keys";

const postConversations = async (payload: { id: string; message: string }): Promise<ConversationResponse[]> => {
  const { data } = await getInstance('CHAT').post(`/conversation/${payload.id}`, { 
    conversation: [{
      content: payload.message, 
      role:'user'
    }] 
  });
  return data;
};

export const usePostConversations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postConversations,
    onSuccess: (newAllConversations, variables) => {
      queryClient.setQueryData(
        [queryKeys.conversation(variables.id)],
        newAllConversations
      );
    },
  });
};