import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'AI姻缘测试API文档',
        version: '1.0.0',
        description: '提供AI姻缘测试相关的API接口',
      },
      components: {
        schemas: {
          Result: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              score: { type: 'number', minimum: 0, maximum: 100 },
              analysis: { type: 'string' },
              suggestions: { 
                type: 'array',
                items: { type: 'string' }
              },
              timestamp: { type: 'string', format: 'date-time' },
              testType: { type: 'string', enum: ['basic', 'advanced'] },
              user1: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  birthDate: { type: 'string', format: 'date' },
                },
                required: ['name'],
              },
              user2: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  birthDate: { type: 'string', format: 'date' },
                },
                required: ['name'],
              },
            },
            required: ['score', 'analysis', 'suggestions', 'testType'],
          },
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              code: { type: 'number' },
              details: { type: 'object' },
            },
            required: ['error', 'code'],
          },
        },
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    },
  });

  return NextResponse.json(spec);
} 