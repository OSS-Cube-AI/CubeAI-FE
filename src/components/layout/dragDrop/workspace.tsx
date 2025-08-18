import { useEffect, useRef, useState } from "react";
import { useDragCtx } from "@/hooks/dragDrop/DragContext";
import { addBlock, getBlocks, subscribe, type BlockItem, removeBlock } from "@/hooks/dragDrop/blocksStore";
import InitBg from "@/assets/block/init.svg";

export default function Workspace() {
  const { dragging, setDragging } = useDragCtx();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<BlockItem[]>(() => getBlocks());

  useEffect(() => {
    const unsub = subscribe(setBlocks);
    return () => unsub();
  }, []);

  // 최초 고정 블록 시드(존재하지 않을 때만 추가)
  useEffect(() => {
    const current = getBlocks();
    const hasInit = current.some((b) => b.type === "init_fixed");
    if (!hasInit) {
      addBlock({
        id: crypto.randomUUID(),
        type: "init_fixed",
        x: 200,
        y: 60,
        label: "실행시작",
        color: InitBg as unknown as string,
        isToggle: false,
        toggleOn: false,
        parameters: [],
        deletable: false,
      });
    }
  }, []);

  const addBlockAt = (clientX: number, clientY: number) => {
    if (!dragging || !surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const meta = (dragging.meta as any) || {};
    const label: string = meta.label ?? dragging.type;
    const color: string | undefined = meta.color;
    const isToggle: boolean = !!meta.isToggle;
    const toggleOn: boolean = !!meta.toggleOn;
    const parameters: number[] = Array.isArray(meta.parameters) ? meta.parameters : [];

    const block: BlockItem = {
      id: crypto.randomUUID(),
      type: dragging.type,
      x,
      y,
      label,
      color,
      isToggle,
      toggleOn,
      parameters,
      deletable: true,
    };

    addBlock(block);
    setDragging(null);
  };

  useEffect(() => {
    if (!dragging) return;
    const onUp = (e: PointerEvent) => addBlockAt(e.clientX, e.clientY);
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [dragging]);

  const handlePointerUp = (e: React.PointerEvent) => {
    addBlockAt(e.clientX, e.clientY);
  };

  return (
    <div
      ref={surfaceRef}
      className="relative flex-1 bg-white"
      onPointerUp={handlePointerUp}
    >
      {blocks.map((b) => (
        <div key={b.id} className="absolute z-[999]" style={{ left: b.x, top: b.y }}>
          <div className="flex w-[336px] my-2 text-white text-xl select-none">
            {b.color && (
              <img src={b.color} alt="bg" className="absolute inset-0 w-[336px] h-28 object-contain pointer-events-none select-none z-0" draggable={false} />)
            }
            <div className="flex items-center w-full h-28 justify-end relative px-4">
              <div className="flex items-center justify-start w-full h-full text-center">
                {b.label}
              </div>
              {b.parameters.map((p, i) => (
                <div key={i} className="w-14 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center">
                  <div className="w-full text-center text-black text-sm">{p}</div>
                </div>
              ))}
              {b.isToggle && (
                <div className="ml-[80px] mt-[5px]">
                  <div className={`relative w-12 h-9 rounded-[30px] overflow-hidden ${b.toggleOn ? 'bg-sky-300' : 'bg-neutral-200 border border-zinc-200'}`}>
                    <div className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow ${b.toggleOn ? 'left-[3px] translate-x-[22px]' : 'left-[3px]'} `} />
                  </div>
                </div>
              )}
              {b.deletable !== false && (
                <button
                  className="absolute top-1 right-1 z-[1000] size-6 leading-6 text-center rounded-full bg-white/90 text-zinc-700 hover:bg-red-500 hover:text-white transition"
                  onClick={(e) => { e.stopPropagation(); removeBlock(b.id); }}
                  title="Remove"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
