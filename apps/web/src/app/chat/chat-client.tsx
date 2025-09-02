
"use client";

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader, Send, Bot, User, MessageSquare, Shield, Zap, Twitter, Instagram, X, Search, Tag, PanelLeft, Gem, History, UserPlus, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { ChatSidebar } from './chat-sidebar';
import { PricingDialog } from '@/components/pricing-dialog';
import { MatchHistorySheet } from '@/components/match-history-sheet';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { FriendRequestDialog } from '@/components/friend-request-dialog';
import { NotificationsDialog } from '@/components/notifications-dialog';


type Message = {
  id: number;
  text: string;
  sender: 'user' | 'stranger' | 'system';
};

type ChatStatus = 'idle' | 'searching' | 'chatting' | 'ended';

interface ChatClientProps {
}


export default function ChatClient({ }: ChatClientProps) {
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [interests, setInterests] = useState<string[]>(['Chatting']);
  const [interestInput, setInterestInput] = useState('');
  const [gender, setGender] = useState('both');
  const [strangerName, setStrangerName] = useState('Stranger');
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Placeholder for user's subscription status
  const isProUser = false;

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({
        top: scrollAreaViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'stranger' | 'system') => {
    setMessages((prev) => [...prev, { id: Date.now(), text, sender }]);
  };

  const handleStartSearch = () => {
    setMessages([]);
    setStatus('searching');
    addMessage('Finding a stranger with similar interests...', 'system');
    // Simulate finding a match
    setTimeout(() => {
        const randomNames = ['CyberNomad', 'PixelPioneer', 'GlitchArtisan', 'DataDaemon', 'SynthWaveRider'];
        const name = randomNames[Math.floor(Math.random() * randomNames.length)];
        setStrangerName(name);
        setStatus('chatting');
        addMessage(`You have connected with ${name}. Say hi!`, 'system');
    }, 2500);
  };

  const handleEndChat = () => {
    if (status === 'chatting') {
      addMessage('You have disconnected.', 'system');
      setStatus('ended');
    }
  };
  
  const handleNextChat = () => {
     if (status === 'chatting' || status === 'ended') {
        handleStartSearch();
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || status !== 'chatting') return;
    addMessage(inputValue, 'user');
    setInputValue('');

    // Simulate stranger's response
    setTimeout(() => {
      addMessage('This is a simulated response from the stranger.', 'stranger');
    }, 1000 + Math.random() * 1000);
  };
  
  const handleInterestInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && interestInput.trim() !== '') {
      e.preventDefault();
      const newInterest = interestInput.trim();
      if (!interests.includes(newInterest)) {
        setInterests(prev => [...prev, newInterest]);
      }
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(prev => prev.filter(i => i !== interestToRemove));
  };


  return (
    <div className="h-full bg-background/90 relative flex flex-col">
      {status === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-y-auto">
            <div className="max-w-xl w-full">
                <div className='flex flex-col items-center justify-center mb-8'>
                    <Logo className="h-20 w-20 text-primary mb-4" />
                    <h2 className="text-4xl font-bold">WhisperLink</h2>
                    <div className="flex gap-4 text-muted-foreground">
                      <Link href="#"><Instagram /></Link>
                      <Link href="#"><Twitter /></Link>
                    </div>
                </div>
                
                <Card className="mb-8 p-6 text-left bg-card/80 backdrop-blur-sm border-primary/20">
                  <div className="space-y-6">
                     <div>
                          <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><Tag className="h-5 w-5" />Interests</h3>
                          <div className="relative mb-3">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                  placeholder="Add an interest..."
                                  className="pl-9"
                                  value={interestInput}
                                  onChange={(e) => setInterestInput(e.target.value)}
                                  onKeyDown={handleInterestInputKeyDown}
                              />
                          </div>
                          <div className="flex flex-wrap gap-2">
                              {interests.map(interest => (
                                  <Badge 
                                      key={interest}
                                      variant="secondary"
                                      className="py-1 px-2 text-sm rounded-md"
                                  >
                                      {interest}
                                      <button onClick={() => removeInterest(interest)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                          <X className="h-3 w-3" />
                                      </button>
                                  </Badge>
                              ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Press Enter to add a tag.</p>
                      </div>
                      
                      <div>
                          <h3 className="font-semibold mb-3 text-lg">Looking for...</h3>
                          <div className="grid grid-cols-3 gap-2">
                             {isProUser ? (
                                  <Button variant={gender === 'male' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setGender('male')}>Male</Button>
                              ) : (
                                  <PricingDialog>
                                      <Button variant="outline" size="sm" className="flex-1 text-muted-foreground border-amber-300/30 bg-gradient-to-br from-yellow-300/5 via-amber-300/5 to-orange-300/5 hover:border-amber-300/60 hover:text-foreground transition-all">
                                          <Gem className="mr-2 h-4 w-4 text-amber-400" /> Male
                                      </Button>
                                  </PricingDialog>
                              )}

                              <Button variant={gender === 'both' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setGender('both')}>Both</Button>
                              
                              {isProUser ? (
                                  <Button variant={gender === 'female' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setGender('female')}>Female</Button>
                              ) : (
                                  <PricingDialog>
                                      <Button variant="outline" size="sm" className="flex-1 text-muted-foreground border-amber-300/30 bg-gradient-to-br from-yellow-300/5 via-amber-300/5 to-orange-300/5 hover:border-amber-300/60 hover:text-foreground transition-all">
                                          <Gem className="mr-2 h-4 w-4 text-amber-400" /> Female
                                      </Button>
                                  </PricingDialog>
                              )}
                          </div>
                      </div>
                  </div>
                </Card>

                <Button size="lg" className="h-12 px-8 text-lg w-full" onClick={handleStartSearch}>
                   <MessageSquare className="mr-2 h-5 w-5" />
                    Start Chat
                </Button>
            </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
            <div className="h-14 px-4 flex items-center justify-between bg-card/80 backdrop-blur-xl border-b z-10 shrink-0">
                <div className="flex items-center gap-2">
                   <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <div className="md:hidden">
                        {isSheetOpen ? (
                           <SheetClose asChild>
                             <Button variant="ghost" size="icon" className="[&_svg]:size-5">
                               <X />
                             </Button>
                           </SheetClose>
                         ) : (
                           <SheetTrigger asChild>
                             <Button variant="ghost" size="icon" className="[&_svg]:size-5">
                               <PanelLeft />
                             </Button>
                           </SheetTrigger>
                         )}
                      </div>
                      <SheetContent side="left" className="w-72 lg:w-80 p-0 top-[3.5rem] h-[calc(100dvh-3.5rem)]" showClose={false}>
                        <SheetHeader className="sr-only">
                          <SheetTitle>Chat Sidebar</SheetTitle>
                          <SheetDescription>
                            Contains chat lists, friend lists, and user profile information.
                          </SheetDescription>
                        </SheetHeader>
                        <ChatSidebar strangerName="Stranger" />
                      </SheetContent>
                    </Sheet>
                    <div className="font-bold text-lg">
                       {status === 'chatting' ? `@${strangerName}` : 'Connecting...'}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                  <FriendRequestDialog>
                      <Button variant="ghost" size="icon" className="[&_svg]:size-5"><UserPlus /></Button>
                  </FriendRequestDialog>
                  <NotificationsDialog>
                      <Button variant="ghost" size="icon" className="[&_svg]:size-5"><Bell /></Button>
                  </NotificationsDialog>
                  <MatchHistorySheet>
                    <Button variant="ghost" size="icon" className="[&_svg]:size-5"><History/></Button>
                  </MatchHistorySheet>
                </div>
            </div>
            <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
                <div className="space-y-4 max-w-4xl mx-auto w-full p-4">
                {messages.map((message) => (
                    <div
                    key={message.id}
                    className={cn('flex items-end gap-2', {
                        'justify-end': message.sender === 'user',
                        'justify-start': message.sender === 'stranger',
                        'justify-center': message.sender === 'system',
                    })}
                    >
                    {message.sender === 'stranger' && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
                        <Bot size={20} />
                        </div>
                    )}
                    {message.sender === 'system' ? (
                        <div className="text-xs text-muted-foreground italic px-4 py-1 bg-muted rounded-full flex items-center gap-2">
                        {status === 'searching' && <Loader className="h-4 w-4 animate-spin" />}
                        {message.text}
                        </div>
                    ) : (
                        <div
                        className={cn(
                            'rounded-lg px-4 py-2 max-w-[75%] break-words',
                            {
                            'bg-primary text-primary-foreground': message.sender === 'user',
                            'bg-muted': message.sender === 'stranger',
                            }
                        )}
                        >
                        {message.text}
                        </div>
                    )}
                    {message.sender === 'user' && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground">
                        <User size={20} />
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-card/80 backdrop-blur-xl shrink-0">
                <div className="flex w-full items-center space-x-2 md:space-x-4 max-w-4xl mx-auto mb-[env(safe-area-inset-bottom)]">
                    <Button variant="outline" onClick={handleEndChat} disabled={status !== 'chatting'}>
                        End
                    </Button>
                    <Button onClick={handleNextChat} disabled={status === 'searching'}>
                        Next
                    </Button>
                    <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
                        <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={status !== 'chatting'}
                        />
                        <Button type="submit" size="icon" disabled={status !== 'chatting'}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
    
    

    
