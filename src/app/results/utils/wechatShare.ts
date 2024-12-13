import { wechatService } from '../services/wechatService';

interface WechatShareConfig {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
}

export async function initWechatShare(config: WechatShareConfig) {
  // 检查是否在微信环境
  const isWechat = /MicroMessenger/i.test(navigator.userAgent);
  if (!isWechat) return;

  try {
    // 加载微信JS SDK
    await loadWechatScript();
    
    // 获取签名
    const signature = await wechatService.getSignature(window.location.href.split('#')[0]);
    
    // 配置微信分享
    window.wx.config({
      debug: process.env.NODE_ENV === 'development',
      appId: signature.appId,
      timestamp: signature.timestamp,
      nonceStr: signature.nonceStr,
      signature: signature.signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    });

    // 监听配置失败事件
    window.wx.error((res: any) => {
      console.error('微信配置失败:', res);
      // 可以在这里添加重试逻辑
    });

    // 设置分享内容
    window.wx.ready(() => {
      // 分享给朋友
      window.wx.updateAppMessageShareData({
        title: config.title,
        desc: config.desc,
        link: config.link,
        imgUrl: config.imgUrl,
        success: function() {
          console.log('分享设置成功');
        },
        fail: function(res: any) {
          console.error('分享设置失败:', res);
        }
      });

      // 分享到朋友圈
      window.wx.updateTimelineShareData({
        title: config.title,
        link: config.link,
        imgUrl: config.imgUrl,
        success: function() {
          console.log('朋友圈分享设置成功');
        },
        fail: function(res: any) {
          console.error('朋友圈分享设置失败:', res);
        }
      });
    });
  } catch (error) {
    console.error('微信分享配置失败:', error);
    throw error;
  }
}

// 加载微信JS SDK
function loadWechatScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.wx) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '//res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
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