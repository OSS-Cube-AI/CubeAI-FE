// ────────────────────────────────────────────────
// PaletteItem.tsx
// ────────────────────────────────────────────────
import { useDrag } from './useDrag';
import { DragData, useDragCtx } from './DragContext';
import { useEffect, useState } from 'react';

interface PaletteItemProps {
  label: string;
  type: string;
  color: string;
  isToggle: boolean;
  parameters: number[];
  isString?: boolean;
  stringDefault?: string;
  isMultiSelect?: boolean;
  multiSelectOptions?: string[];
  multiSelectDefaults?: string[];
  isDropdown?: boolean;
  dropdownOptions?: string[];
  dropdownDefault?: string;
}

export default function PaletteItem({
  label,
  type,
  isToggle,
  parameters,
  color,
  isString,
  stringDefault,
  isMultiSelect,
  multiSelectOptions,
  multiSelectDefaults,
  isDropdown,
  dropdownOptions,
  dropdownDefault,
}: PaletteItemProps) {
  const { setDragging } = useDragCtx();
  const [isOn, setIsOn] = useState(false);
  const [paramValues, setParamValues] = useState<string[]>(parameters.map(p => p.toString()));
  const [stringValue, setStringValue] = useState<string>(stringDefault || '');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(multiSelectDefaults || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string>(dropdownDefault || '');
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  useEffect(() => {
    setParamValues(parameters.map(p => p.toString()));
  }, [parameters]);

  useEffect(() => {
    if (stringDefault) {
      setStringValue(stringDefault);
    }
  }, [stringDefault]);

  useEffect(() => {
    if (multiSelectDefaults) {
      setSelectedOptions(multiSelectDefaults);
    }
  }, [multiSelectDefaults]);

  useEffect(() => {
    if (dropdownDefault) {
      setDropdownValue(dropdownDefault);
    }
  }, [dropdownDefault]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !event.target) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // 드롭다운 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownMenuOpen && !event.target) {
        setIsDropdownMenuOpen(false);
      }
    };

    if (isDropdownMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownMenuOpen]);

  const { bind, isDragging } = useDrag({
    onStart: () => {
      // 현재 UI 상태(토글, 입력값)를 meta에 반영
      const parsedParams = paramValues.map((v, i) => {
        const n = Number(v);
        return Number.isNaN(n) ? parameters[i] : n;
      });

      // parameters는 숫자만 포함하고, 문자열 값은 별도 속성으로 관리
      setDragging({
        type,
        meta: {
          label,
          color,
          isToggle,
          toggleOn: isOn,
          parameters: parsedParams,
          isString,
          stringValue,
          isMultiSelect,
          selectedOptions,
          isDropdown,
          dropdownValue,
        },
      } satisfies DragData);
    },
  });

  const sanitizeNumber = (raw: string) => raw.replace(/[^0-9.\-]/g, '');
  const formatToFive = (raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return '';
    return (Math.round(n * 1e5) / 1e5).toFixed(5);
  };

  return (
    <div
      {...bind}
      className={`flex w-full my-2  text-white text-xl ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center  w-full h-full justify-end">
        {/* 라벨 이름 */}
        <div className="flex items-center justify-start w-full h-full text-center">{label}</div>

        {/* 파라미터 값 입력 */}
        {paramValues.map((value, index) => (
          <div
            key={index}
            className="w-14 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center"
          >
            <input
              value={value}
              onChange={e => {
                const next = [...paramValues];
                next[index] = sanitizeNumber(e.target.value);
                setParamValues(next);
              }}
              onBlur={() => {
                const next = [...paramValues];
                // 비워두면 초기 parameters 값으로 다시 돌아와~ 돌아와 (5자리 포맷)
                if (next[index] === '') {
                  next[index] = formatToFive(String(parameters[index]));
                } else {
                  next[index] = formatToFive(next[index]);
                }
                setParamValues(next);
              }}
              onPointerDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              className="w-full text-center text-black text-sm outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              inputMode="decimal"
              placeholder={formatToFive(String(parameters[index]))}
            />
          </div>
        ))}

        {/* 문자열 입력 컴포넌트 */}
        {isString && (
          <div className="w-28 h-7 bg-white rounded-full mt-[5px] ml-[10px] flex items-center justify-center">
            <input
              value={stringValue}
              onChange={e => {
                setStringValue(e.target.value);
              }}
              onBlur={e => {
                if (e.target.value.trim() === '') {
                  setStringValue(stringDefault || '');
                }
              }}
              onPointerDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              className="w-full text-center text-black text-sm outline-none bg-transparent px-2"
              placeholder={stringDefault || '텍스트 입력'}
            />
          </div>
        )}

        {/* 드롭다운 컴포넌트 */}
        {isDropdown && dropdownOptions && (
          <div className="relative ml-[10px] mt-[5px]" onPointerDown={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsDropdownMenuOpen(!isDropdownMenuOpen);
              }}
              onPointerDown={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              className="w-28 h-7 bg-white rounded-full text-black text-xs px-2 flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-300 cursor-pointer"
            >
              {dropdownValue || '선택'}
            </button>

            {isDropdownMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-28 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-[99999]">
                {dropdownOptions.map(option => (
                  <button
                    key={option}
                    onClick={e => {
                      e.stopPropagation();
                      setDropdownValue(option);
                      setIsDropdownMenuOpen(false);
                    }}
                    onPointerDown={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    className="w-full text-left px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm border-b border-gray-200 last:border-b-0 text-black font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 다중 선택 드롭다운 컴포넌트 */}
        {isMultiSelect && multiSelectOptions && (
          <div className="relative ml-[10px] mt-[5px]" onPointerDown={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              onPointerDown={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              className="w-28 h-7 bg-white rounded-full text-black text-xs px-2 flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-300 cursor-pointer"
            >
              {selectedOptions.length > 0 ? `${selectedOptions.length}개 선택` : '선택'}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-28 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-[99999]">
                {multiSelectOptions.map(option => (
                  <label
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm text-black font-medium"
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedOptions([...selectedOptions, option]);
                        } else {
                          setSelectedOptions(selectedOptions.filter(o => o !== option));
                        }
                      }}
                      className="mr-2"
                      onClick={e => e.stopPropagation()}
                      onPointerDown={e => e.stopPropagation()}
                      onMouseDown={e => e.stopPropagation()}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 토글 버튼 유/무 */}
        {isToggle && (
          <div
            className="ml-[80px] mt-[5px]"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              setIsOn(v => !v);
            }}
            role="switch"
            aria-checked={isOn}
            tabIndex={0}
          >
            <div
              className={`relative w-12 h-9 rounded-[30px] overflow-hidden ${isOn ? 'bg-sky-300' : 'bg-neutral-200 border border-zinc-200'} transition-colors duration-200 ease-in-out`}
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-[0_0_2px_0_rgba(0,0,0,0.05)] left-[3px] transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-[22px]' : ''}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
