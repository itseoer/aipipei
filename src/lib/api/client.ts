import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/config';
import { ErrorCodes, ErrorCode } from '@/constants/errorCodes';
import { logger } from '@/lib/logger';

interface ApiError {
  error: string;
  code: number;
  details?: any;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加请求开始时间
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        // 记录请求耗时
        const duration = Date.now() - response.config.metadata.startTime;
        logger.info('API请求完成', {
          url: response.config.url,
          method: response.config.method,
          duration,
          status: response.status,
        });

        return response;
      },
      (error: AxiosError<ApiError>) => {
        const duration = Date.now() - error.config?.metadata.startTime;
        
        // 记录错误日志
        logger.error('API请求失败', {
          url: error.config?.url,
          method: error.config?.method,
          duration,
          status: error.response?.status,
          error: error.response?.data,
        });

        // 处理错误响应
        if (error.response) {
          const errorCode = this.getErrorCode(error.response.data);
          throw new ApiError(errorCode);
        }

        // 处理网络错误
        throw new ApiError('SYSTEM_ERROR');
      }
    );
  }

  private getErrorCode(error: ApiError): ErrorCode {
    // 根据错误码映射到ErrorCodes
    const code = error.code;
    const errorCode = Object.entries(ErrorCodes).find(
      ([_, value]) => value.code === code
    )?.[0] as ErrorCode;

    return errorCode || 'SYSTEM_ERROR';
  }

  // API方法
  async getResults(params: {
    page: number;
    pageSize: number;
    scoreRange?: [number, number];
    timeRange?: string;
    testType?: string;
  }) {
    const response = await this.client.post('/api/results', params);
    return response.data;
  }

  async getWechatSignature(url: string) {
    const response = await this.client.post('/api/wechat/signature', { url });
    return response.data;
  }
}

// 自定义错误类
export class ApiError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode) {
    super(ErrorCodes[code].message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient(); 
 