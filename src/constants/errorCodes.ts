export const ErrorCodes = {
  // 系统错误 (1000-1999)
  SYSTEM_ERROR: {
    code: 1000,
    message: '系统错误',
  },
  DATABASE_ERROR: {
    code: 1001,
    message: '数据库错误',
  },
  CACHE_ERROR: {
    code: 1002,
    message: '缓存错误',
  },

  // 请求错误 (2000-2999)
  INVALID_PARAMS: {
    code: 2000,
    message: '无效的请求参数',
  },
  UNAUTHORIZED: {
    code: 2001,
    message: '未授权的访问',
  },
  FORBIDDEN: {
    code: 2002,
    message: '禁止访问',
  },
  RATE_LIMIT: {
    code: 2003,
    message: '请求过于频繁',
  },

  // 业务错误 (3000-3999)
  NAME_REQUIRED: {
    code: 3000,
    message: '姓名不能为空',
  },
  INVALID_DATE: {
    code: 3001,
    message: '无效的日期格式',
  },
  TEST_NOT_FOUND: {
    code: 3002,
    message: '测试结果不存在',
  },

  // 第三方服务错误 (4000-4999)
  WECHAT_ERROR: {
    code: 4000,
    message: '微信服务错误',
  },
  REDIS_ERROR: {
    code: 4001,
    message: 'Redis服务错误',
  },
} as const;

export type ErrorCode = keyof typeof ErrorCodes; 