import { useEffect, useState } from "react";
import { getInstance } from "@/apis/instance";
import { ConversationResponse } from "@/apis/chat/dto";
import { useGetConversations, usePostConversations } from "@/apis/chat";

import AiTutor from '@/assets/icons/ai-tutor.svg';
import SendIcon from '@/assets/icons/send.svg';

export default function Chat() {
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [chatData, setChatData] = useState<ConversationResponse | null>(null);

  const { data: chatGetData, isLoading, isPending } = useGetConversations(chatSessionId);
  const { mutate, data: chatMutateData } = usePostConversations();

  const handleMessageSendClick = () => {
    mutate({id: chatSessionId as string, message: message});
  }

  useEffect(() => {
    const initChatSession = async () => {
      const storedSessionId = sessionStorage.getItem('chatSessionId');
      if (storedSessionId) {
        setChatSessionId(storedSessionId);
        return;
      }

      const { data } = await getInstance('CHAT').post('/session');
      const newSessionId = data.session_id;
      setChatSessionId(newSessionId);
      sessionStorage.setItem('chatSessionId', newSessionId);
    };

    initChatSession();
  }, []);

  useEffect(() => {
    if (chatMutateData) {
      setChatData(chatMutateData);
    }
  }, [chatMutateData]);

  useEffect(() => {
    if (chatGetData) {
      setChatData(chatGetData);
    }
  }, [chatGetData]);

  const conversation = chatData?.conversation || [];

  return (
    <div className="flex flex-col w-full h-full">
      {/** AI 튜터 헤더 */}
      <section className="flex-shrink-0 w-full h-24 flex items-center justify-center bg-[#EEF6FF]">
        <div className="w-14 h-14 p-[7px] rounded-[25px] bg-white flex justify-center items-center">
          <img src={AiTutor} alt="AI Tutor Icon" className="" />
        </div>
        <h2 className="w-25 h-15 flex justify-center items-center text-xl font-bold">AI 튜터</h2>
      </section>
      
      {/** 구분선 */}
      <section className="flex-shrink-0 items-center mt-9">
        <div className="flex-grow h-px bg-gray-400"></div>
        <span className="flex-shrink-0 px-6 text-base font-bold text-black">
          AI 튜터와 해결하기
        </span>
        <div className="flex-grow h-px bg-gray-400"></div>
      </section>

      {/** 실제 채팅 기록 */}
      <section className="flex-1 flex flex-col w-full space-y-[17px] px-[25px] mt-6 overflow-y-auto">
        {isLoading || isPending ? (
          <div>로딩 중...</div>
        ) : (
          <>
            <AssistantChat message={"안녕하세요. AI 튜터예요 🤖\n무엇이 궁금해서 저를 찾아오셨나요?"} />
            {conversation.map((chat, index) => (
              chat.role === 'user' ? (
                <UserChat key={index} message={chat.content} />
              ) : (
                <AssistantChat key={index} message={chat.content} />
              )
            ))}
          </>
        )}
      </section>
      
      {/** 채팅 입력창 */}
      <section className="flex-shrink-0 w-full px-5 py-4 bg-[#EEF6FF] flex items-center justify-center gap-3">
        <div className="bg-white px-5 py-[6px] flex-1 justify-center items-center rounded-[10px] w-full">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="AI 튜터에게 질문을 입력하세요."
            className="text-[15px] font-medium w-full min-h-[33px]"
          />
        </div>
        <button 
          onClick={handleMessageSendClick}
          className="flex items-center justify-center w-11 h-11 bg-[#0090FB] rounded-[10px]"
        >
          <img src={SendIcon} alt="Send" />
        </button>
      </section>
    </div>
  )
} 


function UserChat({ message }: { message: string }) {
  return (
    <div className="flex w-max max-w-65 px-3 py-5 justify-center items-center bg-[#0090FB] rounded-[10px]">
      <span className="text-white text-[15px] text-right whitespace-pre-line font-normal">
        {message}
      </span>
    </div>
  );
};

function AssistantChat({ message }: { message: string }) {
  return (
    <div className="flex w-max max-w-65 px-3 py-5 justify-center items-center bg-[#EEF6FF] rounded-[10px]">
      <span className="text-gray-500 text-[15px] text-left whitespace-pre-line font-normal">
        {message}
      </span>
    </div>
  );
};