import { SignUp } from '@clerk/nextjs'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <div className='flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-background via-background to-blue-950/20 relative overflow-hidden'>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      
      {/* Logo/Title */}
      <div className="mb-8 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-5xl">🏗️</span>
          <h1 className="text-4xl font-bold bg-liner-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            InfraReport
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">Building Better India Together</p>
      </div>
      
      {/* Sign Up Component */}
      <SignUp 
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#0a0a0a',
            colorInputBackground: '#1a1a1a',
            colorInputText: '#ffffff',
            colorText: '#ffffff',
            colorTextSecondary: '#9ca3af',
            colorDanger: '#ef4444',
            colorSuccess: '#10b981',
            borderRadius: '0.75rem',
            fontFamily: 'inherit',
          },
          elements: {
            rootBox: 'mx-auto z-10',
            card: 'bg-[#0a0a0a]/95 backdrop-blur-xl border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10',
            headerTitle: 'text-white text-2xl',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white hover:bg-[#2a2a2a] hover:border-blue-500/30 transition-all',
            socialButtonsBlockButtonText: 'text-white font-medium',
            formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all',
            footerActionLink: 'text-blue-500 hover:text-blue-400 font-medium',
            formFieldInput: 'bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white focus:border-blue-500 transition-all',
            formFieldLabel: 'text-gray-300 font-medium',
            identityPreviewText: 'text-white',
            identityPreviewEditButton: 'text-blue-500 hover:text-blue-400',
            formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white',
            dividerLine: 'bg-[#2a2a2a]',
            dividerText: 'text-gray-500',
            otpCodeFieldInput: 'bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white',
          },
        }}
        routing="path"
        path={`/${locale}/sign-up`}
        signInUrl={`/${locale}/sign-in`}
        afterSignInUrl={`/${locale}`}
        afterSignUpUrl={`/${locale}`}
      />
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground z-10">
        <p>© 2026 InfraReport. Secure authentication powered by Clerk.</p>
      </div>
    </div>
  )
}
