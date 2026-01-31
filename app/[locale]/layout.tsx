import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import InstallPWA from '@/components/InstallPWA';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import StandaloneDetector from '@/components/StandaloneDetector';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './globals.css';

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {


    const { locale } = await params;

    let messages;
    try {
        messages = (await import(`@/messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
                <meta name="theme-color" content="#3b82f6" />
                <meta name="mobile-web-app-capable" content="yes" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="InfraReport" />
            </head>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <AuthProvider>
                        <RegisterServiceWorker />
                        <StandaloneDetector />
                        <LanguageSwitcher />
                        {children}
                        <InstallPWA />
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
