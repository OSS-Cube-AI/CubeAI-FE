import { useQuery } from '@tanstack/react-query';
import { getInstance } from '@/apis/instance';
import { ResultRequestParams, ResultResponse, ResultStatusResponse } from '../dto/result';
import { queryKeys } from '@/apis/query-keys';

const getResult = async (params: ResultRequestParams): Promise<ResultResponse> => {
  const { data } = await getInstance('AI').get('/result', { params });
  return data;
};

export const useResult = (params: ResultRequestParams) => {
  return useQuery({
    queryKey: [queryKeys.sidebar.result(params)],
    queryFn: () => getResult(params),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!params.user_id,
  });
};

const getResultStatus = async (params: ResultRequestParams): Promise<ResultStatusResponse> => {
  const { data } = await getInstance('AI').get('/result/status', { params });
  return data;
};

export const useResultStatus = (params: ResultRequestParams) => {
  return useQuery({
    queryKey: [queryKeys.sidebar.resultStatus(params)],
    queryFn: () => getResultStatus(params),
    staleTime: 0, // 캐시 없이 매번 검증
    enabled: !!params.user_id,
  });
};
