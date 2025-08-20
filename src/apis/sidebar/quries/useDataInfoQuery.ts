import { useQuery } from '@tanstack/react-query';
import { getInstance } from '@/apis/instance';
import { DataInfoQueryParams, DataInfoResponseDto } from '../dto/dataInfo';
import { queryKeys } from '@/apis/query-keys';

const getDataInfo = async (params: DataInfoQueryParams): Promise<DataInfoResponseDto> => {
  const { data } = await getInstance('AI').get('/data-info', { params });
  return data;
};

export const useDataInfo = (params: DataInfoQueryParams) => {
  return useQuery({
    queryKey: [queryKeys.sidebar.data(params)],
    queryFn: () => getDataInfo(params),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!params.file,
  });
};
