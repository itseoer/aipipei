'use client';

import { useState, useEffect } from 'react';
import ResultsHeader from './components/ResultsHeader';
import ResultsList from './components/ResultsList';
import ResultsGrid from './components/ResultsGrid';
import ResultsFilter from './components/ResultsFilter';
import MobileFilterDrawer from './components/MobileFilterDrawer';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import { useResults } from './hooks/useResults';
import { Result } from './types';

const initialFilters = {
  scoreRange: [0, 100] as [number, number],
  timeRange: 'all',
  testType: 'all',
};

const testData = [
  {
    id: '1',
    score: 85,
    analysis: '你们的缘分非常深厚,有着相似的价值观和生活理念。彼此都很重视家庭,也都愿意为对方付出。在沟通方面比较默契,能够互相理解和包容。',
    suggestions: [
      '多创造共同话题,增进感情',
      '保持良好的沟通习惯',
      '互相尊重对方的个人空间',
      '共同规划未来',
    ],
    timestamp: new Date().toISOString(),
    testType: 'basic',
    user1: { name: '张三' },
    user2: { name: '李四' },
  },
  // ... 其他测试数据
];

export default function ResultsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 使用测试数据
  useEffect(() => {
    setResults(testData);
  }, []);

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error.message}
      </div>
    );
  }

  if (!results.length) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResultsHeader 
        viewMode={viewMode}
        onViewModeChange={toggleViewMode}
        onOpenFilter={() => setIsFilterOpen(true)}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 桌面端筛选侧边栏 */}
          <aside className="w-64 hidden lg:block">
            <ResultsFilter 
              filters={initialFilters}
              onChange={() => {}}
            />
          </aside>
          
          <main className="flex-1">
            {viewMode === 'list' ? (
              <ResultsList 
                results={results}
                hasMore={false}
                loading={loading}
                onLoadMore={async () => {}}
              />
            ) : (
              <ResultsGrid 
                results={results}
                hasMore={false}
                loading={loading}
                onLoadMore={async () => {}}
              />
            )}
          </main>
        </div>
      </div>

      {/* 移动端筛选抽屉 */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={initialFilters}
        onChange={() => {}}
      />
    </div>
  );
} 