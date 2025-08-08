import { useDragCtx } from "./DragContext";

export default function DragPreview() {
  const { dragging, dragPosition } = useDragCtx();

  // 디버깅을 위한 로그
  console.log('DragPreview render:', { dragging, dragPosition });

  if (!dragging || !dragPosition) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 px-3 py-2 rounded border border-slate-300 bg-sky-100 shadow-lg opacity-80"
      style={{
        left: dragPosition.x + 10,
        top: dragPosition.y + 10,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {dragging.type === 'choice' && '데이터 선택하기'}
      {dragging.type === 'delete' && '빈 데이터 삭제하기'}
      {dragging.type === 'loss function' && '손실함수 선택하기'}
      {dragging.type === 'performance' && '성능 평가하기'}
    </div>
  );
} 