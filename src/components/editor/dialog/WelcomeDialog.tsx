import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NICKNAME_REGEX = /^[a-zA-Z0-9_-]{1,50}$/;
const FORBIDDEN_NAMES = ['admin', 'root', 'system', 'user', 'guest'];

export default function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps) {
  const setUserId = useUserStore(state => state.setUserId);
  const currentUserId = useUserStore(state => state.userId);
  const [nickname, setNickname] = useState(currentUserId || '');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (isOpen) {
      setNickname(currentUserId || '');
      setErrorMessage('');
    }
  }, [isOpen, currentUserId]);
  const isNicknameValid = useMemo(() => {
    if (!nickname) return true;

    if (!NICKNAME_REGEX.test(nickname)) {
      setErrorMessage('1~50자의 영문, 숫자, 밑줄(_), 하이픈(-)만 사용할 수 있습니다.');
      return false;
    }

    if (FORBIDDEN_NAMES.includes(nickname.toLowerCase())) {
      setErrorMessage('사용할 수 없는 닉네임입니다.');
      return false;
    }

    setErrorMessage('');
    return true;
  }, [nickname]);

  const handleStart = () => {
    const finalUserId = nickname.trim() || `demo_user_${uuidv4().substring(0, 8)}`;
    setUserId(finalUserId);
    localStorage.setItem('demo-user-id', finalUserId);
    onClose();
  };

  return (
    <Dialog open={true}>
      <DialogContent onInteractOutside={e => e.preventDefault()} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>데모 시작하기</DialogTitle>
          <DialogDescription>
            사용할 닉네임을 입력하거나, 비워두고 시작하여 랜덤 닉네임을 받으세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <Input
            id="nickname"
            placeholder="닉네임 (선택 사항)"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && isNicknameValid && handleStart()}
          />
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {/* '취소' 버튼을 추가하여 모달을 닫을 수 있게 합니다. */}
          {currentUserId && (
            <Button onClick={onClose} variant="ghost">
              취소
            </Button>
          )}
          <Button onClick={handleStart} disabled={!isNicknameValid}>
            {/* 현재 ID가 있으면 '수정하기'로, 없으면 '시작하기'로 버튼 텍스트를 변경합니다. */}
            {currentUserId ? '수정하기' : '시작하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
