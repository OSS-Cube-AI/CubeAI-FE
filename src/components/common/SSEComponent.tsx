import { useEffect, useRef, useState, useCallback } from 'react';

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
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1초

  // 연결 정리 함수
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // 재연결 함수
  const reconnect = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error('SSE: 최대 재연결 시도 횟수 초과');
      if (onError) {
        onError(new Error('최대 재연결 시도 횟수 초과'));
      }
      return;
    }

    const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts); // 지수 백오프
    console.log(
      `SSE: ${delay}ms 후 재연결 시도... (${reconnectAttempts + 1}/${maxReconnectAttempts})`,
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      // useEffect가 다시 실행되어 연결 재시도
    }, delay);
  }, [reconnectAttempts, maxReconnectAttempts, onError]);

  useEffect(() => {
    // 정리: 기존 연결 종료
    cleanup();

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

          setIsConnected(true);
          setReconnectAttempts(0);

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
          setIsConnected(false);
          if (onError) onError(err as Error);
          reconnect();
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

    // 연결 상태 관리
    eventSource.onopen = () => {
      console.log('SSE: 연결됨');
      setIsConnected(true);
      setReconnectAttempts(0);
    };

    // 'message' 이벤트 리스너 등록
    eventSource.onmessage = event => {
      onMessage(event.data);
    };

    eventSource.onerror = error => {
      console.error('SSE Error:', error);
      setIsConnected(false);

      if (onError) {
        onError(error);
      }

      // 연결이 끊어진 경우 재연결 시도
      if (eventSource.readyState === EventSource.CLOSED) {
        reconnect();
      }
    };

    // 컴포넌트 언마운트 시 연결 정리 (cleanup)
    return () => {
      cleanup();
    };
  }, [url, onMessage, onError, method, body, headers, cleanup, reconnect]);

  // 연결 상태 표시 (디버깅용)
  useEffect(() => {
    console.log(`SSE 연결 상태: ${isConnected ? '연결됨' : '연결 끊김'}`);
  }, [isConnected]);

  return null;
}
