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

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingRef.current) return;
    
    console.log('handlePointerMove called, draggingRef.current:', draggingRef.current);
    
    // 드래그 중인 요소의 위치를 업데이트
    const position = { x: e.clientX, y: e.clientY };
    console.log('About to call setDragPosition with:', position);
    setDragPosition(position);
    console.log('setDragPosition called successfully');
  }, [setDragPosition]);

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current || !startRef.current) return;

      console.log('Drag ended');
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

      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    },
    [onEnd, handlePointerMove, setDragPosition]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      console.log('Drag started');
      console.log('Pointer event:', e.clientX, e.clientY);
      
      // 텍스트 선택 방지 & 포인터 캡처
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      e.preventDefault();

      draggingRef.current = true;
      setIsDragging(true);

      startRef.current = { x: e.clientX, y: e.clientY };
      startTimeRef.current = performance.now();

      console.log('Adding event listeners for pointerup, pointercancel, pointermove');
      onStart?.(e, { start: startRef.current });

      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      window.addEventListener("pointermove", handlePointerMove);
      
      console.log('Event listeners added, draggingRef.current:', draggingRef.current);
    },
    [onStart, handlePointerUp, handlePointerMove]
  );

  // 드래그 가능한 요소에 바인딩할 핸들러
  const bind = {
    onPointerDown: handlePointerDown,
    // 접근성 옵션(선택)
    role: "button" as const,
    tabIndex: 0 as const,
  };

  return { bind, isDragging };
}
