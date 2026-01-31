'use client';

import Link from "next/link";
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  Home, 
  FileText, 
  Map, 
  LayoutDashboard, 
  LogIn,
  Construction,
  User,
  LogOut,
  Shield,
  Radar,
  Menu,
  X,
  MapPin,
  Bell,
  Search,
  FolderOpen
} from "lucide-react";

function Navbar() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string || 'en';
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    window.location.href = `/${locale}`;
  };

  return (
    <nav className="w-full border-b bg-gradient-to-r from-card via-card to-card backdrop-blur-md shadow-lg sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
            aria-label="InfraReport Home - Building Better India"
          >
            <div className="relative">
              <Construction className="w-7 h-7 sm:w-9 sm:h-9 text-blue-500 group-hover:text-blue-400 transition-all group-hover:rotate-12" aria-hidden="true" />
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                InfraReport
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground -mt-1 font-medium">
                🏗️ Building Better India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:text-blue-500 transition-all group relative overflow-hidden"
              aria-label="Navigate to Home page"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" aria-hidden="true" />
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all"></div>
            </Link>
            
            {user && (
              <>
                <Link 
                  href={`/${locale}/reports/new`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:text-green-500 transition-all group relative overflow-hidden"
                  aria-label="Create new infrastructure report"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" aria-hidden="true" />
                  <span className="relative z-10">New Report</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all"></div>
                </Link>
                
                <Link                   href={`/${locale}/my-reports`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-teal-500/10 hover:text-cyan-500 transition-all group relative overflow-hidden"
                  aria-label="View my reports"
                >
                  <FolderOpen className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10">My Reports</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/5 group-hover:to-teal-500/5 transition-all"></div>
                </Link>
                
                <Link                   href={`/${locale}/map`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-purple-500 transition-all group relative overflow-hidden"
                  aria-label="View heat map of all reports"
                >
                  <Map className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10">Heat Map</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all"></div>
                </Link>
                
                <Link 
                  href={`/${locale}/nearby-issues`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 hover:text-orange-500 transition-all group relative overflow-hidden"
                  aria-label="View nearby issues"
                >
                  <MapPin className="w-4 h-4 group-hover:scale-110 animate-bounce transition-transform relative z-10" />
                  <span className="relative z-10">Nearby</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all"></div>
                </Link>
                
                {user.role === 'manager' && user.isApproved && (
                  <Link 
                    href={`/${locale}/dashboard/manager`} 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:text-blue-500 transition-all group relative overflow-hidden"
                    aria-label="Manager dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all"></div>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link 
                    href={`/${locale}/admin`} 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-violet-500/10 hover:text-purple-500 transition-all group relative overflow-hidden"
                    aria-label="Admin panel"
                  >
                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Admin</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-violet-500/0 group-hover:from-purple-500/5 group-hover:to-violet-500/5 transition-all"></div>
                  </Link>
                )}
              </>
            )}

            {!user ? (
              <Link 
                href={`/${locale}/login`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 group ml-2"
              >
                <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="ml-2 pl-2 border-l border-blue-500/30 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate max-w-[120px]">{user.name}</span>
                    <span className="text-xs text-blue-500 capitalize font-medium">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-all group"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-3 space-y-1 animate-slide-up">
            <Link 
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:text-blue-500 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  href={`/${locale}/reports/new`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:text-green-500 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>New Report</span>
                </Link>
                
                <Link 
                  href={`/${locale}/my-reports`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-teal-500/10 hover:text-cyan-500 transition-all"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span>My Reports</span>
                </Link>
                
                <Link 
                  href={`/${locale}/map`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-purple-500 transition-all"
                >
                  <Map className="w-5 h-5" />
                  <span>Heat Map</span>
                </Link>
                
                <Link 
                  href={`/${locale}/nearby-issues`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 hover:text-orange-500 transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Nearby Issues</span>
                </Link>
                
                {user.role === 'manager' && user.isApproved && (
                  <Link 
                    href={`/${locale}/dashboard/manager`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:text-blue-500 transition-all"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Manager Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link 
                    href={`/${locale}/admin`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-violet-500/10 hover:text-purple-500 transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg mb-2 border border-blue-500/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-xs text-blue-500 capitalize font-medium">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}

            {!user && (
              <Link 
                href={`/${locale}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;