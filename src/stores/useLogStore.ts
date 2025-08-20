import { create } from 'zustand';
import type { editorStep } from '@/types/editor';

interface LogState {
  logsByStage: Record<editorStep, string[]>;
  addLog: (stage: editorStep, newLog: string) => void;
  clearLogs: (stage: editorStep) => void;
}

export const useLogStore = create<LogState>(set => ({
  logsByStage: {
    pre: [],
    model: [],
    train: [],
    eval: [],
  },

  // 액션 구현
  addLog: (stage, newLog) =>
    set(state => ({
      logsByStage: {
        ...state.logsByStage,
        [stage]: [...state.logsByStage[stage], newLog],
      },
    })),

  clearLogs: stage =>
    set(state => ({
      logsByStage: {
        ...state.logsByStage,
        [stage]: [], // 해당 단계의 로그만 빈 배열로 덮어쓰기
      },
    })),
}));
