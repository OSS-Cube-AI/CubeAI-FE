import PaletteItem from "./PaletteItem";

const NODE_DEFS = [
    { label: "데이터 선택하기", type: "choice" },
    { label: "빈 데이터 삭제하기", type: "delete" },
    { label: "손실함수 선택하기", type: "loss function" },
    { label: "성능 평가하기", type: "performance" },
  ];
  
export default function NodePalette() {
    return (
      <div className="w-[336px] h-[74vh] space-y-1 px-4 py-2 text-base">
        {NODE_DEFS.map((n) => (
          <PaletteItem key={n.type} {...n} />
        ))}
      </div>
    );
  }