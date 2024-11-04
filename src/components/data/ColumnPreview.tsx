import React from 'react';
import { X } from 'lucide-react';

interface ColumnPreviewProps {
  columnName: string;
  data: any[];
  onClose: () => void;
}

export function ColumnPreview({ columnName, data, onClose }: ColumnPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-slate-800 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{columnName}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          {data.map((value, index) => (
            <div 
              key={index}
              className="bg-slate-700 p-3 rounded-lg flex justify-between items-center"
            >
              <span className="text-gray-400">Row {index + 1}</span>
              <span className="text-white">{value !== null ? value.toString() : 'null'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}