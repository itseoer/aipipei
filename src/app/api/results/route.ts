import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { connectDB } from '@/lib/mongodb';
import { Result } from '@/models/Result';
import { z } from 'zod';

// 请求参数验证
const querySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(50).default(10),
  scoreRange: z.tuple([z.number().min(0).max(100), z.number().min(0).max(100)]).optional(),
  timeRange: z.enum(['all', 'week', 'month', 'halfYear']).optional(),
  testType: z.enum(['all', 'basic', 'advanced']).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = querySchema.parse(body);

    // 构建缓存键
    const cacheKey = `results:${JSON.stringify(query)}`;

    // 尝试从缓存获取数据
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // 连接数据库
    await connectDB();

    // 构建查询条件
    const conditions: any = {};
    
    if (query.scoreRange) {
      conditions.score = {
        $gte: query.scoreRange[0],
        $lte: query.scoreRange[1],
      };
    }

    if (query.timeRange && query.timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        halfYear: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      };
      conditions.timestamp = {
        $gte: timeRanges[query.timeRange],
      };
    }

    if (query.testType && query.testType !== 'all') {
      conditions.testType = query.testType;
    }

    // 执行查询
    const [results, total] = await Promise.all([
      Result.find(conditions)
        .sort({ timestamp: -1 })
        .skip((query.page - 1) * query.pageSize)
        .limit(query.pageSize)
        .lean(),
      Result.countDocuments(conditions),
    ]);

    const data = {
      results,
      total,
      page: query.page,
      pageSize: query.pageSize,
    };

    // 缓存结果(5分钟)
    await redis.setex(cacheKey, 300, JSON.stringify(data));

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '请求参数错误', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
} 