import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { dataApi } from '../../api';

interface DescribeData {
  [key: string]: {
    count: number;
    mean: number;
    std: number;
    min: number;
    '25%': number;
    '50%': number;
    '75%': number;
    max: number;
  };
}

export function DataSummary() {
  const [showDescribe, setShowDescribe] = useState(false);
  const [describeData, setDescribeData] = useState<DescribeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDescribeData = async () => {
    if (!showDescribe || describeData) return;

    setLoading(true);
    setError(null);

    try {
      const data = await dataApi.getDescription();
      setDescribeData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch dataset description'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDescribe) fetchDescribeData();
  }, [showDescribe]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowDescribe(!showDescribe)}
        className="w-full bg-slate-800 p-4 rounded-lg flex items-center justify-between hover:bg-slate-700"
      >
        <span className="text-white font-medium">
          Statistical Summary (describe)
        </span>
        {showDescribe ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )}
      </button>

      {showDescribe && describeData && (
        <div className="bg-white/5 p-4 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-purple-400 px-4 py-2">Metric</th>
                {Object.keys(describeData).map((col) => (
                  <th key={col} className="text-left text-purple-400 px-4 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(describeData[Object.keys(describeData)[0]]).map(
                (metric) => (
                  <tr key={metric} className="border-b border-gray-700">
                    <td className="text-gray-300 px-4 py-2">{metric}</td>
                    {Object.keys(describeData).map((col) => (
                      <td key={col} className="text-gray-300 px-4 py-2">
                        {typeof describeData[col][metric] === 'number'
                          ? describeData[col][metric].toLocaleString()
                          : String(describeData[col][metric])} {/* Convert to string */}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-400 py-4">Loading data...</div>
      )}
    </div>
  );
}
