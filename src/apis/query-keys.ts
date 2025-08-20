import { DataInfoQueryParams } from './sidebar/dto/dataInfo';
import { ResultRequestParams } from './sidebar/dto/result';

export const queryKeys = {
  conversation: (id: string | null) => ['chat', 'conversation', id],
  sidebar: {
    data: (params: DataInfoQueryParams) => [
      'sidebar',
      'data',
      `${params.file} ${params.type} ${params.n}`,
    ],
    result: (params: ResultRequestParams) => ['sidebar', 'result', params.user_id],
    resultStatus: (params: ResultRequestParams) => ['sidebar', 'result', params.user_id, 'status'],
  },
};
