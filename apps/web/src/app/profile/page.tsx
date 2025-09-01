import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, FileText, Camera } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-card/95 backdrop-blur-lg border-primary/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">My Profile</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Update your profile information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary/30">
                  <AvatarImage src="https://picsum.photos/200/200" data-ai-hint="person face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change photo</span>
                </Button>
              </div>
               <div className="text-center">
                    <h2 className="text-2xl font-bold">AnonymousUser</h2>
                    <p className="text-muted-foreground">Joined July 2024</p>
                </div>
            </div>

            <form className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                </Label>
                <Input id="username" defaultValue="AnonymousUser" className="h-11 text-base"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                </Label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled className="h-11 text-base cursor-not-allowed"/>
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

              <Button type="submit" className="w-full h-12 text-base font-semibold">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
