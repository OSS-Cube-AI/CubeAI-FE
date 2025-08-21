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

  // 원본 헤더 전달하되, 충돌 유발 헤더는 제거
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('accept-encoding'); // SSE 안정성

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // 리다이렉트를 프록시 내부에서 follow (중요)
  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    redirect: 'follow',
  });

  // 그대로 전달
  const respHeaders = new Headers(upstream.headers);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}
