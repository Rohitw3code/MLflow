import React from 'react';
import { Save } from 'lucide-react';

interface SaveProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function SaveProjectDialog({ isOpen, onClose, onSave }: SaveProjectDialogProps) {
  const [projectName, setProjectName] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-[400px]">
        <div className="flex items-center space-x-2 mb-4">
          <Save className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Save Project</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
              placeholder="Enter project name"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(projectName);
                onClose();
              }}
              disabled={!projectName}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Save Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}