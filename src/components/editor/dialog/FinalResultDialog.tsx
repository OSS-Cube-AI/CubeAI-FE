import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function FinalResultDialog() {
  return (
    <Dialog>
      <DialogTrigger>🏆 최종 결과 보기</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Final Result</DialogTitle>
          <DialogDescription>Here is the final result of your work.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
