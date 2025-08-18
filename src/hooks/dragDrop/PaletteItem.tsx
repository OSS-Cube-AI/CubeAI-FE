// ────────────────────────────────────────────────
// PaletteItem.tsx
// ────────────────────────────────────────────────
import { useDrag } from "./useDrag";
import { DragData, useDragCtx } from "./DragContext";
import { useEffect, useState } from "react";

interface PaletteItemProps {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
}

export default function PaletteItem({ label, type, isToggle, parameters }: PaletteItemProps) {
  const { setDragging } = useDragCtx();
  const [isOn, setIsOn] = useState(false);
  const [paramValues, setParamValues] = useState<string[]>(parameters.map((p) => p.toString()));

  useEffect(() => {
    setParamValues(parameters.map((p) => p.toString()));
  }, [parameters]);

  const { bind, isDragging } = useDrag({
    onStart: () => {
      console.log('PaletteItem onStart called with type:', type);
      setDragging({ type } satisfies DragData);
      console.log('setDragging called with:', { type });
    },
    onEnd: () => {
      console.log('PaletteItem onEnd called');
      setDragging(null);
      console.log('setDragging called with null');
    },
  });

  const sanitizeNumber = (raw: string) => raw.replace(/[^0-9.\-]/g, "");
  const formatToFive = (raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return "";
    return (Math.round(n * 1e5) / 1e5).toFixed(5);
  };

  return (
    <div
      {...bind}
      className={`flex w-full my-2  text-white text-xl ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center  w-full h-full justify-end">
        {/* 라벨 이름 */}
        <div className="flex items-center justify-start w-full h-full text-center">
          {label}
        </div>

        {/* 파라미터 값 입력 버튼*/}
        {paramValues.map((value, index) => (
          <div key={index} className="w-14 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center">
            <input
              value={value}
              onChange={(e) => {
                const next = [...paramValues];
                next[index] = sanitizeNumber(e.target.value);
                setParamValues(next);
              }}
              onBlur={() => {
                const next = [...paramValues];
                // 비워두면 초기 parameters 값으로 복원 (5자리 포맷)
                if (next[index] === "") {
                  next[index] = formatToFive(String(parameters[index]));
                } else {
                  next[index] = formatToFive(next[index]);
                }
                setParamValues(next);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-center text-black text-sm outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              inputMode="decimal"
              placeholder={formatToFive(String(parameters[index]))}
            />
          </div>
        ))}

        {/* 토글 버튼 유무 */}
        {isToggle && (
          <div
            className="ml-[80px] mt-[5px]"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setIsOn((v) => !v); }}
            role="switch"
            aria-checked={isOn}
            tabIndex={0}
          >
            <div className={`relative w-12 h-9 rounded-[30px] overflow-hidden ${isOn ? 'bg-sky-300' : 'bg-neutral-200 border border-zinc-200'} transition-colors duration-200 ease-in-out`}>
              <div className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-[0_0_2px_0_rgba(0,0,0,0.05)] left-[3px] transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-[22px]' : ''}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
