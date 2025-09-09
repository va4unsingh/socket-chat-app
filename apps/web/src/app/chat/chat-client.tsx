"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader, Send, Bot, User, MessageSquare, Shield, Zap, Twitter, Instagram, X, Search, Tag, PanelLeft, Gem, History, UserPlus, Bell, Smile, Check, CheckCheck, Paperclip, File as FileIcon } from 'lucide-react';
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
import { useUser } from '@/context/user-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';

type Message = {
  id: number;
  sender: 'user' | 'stranger' | 'system';
  text?: string;
  reactions?: { [emoji: string]: ('user' | 'stranger')[]; };
  status?: 'sent' | 'delivered' | 'read';
  file?: {
    name: string;
    url: string;
    type: 'image' | 'other';
  };
};

type ChatStatus = 'idle' | 'searching' | 'chatting' | 'ended';

interface ChatClientProps {
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

export default function ChatClient({ }: ChatClientProps) {
  const { username, avatar } = useUser();
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [interests, setInterests] = useState<string[]>(['Chatting']);
  const [interestInput, setInterestInput] = useState('');
  const [gender, setGender] = useState('both');
  const [strangerName, setStrangerName] = useState('Stranger');
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Placeholder for user's subscription status
  const isProUser = false;

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({
        top: scrollAreaViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isStrangerTyping]);

  const addMessage = (message: Omit<Message, 'id' | 'reactions'>) => {
    const newMessage: Message = {
      id: Date.now(),
      ...message,
      reactions: {},
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const handleStartSearch = () => {
    setMessages([]);
    setStatus('searching');
    addMessage({ text: 'Finding a stranger with similar interests...', sender: 'system' });
    // Simulate finding a match
    setTimeout(() => {
        const randomNames = ['CyberNomad', 'PixelPioneer', 'GlitchArtisan', 'DataDaemon', 'SynthWaveRider'];
        const name = randomNames[Math.floor(Math.random() * randomNames.length)];
        setStrangerName(name);
        setStatus('chatting');
        addMessage({ text: `You have connected with ${name}. Say hi!`, sender: 'system' });
    }, 2500);
  };

  const handleEndChat = () => {
    if (status === 'chatting') {
      addMessage({ text: 'You have disconnected.', sender: 'system' });
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
    const messageId = addMessage({ text: inputValue, sender: 'user', status: 'sent' });
    setInputValue('');

    // Simulate delivery and read receipts
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'delivered' } : m));
    }, 600);

