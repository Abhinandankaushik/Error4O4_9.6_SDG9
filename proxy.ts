import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Public routes — NOTE: locale aware
const isPublicRoute = createRouteMatcher([
  '/(en|hi|mr)/sign-in(.*)',
  '/(en|hi|mr)/sign-up(.*)',
  '/(en|hi|mr)',
  '/(en|hi|mr)/about',
  '/api(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip i18n for API routes
  if (!req.nextUrl.pathname.startsWith('/api')) {
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;
  }

  // Handle auth - all API routes are public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
