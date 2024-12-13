import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Result } from '../types';
import { getAnimationConfig, combineAnimations } from '@/config/animation';

interface ResultsGridProps {
  results: Result[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => Promise<void>;
}

export default function ResultsGrid({ 
  results, 
  hasMore, 
  loading, 
  onLoadMore 
}: ResultsGridProps) {
  const { loadMoreRef, loadingMore } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    loading,
  });

  return (
    <motion.div
      className="space-y-8"
      {...getAnimationConfig('list.container')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {results.map((result) => (
            <motion.div
              key={result.id}
              {...combineAnimations('list.item', 'scale')}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              {/* 匹配分数 */}
              <motion.div 
                className="text-center mb-4"
                {...getAnimationConfig('spring')}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100">
                  <span className="text-2xl font-bold text-pink-600">
                    {result.score}%
                  </span>
                </div>
              </motion.div>

              {/* 简短分析 */}
              <motion.p 
                className="text-gray-600 text-sm text-center mb-4 line-clamp-3"
                {...getAnimationConfig('fade')}
              >
                {result.analysis}
              </motion.p>

              {/* 操作按钮 */}
              <motion.div 
                className="flex justify-center space-x-2"
                {...getAnimationConfig('slide')}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-600 hover:text-pink-600"
                  onClick={() => {/* TODO: 实现查看详情 */}}
                >
                  查看详情
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-600 hover:text-pink-600"
                  onClick={() => {/* TODO: 实现分享功能 */}}
                >
                  分享
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 加载更多指示器 */}
      {(hasMore || loadingMore) && (
        <motion.div
          ref={loadMoreRef}
          className="flex justify-center py-4"
          {...getAnimationConfig('fade')}
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
    </motion.div>
  );
} 