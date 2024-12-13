import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { VirtualList } from './VirtualList';
import { Result } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import ResultDetailModal from './ResultDetailModal';
import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import ShareModal from './ShareModal';
import { getAnimationConfig, combineAnimations } from '@/config/animation';

interface ResultsListProps {
  results: Result[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => Promise<void>;
}

export default function ResultsList({ 
  results, 
  hasMore, 
  loading, 
  onLoadMore 
}: ResultsListProps) {
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareResult, setShareResult] = useState<Result | null>(null);

  const { loadMoreRef, loadingMore } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    loading,
  });

  const handleShare = (result: Result) => {
    setShareResult(result);
    setIsShareOpen(true);
  };

  const renderResultItem = (result: Result, index: number) => (
    <motion.div
      key={result.id}
      {...combineAnimations('list.item', 'scale')}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
    >
      {/* 匹配分数 */}
      <div className="flex items-center justify-between mb-4">
        <motion.h3 
          className="text-2xl font-bold text-pink-600"
          {...getAnimationConfig('spring')}
        >
          匹配度: {result.score}%
        </motion.h3>
        <span className="text-gray-500 text-sm">
          {new Date(result.timestamp).toLocaleDateString()}
        </span>
      </div>

      {/* 分析评语 */}
      <motion.div 
        className="mb-4"
        {...getAnimationConfig('fade')}
      >
        <h4 className="font-medium text-gray-900 mb-2">分析评语</h4>
        <p className="text-gray-600">{result.analysis}</p>
      </motion.div>

      {/* 关系建议 */}
      <motion.div
        {...getAnimationConfig('slide')}
      >
        <h4 className="font-medium text-gray-900 mb-2">关系建议</h4>
        <ul className="list-disc list-inside text-gray-600">
          {result.suggestions.map((suggestion, index) => (
            <motion.li 
              key={index}
              {...getAnimationConfig('list.item')}
            >
              {suggestion}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* 操作按钮 */}
      <motion.div 
        className="flex justify-end mt-4 space-x-2"
        {...getAnimationConfig('fade')}
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-600 hover:text-pink-600"
          onClick={() => handleShare(result)}
        >
          分享
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-600 hover:text-pink-600"
          onClick={() => {
            setSelectedResult(result);
            setIsDetailOpen(true);
          }}
        >
          查看详情
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <ErrorBoundary>
      <motion.div 
        className="space-y-4"
        {...getAnimationConfig('list.container')}
      >
        <AnimatePresence>
          <VirtualList
            items={results}
            itemHeight={300}
            renderItem={renderResultItem}
            className="min-h-[500px]"
            overscan={2}
          />
        </AnimatePresence>
        
        {/* 加载更多指示器 */}
        {(hasMore || loadingMore) && (
          <motion.div
            ref={loadMoreRef}
            className="flex justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loadingMore ? (
              <motion.div 
                className="h-8 w-8 border-b-2 border-pink-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <div className="h-8" />
            )}
          </motion.div>
        )}
        
        {/* 详情弹窗 */}
        <ResultDetailModal
          result={selectedResult}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />

        {/* 分享弹窗 */}
        {shareResult && (
          <ShareModal
            result={shareResult}
            isOpen={isShareOpen}
            onClose={() => {
              setIsShareOpen(false);
              setShareResult(null);
            }}
          />
        )}
      </motion.div>
    </ErrorBoundary>
  );
} 