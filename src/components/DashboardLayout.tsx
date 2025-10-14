import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const DashboardLayout = ({ children, className, activeSection, onSectionChange }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar 
        className="sticky top-0 h-screen" 
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      
      {/* Main Content */}
      <main className={cn("flex-1 overflow-auto", className)}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

