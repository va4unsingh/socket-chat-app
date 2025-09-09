
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SettingsDialog } from './settings-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';


function ProfileContent() {
    const { toast } = useToast();
    const user = useSelector((state: RootState) => state.user.user);
    const handleIdCopy = () => {
        navigator.clipboard.writeText('68b4a9e4d41301c47dd5f09a');
        toast({
            title: 'Copied to clipboard!',
            description: 'Your user ID has been copied.',
        });
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="relative h-32 w-full bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-background" >
                            <AvatarImage src={user.avatar || 'https://picsum.photos/200'} data-ai-hint="person face" className="object-cover"/>
                            <AvatarFallback>{user.username.substring(0,2)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-16">
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{user.username}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono cursor-pointer" onClick={handleIdCopy}>
                        ID: 68b4a9e4d41301c47dd5f09a <Copy className="inline h-3 w-3 ml-1"/>
                    </p>
                    <Separator className="my-4"/>
                    <div>
                        <h3 className="text-sm font-semibold mb-2 uppercase text-muted-foreground">WhisperLink Member Since</h3>
                        <p className="text-base">Sep 1, 2025</p>
                    </div>
                    <Separator className="my-4"/>
                    <div>
                        <h3 className="text-sm font-semibold mb-2 uppercase text-muted-foreground">Interests</h3>
                        <p className="text-base text-muted-foreground italic">No interests added yet.</p>
                    </div>

                    <SettingsDialog>
                        <Button className="w-full mt-4">Edit Profile</Button>
                    </SettingsDialog>
                </div>
            </div>
        </>
    );
}


export function ProfileDialog({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
    
    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>User Profile</DrawerTitle>
                        <DrawerDescription>View your profile information.</DrawerDescription>
                    </DrawerHeader>
                    <ProfileContent />
                </DrawerContent>
            </Drawer>
        )
    }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 pb-0 sr-only">
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>View your profile information.</DialogDescription>
        </DialogHeader>
        <ProfileContent />
      </DialogContent>
    </Dialog>
  );
}
