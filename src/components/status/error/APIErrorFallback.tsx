import { FallbackProps } from 'react-error-boundary';
import { isAxiosError } from 'axios';
import { Navigate } from 'react-router-dom';
import { getAPIErrorInfo } from '@/utils/getApiErrorInfo';
import ErrorPage from './ErrorPage';

export const APIErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  if (isAxiosError(error)) {
    const errorInfo = getAPIErrorInfo(error);

    if (errorInfo.status === '401') {
      return <Navigate to={''} replace />;
    }

    return (
      <ErrorPage
        status={errorInfo.status}
        message={errorInfo.message}
        isUnknownError={errorInfo.status === 'ERROR'}
        onRetry={resetErrorBoundary}
      />
    );
  } else {
    throw error;
  }
};
