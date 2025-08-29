# 🤝 기여 가이드 (Contributing Guide)

Cube AI 프로젝트에 기여해주셔서 감사합니다! 이 가이드는 프로젝트에 기여하는 방법을 안내합니다.

## 📋 목차

- [시작하기 전에](#-시작하기-전에)
- [개발 환경 설정](#-개발-환경-설정)
- [기여 방법](#-기여-방법)
- [코딩 스타일](#-코딩-스타일)
- [커밋 메시지 규칙](#-커밋-메시지-규칙)
- [Pull Request 가이드](#-pull-request-가이드)
- [이슈 리포트](#-이슈-리포트)
- [문서화](#-문서화)
- [테스트](#-테스트)
- [질문과 도움](#-질문과-도움)

## 🚀 시작하기 전에

### 📜 행동 강령 준수

모든 기여자는 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)를 읽고 준수해야 합니다.

### 🎯 기여 유형

다음과 같은 방식으로 프로젝트에 기여할 수 있습니다:

- 🐛 **버그 수정**: 버그를 발견하고 수정
- ✨ **새 기능**: 새로운 기능 추가
- 📚 **문서화**: 문서 개선 및 번역
- 🎨 **UI/UX**: 사용자 인터페이스 개선
- ⚡ **성능**: 성능 최적화
- 🧪 **테스트**: 테스트 코드 작성
- 🔧 **리팩토링**: 코드 품질 개선

## 🛠 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18.0.0 이상
- **pnpm**: 8.0.0 이상 (권장) 또는 npm
- **Git**: 2.30.0 이상

### 1. 저장소 포크 및 클론

```bash
# 1. GitHub에서 저장소를 포크합니다
# 2. 포크한 저장소를 클론합니다
git clone https://github.com/YOUR_USERNAME/CubeAI-FE.git
cd CubeAI-FE

# 3. 원본 저장소를 upstream으로 추가합니다
git remote add upstream https://github.com/OSS-Cube-AI/CubeAI-FE.git
```

### 2. 의존성 설치

```bash
# pnpm 사용 (권장)
pnpm install

# 또는 npm 사용
npm install
```

### 3. 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp .env.example .env.local

# .env.local 파일을 편집하여 필요한 환경 변수 설정
```

### 4. 개발 서버 실행

```bash
# 개발 서버 시작
pnpm dev

```

### 5. 코드 품질 도구 설정

```bash
# ESLint 실행
pnpm lint

# Prettier로 코드 포맷팅
pnpm format

# TypeScript 타입 체크
pnpm tsc --noEmit
```

## 🔄 기여 방법

### 1. 이슈 확인 및 생성

기여하기 전에 다음을 확인하세요:

- [ ] 기존 이슈에서 비슷한 작업이 있는지 확인
- [ ] 새로운 기능의 경우 먼저 이슈를 생성하여 논의
- [ ] 버그 리포트는 재현 단계를 포함하여 작성

### 2. 브랜치 생성

```bash
# 최신 변경사항 가져오기
git fetch upstream
git checkout main
git merge upstream/main

# 새로운 기능 브랜치 생성
git checkout -b feature/your-feature-name

# 버그 수정 브랜치 생성
git checkout -b fix/your-bug-fix

# 문서 개선 브랜치 생성
git checkout -b docs/your-documentation-update
```

### 3. 개발 및 테스트

```bash
# 개발 중 정기적으로 커밋
git add .
git commit -m "feat: add new feature"

# 테스트 실행 (테스트가 있는 경우)
pnpm test

# 빌드 테스트
pnpm build
```

### 4. 변경사항 푸시

```bash
# 브랜치를 원격 저장소에 푸시
git push origin feature/your-feature-name
```

## 📝 코딩 스타일

### TypeScript/React 규칙

```typescript
// ✅ 좋은 예시
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const UserComponent: React.FC<UserProps> = ({ id, name, email }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  return (
    <div className="user-component">
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

// ❌ 피해야 할 예시
const userComponent = (props) => {
  const [isActive, setIsActive] = useState(false);

  return <div><h2>{props.name}</h2></div>;
};
```

### 파일 및 폴더 명명 규칙

```
✅ 좋은 예시
- components/UserProfile.tsx
- hooks/useUserData.ts
- utils/formatDate.ts
- types/user.ts

❌ 피해야 할 예시
- components/userProfile.tsx
- hooks/useuserdata.ts
- utils/format-date.ts
- types/User.ts
```

### CSS/Tailwind 규칙

```tsx
// ✅ 좋은 예시 - 의미있는 클래스명과 일관된 스타일링
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">제목</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    버튼
  </button>
</div>

// ❌ 피해야 할 예시 - 인라인 스타일과 일관성 없는 클래스명
<div style={{display: 'flex', padding: '16px'}}>
  <h2 className="title">제목</h2>
  <button className="btn">버튼</button>
</div>
```

## 📋 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

### 형식

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 타입 종류

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가 또는 수정
- **chore**: 빌드 프로세스, 보조 도구 변경 등
- **hotfix**: 운영 중 발생한 치명적 문제나 보안 취약점의 긴급 수정

### 예시

```bash
# 새로운 기능
git commit -m "feat: add drag and drop functionality for blocks"

# 버그 수정
git commit -m "fix: resolve message sending issue"

# 문서 업데이트
git commit -m "docs(readme): update installation instructions"

# 리팩토링
git commit -m "refactor(components): extract common button component"

# 스타일 변경
git commit -m "style(ui): fix button hover state styling"
```

## 🔀 Pull Request 가이드

### PR 생성 전 체크리스트

- [ ] 코드가 프로젝트의 코딩 스타일을 따름
- [ ] 새로운 기능에 대한 테스트가 포함됨 (해당하는 경우)
- [ ] 문서가 업데이트됨 (필요한 경우)
- [ ] 커밋 메시지가 Conventional Commits 규칙을 따름
- [ ] 브랜치가 최신 main 브랜치와 동기화됨

### PR 템플릿

```markdown
## 📝 변경 사항

- 변경된 내용을 간단히 설명

## 🔗 관련 이슈

- Closes #이슈번호

## 🧪 테스트

- [ ] 로컬에서 테스트 완료
- [ ] 새로운 기능에 대한 테스트 추가
- [ ] 기존 테스트가 모두 통과

## 📸 스크린샷 (UI 변경인 경우)

- 변경 전/후 스크린샷 첨부

## 📋 체크리스트

- [ ] 코드 리뷰 준비 완료
- [ ] 문서 업데이트 완료
- [ ] 테스트 추가/수정 완료
```

### PR 리뷰 과정

1. **자동 검사**: CI/CD 파이프라인 실행
2. **코드 리뷰**: 메인테이너의 코드 리뷰
3. **피드백 반영**: 리뷰어의 피드백에 따라 수정
4. **승인 및 머지**: 모든 검토 완료 후 머지

## 🐛 이슈 리포트

### 버그 리포트 템플릿

```markdown
## 🐛 버그 설명

버그에 대한 명확하고 간결한 설명

## 🔄 재현 단계

1. '...' 페이지로 이동
2. '...' 버튼 클릭
3. '...' 입력
4. 오류 발생

## 🎯 예상 동작

예상했던 동작 설명

## 📱 환경 정보

- OS: [예: macOS 13.0]
- 브라우저: [예: Chrome 120.0]
- Node.js 버전: [예: 18.17.0]

## 📸 스크린샷

가능한 경우 스크린샷 첨부

## 📋 추가 정보

기타 관련 정보나 컨텍스트
```

### 기능 요청 템플릿

```markdown
## ✨ 기능 요청

원하는 기능에 대한 명확한 설명

## 💡 동기

이 기능이 왜 필요한지 설명

## 📋 상세 설명

기능의 구체적인 동작 방식 설명

## 🎨 UI/UX 제안

가능한 경우 UI/UX 스케치나 설명

## 🔗 관련 이슈

관련된 다른 이슈나 PR
```

## 📚 문서화

### 코드 문서화

```typescript
/**
 * 사용자 데이터를 가져오는 커스텀 훅
 * @param userId - 사용자 ID
 * @param options - 쿼리 옵션
 * @returns 사용자 데이터와 로딩 상태
 */
export const useUserData = (userId: string, options?: UseQueryOptions<User>) => {
  // 구현...
};
```

### README 업데이트

새로운 기능이나 변경사항이 있을 때 README.md를 업데이트하세요:

- 새로운 설치 단계
- 새로운 환경 변수
- 새로운 스크립트
- 새로운 기능 사용법

## 🧪 테스트

### 테스트 작성 가이드

```typescript
// 컴포넌트 테스트 예시
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test Button.test.tsx

# 커버리지와 함께 테스트
pnpm test --coverage
```

## ❓ 질문과 도움

### 도움을 받는 방법

1. **GitHub Discussions**: 일반적인 질문이나 아이디어 공유
2. **이메일**: [nm2200521@gmail.com](mailto:nm2200521@gmail.com)

### 질문할 때 포함할 정보

- 사용 중인 Node.js 버전
- 운영체제 정보
- 에러 메시지 (있는 경우)
- 재현 단계
- 시도해본 해결 방법

## 🎉 기여자 인정

모든 기여자는 다음 방식으로 인정받습니다:

- **CONTRIBUTORS.md**: 기여자 목록에 이름 추가
- **릴리즈 노트**: 주요 기여자 명시
- **GitHub 프로필**: 기여 통계 자동 업데이트

## 📞 연락처

- **프로젝트 메인테이너**: [@OSS-Cube-AI](https://github.com/OSS-Cube-AI)
- **이메일**: [nm2200521@gmail.com](mailto:nm2200521@gmail.com)
- **GitHub**: [OSS-Cube-AI/CubeAI-FE](https://github.com/OSS-Cube-AI/CubeAI-FE)

---

## 🙏 감사 인사

Cube AI 프로젝트에 기여해주셔서 진심으로 감사합니다! 여러분의 기여가 더 나은 AI 학습 플랫폼을 만드는 데 큰 도움이 됩니다.

**함께 더 나은 AI 교육을 만들어가요! 🚀**

---

<div align="center">

**질문이나 제안사항이 있으시면 언제든지 연락해주세요!**

</div>
