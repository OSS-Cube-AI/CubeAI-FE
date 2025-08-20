import { create } from 'zustand';

interface UserState {
  userId: string | null;
}

interface UserActions {
  setUserId: (id: string | null) => void;
  clearUserId: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>(set => ({
  userId: null,
  setUserId: (id: string | null) => set({ userId: id }),
  clearUserId: () => set({ userId: null }),
}));
