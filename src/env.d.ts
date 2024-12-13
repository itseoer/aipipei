declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    MONGODB_URI: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    WECHAT_APP_ID: string;
    WECHAT_APP_SECRET: string;
    WECHAT_TOKEN: string;
    API_BASE_URL: string;
    NEXT_PUBLIC_API_BASE_URL: string;
  }
} 