    const typingDuration = 1200 + Math.random() * 1000;
    
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'read' } : m));
        setIsStrangerTyping(true);
    }, 1500)

    setTimeout(() => {
      setIsStrangerTyping(false); 
      addMessage({ text: 'This is a simulated response from the stranger.', sender: 'stranger' });
    }, 1500 + typingDuration);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith('image/') ? 'image' : 'other';

    addMessage({
      sender: 'user',
      status: 'sent',
      file: {
        name: file.name,
        url: fileUrl,
        type: fileType,
      },
    });
    
    // Reset file input
    e.target.value = '';
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

  const handleReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const newReactions = { ...(msg.reactions || {}) };

        // Find if the user has an existing reaction
        const userExistingReaction = Object.entries(newReactions).find(([_, senders]) => senders.includes('user'));

        // If user has an existing reaction, remove it
        if (userExistingReaction) {
          const [existingEmoji] = userExistingReaction;
          newReactions[existingEmoji] = newReactions[existingEmoji].filter(r => r !== 'user');
          if (newReactions[existingEmoji].length === 0) {
            delete newReactions[existingEmoji];
          }
        }

        // If the clicked emoji is different from the one they had, or if they had none, add the new one.
        if (!userExistingReaction || userExistingReaction[0] !== emoji) {
          if (!newReactions[emoji]) {
            newReactions[emoji] = [];
          }
          newReactions[emoji].push('user');
        }

        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));

    // Simulate stranger reacting back
    if (Math.random() > 0.5) {
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.map(msg => {
                if (msg.id === messageId) {
                    const newReactions = { ...(msg.reactions || {}) };
                    const randomEmoji = EMOJI_REACTIONS[Math.floor(Math.random() * EMOJI_REACTIONS.length)];
                    
                    if (!newReactions[randomEmoji]) {
                        newReactions[randomEmoji] = [];
                    }
                    if (!newReactions[randomEmoji].includes('stranger')) {
                        newReactions[randomEmoji].push('stranger');
                    }
                    return { ...msg, reactions: newReactions };
                }
                return msg;
            }));
        }, 800);
    }
  };


  return (
    <div className="h-full bg-background/90 relative flex flex-col">
      {status === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-y-auto">
            <div className="max-w-xl w-full">
                <div className='flex flex-col items-center justify-center mb-8'>
                    <Logo className="h-20 w-20 text-primary mb-4" />
                    <h2 className="text-4xl font-bold">WhisperLink</h2>
                    <div className="flex gap-4 text-muted-foreground mt-2">
                      <Link href="#" className="transition-colors hover:text-primary"><Instagram /></Link>
                      <Link href="#" className="transition-colors hover:text-primary"><Twitter /></Link>
                    </div>
                </div>
                
                <Card id="onboarding-interests" className="mb-8 p-6 text-left bg-card/80 backdrop-blur-sm border-primary/20">
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

                <Button id="onboarding-start-chat" size="lg" className="h-12 px-8 text-lg w-full" onClick={handleStartSearch}>
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
                        <div key={message.id} className="group relative">
                            <div
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
                                    <div className={cn('relative group flex items-center', {
                                        'flex-row-reverse': message.sender === 'user'
                                    })}>
                                        {message.file?.type === 'image' ? (
                                            <Image src={message.file.url} alt={message.file.name} width={200} height={200} className="rounded-md" />
                                        ) : (
                                            <div className={cn('whitespace-pre-wrap rounded-lg px-4 py-2 break-words max-w-[75%] md:max-w-[85%]', {
                                                'bg-primary text-primary-foreground': message.sender === 'user',
                                                'bg-muted': message.sender === 'stranger',
                                            })}>
                                                {message.text}
                                                {message.file?.type === 'other' && (
                                                    <div className="flex items-center gap-2 p-2 rounded-md bg-background/50 mt-2">
                                                        <FileIcon className="h-6 w-6" />
                                                        <span>{message.file.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {message.sender !== 'system' && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={cn("h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mx-1", {
                                                        })}
                                                    >
                                                        <Smile className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-1">
                                                    <div className="flex gap-1">
                                                        {EMOJI_REACTIONS.map(emoji => (
                                                            <Button
                                                                key={emoji}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full"
                                                                onClick={() => handleReaction(message.id, emoji)}
                                                            >
                                                                {emoji}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                )}
                                {message.sender === 'user' && (
                                    <div className="flex items-end gap-1">
                                        <div className="flex items-center h-8">
                                        {message.status === 'read' && <CheckCheck size={16} className="text-blue-500" />}
                                        {message.status === 'delivered' && <CheckCheck size={16} className="text-muted-foreground" />}
                                        {message.status === 'sent' && <Check size={16} className="text-muted-foreground" />}
                                        </div>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={avatar || undefined} />
                                            <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            </div>
                            {message.reactions && Object.keys(message.reactions).length > 0 && (
                                <div className={cn("flex gap-1 mt-1", {
                                    'justify-end pr-10': message.sender === 'user',
                                    'justify-start pl-10': message.sender === 'stranger',
                                })}>
                                    {Object.entries(message.reactions).map(([emoji, senders]) => (
                                        <Badge key={emoji} variant="secondary" className="py-0.5 px-1.5 shadow-sm">
                                            {emoji} {senders.length > 1 ? <span className="text-xs ml-1">{senders.length}</span> : null}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isStrangerTyping && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
                                <Bot size={20} />
                            </div>
                            <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-0"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-card/80 backdrop-blur-xl shrink-0">
                <div className="flex w-full items-center space-x-2 md:space-x-4 max-w-4xl mx-auto mb-[env(safe-area-inset-bottom)]">
                    <Button variant="outline" onClick={handleEndChat} disabled={status !== 'chatting'}>
                        End
                    </Button>
                    <Button onClick={handleNextChat} disabled={status !== 'searching'}>
                        Next
                    </Button>
                    <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf"/>
                        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={status !== 'chatting'}>
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={status !== 'chatting'}
                        />
                        <Button type="submit" size="icon" disabled={status !== 'chatting' || (!inputValue.trim() && !fileInputRef.current?.files?.length)}>
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