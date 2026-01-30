"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Map, 
  LayoutDashboard, 
  LogIn,
  Construction,
  Building2,
  Wrench,
  Target,
  Hammer
} from "lucide-react";

function Navbar() {
  const params = useParams();
  const locale = params.locale || 'en';
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string;

  // Get dashboard link based on role
  const getDashboardLink = () => {
    switch (userRole) {
      case 'city_manager':
        return `/${locale}/dashboard/city-manager`;
      case 'infra_manager':
        return `/${locale}/dashboard/infra-manager`;
      case 'issue_resolver':
        return `/${locale}/dashboard/issue-resolver`;
      case 'contractor':
        return `/${locale}/dashboard/contractor`;
      default:
        return `/${locale}/dashboard/manager`; // fallback
    }
  };

  // Get dashboard icon based on role
  const getDashboardIcon = () => {
    switch (userRole) {
      case 'city_manager':
        return <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />;
      case 'infra_manager':
        return <Wrench className="w-4 h-4 group-hover:scale-110 transition-transform" />;
      case 'issue_resolver':
        return <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />;
      case 'contractor':
        return <Hammer className="w-4 h-4 group-hover:scale-110 transition-transform" />;
      default:
        return <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />;
    }
  };

  // Get dashboard label based on role
  const getDashboardLabel = () => {
    switch (userRole) {
      case 'city_manager':
        return 'City Manager';
      case 'infra_manager':
        return 'Infra Manager';
      case 'issue_resolver':
        return 'Issue Resolver';
      case 'contractor':
        return 'Contractor';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="w-full border-b bg-gradient-to-r from-card via-card to-card backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Construction className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                InfraReport
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">
                Building Better India
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary transition-all group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            
            <SignedIn>
              {/* Show Report button only for citizens */}
              {(!userRole || userRole === 'citizen') && (
                <Link 
                  href={`/${locale}/reports/new`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Report</span>
                </Link>
              )}
              
              <Link 
                href={`/${locale}/map`} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
              >
                <Map className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Heat Map</span>
              </Link>
              
              {/* Show dashboard for employees only */}
              {userRole && userRole !== 'citizen' && (
                <Link 
                  href={getDashboardLink()} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                >
                  {getDashboardIcon()}
                  <span>{getDashboardLabel()}</span>
                </Link>
              )}
            </SignedIn>

            <SignedOut>
              <Link 
                href={`/${locale}/sign-in`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 group"
              >
                <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign In</span>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="ml-2 pl-2 border-l border-blue-500/30">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-background hover:ring-blue-400 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105",
                      userButtonPopoverCard: "bg-[#0a0a0a] border-2 border-blue-500/20 shadow-2xl shadow-blue-500/20",
                      userButtonPopoverActionButton: "hover:bg-blue-500/10 transition-colors text-white",
                      userButtonPopoverActionButtonText: "text-white font-medium",
                      userButtonPopoverActionButtonIcon: "text-blue-400",
                      userButtonPopoverFooter: "hidden",
                      userPreviewMainIdentifier: "text-white font-semibold",
                      userPreviewSecondaryIdentifier: "text-blue-400"
                    },
                    variables: {
                      colorPrimary: "#3b82f6",
                      colorBackground: "#0a0a0a",
                      colorText: "#ffffff",
                      colorTextSecondary: "#60a5fa"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;