import pino from 'pino';
import { config } from '@/config';

// 日志配置
const logConfig = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  production: {
    level: 'info',
    transport: {
      target: 'pino/file',
      options: {
        destination: './logs/app.log',
        mkdir: true,
      },
    },
  },
  test: {
    level: 'silent',
  },
};

// 创建日志记录器
export const logger = pino({
  ...logConfig[process.env.NODE_ENV || 'development'],
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

// 性能监控
export const performance = {
  start(label: string) {
    if (process.env.NODE_ENV === 'development') {
      console.time(label);
    }
    return Date.now();
  },

  end(label: string, startTime: number) {
    const duration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(label);
    }
    logger.info('性能监控', {
      label,
      duration,
    });
    return duration;
  },
};

// 用户行为跟踪
export const analytics = {
  trackEvent(eventName: string, data: any) {
    logger.info('用户行为', {
      event: eventName,
      ...data,
      timestamp: new Date().toISOString(),
    });
  },

  trackError(error: Error, context?: any) {
    logger.error('错误跟踪', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
    });
  },

  trackPerformance(metric: {
    name: string;
    value: number;
    category?: string;
  }) {
    logger.info('性能指标', {
      ...metric,
      timestamp: new Date().toISOString(),
    });
  },
}; 