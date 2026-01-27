'use client';

import {usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  console.log(pathname.split('/'))
  const changeLang = (lang: string) => {
    const parts = pathname.split('/'); 
    parts[1] = lang; 
    router.push(parts.join('/')); "/hi"

  };

  return (
    <div className="flex gap-3">
      <button onClick={() => changeLang('hi')}>हिंदी</button>
      <button onClick={() => changeLang('en')}>English</button>
    </div>
  );
}
