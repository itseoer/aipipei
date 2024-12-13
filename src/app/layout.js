import "./globals.css";

export const metadata = {
  title: "AI姻缘测试 - 探索你的完美匹配",
  description: "通过AI技术预测两个人的契合度,帮助你找到真爱。快来测试你与TA的缘分指数!",
  keywords: "AI姻缘测试,爱情测试,缘分预测,情侣配对",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
