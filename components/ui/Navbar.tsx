import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Home, Upload, MessageSquare, AlertTriangle } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-white hover:text-purple-100 transition-colors"
          >
            <FileText className="h-6 w-6" />
            <span className="font-bold text-lg">AI Document Search</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-purple-100 hover:bg-white/10">
                <Home className="h-5 w-5 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/Chat">
              <Button variant="ghost" className="text-white hover:text-purple-100 hover:bg-white/10">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat
              </Button>
            </Link>
            <Link href="/Upload">
              <Button variant="ghost" className="text-white hover:text-purple-100 hover:bg-white/10">
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </Button>
            </Link>
            <Link href="/danger">
              <Button 
                variant="ghost" 
                className="text-red-200 hover:text-red-100 hover:bg-red-500/30 border border-red-400/50"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Danger Zone
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}