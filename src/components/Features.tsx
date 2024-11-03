import React from 'react';
import { Brain, Rocket, Code } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'One-Click Model Training',
    description: 'Train and download ML models instantly with a single click.',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Instant Deployment',
    description: 'Deploy models and get API endpoints immediately.',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Code Generation',
    description: 'Generate equivalent code for your ML workflow automatically.',
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
