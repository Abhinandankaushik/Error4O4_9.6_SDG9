'use client';

import Link from "next/link";
import { useParams } from 'next/navigation';
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
  X
} from "lucide-react";

function Navbar() {
  const params = useParams();
  const locale = params.locale || 'en';
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    window.location.href = `/${locale}`;
  };

  return (
    <nav className="w-full border-b bg-gradient-to-r from-card via-card to-card backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
          >
            <div className="relative">
              <Construction className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                InfraReport
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground -mt-1">
                Building Better India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-secondary hover:text-primary transition-all group"
            >
              <Home className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">Home</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  href={`/${locale}/reports/new`} 
                  className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                >
                  <FileText className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden xl:inline">Report</span>
                </Link>
                
                <Link 
                  href={`/${locale}/map`} 
                  className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                >
                  <Map className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden xl:inline">Heat Map</span>
                </Link>
                
                <Link 
                  href={`/${locale}/nearby-issues`} 
                  className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-cyan-500/10 hover:text-cyan-500 transition-all group"
                >
                  <Radar className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden xl:inline">Nearby</span>
                </Link>
                
                {user.role === 'manager' && user.isApproved && (
                  <Link 
                    href={`/${locale}/dashboard/manager`} 
                    className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden xl:inline">Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link 
                    href={`/${locale}/admin`} 
                    className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-purple-500/10 hover:text-purple-500 transition-all group"
                  >
                    <Shield className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden xl:inline">Admin</span>
                  </Link>
                )}
              </>
            )}

            {!user ? (
              <Link 
                href={`/${locale}/login`}
                className="flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 group"
              >
                <LogIn className="w-3.5 h-3.5 xl:w-4 xl:h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="ml-2 pl-2 border-l border-blue-500/30 flex items-center gap-2">
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg">
                  <User className="w-4 h-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[120px]\">{user.name}</span>
                    <span className="text-xs text-blue-400 capitalize">{user.role}</span>
                  </div>
                </div>
                <div className="xl:hidden p-2 bg-blue-500/10 rounded-lg\">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-all group"
                >
                  <LogOut className="w-3.5 h-3.5 xl:w-4 xl:h-4\" />
                  <span className="hidden xl:inline\">Logout</span>
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
          <div className="lg:hidden border-t border-border py-3 space-y-1">
            <Link 
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  href={`/${locale}/reports/new`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Report Issue</span>
                </Link>
                
                <Link 
                  href={`/${locale}/map`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                >
                  <Map className="w-4 h-4" />
                  <span>Heat Map</span>
                </Link>
                
                <Link 
                  href={`/${locale}/nearby-issues`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-500/10 hover:text-cyan-500 transition-all"
                >
                  <Radar className="w-4 h-4" />
                  <span>Nearby Issues</span>
                </Link>
                
                {user.role === 'manager' && user.isApproved && (
                  <Link 
                    href={`/${locale}/dashboard/manager`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link 
                    href={`/${locale}/admin`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-500/10 hover:text-purple-500 transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-blue-500/10 rounded-lg mb-2">
                    <User className="w-5 h-5 text-blue-500\" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-blue-400 capitalize">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}

            {!user && (
              <Link 
                href={`/${locale}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" />
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