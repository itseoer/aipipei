import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 微信配置
const config = {
  appId: process.env.WECHAT_APP_ID!,
  appSecret: process.env.WECHAT_APP_SECRET!,
  token: process.env.WECHAT_TOKEN!,
};

// 缓存access_token
let accessToken: string | null = null;
let tokenExpireTime = 0;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // 获取access_token
    const token = await getAccessToken();
    if (!token) {
      throw new Error('获取access_token失败');
    }

    // 获取jsapi_ticket
    const ticket = await getJsapiTicket(token);
    if (!ticket) {
      throw new Error('获取jsapi_ticket失败');
    }

    // 生成签名
    const nonceStr = generateNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature({
      nonceStr,
      timestamp,
      url,
      ticket,
    });

    return NextResponse.json({
      appId: config.appId,
      timestamp,
      nonceStr,
      signature,
    });
  } catch (error) {
    console.error('生成签名失败:', error);
    return NextResponse.json(
      { error: '生成签名失败' },
      { status: 500 }
    );
  }
}

// 获取access_token
async function getAccessToken(): Promise<string | null> {
  // 检查缓存
  if (accessToken && Date.now() < tokenExpireTime) {
    return accessToken;
  }

  try {
    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
    );
    const data = await response.json();

    if (data.access_token) {
      accessToken = data.access_token;
      tokenExpireTime = Date.now() + (data.expires_in * 1000) - 60000; // 提前1分钟过期
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error('获取access_token失败:', error);
    return null;
  }
}

// 获取jsapi_ticket
async function getJsapiTicket(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
    );
    const data = await response.json();

    if (data.ticket) {
      return data.ticket;
    }
    return null;
  } catch (error) {
    console.error('获取jsapi_ticket失败:', error);
    return null;
  }
}

// 生成签名
function generateSignature({
  nonceStr,
  timestamp,
  url,
  ticket,
}: {
  nonceStr: string;
  timestamp: number;
  url: string;
  ticket: string;
}): string {
  const str = [
    `jsapi_ticket=${ticket}`,
    `noncestr=${nonceStr}`,
    `timestamp=${timestamp}`,
    `url=${url}`,
  ].sort().join('&');

  return crypto.createHash('sha1').update(str).digest('hex');
}

// 生成随机字符串
function generateNonceStr(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 