import { create } from 'zustand';

interface UserState {
  userId: string | null;
}

interface UserActions {
  setUserId: (id: string) => void;
  clearUserId: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>(set => ({
  userId: null,
  setUserId: (id: string) => set({ userId: id }),
  clearUserId: () => set({ userId: null }),
}));
