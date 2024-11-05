import { API_CONFIG } from '../config/api';

// Generic API call function with error handling and console messages
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options?.headers,
      },
    });

    const data = await response.json();

    // Check for message in response for logging
    if (data.message) {
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: data.message
      }));
    }

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    window.dispatchEvent(new CustomEvent('console-message', {
      detail: `Error: ${errorMessage}`
    }));
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
  getDataset: () => apiCall('/dataset'),
  getColumnTypes: () => apiCall('/column-types'),
  getVisualizationData: (xColumn: string, yColumn?: string) =>
    apiCall(`/visualization-data?x_column=${xColumn}${yColumn ? `&y_column=${yColumn}` : ''}`),

  updateColumnType: (column: string, dtype: string) =>
    apiCall('/update-type', {
      method: 'POST',
      body: JSON.stringify({ column, dtype }),
    }),
};

// Preprocessing API
export const preprocessApi = {
  getHead: (n = 5) => apiCall(`/preprocess/head?n=${n}`),
  getTail: (n = 5) => apiCall(`/preprocess/tail?n=${n}`),
  getShape: () => apiCall('/preprocess/shape'),
  getMissingValues: () => apiCall('/preprocess/missing'),
  getColumnTypes: () => apiCall('/preprocess/column-types'),

  getCategoricalColumns: () =>
    apiCall('/preprocess/categorical-columns'),

  getNumericalColumns: () =>
    apiCall('/preprocess/numerical-columns'),

  handleMissingValues: (column: string, method: string) =>
    apiCall('/preprocess/handle-missing-values', {
      method: 'POST',
      body: JSON.stringify({ column, method }),
    }),

  updateColumnType: (column: string, dtype: string) =>
    apiCall('/preprocess/update-type', {
      method: 'POST',
      body: JSON.stringify({ column, dtype }),
    }),

  deleteColumn: (column: string) =>
    apiCall('/preprocess/delete-column', {
      method: 'POST',
      body: JSON.stringify({ column }),
    }),

  getColumnValues: (column1: string, column2?: string) =>
    apiCall(
      `/preprocess/get-columns?column1=${column1}${column2 ? `&column2=${column2}` : ''
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

  splitDataset: (params: {
    test_size: number;
    random_state: number;
    shuffle: boolean;
    stratify: boolean;
  }) =>
    apiCall('/preprocess/split', {
      method: 'POST',
      body: JSON.stringify(params),
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