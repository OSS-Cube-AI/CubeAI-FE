import { useEffect, useRef } from 'react';

interface SSEComponentProps {
  url: string;
  onMessage: (data: string) => void;
  onError?: (error: Event) => void;
}

export default function SSEComponent({ url, onMessage, onError }: SSEComponentProps) {
  // `useRef`로 EventSource 인스턴스를 저장하고,
  // 컴포넌트 라이프사이클 동안 유지하기
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    // 'message' 이벤트 리스너 등록
    eventSource.onmessage = event => {
      onMessage(event.data);
    };

    eventSource.onerror = error => {
      console.error('SSE Error:', error);
      if (onError) {
        onError(error);
      }
      eventSource.close();
    };

    // 컴포넌트 언마운트 시 연결 정리 (cleanup)
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [url, onMessage, onError]); // 의존성 배열에 props를 넣어 props 변경 시 재연결

  return null;
}
