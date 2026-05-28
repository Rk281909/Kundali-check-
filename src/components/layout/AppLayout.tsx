import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/firebase';
import { Button } from '../ui/button';
import { Moon, Sun, Menu, Star, MessageSquare, Hand, Sparkles, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';

export default function AppLayout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    { label: 'ड्यासबोर्ड (Dashboard)', path: '/', icon: Star },
    { label: 'एआई ज्योतिषी (AI Oracle)', path: '/chat', icon: MessageSquare },
    { label: 'हस्तरेखा (Palmistry)', path: '/palm', icon: Hand },
    { label: 'राशिफल (Horoscope)', path: '/horoscope', icon: Sparkles },
  ];

  if (profile?.role === 'admin') {
    menuItems.push({ label: 'एडमिन (Admin)', path: '/admin', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Cosmic background effects */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <span className="font-display font-semibold tracking-tight text-xl text-primary flex items-center gap-2">
                    <Star className="h-5 w-5 fill-primary" /> Astral
                  </span>
                  <div className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                          location.pathname === item.path ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <span className="hidden font-display font-bold tracking-tight sm:inline-block text-xl">
                एस्ट्रल एआई (Astral AI)
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors hover:text-foreground/80 ${
                    location.pathname === item.path ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <Button onClick={() => navigate('/auth')} variant="default" className="font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                लगइन गर्नुहोस् (Sign In)
              </Button>
            ) : (
              <Button onClick={handleSignOut} variant="ghost">लगआउट गर्नुहोस् (Sign Out)</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-8 max-w-7xl pb-24 relative z-10">
        <ScrollArea className="h-full">
            <Outlet />
        </ScrollArea>
      </main>
    </div>
  );
}
