import type { BlockItem } from './blocksStore';

const pickLast = (arr: BlockItem[] | undefined) =>
  arr && arr.length ? arr[arr.length - 1] : undefined;

export function blocksToParams(blocks: BlockItem[]): Record<string, unknown> {
  const byLabel: Record<string, BlockItem[]> = {};
  for (const b of blocks) {
    if (!byLabel[b.label]) byLabel[b.label] = [];
    byLabel[b.label].push(b);
  }

  const getNum = (label: string): number | undefined => {
    const b = pickLast(byLabel[label]);
    if (!b) return undefined;
    if (b.parameters?.length) return b.parameters[0] as number;
    const s = (b.stringValue ?? '').trim();
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const getStr = (label: string): string | undefined => {
    const b = pickLast(byLabel[label]);
    if (!b) return undefined;
    if (b.isDropdown && b.dropdownValue) return b.dropdownValue;
    const s = (b.stringValue ?? '').trim();
    return s || undefined;
  };

  const getToggle = (label: string): boolean => {
    const b = pickLast(byLabel[label]);
    return !!b?.toggleOn;
  };

  const getMulti = (label: string): string[] | undefined => {
    const b = pickLast(byLabel[label]);
    return b?.selectedOptions && b.selectedOptions.length ? b.selectedOptions : undefined;
  };

  const params: Record<string, unknown> = {};

  // pre
  const dataset = getStr('데이터셋');
  if (dataset) params.dataset = dataset;
  if (getToggle('테스트 여부')) params.is_test = 'true';
  const testdataset = getStr('테스트 데이터셋');
  if (testdataset) params.testdataset = testdataset;
  const a = getNum('테스트 비율');
  if (a !== undefined) params.a = a;
  if (getToggle('결측치 제거')) params.drop_na = true;
  if (getToggle('불량 데이터 제거')) params.drop_bad = true;
  const min_label = getNum('최소 라벨');
  if (min_label !== undefined) params.min_label = min_label;
  const max_label = getNum('최대 라벨');
  if (max_label !== undefined) params.max_label = max_label;
  if (getToggle('X/Y 분할')) params.split_xy = true;
  const resize_n = getNum('리사이즈 크기');
  if (resize_n !== undefined) params.resize_n = resize_n;
  const augment_method = getStr('증강 방법');
  if (augment_method) params.augment_method = augment_method;
  const augment_param = getNum('증강 파라미터');
  if (augment_param !== undefined) params.augment_param = augment_param;
  const normalize = getStr('정규화');
  if (normalize) params.normalize = normalize;

  // model
  const input_w = getNum('입력 이미지 너비');
  if (input_w !== undefined) params.input_w = input_w;
  const input_h = getNum('입력 이미지 높이');
  if (input_h !== undefined) params.input_h = input_h;
  const input_c = getNum('입력 채널 수');
  if (input_c !== undefined) params.input_c = input_c;
  const conv1_filters = getNum('Conv1 필터 수');
  if (conv1_filters !== undefined) params.conv1_filters = conv1_filters;
  const conv1_kernel = getNum('Conv1 커널 크기');
  if (conv1_kernel !== undefined) params.conv1_kernel = conv1_kernel;
  const conv1_padding = getStr('Conv1 패딩');
  if (conv1_padding) params.conv1_padding = conv1_padding;
  const conv1_activation = getStr('Conv1 활성함수');
  if (conv1_activation) params.conv1_activation = conv1_activation;
  const pool1_type = getStr('Pool1 종류');
  if (pool1_type) params.pool1_type = pool1_type;
  const pool1_size = getNum('Pool1 크기');
  if (pool1_size !== undefined) params.pool1_size = pool1_size;
  const pool1_stride = getNum('Pool1 스트라이드');
  if (pool1_stride !== undefined) params.pool1_stride = pool1_stride;
  if (getToggle('Conv2 사용 여부')) params.use_conv2 = true;
  const conv2_filters = getNum('Conv2 필터 수');
  if (conv2_filters !== undefined) params.conv2_filters = conv2_filters;
  const conv2_kernel = getNum('Conv2 커널 크기');
  if (conv2_kernel !== undefined) params.conv2_kernel = conv2_kernel;
  const conv2_activation = getStr('Conv2 활성함수');
  if (conv2_activation) params.conv2_activation = conv2_activation;
  if (getToggle('드롭아웃 사용 여부')) params.use_dropout = true;
  const dropout_p = getNum('드롭아웃 비율');
  if (dropout_p !== undefined) params.dropout_p = dropout_p;
  const dense_units = getNum('Dense 레이어 유닛 수');
  if (dense_units !== undefined) params.dense_units = dense_units;
  const dense_activation = getStr('Dense 활성함수');
  if (dense_activation) params.dense_activation = dense_activation;
  const num_classes_model = getNum('출력 클래스 수');
  if (num_classes_model !== undefined) params.num_classes = num_classes_model;

  // train
  const loss_method = getStr('손실함수');
  if (loss_method) params.loss_method = loss_method;
  const optimizer_method = getStr('옵티마이저');
  if (optimizer_method) params.optimizer_method = optimizer_method;
  const learning_rate = getNum('학습률');
  if (learning_rate !== undefined) params.learning_rate = learning_rate;
  const epochs = getNum('에폭 수');
  if (epochs !== undefined) params.epochs = epochs;
  const batch_size = getNum('배치 크기');
  if (batch_size !== undefined) params.batch_size = batch_size;
  const patience = getNum('학습 조기 종료');
  if (patience !== undefined) params.patience = patience;

  // eval
  const metrics = getMulti('평가 메트릭');
  if (metrics) params['metrics'] = metrics;
  const average = getStr('평균 방식');
  if (average) params.average = average;
  const topk_k = getNum('Top-K 값');
  if (topk_k !== undefined) params.topk_k = topk_k;
  if (getToggle('분류 리포트 출력')) params.show_classification_report = true;
  if (getToggle('혼동 행렬 출력')) params.show_confusion_matrix = true;
  if (getToggle('혼동 행렬 정규화')) params.cm_normalize = true;
  const viz_samples = getNum('시각화할 예측 샘플 수');
  if (viz_samples !== undefined) params.viz_samples = viz_samples;
  const viz_mis = getNum('시각화할 오분류 샘플 수');
  if (viz_mis !== undefined) params.viz_mis = viz_mis;
  const eval_batch = getNum('평가 배치 크기');
  if (eval_batch !== undefined) params.eval_batch = eval_batch;
  const num_classes_eval = getNum('클래스 수');
  if (num_classes_eval !== undefined) params.num_classes = num_classes_eval;
  const class_names = getStr('클래스 이름');
  if (class_names) params.class_names = class_names;
  if (getToggle('CPU 강제 사용')) params.force_cpu = true;

  return params;
}
