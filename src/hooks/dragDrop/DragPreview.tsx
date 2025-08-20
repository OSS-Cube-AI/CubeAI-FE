import { useDragCtx } from './DragContext';

export default function DragPreview() {
  const { dragging, dragPosition } = useDragCtx();
  if (!dragging || !dragPosition) return null;

  const meta = (dragging.meta as any) || {};
  const label: string = meta.label ?? dragging.type;
  const color: string | undefined = meta.color;
  const isToggle: boolean = !!meta.isToggle;
  const toggleOn: boolean = !!meta.toggleOn;
  const parameters: number[] = Array.isArray(meta.parameters) ? meta.parameters : [];

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: dragPosition.x + 10,
        top: dragPosition.y + 10,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex w-[336px] my-2 text-white text-xl select-none relative">
        {color && (
          <img
            src={color}
            alt="bg"
            className="absolute inset-0 w-[336px] h-28 object-contain"
            draggable={false}
          />
        )}
        <div className="flex items-center w-full h-28 justify-end relative px-4">
          <div className="flex items-center justify-start w-full h-full text-center">{label}</div>
          {parameters.map((p: number, i: number) => (
            <div
              key={i}
              className="w-14 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center"
            >
              <div className="w-full text-center text-black text-sm">{p}</div>
            </div>
          ))}
          {isToggle && (
            <div className="ml-[80px] mt-[5px]">
              <div
                className={`relative w-12 h-9 rounded-[30px] overflow-hidden ${toggleOn ? 'bg-sky-300' : 'bg-neutral-200 border border-zinc-200'}`}
              >
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow ${toggleOn ? 'left-[3px] translate-x-[22px]' : 'left-[3px]'} `}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
