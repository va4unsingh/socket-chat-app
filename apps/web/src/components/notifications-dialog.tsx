
"use client";

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

export function NotificationsDialog({ children }: { children: React.ReactNode }) {
  const [permission, setPermission] = React.useState<NotificationPermission>('default');

  React.useEffect(() => {
    // This check ensures Notification API is available
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);

    if (newPermission === 'granted') {
      // In a real app, you would get the subscription object and send it to your backend.
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 p-2 font-semibold">
            <Bell className="h-5 w-5" />
            Notifications
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-4 text-center text-sm text-muted-foreground">
             <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p>No new notifications.</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="p-2">
            {permission === 'granted' ? (
              <p className="text-xs text-center text-green-600">Notifications are enabled.</p>
            ) : permission === 'denied' ? (
              <p className="text-xs text-center text-red-600">Notifications are blocked. Update your browser settings.</p>
            ) : (
              <Button className="w-full" size="sm" onClick={requestPermission}>
                Enable Browser Notifications
              </Button>
            )}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
