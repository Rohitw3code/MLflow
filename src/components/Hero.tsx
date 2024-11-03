import React from 'react';
import { ArrowRight, Brain, Cpu, Code2, Rocket, Workflow } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export function Hero({ onStartClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unspla1sh.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 rotate-45 transform animate-gradient"></div>
      </div>

      <div className="relative z-10 mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Build and Deploy ML Models with
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                {' '}
                Zero Code
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your data into powerful ML models with our intuitive
              no-code platform. Perfect for data scientists, analysts, and ML
              engineers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn animation-delay-200">
            <button
              onClick={onStartClick}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
            >
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#features"
              className="text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <span>Learn More</span>
              <Rocket className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 animate-fadeIn animation-delay-400">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'AutoML',
                description:
                  'Automated model selection and hyperparameter tuning',
              },
              {
                icon: <Code2 className="w-6 h-6" />,
                title: 'Code Export',
                description:
                  'Export trained models as Python, R, or JavaScript code',
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: 'One-Click Deploy',
                description: 'Deploy models to production with a single click',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/10"
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
      </div>

      {/* Floating elements animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Cpu className="w-8 h-8 text-purple-400/30" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-float animation-delay-1000">
          <Brain className="w-8 h-8 text-blue-400/30" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float animation-delay-2000">
          <Workflow className="w-8 h-8 text-purple-400/30" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
