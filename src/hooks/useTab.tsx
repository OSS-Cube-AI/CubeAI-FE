import { motion } from 'motion/react';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function useTab<T>(
  defaultTab: T,
  layoutId: string = 'activeTab',
  onTabChange?: (newTab: T) => void,
) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  // 외부에서 activeTab을 설정할 수 있는 함수
  const setActiveTabExternal = (newTab: T) => {
    setActiveTab(newTab);
    if (onTabChange) {
      onTabChange(newTab);
    }
  };

  function TabsList({ children }: { children: React.ReactNode }) {
    const childArray = React.Children.toArray(children);

    return (
      <div className="flex h-full">
        {childArray.map((child, index) => {
          if (React.isValidElement<{ isFirst?: boolean; isLast?: boolean }>(child)) {
            return React.cloneElement(child, {
              isFirst: index === 0,
              isLast: index === childArray.length - 1,
            });
          }
          return child;
        })}
      </div>
    );
  }

  function TabTrigger({
    children,
    value,
    isFirst,
    isLast,
    disabled = false,
  }: {
    children: React.ReactNode;
    value: T;
    isFirst?: boolean;
    isLast?: boolean;
    disabled?: boolean;
  }) {
    const isActive = activeTab === value;

    const baseStyle = twMerge(
      'inline-flex items-center justify-center w-full relative',
      'transition-all duration-200 min-h-15 border-[2px] border-b-0 border-r-0 border-[#C3CCD9]',
    );
    const radiusStyle = isFirst
      ? 'rounded-tl-[30px]'
      : isLast
        ? 'rounded-tr-[30px] !border-r-[2px]'
        : '';

    const activeStyle =
      'bg-white text-[#0090FB] shadow-[0_2px_4px_rgba(0,0,0,0.05)] z-10 cursor-pointer';
    const inactiveStyle = 'bg-[#F5F7FA] text-[#89919D] cursor-pointer';
    const disabledStyle = 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'; // 비활성화 스타일

    const combinedStyle = disabled ? disabledStyle : isActive ? activeStyle : inactiveStyle;

    const handleClick = () => {
      if (!disabled) {
        setActiveTab(value);
        if (onTabChange) {
          onTabChange(value);
        }
      }
    };

    return (
      <div className={twMerge(baseStyle, radiusStyle, combinedStyle)} onClick={handleClick}>
        <span className="inline-block px-4 py-2 text-[15px] font-medium whitespace-pre-line">
          {children}
        </span>
        {isActive && (
          <motion.div
            layoutId={layoutId}
            className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[#0090FB] rounded-t"
          />
        )}
      </div>
    );
  }

  function TabsContainer({ children }: { children: React.ReactNode }) {
    // h-[85vh]를 flex-1로 변경하여 남은 공간을 모두 차지하도록 함
    return (
      <div className="flex flex-col flex-1 w-full overflow-y-scroll scrollbar-hide">{children}</div>
    );
  }

  function TabContent({ children, value }: { children: React.ReactNode; value: T }) {
    if (activeTab !== value) return null;
    // h-[56vh]를 flex-1로 변경하여 TabsContainer 내부의 남은 공간을 채우도록 함
    return <div className="w-full flex-1">{children}</div>;
  }

  return {
    TabsList,
    TabTrigger,
    TabsContainer,
    TabContent,
    activeTab,
    setActiveTab: setActiveTabExternal,
  };
}
