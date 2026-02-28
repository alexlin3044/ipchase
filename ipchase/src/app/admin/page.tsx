'use client';

import { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // 简单密码验证 - 实际应使用环境变量
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('密码错误');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">管理后台</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理密码"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">管理后台</h1>
      
      <div className="flex gap-4 mb-8">
        {['overview', 'stats', 'settings'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg transition ${
              activeSection === section
                ? 'bg-cyan-500 text-black'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {section === 'overview' && '📊 概览'}
            {section === 'stats' && '📈 统计'}
            {section === 'settings' && '⚙️ 设置'}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">系统概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-500 text-sm">今日访问</div>
              <div className="text-2xl font-bold">1,234</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-500 text-sm">总查询量</div>
              <div className="text-2xl font-bold">56,789</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-500 text-sm">在线用户</div>
              <div className="text-2xl font-bold">42</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-500 text-sm">系统状态</div>
              <div className="text-2xl font-bold text-green-400">正常</div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'stats' && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">查询统计</h2>
          <p className="text-gray-400">统计数据功能开发中...</p>
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">系统设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <div className="font-medium">广告展示</div>
                <div className="text-gray-500 text-sm">开启页面广告展示</div>
              </div>
              <button className="w-12 h-6 bg-green-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <div className="font-medium">数据分析</div>
                <div className="text-gray-500 text-sm">收集匿名使用统计</div>
              </div>
              <button className="w-12 h-6 bg-green-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
