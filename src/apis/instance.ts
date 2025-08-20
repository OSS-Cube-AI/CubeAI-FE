import axios, { AxiosInstance } from 'axios';

export type ServerType = 'MAIN' | 'CHAT' | 'AI';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CHAT_BACKEND_URL = import.meta.env.VITE_CHAT_BACKEND_URL;
const AI_BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL ?? 'http://211.188.56.255:9022';

const BASE_URLS: Record<ServerType, string> = {
  MAIN: BACKEND_URL,
  CHAT: CHAT_BACKEND_URL,
  AI: AI_BACKEND_URL,
};

// 각 서버 인스턴스를 저장할 캐시
const instances: Partial<Record<ServerType, AxiosInstance>> = {};

const createConfiguredInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    responseType: 'json',
    headers: { 'Content-Type': 'application/json' },
    timeout: 4000,
    withCredentials: true,
  });

  // Interceptors 설정 (공통 로직)
  instance.interceptors.request.use(
    config => {
      const accessToken = ''; // 실제 토큰을 가져오는 로직
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => response,
    async error => Promise.reject(error),
  );

  return instance;
};

/**
 * 서버 타입에 맞는 axios 인스턴스를 반환하는 함수
 * @param type 서버 타입 (MAIN, CHAT 등)
 * @returns 해당 서버에 대한 AxiosInstance
 */
export const getInstance = (type: ServerType): AxiosInstance => {
  // 인스턴스가 이미 캐시되어 있으면 반환
  if (instances[type]) {
    return instances[type] as AxiosInstance;
  }

  // 캐시에 없으면 새로 생성 후 캐시
  const newInstance = createConfiguredInstance(BASE_URLS[type]);
  instances[type] = newInstance;
  return newInstance;
};
