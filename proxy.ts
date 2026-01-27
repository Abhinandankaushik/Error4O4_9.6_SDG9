import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Public routes — NOTE: locale aware
const isPublicRoute = createRouteMatcher([
  '/(en|hi)/sign-in(.*)',
  '/(en|hi)/sign-up(.*)',
  '/(en|hi)',
  '/(en|hi)/about'
]);

export default clerkMiddleware(async (auth, req) => {
  // First handle i18n
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Then handle auth
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
