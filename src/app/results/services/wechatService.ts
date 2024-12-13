interface WechatSignature {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
}

class WechatService {
  private retryCount = 0;
  private readonly maxRetries = 3;

  // 获取微信分享签名
  async getSignature(url: string): Promise<WechatSignature> {
    try {
      const response = await fetch('/api/wechat/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('获取签名失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        // 重试延迟增加
        await new Promise(resolve => setTimeout(resolve, this.retryCount * 1000));
        return this.getSignature(url);
      }
      throw error;
    }
  }

  // 重置重试计数
  resetRetryCount(): void {
    this.retryCount = 0;
  }
}

export const wechatService = new WechatService(); 