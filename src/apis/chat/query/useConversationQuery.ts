import { useQuery } from "@tanstack/react-query";
import { getInstance } from "@/apis/instance";
import { ConversationResponse } from "../dto";
import { queryKeys } from "@/apis/query-keys";

const getConversations = async (id: string): Promise<ConversationResponse[]> => {
  const { data } = await getInstance('CHAT').get(`/conversation/${id}`);
  return data;
};

export const useGetConversations = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.conversation(id)],
    queryFn: () => getConversations(id),
  });
};