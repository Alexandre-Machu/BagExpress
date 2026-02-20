export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/driver/:path*', '/api/bookings/:path*'],
};
