
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Settings, MessageSquare, Users, Mailbox, UserPlus, X } from 'lucide-react';
import { PricingDialog } from '@/components/pricing-dialog';
import { SettingsDialog } from '@/components/settings-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';
import { useUser } from '@/context/user-context';

export function ChatSidebar({ strangerName, children }: { strangerName: string, children?: React.ReactNode }) {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col bg-card/50 pt-[env(safe-area-inset-top)] pb-6 pb-[env(safe-area-inset-bottom)]">
            {children}
            <div className="flex-1 flex flex-col overflow-y-auto">
                 <div className="p-4">
                    <Tabs defaultValue="chats" className="w-full flex flex-col flex-1">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="chats">
                                <MessageSquare className="h-4 w-4 mr-2"/>
                                Chats
                            </TabsTrigger>
                            <TabsTrigger value="friends">
                                <Users className="h-4 w-4 mr-2"/>
                                Friends
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="chats" className="flex-1 flex flex-col gap-4 mt-4">
                            <Button variant="outline" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2"/>
                                New Chat
                            </Button>
                            <Separator />
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                                <Mailbox className="h-16 w-16 mb-4 text-primary/50" />
                                <h3 className="font-semibold text-lg text-foreground">Direct Messages</h3>
                                <p className="text-sm">Your new conversations will appear here.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="friends" className="flex-1 flex flex-col gap-4 mt-4">
                            <Button variant="outline" className="w-full">
                            <UserPlus className="h-4 w-4 mr-2"/>
                                Add Friend
                            </Button>
                            <Separator />
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                                <Users className="h-16 w-16 mb-4 text-primary/50" />
                                <h3 className="font-semibold text-lg text-foreground">No Friends Yet</h3>
                                <p className="text-sm">Add friends to start a conversation.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                 </div>
            </div>

            <div className="flex flex-col gap-2 p-4 border-t mt-auto">
                <Card className="bg-gradient-to-br from-yellow-300/10 via-amber-300/10 to-orange-300/10 border-amber-300/30 text-center overflow-hidden mb-4">
                    <CardContent className="p-4 space-y-3">
                        <p className="text-xs text-foreground/70 font-medium">Unlock chat filters, send images, and much more!</p>
                        <PricingDialog>
                            <Button className="w-full justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg hover:shadow-amber-500/40 transition-all duration-300">
                                <Crown className="h-5 w-5" />
                                <span>Upgrade Now</span>
                            </Button>
                        </PricingDialog>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between gap-3 p-3 bg-transparent border-0 shadow-none rounded-lg">
                    <div className='flex items-center gap-3 cursor-pointer'>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || undefined} data-ai-hint="person face" />
                            <AvatarFallback>{user.email.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Free User</p>
                        </div>
                    </div>
                    <SettingsDialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </SettingsDialog>
                </div>
            </div>
        </div>
    )
}
