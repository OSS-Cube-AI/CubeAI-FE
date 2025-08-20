import { getInstance } from '@/apis/instance';

export type Stage = 'pre' | 'model' | 'train' | 'eval' | 'all';

// GET 요청 파라미터 인코딩: 불리언은 'on'으로 변환, 배열은 key[] 형식으로 변환
const buildGetParams = (params: Record<string, unknown>) => {
	const out: Record<string, string | string[] | number> = {};
	Object.entries(params ?? {}).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			out[`${key}[]`] = value.map(v => String(v));
			return;
		}
		if (typeof value === 'boolean') {
			if (value) out[key] = 'on'; //체크박스 체크 시 체크 되는 코드
			return; // 실패시 종료
		}
		out[key] = typeof value === 'number' ? value : String(value);
	});
	return out;
};

export const convertByGet = async (
	stage: Stage,
	params: Record<string, unknown>,
): Promise<string> => {
	const instance = getInstance('AI');
	const res = await instance.get('/convert', {
		params: { stage, ...buildGetParams(params) },
		responseType: 'text',
	});
	return typeof res.data === 'string' ? res.data : '';
};

// POST (multipart/form-data) 구현: 사양에 맞게 폼 데이터로 전송
export const convertByPost = async (
	stage: Stage,
	params: Record<string, unknown>,
): Promise<string> => {
	const form = new FormData();
	form.append('stage', stage);
	Object.entries(params ?? {}).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			value.forEach(v => form.append(`${key}[]`, String(v)));
			return;
		}
		if (typeof value === 'boolean') {
			if (value) form.append(key, 'on'); // 체크된 경우에만 포함
			return;
		}
		form.append(key, String(value));
	});

	const instance = getInstance('AI');
	const res = await instance.post('/convert', form, {
		// Content-Type은 생략해야 브라우저가 boundary를 자동으로 설정
		responseType: 'text',
	});
	return typeof res.data === 'string' ? res.data : '';
};

// 디버그용: GET 요청 후 상태코드를 콘솔에 출력하고 HTML을 반환
export const convertByGetAndLog = async (
	stage: Stage,
	params: Record<string, unknown>,
): Promise<{ status: number; html: string }> => {
	const instance = getInstance('AI');
	const res = await instance.get('/convert', {
		params: { stage, ...buildGetParams(params) },
		responseType: 'text',
	});
	// 상태 코드 로깅
	console.log('[GET /convert] status:', res.status);
	return { status: res.status, html: typeof res.data === 'string' ? res.data : '' };
}; 