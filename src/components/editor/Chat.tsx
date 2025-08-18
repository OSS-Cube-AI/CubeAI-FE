import { ConversationResponse } from "@/apis/chat/dto";
import { useGetConversations, usePostConversations } from "@/apis/chat";

import AiTutor from '@/assets/icons/ai-tutor.svg';

export default function Chat() {
  const postConversationMutation = usePostConversations();

  const handleSendMessage = (message: string) => {
    const activeConversation = conversations?.[0]; // 예시로 첫 번째 대화 선택
    if (activeConversation) {
      postConversationMutation.mutate({ id: activeConversation.id, message });
    }
  };

  return (
    <div>
      <section className="w-full h-24 flex items-center justify-center bg-[#EEF6FF]">
        <div className="w-14 h-14 p-[7px] rounded-[25px] bg-white flex justify-center items-center">
          <img src={AiTutor} alt="AI Tutor Icon" className="" />
        </div>
        <h2 className="w-25 h-15 flex justify-center items-center text-xl font-bold">AI 튜터</h2>
      </section>
      <section className="flex items-center mt-9">
        <div className="flex-grow h-px bg-gray-400"></div>
        <span className="flex-shrink-0 px-6 text-base font-bold text-black">
          AI 튜터와 해결하기
        </span>
        <div className="flex-grow h-px bg-gray-400"></div>
      </section>

    </div>
  )
} 

