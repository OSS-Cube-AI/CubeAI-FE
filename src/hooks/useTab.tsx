import { motion } from 'motion/react';
import React, { useState } from 'react';

export function useTab<T>(defaultTab: T) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  function TabsList({ children }: { children: React.ReactNode }) {
    const childArray = React.Children.toArray(children);

    return (
      <div className="flex justify-between border-b border-gray-200">
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

    const baseStyle = "cursor-pointer pb-2 -mb-[1.5px] relative";
    const radiusStyle = isFirst
      ? "rounded-l-full"
      : isLast
      ? "rounded-r-full"
      : "";

    return (
      <motion.div
        className={`${baseStyle} ${radiusStyle}`}
        onClick={() => setActiveTab(value)}
      >
        <span
          className={`px-4 py-1 inline-block text-[15px] ${
            isActive
              ? "text-[#0090FB] bg-white"
              : "text-[#89919D] bg-[#EEF6FF]"
          } ${radiusStyle}`}
        >
          {children}
        </span>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0090FB]"
            layoutId="activeTab"
          />
        )}
      </motion.div>
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