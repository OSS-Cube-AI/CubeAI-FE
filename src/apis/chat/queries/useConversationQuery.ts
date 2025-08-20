import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getInstance } from '@/apis/instance';
import { ConversationResponse } from '../dto';
import { queryKeys } from '@/apis/query-keys';

const getConversations = async (id: string): Promise<ConversationResponse> => {
  try {
    const { data } = await getInstance('CHAT').get(`/conversation/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log('404 에러 발생: 대화 내용을 찾을 수 없습니다. 빈 배열을 반환합니다.');
      return { conversation: [] };
    }
    throw error;
  }
};

export const useGetConversations = (id: string | null) => {
  return useQuery({
    queryKey: [queryKeys.conversation(id)],
    queryFn: () => getConversations(id as string),
    enabled: !!id,
  });
};
