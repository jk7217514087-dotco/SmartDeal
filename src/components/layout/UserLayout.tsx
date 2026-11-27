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
      className={`flex flex-col min-h-screen w-full ${activeTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'} transition-colors duration-200`}
      style={{ backgroundColor: currentBg }}
    >
      {/* Customer Header / Navigation (Sticky Fixed at Top on All Pages) */}
      <Navbar />
      
      {/* Main Customer Page Content */}
      <main className="flex-1 w-full pb-16 sm:pb-0">
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
