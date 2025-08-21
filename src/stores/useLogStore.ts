import { create } from 'zustand';
import type { editorStep } from '@/types/editor';

const MAX_LOG_CHARS = 200;

interface LogState {
  logsByStage: Record<editorStep, string[]>;
  addLog: (stage: editorStep, newLog: string) => void;
  addLogs: (stage: editorStep, newLogs: string[]) => void;
  clearLogs: (stage: editorStep) => void;
}

export const useLogStore = create<LogState>(set => ({
  logsByStage: {
    pre: [],
    model: [],
    train: [],
    eval: [],
  },

  // 단건 추가
  addLog: (stage, newLog) =>
    set(state => ({
      logsByStage: {
        ...state.logsByStage,
        [stage]: [
          ...state.logsByStage[stage],
          newLog.length > MAX_LOG_CHARS ? newLog.slice(0, MAX_LOG_CHARS) : newLog,
        ],
      },
    })),

  // 배치 추가 (렌더링 부하 줄이기)
  addLogs: (stage, newLogs) =>
    set(state => {
      const truncated = newLogs.map(l =>
        l.length > MAX_LOG_CHARS ? l.slice(0, MAX_LOG_CHARS) : l,
      );
      return {
        logsByStage: {
          ...state.logsByStage,
          [stage]: [...state.logsByStage[stage], ...truncated],
        },
      };
    }),

  clearLogs: stage =>
    set(state => ({
      logsByStage: {
        ...state.logsByStage,
        [stage]: [], // 해당 단계의 로그만 빈 배열로 덮어쓰기
      },
    })),
}));
