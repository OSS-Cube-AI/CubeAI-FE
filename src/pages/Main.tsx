import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Cube from '@/assets/Cube.png';
import Finished from '@/assets/icons/finish.png';
import NotFinished from '@/assets/icons/not_finish.png';

function ProgressBar({ value, width }: { value: number; width?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-6 rounded-full shadow-[0_0_3px_1px_rgba(0,144,251,0.8)] overflow-hidden bg-white ${width || 'w-64'}`}
    >
      <div
        className="h-full bg-sky-400 flex items-center justify-end pr-2 rounded-l-full"
        style={{ width: `${pct}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        role="progressbar"
      >
        <span className="text-white text-[10px] font-bold">{pct}%</span>
      </div>
    </div>
  );
}

function UnitCard({
  title,
  subtitle,
  bullets,
  completed,
}: {
  title: string;
  subtitle?: string;
  bullets?: string[];
  completed?: boolean;
}) {
  return (
    <article className="w-64 flex flex-col gap-2">
      <div className="h-36 bg-blue-50 rounded-md p-4 relative">
        <h4 className="text-sky-500 text-xl font-bold leading-6">{title}</h4>
        <div className="absolute bottom-3 right-3 size-9 grid place-items-center select-none">
          <img
            src={completed ? Finished : NotFinished}
            alt={completed ? '완료' : '미완료'}
            className="w-[100%] h-[100%] object-cover select-none"
            draggable="false"
          />
        </div>
      </div>
      {subtitle && (
        <div className="h-11 flex items-center">
          <p className="text-base font-bold truncate" title={subtitle}>
            {subtitle}
          </p>
        </div>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="text-zinc-600 text-xs font-medium leading-5 list-disc pl-4">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function MainPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const curriculumSteps = [
    { title: 'AI의 개념 잡기', progress: 75, completed: true },
    { title: '데이터 전처리 배우기', progress: 40, completed: true },
    { title: '모델 구조 만들기', progress: 10, completed: false },
    { title: '학습 및 실험', progress: 0, completed: false },
  ];

  const handleStepClick = (stepIndex: number) => {
    // 모든 단계를 클릭 가능하게 함
    setCurrentStep(stepIndex);

    // 활성화된 단계를 설정 (토글이 아닌 단일 선택)
    setActiveStep(stepIndex);

    // 여기에 실제 페이지 이동 로직을 추가할 수 있습니다
    console.log(`Step ${stepIndex + 1} clicked: ${curriculumSteps[stepIndex].title}`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <div className="mx-auto max-w-100% px-6 pb-10 bg-sky-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 items-center">
          <div className="space-y-8">
            <h1 className="text-white text-4xl md:text-4xl font-bold px-[153px] leading-tight">
              큐브 AI, 실무형 인공지능 학습의 시작
            </h1>
            <p className="text-white text-lg md:text-xl font-medium  px-[153px] leading-relaxed">
              AI를 처음 배우는 사람도, 개념부터 실습까지
              <br />한 번에 익히고 바로 활용할 수 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-0 text-white text-3xl font-bold place-items-center relative">
            <div className="h-36 w-full grid place-items-center relative z-10">
              <img src={Cube} alt="AI Basics" className="w-full h-[152px] object-contain" />
              <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold select-none">
                AI Basics
              </div>
            </div>
            <div className="h-36 w-full rounded-xl grid place-items-center relative -ml-[220px] -mt-[-120px] z-20">
              <img src={Cube} alt="Model Build" className="w-full h-[152px] object-contain" />
              <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold select-none">
                Model Build
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        id="curriculum"
        className="mx-auto max-w-7xl px-6 py-10 border-b border-[#C3CCD9]/60 bg-white"
      >
        <div className="flex flex-wrap items-center gap-16">
          {curriculumSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-justify-start">
              <button
                onClick={() => handleStepClick(index)}
                className={`
                  w-[250px] px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200
                  ${
                    step.completed
                      ? 'bg-sky-500 text-white shadow-lg'
                      : index === currentStep
                        ? 'bg-blue-100 text-white-700 border-2 border-blue-300'
                        : 'bg-white text-zinc-600 border-2 border-blue-200'
                  }
                  ${index === currentStep ? 'ring-4 ring-blue-300 ring-opacity-50' : ''}
                `}
              >
                {step.title}
              </button>

              {/* 진행바는 활성화된 단계에서만 표시 */}
              {activeStep === index && (
                <div className="mt-[21px] flex flex-col items-center gap-2">
                  <ProgressBar value={step.progress} width="w-64" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <UnitCard
            title="AI란 무엇인가"
            subtitle="AI란 무엇인가?"
            bullets={['인공지능 vs 머신러닝 vs 딥러닝', 'AI가 하는 일은 무엇인가?']}
            completed
          />
          <UnitCard
            title="2. AI 테스크 종류"
            subtitle="AI 테스크 종류"
            bullets={[
              '이미지 분류, 감정 분석, 추천 시스템',
              '생성 AI(텍스트/이미지 등), 숫자 예측(회귀 등)',
            ]}
            completed
          />
          <UnitCard
            title="3. AI 학습 흐름"
            subtitle="AI 학습 흐름"
            bullets={[
              '데이터 수집 → 전처리 → 학습 → 예측 → 평가',
              '지도학습 vs 비지도학습',
              '모델 성능 평가 기준(정확도 등)',
            ]}
          />
          <UnitCard
            title="4. AI 모델 설명"
            subtitle="AI 학습 흐름"
            bullets={[
              '데이터 수집 → 전처리 → 학습 → 예측 → 평가',
              '지도학습 vs 비지도학습',
              '모델 성능 평가 기준(정확도 등)',
            ]}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
