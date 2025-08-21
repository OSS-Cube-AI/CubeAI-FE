export const config = { runtime: 'edge' };

// Vercel 프로젝트 환경변수로 설정해 두기
const BACKEND = (globalThis as any).VITE_AI_BACKEND_URL;
if (!BACKEND) {
  throw new Error('VITE_AI_BACKEND_URL is not set');
}

export default async function handler(req: Request) {
  const inUrl = new URL(req.url);
  // /api/xxx → xxx 로 변환
  const subpath = inUrl.pathname.replace(/^\/api\/?/, '');
  const target = `${BACKEND.replace(/\/$/, '')}/${subpath}${inUrl.search}`;

  // 원본 헤더를 전달(필요 시 여기서 인증 헤더 주입 가능)
  const headers = new Headers(req.headers);
  // 백엔드가 Host 헤더에 민감하면 교체
  headers.set('host', new URL(BACKEND).host);

  // OPTIONS 프리플라이트를 자체 처리(동일 오리진이면 거의 안 뜨지만 안전장치)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // Body/메서드 그대로 전달
  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    redirect: 'manual',
  });

  // 응답 그대로 반환(쿠키/헤더 재작성 필요하면 여기서 수정)
  const respHeaders = new Headers(upstream.headers);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}
