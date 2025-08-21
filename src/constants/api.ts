/* API 경로 정의 */
export const API = {} as const;

// AI 백엔드 URL 설정 - HTTP만 지원하므로 HTTP로 고정
export const AI_BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL;
