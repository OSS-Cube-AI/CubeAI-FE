import type { BlockItem } from './blocksStore';

// 한글 라벨 ↔ 영문 파라미터 일대일 매핑
const LABEL_TO_PARAM: Record<string, string> = {
  // pre
  데이터셋: 'dataset',
  '테스트 데이터셋 사용 여부': 'is_test',
  '테스트 데이터셋': 'testdataset',
  '테스트 비율': 'a',
  '결측치 제거': 'drop_na',
  '불량 데이터 제거': 'drop_bad',
  '최소 라벨': 'min_label',
  '최대 라벨': 'max_label',
  'X/Y 분할': 'split_xy',
  '리사이즈 크기': 'resize_n',
  '증강 방법': 'augment_method',
  '증강 파라미터': 'augment_param',
  정규화: 'normalize',

  // model
  '입력 이미지 너비': 'input_w',
  '입력 이미지 높이': 'input_h',
  '입력 채널 수': 'input_c',
  'Conv1 필터 수': 'conv1_filters',
  'Conv1 커널 크기': 'conv1_kernel',
  'Conv1 패딩': 'conv1_padding',
  'Conv1 활성함수': 'conv1_activation',
  'Pool1 종류': 'pool1_type',
  'Pool1 크기': 'pool1_size',
  'Pool1 스트라이드': 'pool1_stride',
  'Conv2 사용 여부': 'use_conv2',
  'Conv2 필터 수': 'conv2_filters',
  'Conv2 커널 크기': 'conv2_kernel',
  'Conv2 활성함수': 'conv2_activation',
  '드롭아웃 사용 여부': 'use_dropout',
  '드롭아웃 비율': 'dropout_p',
  'Dense 레이어 유닛 수': 'dense_units',
  'Dense 활성함수': 'dense_activation',
  '출력 클래스 수': 'num_classes',

  // train
  손실함수: 'loss_method',
  옵티마이저: 'optimizer_method',
  학습률: 'learning_rate',
  '에폭 수': 'epochs',
  '배치 크기': 'batch_size',
  '학습 조기 종료': 'patience',

  // eval
  '평가 메트릭': 'metrics',
  '평균 방식': 'average',
  'Top-K 값': 'topk_k',
  '분류 리포트 출력': 'show_classification_report',
  '혼동 행렬 출력': 'show_confusion_matrix',
  '혼동 행렬 정규화': 'cm_normalize',
  '시각화할 예측 샘플 수': 'viz_samples',
  '시각화할 오분류 샘플 수': 'viz_mis',
  '평가 배치 크기': 'eval_batch',
  '클래스 수': 'num_classes',
  '클래스 이름': 'class_names',
  'CPU 강제 사용': 'force_cpu',
};

function coerceNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function blocksToParams(blocks: BlockItem[]): Record<string, unknown> {
  const params: Record<string, unknown> = {};

  for (const b of blocks) {
    // end 블록은 존재 여부만 서버에 전달
    if (b.type === 'end') {
      params.end = true; // 폼데이터에 'on'으로 직렬화됨
      continue;
    }

    const key = LABEL_TO_PARAM[b.label];
    if (!key) continue; // 매핑 없는 라벨은 건너뜀

    // 데이터셋 블록 존재 여부 표시 (dataset=on 용도)
    if (key === 'dataset') {
      params.dataset_present = true;
    }

    // 다중 선택 값 (선택된 값만)
    if (b.isMultiSelect && b.selectedOptions && b.selectedOptions.length > 0) {
      params[key] = b.selectedOptions;
      continue;
    }

    // 드롭다운 값 (선택된 경우만)
    if (b.isDropdown && b.dropdownValue) {
      params[key] = b.dropdownValue;
      continue;
    }

    // 토글 값 (켜져있을 때만 true로 전송)
    if (b.isToggle && b.toggleOn) {
      params[key] = true;
      continue;
    }

    // 문자열 값 (존재할 때만)
    const sv = (b.stringValue ?? '').trim();
    if (sv) {
      const maybeNum = coerceNumber(sv);
      params[key] = maybeNum !== undefined ? maybeNum : sv;
      continue;
    }

    // 숫자 파라미터 (첫 번째 값만, 존재할 때만)
    if (Array.isArray(b.parameters) && b.parameters.length > 0) {
      params[key] = b.parameters[0];
      continue;
    }
  }

  return params;
}
