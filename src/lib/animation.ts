import { config } from '@/config';
import { analytics } from '@/lib/logger';

// 动画配置
export const animationConfig = {
  // 使用transform代替position
  transform: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -20 },
  },
  
  // 过渡配置
  transition: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
    mass: 1,
  },

  // GPU加速
  accelerate: {
    willChange: 'transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  },
};

// 性能监控
export const animationMetrics = {
  // 记录动画开始
  start(label: string) {
    const startTime = performance.now();
    analytics.trackPerformance({
      name: `animation_start_${label}`,
      value: startTime,
      category: 'animation',
    });
    return startTime;
  },

  // 记录动画结束
  end(label: string, startTime: number) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    analytics.trackPerformance({
      name: `animation_end_${label}`,
      value: duration,
      category: 'animation',
    });

    // 如果动画时长超过阈值,记录警告
    if (duration > config.performance.animationThreshold) {
      analytics.trackError(new Error('Animation performance warning'), {
        label,
        duration,
        threshold: config.performance.animationThreshold,
      });
    }

    return duration;
  },
};

// 动画优化工具
export const animationUtils = {
  // 检查浏览器是否支持动画优化
  checkSupport() {
    return {
      transform3d: 'WebKitCSSMatrix' in window || 'MozCSSMatrix' in window,
      willChange: 'willChange' in document.body.style,
      requestAnimationFrame: 'requestAnimationFrame' in window,
    };
  },

  // 获取最优的动画配置
  getOptimalConfig() {
    const support = this.checkSupport();
    return {
      ...animationConfig,
      accelerate: support.transform3d ? animationConfig.accelerate : {},
    };
  },

  // 防抖动画
  debounceAnimation(callback: () => void, wait: number) {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const startTime = animationMetrics.start('debounced');
        callback();
        animationMetrics.end('debounced', startTime);
      }, wait);
    };
  },

  // 节流动画
  throttleAnimation(callback: () => void, limit: number) {
    let waiting = false;
    return () => {
      if (!waiting) {
        const startTime = animationMetrics.start('throttled');
        callback();
        animationMetrics.end('throttled', startTime);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  },
}; 