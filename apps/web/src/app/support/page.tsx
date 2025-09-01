import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl border border-primary/20">
                <div className="p-8 space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-primary">Contact Support</h1>
                    <p className="text-muted-foreground">
                    Please fill out the form below and we will get back to you as soon
                    as possible.
                    </p>
                </div>

                <div className="p-8 pt-0">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="name" placeholder="Enter your name" className="pl-10 h-11"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                 <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-10 h-11"
                                    />
                                 </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                             <div className="relative">
                                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="subject" placeholder="What is your message about?" className="pl-10 h-11" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                            id="message"
                            placeholder="Please describe your issue or question."
                            className="min-h-[150px] text-base"
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 text-base font-semibold">
                            Submit Request
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
