"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { Menu, X } from 'lucide-react';
import { useLoginModal } from '@/components/auth/login-modal-context';

export function NavMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useLoginModal();
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <Link href="/">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
              Professional
            </Button>
          </Link>
          <Link href="/personal">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
              Personal
            </Button>
          </Link>
        </div>

        {isLoggedIn ? (
          <>
            <Link href="/admin/settings">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                Settings
              </Button>
            </Link>
            <Button variant="ghost" onClick={logout} className="text-primary hover:text-primary/80 hover:bg-primary/10">
              Logout
            </Button>
          </>
        ) : (
          <Button 
            variant="ghost" 
            onClick={() => openModal()}
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            Login
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-slate-900 border-b border-border">
          <nav className="container py-4">
            <div className="flex flex-col space-y-2 items-end">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-[200px]">
                <Button variant="ghost" className="w-full justify-end">
                  Professional
                </Button>
              </Link>
              <Link href="/personal" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-[200px]">
                <Button variant="ghost" className="w-full justify-end">
                  Personal
                </Button>
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-[200px]">
                    <Button variant="ghost" className="w-full justify-end">
                      Settings
                    </Button>
                  </Link>
                  <div className="w-full max-w-[200px]">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-end"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full max-w-[200px]">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openModal();
                    }}
                    className="w-full justify-end"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
} 