import { DataInfoQueryParams } from './sidebar/dto/dataInfo';

export const queryKeys = {
  conversation: (id: string | null) => ['chat', 'conversation', id],
  sidebar: {
    data: (params: DataInfoQueryParams) => [
      'sidebar',
      'data',
      `${params.file} ${params.type} ${params.n}`,
    ],
  },
};
