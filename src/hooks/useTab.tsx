import { motion } from 'motion/react';
import { useState } from 'react';

export function useTab<T>(defaultTab: T) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  function TabsList({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex justify-between border-b border-gray-200 mx-6">
        {children}
      </div>
    );
  }

  function TabTrigger({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: T;
  }) {
    const isActive = activeTab === value;

    return (
      <motion.div
        className="cursor-pointer pb-2 px-2 -mb-[1.5px] relative"
        onClick={() => setActiveTab(value)}
      >
        <span className={isActive ? 'text-[#0090FB]' : 'text-[#89919D]'}>
          {children}
        </span>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100"
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