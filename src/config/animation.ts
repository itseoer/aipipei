import { config } from '@/config';

// 动画主题配置
export const animationTheme = {
  // 基础动画
  base: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
    style: {},
  },

  // 弹性动画
  spring: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
    mass: 1,
    style: {},
  },

  // 渐变动画
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.2,
    },
    style: {},
  },

  // 滑动动画
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: {
      duration: 0.3,
    },
    style: {},
  },

  // 缩放动画
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
    style: {},
  },

  // 列表动画
  list: {
    container: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: {
        staggerChildren: 0.1,
      },
      style: {},
    },
    item: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 },
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
      style: {},
    },
  },

  // 性能优化
  performance: {
    transform: true,
    gpu: true,
    willChange: true,
    reducedMotion: false,
  },
};

// 获取动画配置
export function getAnimationConfig(type: keyof typeof animationTheme) {
  const config = {
    ...animationTheme[type],
    style: {},  // 确保有默认的 style 对象
  };
  
  // 添加性能优化
  if (animationTheme.performance.transform) {
    config.style = {
      ...config.style,
      transform: 'translateZ(0)',
    };
  }

  if (animationTheme.performance.gpu) {
    config.style = {
      ...config.style,
      backfaceVisibility: 'hidden',
    };
  }

  if (animationTheme.performance.willChange) {
    config.style = {
      ...config.style,
      willChange: 'transform',
    };
  }

  return config;
}

// 动画组合工具
export function combineAnimations(...types: (keyof typeof animationTheme)[]) {
  return types.reduce((combined, type) => {
    const config = getAnimationConfig(type);
    return {
      ...combined,
      ...config,
      transition: {
        ...combined.transition,
        ...config.transition,
      },
      style: {
        ...(combined.style || {}),
        ...(config.style || {}),
      },
    };
  }, { style: {} });
} 