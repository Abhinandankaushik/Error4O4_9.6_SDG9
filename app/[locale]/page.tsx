'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { MdReportProblem, MdPeople, MdCheckCircle, MdMap, MdCameraAlt, MdDashboard, MdTrendingUp } from 'react-icons/md';
import "./globals.css"

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
];

export default function HomePage() {
    const t = useTranslations('Home');
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = params.locale as string;
    const { isSignedIn } = useAuth();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const changeLanguage = (locale: string) => {
        // Replace locale in pathname
        const newPathname = pathname.replace(/^\/(en|hi|mr)/, `/${locale}`);
        router.push(newPathname);
    };
    
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            {/* Language Selector - Floating Dropdown */}
            <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="fixed top-20 right-4 z-50"
            >
                <select
                    value={locale}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="appearance-none bg-card border-2 border-blue-500/20 rounded-lg px-4 py-3 pr-10 text-sm font-medium hover:border-blue-500/40 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-2xl backdrop-blur-sm"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </motion.div>
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-background to-background"></div>
                <motion.div 
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"
                    animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                    }}
                ></motion.div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <Badge variant="secondary" className="px-4 py-2 text-sm animate-pulse">
                                 {t('title')}
                            </Badge>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                                <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                    {t('subtitle')}
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                                {t('description')}
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link href={`/${locale}/reports/new`}>
                                <Button size="lg" className="text-lg px-8 py-6 group">
                                    <MdReportProblem className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                    {t('getStarted')}
                                </Button>
                            </Link>
                            {mounted && !isSignedIn && (
                                <Link href={`/${locale}/sign-in`}>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                        {t('signIn')}
                                    </Button>
                                </Link>
                            )}
                        </motion.div>

                        {/* Stats */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12"
                        >
                            {[
                                { value: '10K+', label: t('stats.reports'), color: 'text-blue-500' },
                                { value: '85%', label: t('stats.resolved'), color: 'text-green-500' },
                                { value: '50+', label: t('stats.cities'), color: 'text-yellow-500' },
                                { value: '24/7', label: t('stats.support'), color: 'text-purple-500' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                    className="transform hover:scale-110 transition-transform"
                                >
                                    <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4 mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold">
                            {t('howItWorks.title')}
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: <MdReportProblem className="w-16 h-16 text-blue-500" />, 
                                title: t('howItWorks.step1.title'), 
                                desc: t('howItWorks.step1.description'),
                                step: 1
                            },
                            { 
                                icon: <MdPeople className="w-16 h-16 text-green-500" />, 
                                title: t('howItWorks.step2.title'), 
                                desc: t('howItWorks.step2.description'),
                                step: 2
                            },
                            { 
                                icon: <MdCheckCircle className="w-16 h-16 text-purple-500" />, 
                                title: t('howItWorks.step3.title'), 
                                desc: t('howItWorks.step3.description'),
                                step: 3
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Card className="relative overflow-hidden border-2 hover:border-blue-500 hover:shadow-2xl transition-all h-full group">
                                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="text-2xl font-bold text-blue-500">{item.step}</span>
                                    </div>
                                    <CardContent className="p-8 space-y-4">
                                        <div className="group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <MdReportProblem className="w-8 h-8" />, title: t('features.report.title'), desc: t('features.report.description'), color: 'blue' },
                            { icon: <MdTrendingUp className="w-8 h-8" />, title: t('features.track.title'), desc: t('features.track.description'), color: 'green' },
                            { icon: <MdCameraAlt className="w-8 h-8" />, title: t('features.ai.title'), desc: t('features.ai.description'), color: 'purple' },
                            { icon: <MdMap className="w-8 h-8" />, title: t('features.map.title'), desc: t('features.map.description'), color: 'orange' },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-blue-500">
                                    <CardContent className="p-6 space-y-3">
                                        <div className={`w-14 h-14 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-500`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-linear-to-r from-blue-600 to-blue-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            {t('cta')}
                        </h2>
                        <Link href={`/${locale}/reports/new`}>
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                                <MdReportProblem className="w-5 h-5 mr-2" />
                                {t('getStarted')}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-muted-foreground">
                        <p className="text-sm">
                            © 2026 InfraReport. {t('title')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

