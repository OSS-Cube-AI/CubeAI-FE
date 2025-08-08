import { createContext, useContext, useState, ReactNode } from "react";

/* ------------------------- 타입 정의 ------------------------- */
export interface DragData {
  type: string;
  meta?: Record<string, unknown>;
}

export interface DragContextValue {
  dragging: DragData | null;
  setDragging: (d: DragData | null) => void;
  dragPosition: { x: number; y: number } | null;
  setDragPosition: (p: { x: number; y: number } | null) => void;
}

/* ------------------------- 컨텍스트 ------------------------- */
// 1) 컨텍스트 객체
const DragContext = createContext<DragContextValue>({
  dragging: null,
  setDragging: () => {
    throw new Error("🚑 <DragProvider>로 감싸지 않은 곳에서 setDragging을 호출했습니다!");
  },
  dragPosition: null,
  setDragPosition: () => {
    throw new Error("🚑 <DragProvider>로 감싸지 않은 곳에서 setDragPosition을 호출했습니다!");
  },
});

// 2) 커스텀 훅
export const useDragCtx = () => {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error("🚑 useDragCtx는 <DragProvider> 내부에서만 사용해야 합니다!");
  return ctx;
};

/* ------------------------- 프로바이더 ------------------------- */
export function DragProvider({ children }: { children: ReactNode }) {
  const [dragging, setDragging] = useState<DragData | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  return (
    <DragContext.Provider value={{ dragging, setDragging, dragPosition, setDragPosition }}>
      {children}
    </DragContext.Provider>
  );
}
