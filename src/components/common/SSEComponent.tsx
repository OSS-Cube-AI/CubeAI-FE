import { useEffect, useRef } from 'react';

interface SSEComponentProps {
  url: string;
  onMessage: (data: string) => void;
  onError?: (error: Event | Error) => void;
  method?: 'GET' | 'POST';
  body?: FormData;
  headers?: Record<string, string>;
}

export default function SSEComponent({
  url,
  onMessage,
  onError,
  method = 'GET',
  body,
  headers,
}: SSEComponentProps) {
  // `useRef`로 연결 인스턴스를 저장하고,
  // 컴포넌트 라이프사이클 동안 유지하기
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 정리: 기존 연결 종료
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    // POST + FormData 요청인 경우: fetch 스트리밍으로 처리
    if (method === 'POST' && body) {
      const controller = new AbortController();
      abortRef.current = controller;

      (async () => {
        try {
          const res = await fetch(url, {
            method: 'POST',
            body,
            credentials: 'include',
            headers: { Accept: 'text/event-stream', ...(headers || {}) },
            signal: controller.signal,
          });

          if (!res.ok || !res.body) {
            throw new Error(`SSE fetch failed: ${res.status}`);
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // SSE는 이벤트 사이에 빈 줄(\n\n)로 구분됨
            let splitIndex: number;
            while ((splitIndex = buffer.indexOf('\n\n')) !== -1) {
              const rawEvent = buffer.slice(0, splitIndex);
              buffer = buffer.slice(splitIndex + 2);

              // 가장 단순한 파서: 'data: ' 라인만 처리
              const lines = rawEvent.split('\n');
              for (const line of lines) {
                if (line.startsWith('data:')) {
                  const data = line.slice(5).trimStart();
                  onMessage(data);
                }
              }
            }
          }
        } catch (err) {
          console.error('SSE (fetch) Error:', err);
          if (onError) onError(err as Error);
        }
      })();

      // cleanup: fetch 스트림 중단
      return () => {
        if (abortRef.current) {
          abortRef.current.abort();
          abortRef.current = null;
        }
      };
    }

    // 기본: GET 쿼리 기반 EventSource
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
  }, [url, onMessage, onError, method, body, headers]); // props 변경 시 재연결

  return null;
}
