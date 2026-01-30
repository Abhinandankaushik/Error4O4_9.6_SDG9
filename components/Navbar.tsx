import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Home, 
  FileText, 
  Map, 
  Camera, 
  LayoutDashboard, 
  LogIn,
  Construction
} from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full border-b bg-gradient-to-r from-card via-card to-card backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            href={'/'} 
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
              href={'/'} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary transition-all group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            
            <SignedIn>
              <Link 
                href={'/reports/new'} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
              >
                <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Report</span>
              </Link>
              
              <Link 
                href={'/map'} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
              >
                <Map className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Heat Map</span>
              </Link>
              
              <Link 
                href={'/ar-view'} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group relative"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>AR View</span>
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  AI
                </span>
              </Link>
              
              <Link 
                href={'/dashboard/manager'} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-all group"
              >
                <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Dashboard</span>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link 
                href={'/sign-in'}
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