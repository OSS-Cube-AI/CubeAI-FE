import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/stores/useUserStore';
import { useResult } from '@/apis/sidebar/quries/useResultQuery';

export default function FinalResultDialog() {
  const userId = useUserStore(state => state.userId);
  const { data: resultData, isLoading, isError, error } = useResult({ user_id: userId });
  const createImgSrc = (base64: string) => `data:image/png;base64,${base64}`;

  return (
    <Dialog>
      <DialogTrigger>🏆 최종 결과 보기</DialogTrigger>
      <DialogContent className="w-3/4 !max-w-7xl h-[85vh] !flex flex-col overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>🎉 최종 학습 결과</DialogTitle>
          <DialogDescription>모델 학습 및 평가가 모두 완료되었습니다.</DialogDescription>
        </DialogHeader>
        {isLoading && <div className="py-10 text-center">결과를 불러옵니다...</div>}
        {isError && <div className="py-10 text-center text-red-500">{error.message}</div>}

        {resultData && (
          <div className="mt-4 w-full h-full flex-1 flex-col items-start justify-start">
            <div className="mb-6 p-4 bg-slate-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">종합 정확도 (Accuracy)</h3>
              <p className="text-4xl font-bold text-blue-600">
                {(resultData.accuracy * 100).toFixed(2)}%
              </p>
            </div>
            <Tabs defaultValue="confusion_matrix">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="confusion_matrix">Confusion Matrix</TabsTrigger>
                <TabsTrigger value="misclassified_samples">Misclassified</TabsTrigger>
                <TabsTrigger value="prediction_samples">Predictions</TabsTrigger>
              </TabsList>
              <TabsContent value="confusion_matrix" className="mt-4">
                <img
                  src={createImgSrc(resultData.confusion_matrix)}
                  alt="Confusion Matrix"
                  className="w-full rounded-md border"
                />
              </TabsContent>
              <TabsContent value="misclassified_samples" className="mt-4">
                <img
                  src={createImgSrc(resultData.misclassified_samples)}
                  alt="Misclassified Samples"
                  className="w-full rounded-md border"
                />
              </TabsContent>
              <TabsContent value="prediction_samples" className="mt-4">
                <img
                  src={createImgSrc(resultData.prediction_samples)}
                  alt="Prediction Samples"
                  className="w-full rounded-md border"
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
