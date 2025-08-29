# 🧊 [Cube AI](4th-security-cube-ai-fe.vercel.app)

> **놓고, 만들고, 내 것으로 Make AI Your Playground**  
> AI를 처음 배우는 사람도, 개념부터 실습까지 한 번에 익히고 바로 활용할 수 있습니다.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.5-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [사용법](#-사용법)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## 🎯 프로젝트 소개

Cube AI는 **드래그 앤 드롭 방식**으로 AI 모델을 구축하고 학습할 수 있는 인터랙티브한 웹 플랫폼입니다. 코딩 지식이 없어도 시각적 블록 조작을 통해 AI의 핵심 개념을 이해하고 실습할 수 있습니다.

### 🌟 핵심 가치

- **접근성**: 코딩 경험이 없어도 AI를 배울 수 있습니다
- **시각적 학습**: 드래그 앤 드롭으로 직관적인 AI 모델 구축
- **실무 중심**: 이론과 실습을 균형있게 제공
- **AI 튜터**: 실시간 AI 어시스턴트로 학습 지원

## ✨ 주요 기능

### 🎨 드래그 앤 드롭 에디터

- **데이터 전처리**: 데이터 로딩, 정제, 변환 블록
- **모델 설계**: 신경망 구조, 레이어 구성 블록
- **학습하기**: 옵티마이저, 손실함수, 학습 파라미터 블록
- **평가하기**: 성능 지표, 검증 블록

### 🤖 AI 튜터

- 실시간 채팅을 통한 학습 지원
- 단계별 가이드 및 힌트 제공
- 개인화된 학습 경험

### 📊 실시간 모니터링

- **코드 탭**: 생성된 Python 코드 실시간 확인
- **데이터 탭**: 데이터셋 정보 및 시각화
- **학습 탭**: 학습 진행 상황 및 결과 모니터링

### 🎓 체계적 학습 과정

1. **AI의 개념 잡기** - AI, 머신러닝, 딥러닝 기초
2. **데이터 전처리 배우기** - 데이터 수집 및 정제
3. **모델 구조 만들기** - 신경망 설계 및 구성
4. **학습 및 실험** - 모델 훈련 및 성능 평가

## 🛠 기술 스택

### Frontend

- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.6.3** - 타입 안전성
- **Vite 6.3.4** - 빌드 도구
- **Tailwind CSS 4.1.5** - 스타일링

### 상태 관리 & 데이터 페칭

- **Zustand 5.0.4** - 상태 관리
- **TanStack Query 5.76.1** - 서버 상태 관리
- **Axios 1.9.0** - HTTP 클라이언트

### UI/UX

- **Radix UI** - 접근성 중심 컴포넌트
- **DnD Kit** - 드래그 앤 드롭 기능
- **Lucide React** - 아이콘
- **Motion** - 애니메이션

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **React Hook Form** - 폼 관리

## 🚀 시작하기

### 필수 요구사항

- **Node.js** 18.0.0 이상
- **pnpm** (권장) 또는 npm

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone https://github.com/OSS-Cube-AI/CubeAI-FE.git
   cd CubeAI-FE
   ```

2. **의존성 설치**

   ```bash
   pnpm install
   # 또는
   npm install
   ```

   pnpm을 권장합니다

3. **환경 변수 설정**

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` 파일에 다음 변수들을 설정하세요:

   ```env
   VITE_AI_BACKEND_URL=your_backend_url_here
   ```

4. **개발 서버 실행**

   ```bash
   pnpm dev
   # 또는
   npm run dev
   ```

### 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 📁 프로젝트 구조

```
src/
├── apis/                    # API 관련 코드
│   ├── blocks/             # 블록 관련 API
│   ├── chat/               # 채팅 API
│   └── sidebar/            # 사이드바 API
├── components/             # React 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   ├── editor/             # 에디터 관련 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   ├── status/             # 상태 관련 컴포넌트
│   └── ui/                 # UI 컴포넌트
├── hooks/                  # 커스텀 훅
│   └── dragDrop/           # 드래그 앤 드롭 관련 훅
├── pages/                  # 페이지 컴포넌트
├── routes/                 # 라우팅 설정
├── stores/                 # 상태 관리 스토어
├── types/                  # TypeScript 타입 정의
├── utils/                  # 유틸리티 함수
└── styles/                 # 스타일 파일
```

## 🎮 사용법

### 1. 메인 페이지

- 학습 진행 상황을 확인할 수 있습니다
- 각 단계별 완료 상태를 시각적으로 확인
- 클릭하여 해당 단계로 이동

### 2. 에디터 페이지

- **좌측 사이드바**: 드래그 가능한 블록 팔레트
- **중앙 캔버스**: 블록을 드래그하여 워크플로우 구성
- **우측 사이드바**: 코드, 데이터, 학습 결과 확인

### 3. AI 튜터

- 우측 하단의 AI 튜터 버튼 클릭
- 실시간 채팅으로 질문 및 도움 요청
- 단계별 가이드 및 힌트 제공

### 4. 블록 조작

- 좌측에서 블록을 드래그하여 캔버스에 배치
- 블록 간 연결선으로 데이터 흐름 정의
- 각 블록의 속성을 설정하여 워크플로우 완성

## 🤝 기여하기

Cube AI 프로젝트에 기여해주셔서 감사합니다! 기여 방법은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고해주세요.

### 기여 방법

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 📞 문의

- **이슈 리포트**: [GitHub Issues](https://github.com/OSS-Cube-AI/CubeAI-FE/issues)

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! ⭐**

Cube AI

</div>
