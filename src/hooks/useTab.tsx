import { motion } from 'motion/react';
import React, { useState } from 'react';

export function useTab<T>(defaultTab: T) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  function TabsList({ children }: { children: React.ReactNode }) {
    const childArray = React.Children.toArray(children);

    return (
      <div className="flex border-b-[2px] border-gray-200">
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
  }: {
    children: React.ReactNode;
    value: T;
    isFirst?: boolean;
    isLast?: boolean;
  }) {
    const isActive = activeTab === value;

    const baseStyle = "inline-flex items-center justify-center w-full cursor-pointer relative transition-all duration-200 min-h-15";
    const radiusStyle = isFirst
      ? "rounded-tl-[30px]"
      : isLast
      ? "rounded-tr-[30px]"
      : "";

    const activeStyle = isActive
      ? "bg-white text-[#0090FB] shadow-[0_2px_4px_rgba(0,0,0,0.05)] z-10 border-t border-l border-r border-gray-200"
      : "bg-[#F5F7FA] text-[#89919D] border border-gray-200";

    return (
      <div
        className={`${baseStyle} ${radiusStyle} ${activeStyle}`}
        onClick={() => setActiveTab(value)}
      >
        <span className="inline-block px-4 py-2 text-[15px] font-medium">
          {children}
        </span>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[#0090FB] rounded-t"
          />
        )}
      </div>
    );
  }

  function TabsContainer({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex flex-col flex-1 w-full px-6 py-3 overflow-y-scroll scrollbar-hide">
        {children}
      </div>
    );
  }

  function TabContent({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: T;
  }) {
    if (activeTab !== value) return null;
    return <div>{children}</div>;
  }

  return {
    TabsList,
    TabTrigger,
    TabsContainer,
    TabContent,
  };
}