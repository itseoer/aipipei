import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI姻缘测试 - 探索你的完美匹配',
  description: '通过AI技术预测两个人的契合度,帮助你找到真爱。快来测试你与TA的缘分指数!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
} 