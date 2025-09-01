
"use client";

import { useState, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Pencil, Sparkles } from 'lucide-react';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useIsMobile } from '@/hooks/use-mobile';


function SettingsContent() {
  const [username, setUsername] = useState('ancient elegy');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>('https://picsum.photos/200');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveAvatar = () => {
      setAvatarPreview(null);
  }

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        setIsEditingUsername(false);
    }
  }

  return (
      <Tabs defaultValue="profile" className="w-full flex flex-col sm:flex-row h-full">
        <TabsList className="flex flex-row sm:flex-col sm:h-full justify-start items-start p-2 sm:p-4 gap-1 bg-transparent sm:border-r sm:bg-muted/30 w-full sm:w-60 shrink-0">
            <TabsTrigger value="profile" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3">My Profile</TabsTrigger>
            <TabsTrigger value="account" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3">Account</TabsTrigger>
            <TabsTrigger value="privacy" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3">Privacy</TabsTrigger>
            <TabsTrigger value="preferences" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3">Preferences</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
            <TabsContent value="profile" className="mt-0 space-y-8">
                 <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avatar</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarPreview || undefined} data-ai-hint="person face"/>
                            <AvatarFallback>AE</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex gap-2">
                                <Button onClick={handleAvatarClick} size="sm">Change</Button>
                                <Button variant="ghost" onClick={handleRemoveAvatar} size="sm">Remove</Button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Avatars are reviewed. Max 8MB.</p>
                        </div>
                    </div>
                 </div>
                 <Separator />
                 <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Banner</Label>
                     <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="relative border rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-purple-600 to-blue-600">
                            <p className="font-semibold text-white text-sm">Simple</p>
                            <Button size="icon" variant="outline" className="absolute top-2 right-2 h-6 w-6 bg-black/30 backdrop-blur-sm border-white/50 text-white hover:bg-black/50 hover:text-white">
                                <Pencil className="h-3 w-3"/>
                            </Button>
                        </div>
                        <div className="relative border rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
                            <p className="font-semibold text-white text-sm">Gradient</p>
                             <Button size="icon" variant="outline" className="absolute top-2 right-2 h-6 w-6 bg-black/30 backdrop-blur-sm border-white/50 text-white hover:bg-black/50 hover:text-white">
                                <Sparkles className="h-3 w-3"/>
                            </Button>
                        </div>
                    </div>
                 </div>
                 <Separator />
                 <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                    <div className="flex items-center justify-between mt-2 p-2 sm:p-3 bg-muted/50 rounded-lg">
                        {isEditingUsername ? (
                            <Input 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleUsernameKeyDown}
                                onBlur={() => setIsEditingUsername(false)}
                                autoFocus
                                className="font-mono text-sm sm:text-base"
                            />
                        ) : (
                            <div>
                                <p className="font-mono text-foreground text-sm sm:text-base">{username}</p>
                            </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setIsEditingUsername(!isEditingUsername)}>
                            {isEditingUsername ? 'Save' : 'Edit'}
                        </Button>
                    </div>
                 </div>
                 <Separator />
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interests</Label>
                    <div className="flex items-center justify-between mt-2 p-3 bg-muted/50 rounded-lg">
                        <div>
                            <p className="text-muted-foreground text-sm sm:text-base">No interests added</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                    </div>
                 </div>
            </TabsContent>

            <TabsContent value="account" className="mt-0">
                <h2 className="text-xl font-bold mb-4">Account Management</h2>
                <p className="text-muted-foreground">This is where account management settings will go.</p>
            </TabsContent>
            <TabsContent value="privacy" className="mt-0">
                <h2 className="text-xl font-bold mb-4">Privacy & Safety</h2>
                <p className="text-muted-foreground">This is where privacy settings will go.</p>
            </TabsContent>
            <TabsContent value="preferences" className="mt-0">
                <h2 className="text-xl font-bold mb-4">App Settings</h2>
                <p className="text-muted-foreground">This is where user preferences will go.</p>
            </TabsContent>
        </div>
      </Tabs>
  );
}


export function SettingsDialog({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
        <Drawer>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Settings</DrawerTitle>
                    <DrawerDescription>Manage your account settings and preferences.</DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto px-4">
                  <SettingsContent />
                </div>
            </DrawerContent>
        </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-auto max-h-[85vh] sm:h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sm:pb-2">
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            <SettingsContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
