import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { AIAssistantModal } from '../common/AIAssistantModal';
import { BackgroundCustomizerModal } from '../common/BackgroundCustomizerModal';
import { InstallAppPrompt } from '../common/InstallAppPrompt';
import { useApp, getThemeDefaultBg } from '../../context/AppContext';

export const UserLayout: React.FC = () => {
  const { customBg, activeTheme } = useApp();
  const currentBg = customBg || getThemeDefaultBg(activeTheme);
  const isWhite = activeTheme === 'pure-white' || (currentBg && (currentBg.toLowerCase() === '#ffffff' || currentBg.toLowerCase() === '#f8fafd'));

  return (
    <div 
      className={`flex flex-col min-h-screen w-full max-w-full overflow-x-hidden ${isWhite ? 'text-slate-900' : 'text-slate-100'} transition-colors duration-200`}
      style={{ backgroundColor: currentBg }}
    >
      {/* Customer Header / Navigation */}
      <Navbar />
      
      {/* Universal back button */}
      <GlobalBackButton />

      {/* Main Customer Page Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 sm:pb-0">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <Footer />

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
