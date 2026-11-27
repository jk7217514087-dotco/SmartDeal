import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { AIAssistantModal } from '../common/AIAssistantModal';
import { BackgroundCustomizerModal } from '../common/BackgroundCustomizerModal';
import { InstallAppPrompt } from '../common/InstallAppPrompt';
import { useApp, getThemeDefaultBg } from '../../context/AppContext';

export const UserLayout: React.FC = () => {
  const { customBg, activeTheme } = useApp();
  const currentBg = customBg || getThemeDefaultBg(activeTheme);

  return (
    <div 
      className={`flex flex-col min-h-screen w-full relative ${activeTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'} transition-colors duration-200`}
      style={{ backgroundColor: currentBg }}
    >
      {/* Subtle Diagonal SmartDeal Brand Watermark across all pages */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-[0.028] dark:opacity-[0.02]">
        <div className="absolute -top-10 -left-16 text-[14vw] font-black uppercase tracking-widest text-slate-900 dark:text-white -rotate-12 whitespace-nowrap font-sans">
          SmartDeal
        </div>
        <div className="absolute top-1/3 -right-20 text-[14vw] font-black uppercase tracking-widest text-slate-900 dark:text-white -rotate-12 whitespace-nowrap font-sans">
          SmartDeal
        </div>
        <div className="absolute top-2/3 -left-20 text-[14vw] font-black uppercase tracking-widest text-slate-900 dark:text-white -rotate-12 whitespace-nowrap font-sans">
          SmartDeal
        </div>
      </div>

      {/* Customer Header / Navigation (Fixed at Top on All Pages) */}
      <Navbar />
      
      {/* Main Customer Page Content */}
      <main className="flex-1 w-full pb-16 sm:pb-0 relative z-10">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Customer AI Assistant Modal */}
      <AIAssistantModal />

      {/* Customer UI Theme / Background Customizer */}
      <BackgroundCustomizerModal />

      {/* Multi-Device App Installation (Phone & Laptop/Windows) */}
      <InstallAppPrompt />
    </div>
  );
};

export default UserLayout;
