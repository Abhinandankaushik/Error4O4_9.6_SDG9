import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ClerkProvider } from "@clerk/nextjs";
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </head>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ClerkProvider>
                        {children}
                    </ClerkProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
