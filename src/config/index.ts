interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  cache: {
    defaultTTL: number;
    keys: {
      results: string;
      wechatToken: string;
    };
  };
  limits: {
    maxPageSize: number;
    maxRetries: number;
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
  features: {
    enableCache: boolean;
    enableRateLimit: boolean;
    enableSwagger: boolean;
    reducedMotion: boolean;
  };
  performance: {
    animationThreshold: number;
  };
}

const development: Config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  cache: {
    defaultTTL: 300, // 5分钟
    keys: {
      results: 'results:',
      wechatToken: 'wechat:token',
    },
  },
  limits: {
    maxPageSize: 50,
    maxRetries: 3,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 限制100次请求
    },
  },
  features: {
    enableCache: true,
    enableRateLimit: false,
    enableSwagger: true,
    reducedMotion: false,
  },
  performance: {
    animationThreshold: 100, // 动画性能警告阈值（毫秒）
  },
};

const production: Config = {
  ...development,
  features: {
    enableCache: true,
    enableRateLimit: true,
    enableSwagger: false,
    reducedMotion: false,
  },
};

const test: Config = {
  ...development,
  features: {
    enableCache: false,
    enableRateLimit: false,
    enableSwagger: false,
    reducedMotion: false,
  },
};

const configs = {
  development,
  production,
  test,
};

export const config = configs[process.env.NODE_ENV || 'development']; 