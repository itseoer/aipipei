import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  overscan = 3,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [containerHeight, setContainerHeight] = useState(0);

  // 计算可见范围
  const calculateVisibleRange = () => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const totalHeight = items.length * itemHeight;
    
    // 计算可见范围的起始和结束索引
    let start = Math.floor(scrollTop / itemHeight);
    let end = Math.ceil((scrollTop + clientHeight) / itemHeight);

    // 添加overscan以提供缓冲
    start = Math.max(0, start - overscan);
    end = Math.min(items.length, end + overscan);

    setVisibleRange({ start, end });
  };

  // 监听容器大小变化
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(debounce(() => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
        calculateVisibleRange();
      }
    }, 200));

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = debounce(() => {
      calculateVisibleRange();
    }, 100);

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  // 计算总高度和偏移量
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  // 获取可见项
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ height: containerHeight || '100%' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            renderItem(item, index + visibleRange.start)
          ))}
        </div>
      </div>
    </div>
  );
} 