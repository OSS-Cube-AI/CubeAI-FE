import { useMutation } from '@tanstack/react-query';
import { AI_BACKEND_URL } from '@/constants/api';

/** ----- 공통 타입 ----- */
export type Stage = 'pre' | 'model' | 'train' | 'eval' | 'all';

const AI_BASE = AI_BACKEND_URL;

type Primitive = string | number | boolean | null | undefined;
export type FieldValue = Primitive | Primitive[];

/** 서버 스펙에 맞춘 FormData 직렬화 유틸
 * - stage는 string 필수
 * - checkbox: boolean을 "true"/"false"로 전송
 * - checkbox[]: 같은 키로 여러 번 append (e.g. metrics)
 * - number: 문자열로 변환
 * - null/undefined는 무시
 */
export function toFormData(stage: Stage, fields: Record<string, FieldValue>, userId: string) {
  const fd = new FormData();
  fd.append('user_id', userId);
  fd.append('stage', stage);

  Object.entries(fields ?? {}).forEach(([k, v]) => {
    if (v === null || v === undefined) return;

    if (Array.isArray(v)) {
      // checkbox[] 같은 다중 선택은 같은 키로 반복 append
      v.forEach(item => {
        if (item === null || item === undefined) return;
        if (typeof item === 'boolean') {
          // 토글은 켜져있을 때만 전송
          if (item) fd.append(k, 'on');
        } else {
          fd.append(k, String(item));
        }
      });
      return;
    }

    if (typeof v === 'boolean') {
      // 토글은 켜져있을 때만 전송 (true -> 'on', false -> 전송하지 않음)
      if (v) fd.append(k, 'on');
    } else {
      fd.append(k, String(v));
    }
  });

  return fd;
}

/** ----- 스펙 기반 필드 타입 (선택) ----- */
export interface PreFields {
  dataset?: string;
  is_test?: 'true' | 'false';
  testdataset?: string;
  a?: number;
  drop_na?: boolean;
  drop_bad?: boolean;
  min_label?: number;
  max_label?: number;
  split_xy?: boolean;
  resize_n?: number;
  augment_method?: 'rotate' | 'hflip' | 'vflip' | 'translate';
  augment_param?: number;
  normalize?: '0-1' | '-1-1';
}

export interface ModelFields {
  input_w?: number;
  input_h?: number;
  input_c?: 1 | 3;
  conv1_filters?: number;
  conv1_kernel?: number;
  conv1_padding?: 'same' | 'valid';
  conv1_activation?: string;
  pool1_type?: 'max' | 'avg';
  pool1_size?: number;
  pool1_stride?: number;
  use_conv2?: boolean;
  conv2_filters?: number;
  conv2_kernel?: number;
  conv2_activation?: string;
  use_dropout?: boolean;
  dropout_p?: number;
  dense_units?: number;
  dense_activation?: string;
  num_classes?: number;
}

export interface TrainFields {
  loss_method?: 'CrossEntropy' | 'MSE';
  optimizer_method?: 'Adam' | 'SGD' | 'RMSprop';
  learning_rate?: number;
  epochs?: number;
  batch_size?: number;
  patience?: number;
}

export interface EvalFields {
  metrics?: string[]; // checkbox[]
  average?: string; // "macro" 등
  topk_k?: number;
  show_classification_report?: boolean;
  show_confusion_matrix?: boolean;
  cm_normalize?: boolean;
  viz_samples?: number;
  viz_mis?: number;
  eval_batch?: number;
  num_classes?: number;
  class_names?: string; // "cat,dog,..." 형태
  force_cpu?: boolean;
}

export type ConvertFields =
  | PreFields
  | ModelFields
  | TrainFields
  | EvalFields
  | Record<string, FieldValue>;

/** ----- /convert : 코드 생성/변환 (form-data) ----- */
export type ConvertArgs = { stage: Stage; fields: ConvertFields; userId: string };

export async function postConvert({ stage, fields, userId }: ConvertArgs): Promise<string> {
  const fd = toFormData(stage, fields as Record<string, FieldValue>, userId);

  // Debug: FormData 내용을 콘솔에 출력
  try {
    const debug: Record<string, any> = {};
    fd.forEach((v, k) => {
      if (k.endsWith('[]')) {
        if (!debug[k]) debug[k] = [];
        (debug[k] as any[]).push(v);
      } else if (debug[k] !== undefined) {
        if (!Array.isArray(debug[k])) debug[k] = [debug[k]];
        (debug[k] as any[]).push(v);
      } else {
        debug[k] = v;
      }
    });
    // eslint-disable-next-line no-console
    console.debug('[fetch]', 'POST', `${AI_BASE}/convert`, debug);
  } catch {}

  const res = await fetch(`${AI_BASE}/convert`, {
    method: 'POST',
    body: fd,
    credentials: 'include',
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text; // text/plain
}

export function useConvertMutation() {
  return useMutation({
    mutationFn: (args: ConvertArgs) => postConvert(args),
  });
}
