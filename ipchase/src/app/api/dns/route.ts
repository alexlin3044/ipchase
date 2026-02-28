import { NextRequest, NextResponse } from 'next/server';

// DNS查询API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: '请提供域名' }, { status: 400 });
  }

  try {
    // 使用 DNS-over-HTTPS 查询
    const types = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];
    const results: Record<string, any> = {};

    for (const type of types) {
      try {
        const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
        const data = await res.json();
        if (data.Answer) {
          results[type] = data.Answer.map((a: any) => a.data);
        }
      } catch (e) {
        results[type] = [];
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: '查询失败' }, { status: 500 });
  }
}
