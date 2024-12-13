import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    if (!response.ok) {
      // 处理API错误
      const error = await response.json();
      return new NextResponse(
        JSON.stringify({
          error: error.message || '服务器错误',
          code: response.status,
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return response;
  } catch (error) {
    console.error('请求处理失败:', error);
    
    // 记录错误日志
    await logError({
      url: request.url,
      method: request.method,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    return new NextResponse(
      JSON.stringify({
        error: '服务器错误',
        code: 500,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// 配置中间件匹配的路由
export const config = {
  matcher: '/api/:path*',
};

// 错误日志记录
async function logError(errorData: {
  url: string;
  method: string;
  error: string;
  timestamp: string;
}) {
  try {
    // TODO: 实现实际的错误日志记录
    console.error('API错误:', errorData);
  } catch (error) {
    console.error('记录错误日志失败:', error);
  }
} 