import { API_CONFIG } from '../config/api';

// Generic API call function with error handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Data Management API
export const dataApi = {
  loadDataset: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall('/load', {
      method: 'POST',
      body: formData,
    });
  },

  getHead: (n = 5) => apiCall(`/head?n=${n}`),
  getTail: (n = 5) => apiCall(`/tail?n=${n}`),
  getShape: () => apiCall('/shape'),
  getDescription: () => apiCall('/describe'),
  getInfo: () => apiCall('/info'),
  getMissingValues: () => apiCall('/missing'),

  updateColumnType: (column: string, dtype: string) =>
    apiCall('/update-type', {
      method: 'POST',
      body: JSON.stringify({ column, dtype }),
    }),
};

// Preprocessing API
export const preprocessApi = {
  handleMissingValues: (column: string, method: string) =>
    apiCall('/preprocess/missing', {
      method: 'POST',
      body: JSON.stringify({ column, method }),
    }),

  deleteColumn: (column: string) =>
    apiCall('/preprocess/delete-column', {
      method: 'POST',
      body: JSON.stringify({ column }),
    }),

  getColumnValues: (column1: string, column2?: string) =>
    apiCall(
      `/preprocess/get-columns?column1=${column1}${
        column2 ? `&column2=${column2}` : ''
      }`
    ),

  encodeCategorical: (column: string, method: string) =>
    apiCall('/preprocess/encode', {
      method: 'POST',
      body: JSON.stringify({ column, method }),
    }),

  scaleFeatures: (columns: string[], method: string) =>
    apiCall('/preprocess/scale', {
      method: 'POST',
      body: JSON.stringify({ columns, method }),
    }),

  getFeaturesTarget: (features: string[], target: string) =>
    apiCall('/preprocess/features-target', {
      method: 'POST',
      body: JSON.stringify({ features, target }),
    }),

  splitDataset: (
    features: string[],
    target: string,
    testSize: number,
    randomState: number,
    shuffle: boolean
  ) =>
    apiCall('/preprocess/split', {
      method: 'POST',
      body: JSON.stringify({
        features,
        target,
        test_size: testSize,
        random_state: randomState,
        shuffle,
      }),
    }),
};

// Model API
export const modelApi = {
  initializeModel: (
    algorithm: string,
    modelType: string,
    params?: Record<string, any>
  ) =>
    apiCall('/model/init', {
      method: 'POST',
      body: JSON.stringify({
        algorithm,
        model_type: modelType,
        params,
      }),
    }),

  trainModel: (XTrain: number[][], yTrain: number[]) =>
    apiCall('/model/train', {
      method: 'POST',
      body: JSON.stringify({
        X_train: XTrain,
        y_train: yTrain,
      }),
    }),

  evaluateModel: (XTest: number[][], yTest: number[]) =>
    apiCall('/model/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        X_test: XTest,
        y_test: yTest,
      }),
    }),

  predict: (features: number[][]) =>
    apiCall('/model/predict', {
      method: 'POST',
      body: JSON.stringify({ features }),
    }),
};