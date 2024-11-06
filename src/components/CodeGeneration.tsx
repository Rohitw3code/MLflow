import React, { useState, useEffect, useRef } from 'react';
import { Code2, X, Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import { Groq } from 'groq-sdk';

interface CodeGenerationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodeGeneration({ isOpen, onClose }: CodeGenerationProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'python' | 'javascript' | 'typescript'>('python');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (generatedCode) {
      Prism.highlightElement(codeRef.current!);
    }
  }, [generatedCode, language]);

  useEffect(() => {
    const handleConsoleMessage = (event: CustomEvent<string>) => {
      setPrompt(event.detail);
    };

    window.addEventListener('console-message', handleConsoleMessage as EventListener);
    return () => {
      window.removeEventListener('console-message', handleConsoleMessage as EventListener);
    };
  }, []);

  const generateCode = async () => {
    if (!prompt) {
      setError('Please provide a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser:true
      });

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert programmer. Generate clean, well-documented ${language} code based on the user's request. Include comments explaining the code.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.3,
        max_tokens: 2048,
      });

      setGeneratedCode(completion.choices[0]?.message?.content || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-slate-800 p-6 rounded-lg w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Code Generation</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 min-h-[100px]"
              placeholder="Describe what code you want to generate..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </select>

            <button
              onClick={generateCode}
              disabled={isGenerating || !prompt}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4" />
                  <span>Generate Code</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {generatedCode && (
            <div className="relative">
              <div className="absolute right-2 top-2">
                <button
                  onClick={handleCopy}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg"
                  title={copied ? 'Copied!' : 'Copy code'}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code ref={codeRef} className={`language-${language}`}>
                  {generatedCode}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}