interface ResultsHeaderProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: () => void;
  onOpenFilter: () => void;
}

export default function ResultsHeader({
  viewMode,
  onViewModeChange,
  onOpenFilter,
}: ResultsHeaderProps) {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onViewModeChange}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {viewMode === 'list' ? '切换到网格视图' : '切换到列表视图'}
            </button>

            {/* 移动端筛选按钮 */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={onOpenFilter}
            >
              <span className="sr-only">打开筛选</span>
              <svg 
                className="h-6 w-6 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 