import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPChase - IP查询工具",
  description: "专业的IP查询网站 - IP归属地查询、浏览器指纹检测、DNS查询、延迟测速、Whois查询",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#0a0a0a]">
        <header className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold gradient-text">IPChase</a>
            <nav className="flex gap-6">
              <a href="/" className="hover:text-cyan-400 transition">首页</a>
              <a href="#tools" className="hover:text-cyan-400 transition">工具</a>
              <a href="/admin" className="hover:text-cyan-400 transition">管理</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-white/10 mt-20 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
            <p>© 2026 IPChase. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
