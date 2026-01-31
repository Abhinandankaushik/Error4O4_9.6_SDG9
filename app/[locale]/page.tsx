'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { MdReportProblem, MdPeople, MdCheckCircle, MdMap, MdCameraAlt, MdDashboard, MdTrendingUp, MdSpeed, MdSecurity, MdCloud } from 'react-icons/md';
import { 
  BarChart3, CheckCircle, Building, Camera, Map, 
  TrendingUp, Zap, Shield, CloudUpload 
} from 'lucide-react';
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
    const { user } = useAuth();
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
                className="fixed top-16 sm:top-20 right-2 sm:right-4 z-40"
            >
                <select
                    value={locale}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="appearance-none bg-card border-2 border-blue-500/20 rounded-lg px-2 py-2 sm:px-4 sm:py-3 pr-8 sm:pr-10 text-xs sm:text-sm font-medium hover:border-blue-500/40 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-2xl backdrop-blur-sm"
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-background to-purple-600/5"></div>
                
                {/* Animated Grid */}
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

                {/* Floating Orbs */}
                <motion.div
                    className="hidden md:block absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="hidden md:block absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
                
                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
                    <div className="text-center space-y-6 sm:space-y-8">
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <Badge variant="secondary" className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/30 backdrop-blur-sm shadow-xl">
                                <span className="mr-2">🏗️</span>
                                {t('title')}
                            </Badge>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight px-2">
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                                    {t('subtitle')}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                                {t('description')}
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
                        >
                            <Link href={`/${locale}/reports/new`} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl shadow-blue-500/30 border-2 border-blue-400/30">
                                    <MdReportProblem className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:rotate-12 transition-transform" />
                                    {t('getStarted')}
                                </Button>
                            </Link>
                            {mounted && !user && (
                                <Link href={`/${locale}/login`} className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 border-2 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10">
                                        {t('signIn')}
                                    </Button>
                                </Link>
                            )}
                        </motion.div>

                        {/* Live Stats */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 max-w-4xl mx-auto pt-8 sm:pt-12 md:pt-16 px-2"
                        >
                            {[
                                { value: '10K+', label: t('stats.reports'), color: 'text-blue-500', icon: BarChart3 },
                                { value: '85%', label: t('stats.resolved'), color: 'text-green-500', icon: CheckCircle },
                                { value: '50+', label: t('stats.cities'), color: 'text-yellow-500', icon: Building },
                                { value: '24/7', label: t('stats.support'), color: 'text-purple-500', icon: Zap }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    className="relative"
                                >
                                    <div className="bg-card/50 backdrop-blur-sm border-2 border-blue-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:border-blue-500/50 transition-all shadow-xl">
                                        <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mb-1 sm:mb-2" />
                                        <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                                        <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16 px-2"
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
            <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4 mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to report and track infrastructure issues
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: <MdReportProblem className="w-10 h-10" />, 
                                title: t('features.report.title'), 
                                desc: t('features.report.description'), 
                                color: 'blue',
                                gradient: 'from-blue-600 to-blue-400'
                            },
                            { 
                                icon: <MdTrendingUp className="w-10 h-10" />, 
                                title: t('features.track.title'), 
                                desc: t('features.track.description'), 
                                color: 'green',
                                gradient: 'from-green-600 to-green-400'
                            },
                            { 
                                icon: <MdCameraAlt className="w-10 h-10" />, 
                                title: t('features.ai.title'), 
                                desc: t('features.ai.description'), 
                                color: 'purple',
                                gradient: 'from-purple-600 to-purple-400'
                            },
                            { 
                                icon: <MdMap className="w-10 h-10" />, 
                                title: t('features.map.title'), 
                                desc: t('features.map.description'), 
                                color: 'orange',
                                gradient: 'from-orange-600 to-orange-400'
                            },
                            { 
                                icon: <MdSpeed className="w-10 h-10" />, 
                                title: 'Real-time Updates', 
                                desc: 'Get instant notifications on report status changes and resolutions', 
                                color: 'cyan',
                                gradient: 'from-cyan-600 to-cyan-400'
                            },
                            { 
                                icon: <MdSecurity className="w-10 h-10" />, 
                                title: 'Secure & Private', 
                                desc: 'Your data is encrypted and protected with enterprise-grade security', 
                                color: 'red',
                                gradient: 'from-red-600 to-red-400'
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                            >
                                <Card className="h-full hover:shadow-2xl transition-all border-2 hover:border-blue-500/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative overflow-hidden group">
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                    
                                    <CardContent className="p-8 space-y-4 relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-secondary/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4 mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Why Choose InfraReport?
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MdSpeed className="w-12 h-12 text-blue-500" />,
                                title: 'Lightning Fast',
                                desc: 'Report issues in seconds with our streamlined interface and smart forms',
                                stat: '< 60s',
                                statLabel: 'Avg. Report Time'
                            },
                            {
                                icon: <MdCloud className="w-12 h-12 text-green-500" />,
                                title: 'Cloud Powered',
                                desc: 'Access your reports from anywhere, anytime with automatic cloud sync',
                                stat: '99.9%',
                                statLabel: 'Uptime'
                            },
                            {
                                icon: <MdDashboard className="w-12 h-12 text-purple-500" />,
                                title: 'Smart Analytics',
                                desc: 'Track progress with detailed insights and real-time analytics dashboard',
                                stat: '5+',
                                statLabel: 'Analytics Tools'
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Card className="h-full border-2 hover:border-blue-500/50 hover:shadow-2xl transition-all bg-gradient-to-br from-card to-background">
                                    <CardContent className="p-8 space-y-6 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                        <div className="pt-4 border-t border-border">
                                            <div className="text-4xl font-bold text-blue-500">{item.stat}</div>
                                            <div className="text-sm text-muted-foreground mt-1">{item.statLabel}</div>
                                        </div>
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

