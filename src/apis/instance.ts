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
    timeout: 4000,
    withCredentials: true,
  });

  // Interceptors 설정 (공통 로직)
  instance.interceptors.request.use(
    config => {
      // JSON 기본 헤더는 강제하지 않되, FormData가 아닐 때만 명시적으로 설정
      const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
      if (!isFormData) {
        config.headers = config.headers ?? {};
        if (!config.headers['Content-Type'] && !config.headers['content-type']) {
          config.headers['Content-Type'] = 'application/json';
        }
      } else if (config.headers) {
        // FormData 경우 브라우저가 boundary 포함하여 자동 설정하도록 제거
        delete (config.headers as any)['Content-Type'];
        delete (config.headers as any)['content-type'];
      }

      const accessToken = '';
      if (accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${accessToken}`;
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
