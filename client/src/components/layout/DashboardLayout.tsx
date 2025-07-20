import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setActiveSection } from '@/store/slices/contentSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { activeSection } = useSelector((state: RootState) => state.content);
  const dispatch = useDispatch();

  const handleSectionChange = (section: 'feed' | 'trending' | 'favorites' | 'discover') => {
    dispatch(setActiveSection(section));
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed inset-y-0 left-0 z-50 w-64">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar 
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-64' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
