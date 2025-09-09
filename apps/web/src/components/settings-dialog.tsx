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
import { Camera, Pencil, Sparkles, User, Lock, Bell, Palette, Shield, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { updateUsername, updateAvatar } from '@/lib/redux/slices/userSlice';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

function SettingsContent() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { theme, setTheme } = useTheme();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = async (data: { username?: string; avatar?: string | null }) => {
    // TODO: Replace with actual API call
    console.log('Updating profile with:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile updated successfully!');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (user) {
          const avatar = reader.result as string;
          dispatch(updateAvatar(avatar));
          handleUpdateProfile({ avatar });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveAvatar = () => {
    if (user) {
      dispatch(updateAvatar(null));
      handleUpdateProfile({ avatar: null });
    }
  }

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        setIsEditingUsername(false);
        if (user && user.username !== username) {
            dispatch(updateUsername(username));
            handleUpdateProfile({ username });
        }
    }
  }

  if (!user) {
    return null;
  }

  return (
      <Tabs defaultValue="profile" className="w-full flex flex-col sm:flex-row h-full">
        <TabsList className="flex flex-row sm:flex-col sm:h-full justify-start items-start p-2 sm:p-4 gap-1 bg-transparent sm:border-r sm:bg-muted/30 w-full sm:w-60 shrink-0">
            <TabsTrigger value="profile" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3 transition-colors hover:bg-muted"><User className="h-4 w-4"/>My Profile</TabsTrigger>
            <TabsTrigger value="account" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3 transition-colors hover:bg-muted"><Lock className="h-4 w-4"/>Account</TabsTrigger>
            <TabsTrigger value="privacy" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3 transition-colors hover:bg-muted"><Shield className="h-4 w-4"/>Privacy</TabsTrigger>
            <TabsTrigger value="preferences" className="w-full justify-start gap-2 text-xs sm:text-sm px-2 py-1.5 sm:px-3 transition-colors hover:bg-muted"><Palette className="h-4 w-4"/>Preferences</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
            <TabsContent value="profile" className="mt-0 space-y-8">
                 <div>
                    <h3 className="text-lg font-medium">Profile Customization</h3>
                    <p className="text-sm text-muted-foreground">Modify your public-facing profile details.</p>
                 </div>
                 <Separator />
                 <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avatar</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar || undefined} data-ai-hint="person face" className="object-cover"/>
                            <AvatarFallback>{user.username ? user.username.substring(0, 2) : ''}</AvatarFallback>
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
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                    <div className="flex items-center gap-2 mt-2 p-2 sm:p-3 bg-muted/50 rounded-lg">
                        {isEditingUsername ? (
                            <Input 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleUsernameKeyDown}
                                onBlur={() => {
                                    setIsEditingUsername(false);
                                    if (user && user.username !== username) {
                                        dispatch(updateUsername(username));
                                        handleUpdateProfile({ username });
                                    }
                                }}
                                autoFocus
                                className="font-mono text-sm sm:text-base flex-1"
                                maxLength={20}
                            />
                        ) : (
                            <div className="flex-1">
                                <p className="font-mono text-foreground text-sm sm:text-base">{user.username}</p>
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

            <TabsContent value="account" className="mt-0 space-y-8">
                <div>
                    <h3 className="text-lg font-medium">Account Management</h3>
                    <p className="text-sm text-muted-foreground">Manage your account details and security.</p>
                </div>
                <Separator />
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 mt-2">
                        <Input id="email" type="email" defaultValue={user.email} className="flex-1" disabled />
                        <Button disabled>Update</Button>
                    </div>
                </div>
                <Separator />
                <div>
                    <Label>Password</Label>
                    <Button variant="outline" className="mt-2 w-full sm:w-auto">Change Password</Button>
                </div>
                <Separator />
                <div>
                    <Label className="text-destructive">Danger Zone</Label>
                     <Button variant="destructive" className="mt-2 w-full sm:w-auto flex items-center gap-2"><Trash2 className="h-4 w-4"/>Delete Account</Button>
                     <p className="text-xs text-muted-foreground mt-2">Permanently delete your account and all of your content.</p>
                </div>
            </TabsContent>
            <TabsContent value="privacy" className="mt-0 space-y-6">
                 <div>
                    <h3 className="text-lg font-medium">Privacy & Safety</h3>
                    <p className="text-sm text-muted-foreground">Control who can interact with you.</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                        <Label>Allow direct messages</Label>
                        <p className="text-xs text-muted-foreground">Allow users who are not on your friends list to message you.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                        <Label>Enable read receipts</Label>
                        <p className="text-xs text-muted-foreground">Let others know when you have seen their messages.</p>
                    </div>
                    <Switch />
                </div>
            </TabsContent>
            <TabsContent value="preferences" className="mt-0 space-y-8">
                <div>
                    <h3 className="text-lg font-medium">App Settings</h3>
                    <p className="text-sm text-muted-foreground">Customize the look and feel of the application.</p>
                </div>
                <Separator />
                <div>
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
                        <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
                        <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>System</Button>
                    </div>
                </div>
                <Separator />
                <div>
                    <Label>Language</Label>
                     <Select defaultValue="en">
                      <SelectTrigger className="w-full sm:w-[180px] mt-2">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </TabsContent>
        </div>
      </Tabs>
  );
}

export function SettingsDialog({ children, open, onOpenChange }: { children?: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
            <DrawerContent className="h-[85vh] pb-[env(safe-area-inset-bottom)]">
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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