import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Result, FilterState, PaginationState } from '../types';

interface UseResultsProps {
  initialFilters: FilterState;
}

export function useResults({ initialFilters }: UseResultsProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取结果的函数
  const fetchResults = async (filters: FilterState, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 替换为实际的API调用
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...filters,
          page,
          pageSize: pagination.pageSize,
        }),
      });
      
      if (!response.ok) {
        throw new Error('获取结果失败');
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setResults(data.results);
      } else {
        setResults(prev => [...prev, ...data.results]);
      }
      
      setPagination(prev => ({
        ...prev,
        page,
        total: data.total,
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 使用防抖优化频繁的筛选请求
  const debouncedFetchResults = debounce(fetchResults, 300);

  // 处理筛选条件变化
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    debouncedFetchResults(newFilters, 1);
  };

  // 加载更多数据
  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchResults(filters, pagination.page + 1);
  };

  // 计算是否还有更多数据
  const hasMore = results.length < pagination.total;

  // 初始加载
  useEffect(() => {
    fetchResults(initialFilters, 1);
  }, []);

  return {
    results,
    loading,
    error,
    filters,
    setFilters: handleFilterChange,
    hasMore,
    loadMore,
  };
} 