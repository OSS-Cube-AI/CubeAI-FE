import PaletteItem from "./PaletteItem";
import Green from '@/assets/block/green.svg';
import Yellow from '@/assets/block/yellow.svg';
import Purple from '@/assets/block/purple.svg';
import Pink from '@/assets/block/pink.svg';

const NODE_DEFS = [
    { label: "데이터 선택하기", type: "choice", color: Green, isToggle: false, parameters: [0.003, 10] },
    { label: "빈 데이터 삭제하기", type: "delete", color: Purple, isToggle: false, parameters: [10] },
    { label: "손실함수 선택하기", type: "loss function", color: Yellow, isToggle: true, parameters: [] },
    { label: "성능 평가하기", type: "performance", color: Pink, isToggle: false, parameters: [] },
  ];
  
export default function NodePalette() {
    return (
      <>
      {NODE_DEFS.map((n) => (
        <div key={n.type} className="relative grid w-[336px] h-28 place-items-center px-4 py-2">
          <img
          src={n.color}
          alt={n.label}
          className="absolute inset-0 w-full h-full object-contain -z-10 pointer-events-none"
          />
          <PaletteItem {...n} />
          </div>
      ))}
      </>
    );
  }