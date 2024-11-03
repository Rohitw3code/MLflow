import React from 'react';
import { Cpu, BarChart3, GitBranch, Share2, Clock, Check, XCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

function StatCard({ icon, title, value, description }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="bg-purple-500/20 p-3 rounded-lg">{icon}</div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-white text-2xl font-semibold">{value}</p>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-2">{description}</p>
    </div>
  );
}

// Sample data for charts
const performanceData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  accuracy: 85 + Math.random() * 10,
  requests: Math.floor(Math.random() * 1000),
}));

const recentProjects = [
  { id: 1, name: 'Customer Churn Prediction', time: '2 hours ago', status: 'completed' },
  { id: 2, name: 'Sales Forecasting', time: '5 hours ago', status: 'failed' },
  { id: 3, name: 'Sentiment Analysis', time: '1 day ago', status: 'completed' },
  { id: 4, name: 'Image Classification', time: '2 days ago', status: 'pending' },
  { id: 5, name: 'Fraud Detection', time: '3 days ago', status: 'completed' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <Check className="w-5 h-5 text-green-400" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'pending':
      return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    default:
      return null;
  }
};

export function Dashboard() {
  const stats = [
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: 'Active Models',
      value: '12',
      description: 'Models currently in production',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      title: 'Average Accuracy',
      value: '94.2%',
      description: 'Across all deployed models',
    },
    {
      icon: <Share2 className="w-6 h-6 text-purple-400" />,
      title: 'API Calls',
      value: '8.4K',
      description: 'In the last 24 hours',
    },
  ];

  return (
    <div className="flex-1 transition-all duration-300 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to MLflow
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Get started by selecting a workflow from the side navigation.
              Build, train, and deploy your machine learning models with just a
              few clicks.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Model Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">API Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Recent Projects</h3>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(project.status)}
                    <div>
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{project.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;