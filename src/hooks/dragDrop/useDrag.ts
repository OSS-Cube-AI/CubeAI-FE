// useDrag.ts
import { useCallback, useRef, useState } from "react";
import { useDragCtx } from "./DragContext";

type Point = { x: number; y: number };

type DragStartInfo = { start: Point };
type DragEndInfo = {
  start: Point;
  end: Point;
  delta: Point; // 드래그 중 이동 거리
  durationMs: number; // 드래그 지속 시간
};

export interface DragData {
  type: string;
  meta?: Record<string, unknown>;
}

/**
 * 드래그 훅 옵션 타입 -> 드래그 시작하면 액션 시작, 드롭하면 액션 종료
 * onStart: 드래그 시작 시 호출
 * onEnd: 드래그 종료 시 호출
 */
type UseDragOptions = {
  // 드래그 시작 시 호출
  onStart?: (e: PointerEvent | React.PointerEvent, info: DragStartInfo) => void;
  // 드래그 종료 시 호출
  onEnd?: (e: PointerEvent | React.PointerEvent, info: DragEndInfo) => void;
};

/**
 * 드래그 훅
 * @param options 드래그 훅 옵션 (onStart, onEnd)
 * @returns 드래그 가능한 요소에 도착한 핸들러
 */
export function useDrag(options: UseDragOptions = {}) {
  const { onStart, onEnd } = options;
  const { setDragPosition } = useDragCtx();

  const draggingRef = useRef(false);
  const startRef = useRef<Point | null>(null);
  const startTimeRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const cleanupListeners = useCallback((handlePointerUp: any, handlePointerCancel: any, handlePointerMove: any) => {
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerCancel);
    window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingRef.current) return;

    const position = { x: e.clientX, y: e.clientY };
    setDragPosition(position);
  }, [setDragPosition]);

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current || !startRef.current) return;

      draggingRef.current = false;
      setIsDragging(false);

      const end = { x: e.clientX, y: e.clientY };
      const delta = {
        x: end.x - startRef.current.x,
        y: end.y - startRef.current.y,
      };
      const durationMs = performance.now() - startTimeRef.current;

      // 드래그 위치 초기화
      setDragPosition(null);

      onEnd?.(e, {
        start: startRef.current,
        end,
        delta,
        durationMs,
      });

      cleanupListeners(handlePointerUp as any, handlePointerCancel as any, handlePointerMove as any);
    },
    [onEnd, handlePointerMove, setDragPosition, cleanupListeners]
  );

  const handlePointerCancel = useCallback(() => {
    if (!draggingRef.current) return;
    // 스크롤/제스처 등으로 취소된 경우: 종료 콜백 없이 상태만 정리
    draggingRef.current = false;
    setIsDragging(false);
    setDragPosition(null);
    cleanupListeners(handlePointerUp as any, handlePointerCancel as any, handlePointerMove as any);
  }, [cleanupListeners, handlePointerMove, handlePointerUp, setDragPosition]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 제스처 충돌 방지
      (e.currentTarget as HTMLElement).style.touchAction = "none";
      // 텍스트 선택 방지
      e.preventDefault();

      draggingRef.current = true;
      setIsDragging(true);

      startRef.current = { x: e.clientX, y: e.clientY };
      startTimeRef.current = performance.now();

      onStart?.(e, { start: startRef.current });

      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerCancel);
      window.addEventListener("pointermove", handlePointerMove);
    },
    [onStart, handlePointerUp, handlePointerMove, handlePointerCancel]
  );

  // 드래그 가능한 요소에 바인딩할 핸들러
  const bind = {
    onPointerDown: handlePointerDown,
    role: "button" as const,
    tabIndex: 0 as const,
  };

  return { bind, isDragging };
}
