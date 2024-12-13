import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { performance, analytics } from '@/lib/logger';

interface PerformanceMetrics {
  fps: number;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  } | null;
  paintTime: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    paintTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    // 监控FPS
    const measureFPS = () => {
      frameCount++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          } : null,
        }));

        // 记录性能指标
        analytics.trackPerformance({
          name: 'fps',
          value: fps,
          category: 'animation',
        });

        frameCount = 0;
        lastTime = now;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // 监控绘制时间
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          setMetrics(prev => ({
            ...prev,
            paintTime: entry.duration,
          }));

          analytics.trackPerformance({
            name: 'paint',
            value: entry.duration,
            category: 'rendering',
          });
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
    measureFPS();

    // 快捷键切换显示
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' && e.ctrlKey) {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-lg font-mono text-sm z-50"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <div className="space-y-2">
          <div>FPS: {metrics.fps}</div>
          {metrics.memory && (
            <div>
              Memory: {Math.round(metrics.memory.usedJSHeapSize / 1024 / 1024)}MB /
              {Math.round(metrics.memory.totalJSHeapSize / 1024 / 1024)}MB
            </div>
          )}
          <div>Paint: {metrics.paintTime.toFixed(2)}ms</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 