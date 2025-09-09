'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, FileText, Camera, Bell, CreditCard, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getUserProfile, updateAccountDetails } from '@/lib/api';

interface UserProfile {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  bio: string;
  avatar?: string;
  status: string;
  isOnline: boolean;
  lastSeen: string;
}

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const response = await getUserProfile(user.id);
          setProfile(response.data.data);
          setBio(response.data.data.bio || '');
          setUsername(response.data.data.user.username || '');
        } catch (err) {
          setError('Failed to fetch profile.');
          toast.error('Failed to fetch profile.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await updateAccountDetails({ bio, username });
        setProfile(response.data.data);
        toast.success('Profile updated successfully!');
    } catch (err) {
        setError('Failed to update profile.');
        toast.error('Failed to update profile.');
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </main>
        </div>
    )
  }

  if (!user || error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-12 md:py-20 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{error || 'Please log in to view your profile.'}</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <Avatar className="h-32 w-32 border-4 border-primary/30">
                      <AvatarImage src={profile?.avatar || user.avatar || 'https://picsum.photos/200/200'} data-ai-hint="person face" />
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm">
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change photo</span>
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-muted-foreground">Joined July 2024</p>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                  <CardDescription>Update your profile information and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Username
                      </Label>
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="h-11 text-base"/>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                      </Label>
                      <Input id="email" type="email" defaultValue={user.email} disabled className="h-11 text-base cursor-not-allowed"/>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Bio
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us a little bit about yourself..."
                        className="min-h-[120px] text-base"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto">Save Changes</Button>
                  </form>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5"/> Manage Subscription</h3>
                    <div className="p-4 border rounded-lg bg-card/50">
                        <p className="text-muted-foreground">You are currently on the <span className="font-semibold text-primary">Pro Plan</span>.</p>
                        <Button variant="outline" className="mt-4">Manage Billing</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell className="h-5 w-5"/> Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <Label htmlFor="new-message-notifications" className="font-medium">New Messages</Label>
                            <Switch id="new-message-notifications" defaultChecked/>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <Label htmlFor="friend-request-notifications" className="font-medium">Friend Requests</Label>
                            <Switch id="friend-request-notifications" defaultChecked/>
                        </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}