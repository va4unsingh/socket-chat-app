"use client";

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, FileText, Camera, Bell, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/context/user-context';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-12 md:py-20 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Please log in to view your profile.</h1>
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
                      <AvatarImage src={user.avatar || 'https://picsum.photos/200/200'} data-ai-hint="person face" />
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm">
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change photo</span>
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold">{user.email}</h2>
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
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Username
                      </Label>
                      <Input id="username" defaultValue={user.email} className="h-11 text-base"/>
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
                        defaultValue="Just a mystery looking for a good conversation. I enjoy movies, music, and exploring new ideas."
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
