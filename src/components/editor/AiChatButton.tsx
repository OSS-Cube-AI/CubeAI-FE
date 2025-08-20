
import Chat from "@/components/editor/Chat";
import AiChatIcon from "@/assets/icons/ai-chat.svg";
import { useState } from "react";

export default function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && <Chat isOpen={isOpen} />}
      <button 
        onClick={() => {
          console.log('버튼 클릭됨!');
          setIsOpen(prev => !prev);
        }}
        className="flex justify-center items-center w-16 h-16 bg-[#EEF6FF] rounded-full shadow-md fixed bottom-4 right-4 z-50 hover:bg-[#DDEBFF] transition-colors duration-300"
      >
        <img src={AiChatIcon} alt="AI 채팅 아이콘" className="w-8 h-8" />
      </button>
    </>
  );
}