import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;
    
    if (path.startsWith('/api') && !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (path.startsWith('/api/admin') && token?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/students/:path*', '/attendance/:path*', '/analytics/:path*', '/api/:path*']
};