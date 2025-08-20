import { useQuery } from '@tanstack/react-query';
import { getInstance } from '@/apis/instance';

export type Stage = 'pre' | 'model' | 'train' | 'eval' | 'all';

export type ConvertQueryArgs = {
  stage: Stage;
  params?: Record<string, unknown>;
  enabled?: boolean;
};

function buildGetParams(params: Record<string, unknown> = {}) {
  const out: Record<string, string | number | string[]> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      out[`${key}[]`] = value.map(v => String(v));
      return;
    }
    if (typeof value === 'boolean') {
      if (value) out[key] = 'on';
      return;
    }
    out[key] = typeof value === 'number' ? value : String(value);
  });
  return out;
}

async function fetchConvert(stage: Stage, params?: Record<string, unknown>): Promise<string> {
  const instance = getInstance('AI');
  const res = await instance.get('/convert', {
    params: { stage, ...buildGetParams(params ?? {}) },
    responseType: 'text',
  });
  return typeof res.data === 'string' ? res.data : '';
}

export function useConvertQuery({ stage, params, enabled = true }: ConvertQueryArgs) {
  return useQuery({
    queryKey: ['convert', stage, params],
    queryFn: () => fetchConvert(stage, params),
    enabled,
  });
}
