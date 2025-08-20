import { useState, useMemo } from 'react';
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
  onIdSet: () => void;
}

const NICKNAME_REGEX = /^[a-zA-Z0-9_-]{1,50}$/;
const FORBIDDEN_NAMES = ['admin', 'root', 'system', 'user', 'guest'];

export default function WelcomeDialog({ onIdSet }: WelcomeDialogProps) {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const setUserId = useUserStore(state => state.setUserId);

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
    onIdSet();
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
        <DialogFooter>
          <Button onClick={handleStart} disabled={!isNicknameValid}>
            시작하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
