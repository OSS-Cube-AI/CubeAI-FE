import { create } from 'zustand';

type ConvertResultState = {
  code: string;
  loading: boolean;
  error: string | null;
  setCode: (code: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useConvertResultStore = create<ConvertResultState>(set => ({
  code: '',
  loading: false,
  error: null,
  setCode: code => set({ code }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
