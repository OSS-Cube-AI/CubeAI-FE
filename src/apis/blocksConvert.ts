import { getInstance as getFormdataInstance } from '@/apis/formdata';

export type Stage = 'pre' | 'model' | 'train' | 'eval' | 'all';

// GET 요청 파라미터 인코딩: 불리언은 'on'으로 변환, 배열은 key[] 형식으로 변환
const buildGetParams = (params: Record<string, unknown>) => {
  const out: Record<string, string | string[] | number> = {};
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      out[`${key}[]`] = value.map(v => String(v));
      return;
    }
    if (typeof value === 'boolean') {
      if (value) out[key] = 'on'; //체크박스 체크 시 체크 되는 코드
      return; // 실패시 종료
    }
    out[key] = typeof value === 'number' ? value : String(value);
  });
  return out;
};

export const convertByGet = async (
  stage: Stage,
  params: Record<string, unknown>,
): Promise<string> => {
  const instance = getFormdataInstance('AI');
  const res = await instance.get('/convert', {
    params: { stage, ...buildGetParams(params) },
    responseType: 'text',
  });
  return typeof res.data === 'string' ? res.data : '';
};

function appendField(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach(v => {
      if (v === undefined || v === null) return;
      if (typeof v === 'boolean') {
        if (v) fd.append(key, 'on');
      } else {
        fd.append(key, String(v));
      }
    });
    return;
  }
  if (typeof value === 'boolean') {
    // 토글은 켜져있을 때만 전송 (true -> 'on', false -> 전송하지 않음)
    if (value) fd.append(key, 'on');
    return;
  }
  fd.append(key, String(value));
}

export async function convertByPost(stage: Stage, fields: Record<string, unknown>, userId: string) {
  const fd = new FormData();
  fd.append('user_id', userId);
  fd.append('stage', stage);
  Object.entries(fields ?? {}).forEach(([k, v]) => appendField(fd, k, v));

  // end 블록이 포함되어 있다면 {stage}_end=on 키를 추가
  if (fields && (fields as any).end === true) {
    const key = `${stage}_end` as string;
    fd.append(key, 'on');
  }

  // dataset 블록 존재 시 dataset=on 추가
  if (fields && (fields as any).dataset_present === true) {
    const key = `dataset` as string;
    fd.append(key, 'on');
  }

  const api = getFormdataInstance('AI');
  const res = await api.post('/convert', fd, { responseType: 'text' });
  return res.data as string;
}

// 디버그용: GET 요청 후 상태코드를 콘솔에 출력하고 HTML을 반환
export const convertByGetAndLog = async (
  stage: Stage,
  params: Record<string, unknown>,
): Promise<{ status: number; html: string }> => {
  const instance = getFormdataInstance('AI');
  const res = await instance.get('/convert', {
    params: { stage, ...buildGetParams(params) },
    responseType: 'text',
  });
  // 상태 코드 로깅
  console.log('[GET /convert] status:', res.status);
  return { status: res.status, html: typeof res.data === 'string' ? res.data : '' };
};
