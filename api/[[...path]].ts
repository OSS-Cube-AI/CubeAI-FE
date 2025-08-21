export const config = { runtime: 'edge' };

const BACKEND = (globalThis as any).VITE_AI_BACKEND_URL;
if (!BACKEND) throw new Error('VITE_AI_BACKEND_URL is not set');

// 안전한 URL join
function join(a: string, b: string) {
  return `${a.replace(/\/+$/, '')}/${b.replace(/^\/+/, '')}`;
}

export default async function handler(req: Request) {
  const inUrl = new URL(req.url);
  const subpath = inUrl.pathname.replace(/^\/api\/?/, '');
  const target = join(BACKEND, subpath) + inUrl.search;

  // SSE 연결인지 확인
  const isSSE = inUrl.pathname.includes('/logs/stream');

  // 원본 헤더 전달하되, 충돌 유발 헤더는 제거
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('accept-encoding'); // SSE 안정성

  // SSE 연결 시 특별한 헤더 설정
  if (isSSE) {
    headers.set('Cache-Control', 'no-cache');
    headers.set('Connection', 'keep-alive');
    headers.set('Accept', 'text/event-stream');
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  try {
    // 리다이렉트를 프록시 내부에서 follow (중요)
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      redirect: 'follow',
    });

    // SSE 연결 시 스트리밍 응답
    if (isSSE && upstream.ok) {
      const respHeaders = new Headers();

      // SSE 필수 헤더 설정
      respHeaders.set('Content-Type', 'text/event-stream; charset=utf-8');
      respHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      respHeaders.set('Connection', 'keep-alive');
      respHeaders.set('Access-Control-Allow-Origin', '*');
      respHeaders.set('Access-Control-Allow-Headers', 'Cache-Control, Content-Type');
      respHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

      // 버퍼링 방지 헤더 (nginx, Apache 등에서 사용)
      respHeaders.set('X-Accel-Buffering', 'no');

      // 원본 응답 헤더에서 필요한 것만 복사
      if (upstream.headers.get('content-type')) {
        respHeaders.set('Content-Type', upstream.headers.get('content-type')!);
      }

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: respHeaders,
      });
    }

    // 일반 응답
    const respHeaders = new Headers(upstream.headers);
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);

    // SSE 연결 오류 시 적절한 응답
    if (isSSE) {
      return new Response('data: {"error": "Connection failed"}\n\n', {
        status: 500,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    return new Response('Proxy error', { status: 500 });
  }
}
