'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className='sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60'>
      <div className='flex h-14 sm:h-16 items-center gap-3 sm:gap-4 px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Mobile menu button */}
        <Button variant='ghost' size='icon' className='lg:hidden shrink-0' onClick={onMenuClick}>
          <Menu className='h-5 w-5' />
        </Button>

        {/* Title */}
        <h1 className='text-lg sm:text-xl font-semibold text-foreground truncate'>Products</h1>
      </div>
    </header>
  );
}
