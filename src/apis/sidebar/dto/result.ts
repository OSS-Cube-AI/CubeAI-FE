export interface ResultRequestParams {
  user_id: string | null;
}

export interface ResultResponse {
  ok: boolean;
  user_id: string;
  accuracy: number;
  confusion_matrix: string;
  misclassified_samples: string;
  prediction_samples: string;
  message: string;
}

export interface ResultStatusResponse {
  ready: boolean;
  user_id: string;
  message: string;
  files: {
    'confusion_matrix.png': boolean;
    'evaluation_results.json': boolean;
    'misclassified_samples.png': boolean;
    'prediction_samples.png': boolean;
  };
}
