'use client';

import { useState, useEffect } from 'react';

// IP信息类型
interface IPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  as: string;
  timezone: string;
}

// 浏览器指纹类型
interface Fingerprint {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  colorDepth: number;
}

export default function Home() {
  const [queryIP, setQueryIP] = useState('');
  const [ipInfo, setIPInfo] = useState<IPInfo | null>(null);
  const [myIPInfo, setMyIPInfo] = useState<IPInfo | null>(null);
  const [fingerprint, setFingerprint] = useState<Fingerprint | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ip');
  const [dnsResult, setDnsResult] = useState<string>('');
  const [pingResult, setPingResult] = useState<string>('');
  const [whoisResult, setWhoisResult] = useState<string>('');

  // 获取当前IP信息
  useEffect(() => {
    fetchMyIP();
    getFingerprint();
  }, []);

  async function fetchMyIP() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setMyIPInfo({
        ip: data.ip || '未知',
        country: data.country_name || '未知',
        region: data.region || '未知',
        city: data.city || '未知',
        isp: data.org || '未知',
        as: data.asn || '未知',
        timezone: data.timezone || '未知',
      });
    } catch (e) {
      console.error(e);
    }
  }

  function getFingerprint() {
    const fp: Fingerprint = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width} x ${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || null,
      colorDepth: window.screen.colorDepth,
    };
    setFingerprint(fp);
  }

  async function queryIPInfo() {
    if (!queryIP) return;
    setLoading(true);
    try {
      const res = await fetch(`https://ipapi.co/${queryIP}/json/`);
      const data = await res.json();
      setIPInfo({
        ip: data.ip || queryIP,
        country: data.country_name || '未知',
        region: data.region || '未知',
        city: data.city || '未知',
        isp: data.org || '未知',
        as: data.asn || '未知',
        timezone: data.timezone || '未知',
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function queryDNS() {
    if (!queryIP) return;
    setLoading(true);
    setDnsResult('查询中...');
    try {
      const res = await fetch(`/api/dns?domain=${encodeURIComponent(queryIP)}`);
      const data = await res.json();
      setDnsResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setDnsResult('查询失败');
    }
    setLoading(false);
  }

  async function queryWhois() {
    if (!queryIP) return;
    setLoading(true);
    setWhoisResult('查询中...');
    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(queryIP)}`);
      const data = await res.json();
      setWhoisResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setWhoisResult('查询失败');
    }
    setLoading(false);
  }

  async function testPing() {
    setPingResult('测速中...');
    const times: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      try {
        await fetch('https://1.1.1.1/cdn-cgi/trace', { mode: 'no-cors' });
        const end = performance.now();
        times.push(Math.round(end - start));
      } catch (e) {
        times.push(-1);
      }
      await new Promise(r => setTimeout(r, 500));
    }
    const validTimes = times.filter(t => t > 0);
    if (validTimes.length > 0) {
      const avg = Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length);
      setPingResult(`延迟: ${validTimes.join('ms, ')}ms\n平均: ${avg}ms`);
    } else {
      setPingResult('测速失败');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 搜索框 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">IPChase</span>
        </h1>
        <p className="text-gray-400 mb-8">专业的IP查询与网络诊断工具</p>
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={queryIP}
            onChange={(e) => setQueryIP(e.target.value)}
            placeholder="输入IP地址或域名查询"
            className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-lg"
            onKeyDown={(e) => e.key === 'Enter' && queryIPInfo()}
          />
          <button
            onClick={queryIPInfo}
            disabled={loading}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            查询
          </button>
        </div>
      </div>

      {/* 我的IP信息 */}
      {myIPInfo && (
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">🌐 您的IP信息</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-500 text-sm">IP地址</div>
              <div className="text-lg font-mono">{myIPInfo.ip}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">位置</div>
              <div className="text-lg">{myIPInfo.country} {myIPInfo.region} {myIPInfo.city}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">运营商</div>
              <div className="text-lg">{myIPInfo.isp}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">时区</div>
              <div className="text-lg">{myIPInfo.timezone}</div>
            </div>
          </div>
        </div>
      )}

      {/* 查询结果 */}
      {ipInfo && (
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">🔍 查询结果</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-500 text-sm">IP地址</div>
              <div className="text-lg font-mono">{ipInfo.ip}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">位置</div>
              <div className="text-lg">{ipInfo.country} {ipInfo.region} {ipInfo.city}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">运营商</div>
              <div className="text-lg">{ipInfo.isp}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">AS</div>
              <div className="text-lg">{ipInfo.as}</div>
            </div>
          </div>
        </div>
      )}

      {/* 工具列表 */}
      <div id="tools" className="mb-8">
        <h2 className="text-2xl font-bold mb-6">🛠️ 网络工具</h2>
        
        {/* 标签切换 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { id: 'ip', label: 'IP归属地' },
            { id: 'fingerprint', label: '浏览器指纹' },
            { id: 'dns', label: 'DNS查询' },
            { id: 'ping', label: '延迟测速' },
            { id: 'whois', label: 'Whois查询' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* IP归属地 */}
        {activeTab === 'ip' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">IP归属地查询</h3>
            <p className="text-gray-400 mb-4">输入IP或域名查询详细信息</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={queryIP}
                onChange={(e) => setQueryIP(e.target.value)}
                placeholder="例如: 8.8.8.8 或 google.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={queryIPInfo}
                className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
              >
                查询
              </button>
            </div>
          </div>
        )}

        {/* 浏览器指纹 */}
        {activeTab === 'fingerprint' && fingerprint && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">浏览器指纹检测</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fingerprint).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-500 text-sm">{key}</div>
                  <div className="text-sm font-mono break-all">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DNS查询 */}
        {activeTab === 'dns' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">DNS查询</h3>
            <p className="text-gray-400 mb-4">查询域名的DNS记录</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={queryIP}
                onChange={(e) => setQueryIP(e.target.value)}
                placeholder="例如: google.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={queryDNS}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-400 transition disabled:opacity-50"
              >
                查询
              </button>
            </div>
            {dnsResult && (
              <pre className="bg-black/50 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {dnsResult}
              </pre>
            )}
          </div>
        )}

        {/* 延迟测速 */}
        {activeTab === 'ping' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">延迟测速</h3>
            <p className="text-gray-400 mb-4">测试到Cloudflare DNS (1.1.1.1) 的延迟</p>
            <button
              onClick={testPing}
              className="px-6 py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              开始测速
            </button>
            {pingResult && (
              <pre className="mt-4 bg-black/50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                {pingResult}
              </pre>
            )}
          </div>
        )}

        {/* Whois查询 */}
        {activeTab === 'whois' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Whois查询</h3>
            <p className="text-gray-400 mb-4">查询域名注册信息</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={queryIP}
                onChange={(e) => setQueryIP(e.target.value)}
                placeholder="例如: google.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={queryWhois}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-400 transition disabled:opacity-50"
              >
                查询
              </button>
            </div>
            {whoisResult && (
              <pre className="bg-black/50 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {whoisResult}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
