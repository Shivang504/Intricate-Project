'use client';

import { X, LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Users, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: Package, label: 'Products', active: true },
  { icon: Users, label: 'Customers', active: false },
  { icon: Tag, label: 'Categories', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className='fixed inset-0 z-40 bg-black/50 lg:hidden' onClick={() => onOpenChange(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
        <div className='flex h-full flex-col overflow-y-auto'>
          {/* Logo */}
          <div className='flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-sidebar-border shrink-0'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0'>
                <Package className='h-5 w-5' />
              </div>
              <span className='text-base sm:text-lg font-semibold text-sidebar-foreground truncate'>Product Hub</span>
            </div>
            <Button variant='ghost' size='icon' className='lg:hidden shrink-0' onClick={() => onOpenChange(false)}>
              <X className='h-5 w-5' />
            </Button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-1 p-3 sm:p-4 overflow-y-auto'>
            {menuItems.map(item => (
              <button
                key={item.label}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}>
                <item.icon className='h-5 w-5 shrink-0' />
                <span className='truncate'>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className='border-t border-sidebar-border p-3 sm:p-4 shrink-0'>
            <div className='flex items-center gap-3 rounded-lg bg-sidebar-accent p-3'>
              <div className='flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shrink-0'>
                JD
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-sidebar-foreground text-sm truncate'>John Doe</div>
                <div className='text-sidebar-foreground/60 text-xs truncate'>Admin</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
