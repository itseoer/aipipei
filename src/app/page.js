import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-pink-600">
              AI姻缘测试
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">关于我们</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">博客</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">联系我们</Link>
          </div>
        </nav>
      </header>

      {/* Hero区域 */}
      <section className="relative bg-gradient-to-b from-pink-50 to-white pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              探索你的完美匹配
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              通过AI技术,只需输入两个人的姓名,即可预测你们的缘分指数。快来测试,发现你的真爱!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="text"
                placeholder="输入你的姓名"
                className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="text"
                placeholder="输入TA的姓名" 
                className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="px-8 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
                开始测试
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 特色功能区 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">为什么选择我们?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特色1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">快速准确</h3>
              <p className="text-gray-600">基于先进的AI算法,秒出结果,准确率高达95%</p>
            </div>
            
            {/* 特色2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">趣味性强</h3>
              <p className="text-gray-600">生动有趣的结果展示,让测试充满乐趣</p>
            </div>
            
            {/* 特色3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">一键分享</h3>
              <p className="text-gray-600">支持多平台分享,与好友一起互动</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">关于我们</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">公司介绍</Link></li>
                <li><Link href="/team" className="text-gray-600 hover:text-gray-900">团队成员</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">联系方式</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">帮助中心</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-600 hover:text-gray-900">常见问题</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">隐私政策</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">服务条款</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">更多资源</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">博客文章</Link></li>
                <li><Link href="/cases" className="text-gray-600 hover:text-gray-900">成功案例</Link></li>
                <li><Link href="/partners" className="text-gray-600 hover:text-gray-900">合作伙伴</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">关注我们</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">微信</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.258 4.458c0-.144.02-.455.099-.455 2.116.166 4.213.481 5.259.908.576.224 1.151.449 1.727.676 1.281.482 2.562.966 3.842 1.45.481.178.962.367 1.442.549.481.178.962.367 1.442.549.222.09.444.183.665.277.222.098.444.178.665.277.481.178.962.366 1.442.549.481.178.962.367 1.442.549.222.089.444.178.665.277.222.089.444.178.665.277.144.055.288.111.432.166" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}