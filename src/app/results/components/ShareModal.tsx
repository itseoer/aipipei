import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Result } from '../types';
import html2canvas from 'html2canvas';
import Toast from './Toast';
import { initWechatShare } from '../utils/wechatShare';
import { shareImageCache } from '../utils/shareImageCache';

interface ShareModalProps {
  result: Result;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ result, isOpen, onClose }: ShareModalProps) {
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isConfiguringWechat, setIsConfiguringWechat] = useState(false);

  // 显示提示
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastConfig({ message, type, isVisible: true });
    setTimeout(() => {
      setToastConfig(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // 复制分享链接
  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/results/${result.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('链接已复制到剪贴板', 'success');
    } catch (error) {
      showToast('复制链接失败', 'error');
      console.error('复制链接失败:', error);
    }
  };

  // 社交媒体分享
  const shareToSocial = async (platform: 'weixin' | 'weibo' | 'qq') => {
    if (platform === 'weixin') {
      try {
        setIsConfiguringWechat(true);
        await initWechatShare({
          title: `我的姻缘测试结果：${result.score}%的契合度！`,
          desc: result.analysis,
          link: `${window.location.origin}/results/${result.id}`,
          imgUrl: `${window.location.origin}/share-preview.png`,
        });
        showToast('请点击右上角分享', 'info');
      } catch (error) {
        showToast('微信分享配置失败', 'error');
      } finally {
        setIsConfiguringWechat(false);
      }
      return;
    }

    const shareUrl = encodeURIComponent(`${window.location.origin}/results/${result.id}`);
    const title = encodeURIComponent(`我的姻缘测试结果：${result.score}%的契合度！`);
    
    let url = '';
    switch (platform) {
      case 'weibo':
        url = `http://service.weibo.com/share/share.php?url=${shareUrl}&title=${title}`;
        break;
      case 'qq':
        url = `http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&title=${title}`;
        break;
      case 'weixin':
        // 微信分享需要使用微信SDK
        // TODO: 实现微信分享
        return;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  // 生成分享图片
  const generateShareImage = async () => {
    const element = document.getElementById('share-content');
    if (!element) return;
    
    try {
      // 检查缓存
      const cacheKey = `result-${result.id}`;
      const cachedImage = shareImageCache.get(cacheKey);
      
      if (cachedImage) {
        // 使用缓存的图片
        const link = document.createElement('a');
        link.download = `姻缘测试结果-${result.score}%.png`;
        link.href = cachedImage;
        link.click();
        showToast('分享图片已保存', 'success');
        return;
      }

      setIsGeneratingImage(true);
      showToast('正在生成分享图片...', 'info');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: process.env.NODE_ENV === 'development',
        onclone: (document) => {
          // 可以在这里修改克隆的DOM，比如添加水印等
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      shareImageCache.set(cacheKey, dataUrl);
      
      const link = document.createElement('a');
      link.download = `姻缘测试结果-${result.score}%.png`;
      link.href = dataUrl;
      link.click();
      showToast('分享图片已保存', 'success');
    } catch (error) {
      showToast('生成分享图片失败', 'error');
      console.error('生成分享图片失败:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                      分享结果
                    </Dialog.Title>

                    {/* 分享预览 */}
                    <div id="share-content" className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-lg mb-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-4">
                          <span className="text-3xl font-bold text-pink-600">
                            {result.score}%
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{result.analysis}</p>
                      </div>
                    </div>

                    {/* 分享选项 */}
                    <div className="space-y-4">
                      {/* 保存图片 */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateShareImage}
                        disabled={isGeneratingImage}
                        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                          isGeneratingImage ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
                        }`}
                      >
                        {isGeneratingImage ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            生成中...
                          </>
                        ) : (
                          '保存分享图片'
                        )}
                      </motion.button>

                      {/* 复制链接 */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyShareLink}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        复制分享链接
                      </motion.button>

                      {/* 社交媒体分享 */}
                      <div className="flex justify-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('weixin')}
                          className="p-2 rounded-full bg-green-100 text-green-600"
                        >
                          微信
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('weibo')}
                          className="p-2 rounded-full bg-red-100 text-red-600"
                        >
                          微博
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareToSocial('qq')}
                          className="p-2 rounded-full bg-blue-100 text-blue-600"
                        >
                          QQ
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* 提示组件 */}
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  );
} 