import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import Navbar from "@/components/Navbar";
import "./globals.css"

export default function HomePage() {

    const t = useTranslations('Home');
    console.log(t('title'))
    return (

        <div>
            <Navbar />
            <LanguageSwitcher />
            {t('title')} <br />
            {t('description')}
        </div >
    );
}

