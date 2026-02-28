import { NextRequest, NextResponse } from 'next/server';

// Whois查询API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: '请提供域名' }, { status: 400 });
  }

  try {
    // 使用 whoisjsonapi.com 查询
    const res = await fetch(`https://whoisjsonapi.com/v1/${encodeURIComponent(domain)}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // 如果失败，尝试备用方案
    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ error: '查询失败，请稍后重试' }, { status: 500 });
    }
  }
}
