'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [names, setNames] = useState({
    name1: '',
    name2: '',
  });

  // 处理客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.name1 || !names.name2) {
      alert('请输入双方姓名');
      return;
    }
    router.push(`/results?name1=${encodeURIComponent(names.name1)}&name2=${encodeURIComponent(names.name2)}`);
  };

  // 在客户端渲染之前返回占位内容
  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI姻缘测试
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            通过AI技术分析你们的契合度，探索你的完美匹配
          </p>

          {/* 姓名输入表单 */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto space-y-4">
            <div>
              <input
                type="text"
                value={names.name1}
                onChange={(e) => setNames(prev => ({ ...prev, name1: e.target.value }))}
                placeholder="请输入第一个人的姓名"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={names.name2}
                onChange={(e) => setNames(prev => ({ ...prev, name2: e.target.value }))}
                placeholder="请输入第二个人的姓名"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-pink-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                开始测试
              </button>
            </div>
          </form>
        </div>

        {/* 特色功能区 */}
        <section className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特色1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">快速准确</h3>
              <p className="text-gray-600">基于先进的AI算法,秒出结果,准确率高达95%</p>
            </div>
            
            {/* 特色2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">趣味性强</h3>
              <p className="text-gray-600">生动有趣的结果展示,让测试充满乐趣</p>
            </div>

            {/* 特色3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">专业分析</h3>
              <p className="text-gray-600">提供专业的分析报告和建议</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 