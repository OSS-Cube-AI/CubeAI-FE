export type editorStep = 'pre' | 'model' | 'train' | 'eval';

export const editorStepKor: Record<editorStep, string> = {
  pre: '전처리',
  model: '모델',
  train: '학습',
  eval: '평가',
};
