'use client';

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
  Radar
} from "lucide-react";

function Navbar() {
  const params = useParams();
  const locale = params.locale || 'en';
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    window.location.href = `/${locale}`;
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
            
            {user && (
              <>
                <Link 
                  href={`/${locale}/reports/new`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Report</span>
                </Link>
                
                <Link 
                  href={`/${locale}/map`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                >
                  <Map className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Heat Map</span>
                </Link>
                
                <Link 
                  href={`/${locale}/nearby-issues`} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-cyan-500/10 hover:text-cyan-500 transition-all group"
                >
                  <Radar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Nearby Issues</span>
                </Link>
                
                {user.role === 'manager' && user.isApproved && (
                  <Link 
                    href={`/${locale}/dashboard/manager`} 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
                  >
                    <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link 
                    href={`/${locale}/admin`} 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/10 hover:text-purple-500 transition-all group"
                  >
                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}

            {!user ? (
              <Link 
                href={`/${locale}/login`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 group"
              >
                <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="ml-2 pl-2 border-l border-blue-500/30 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg">
                  <User className="w-4 h-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-blue-400 capitalize">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-all group"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;