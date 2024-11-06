import React, { useState } from 'react';
import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { dataApi } from '../../api';

interface DataUploadProps {
  onDataLoaded: (data: any[], columns: string[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export function DataUpload({ onDataLoaded, setIsLoading }: DataUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType === 'csv' || fileType === 'xlsx' || fileType === 'xls') {
        setFile(selectedFile);
        setSuccess(false);
        setError(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await dataApi.loadDataset(file);
      const columns = response.data && response.data.length > 0 
        ? Object.keys(response.data[0]) 
        : [];
      onDataLoaded(response.data, columns);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload dataset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-4 sm:p-6 rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-white">Upload Dataset</h3>
        {success && (
          <div className="flex items-center text-green-400">
            <Check size={16} className="mr-1" />
            <span>File loaded successfully</span>
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-400">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 sm:p-6 text-center">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-purple-400 mb-2" />
          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Drag and drop or click to upload CSV or Excel file
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Supported formats: .csv, .xlsx, .xls
          </p>
        </label>
      </div>

      {file && (
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800 p-3 rounded-lg space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <FileUp className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-gray-300 text-sm truncate max-w-[200px] sm:max-w-none">
                {file.name}
              </span>
            </div>
            <button
              onClick={handleUpload}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}