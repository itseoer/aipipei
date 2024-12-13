import { useState } from 'react';

interface FilterState {
  scoreRange: [number, number];
  timeRange: string;
  testType: string;
}

interface ResultsFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function ResultsFilter({ filters, onChange }: ResultsFilterProps) {
  // 本地状态用于实时更新UI
  const [localFilters, setLocalFilters] = useState(filters);
  
  // 处理评分范围变化
  const handleScoreChange = (value: number, index: 0 | 1) => {
    const newRange = [...localFilters.scoreRange] as [number, number];
    newRange[index] = value;
    
    // 确保最小值不大于最大值
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    }
    if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    const newFilters = {
      ...localFilters,
      scoreRange: newRange
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium text-gray-900 mb-4">筛选条件</h3>
      
      {/* 匹配度范围 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          匹配度范围
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={0}
              max={100}
              value={localFilters.scoreRange[0]}
              onChange={(e) => handleScoreChange(Number(e.target.value), 0)}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-12">
              {localFilters.scoreRange[0]}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={0}
              max={100}
              value={localFilters.scoreRange[1]}
              onChange={(e) => handleScoreChange(Number(e.target.value), 1)}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-12">
              {localFilters.scoreRange[1]}%
            </span>
          </div>
        </div>
      </div>

      {/* 时间范围 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          时间范围
        </label>
        <select
          value={localFilters.timeRange}
          onChange={(e) => {
            const newFilters = {
              ...localFilters,
              timeRange: e.target.value
            };
            setLocalFilters(newFilters);
            onChange(newFilters);
          }}
          className="w-full rounded-md border-gray-300"
        >
          <option value="all">全部时间</option>
          <option value="week">最近一周</option>
          <option value="month">最近一月</option>
          <option value="halfYear">最近半年</option>
        </select>
      </div>

      {/* 测试类型 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          测试类型
        </label>
        <select
          value={localFilters.testType}
          onChange={(e) => {
            const newFilters = {
              ...localFilters,
              testType: e.target.value
            };
            setLocalFilters(newFilters);
            onChange(newFilters);
          }}
          className="w-full rounded-md border-gray-300"
        >
          <option value="all">全部类型</option>
          <option value="basic">基础测试</option>
          <option value="advanced">深度测试</option>
        </select>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={() => {
          const defaultFilters = {
            scoreRange: [0, 100] as [number, number],
            timeRange: 'all',
            testType: 'all'
          };
          setLocalFilters(defaultFilters);
          onChange(defaultFilters);
        }}
        className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-pink-600 bg-pink-50 hover:bg-pink-100"
      >
        重置筛选
      </button>
    </div>
  );
} 